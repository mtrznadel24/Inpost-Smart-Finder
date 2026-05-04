import logging

import contextlib
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.pool import NullPool

from app.core.config import settings
from app.core.database import Base, DBSessionManager, get_db, session_manager
from app.main import app

TEST_DATABASE_URL = str(settings.async_database_url)\
    .replace("smart_finder_db", "smart_finder_test_db")\
    .replace("@db:", "@localhost:")

test_session_manager = DBSessionManager(
    TEST_DATABASE_URL,
    poolclass=NullPool,
    echo=False,
)

session_manager._engine = test_session_manager._engine
session_manager._sessionmaker = test_session_manager._sessionmaker


@pytest.fixture(autouse=True, scope="session")
def configure_logs():
    """Disables spammy logs during test execution."""
    logging.basicConfig(level=logging.CRITICAL)


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_db():
    """
    Creates all tables before running tests and drops them after.
    Ensures PostGIS extension exists in the test database.
    """
    async with test_session_manager.engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        await conn.run_sync(Base.metadata.create_all)

    yield

    async with test_session_manager.engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await test_session_manager.close()


@pytest_asyncio.fixture
async def db_session():
    """
    Provides an isolated database session for a single test.
    Rolls back any changes made during the test to keep the database clean.
    """
    async with test_session_manager.connect() as conn:
        trans = await conn.begin()
        async_session = AsyncSession(bind=conn, expire_on_commit=False)

        @contextlib.asynccontextmanager
        async def mock_session():
            yield async_session

        original_session = session_manager.session
        session_manager.session = mock_session

        try:
            yield async_session
        finally:
            session_manager.session = original_session
            await async_session.close()
            if trans.is_active:
                await trans.rollback()


@pytest_asyncio.fixture
async def client(db_session):
    """
    Test client for FastAPI endpoints.
    Overrides the main database dependency to use the isolated test session.
    """
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver"
    ) as ac:
        yield ac

    app.dependency_overrides.clear()