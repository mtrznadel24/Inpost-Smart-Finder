import pytest
import respx
from geoalchemy2.elements import WKTElement
from httpx import Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.lockers.models import ParcelLocker
from app.lockers.sync_service import fetch_and_save_inpost_data, save_to_db

MOCK_VALID_ITEM_1 = {
    "name": "ADA01M",
    "status": "Operating",
    "location": {"longitude": 22.26405, "latitude": 51.73834},
    "address_details": {
        "city": "Adamów",
        "street": "Kościuszki",
        "building_number": "27",
    },
    "location_description": "Przy sklepie Lewiatan",
    "location_247": True,
    "easy_access_zone": True,
    "payment_available": True,
    "functions": ["parcel_collect", "parcel_send"],
}

MOCK_VALID_ITEM_2 = {
    "name": "ADA01N",
    "status": "Maintenance",
    "location": {"longitude": 22.25875, "latitude": 51.7444},
    "address_details": {
        "city": "Adamów",
        "street": "Kleeberga",
        "building_number": "5B",
    },
    "location_description": "Groszek",
    "location_247": False,
    "easy_access_zone": False,
    "payment_available": False,
    "functions": [],
}

MOCK_INVALID_ITEM = {
    "name": "BROKEN01",
    "status": "Operating",
    "location": {"longitude": None, "latitude": None},
    "address_details": {"city": "Brak", "street": "Brak", "building_number": "0"},
}


@pytest.mark.asyncio
async def test_save_to_db_inserts_new_records(db_session: AsyncSession):
    """
    Tests if the database successfully inserts completely new parcel lockers
    and handles PostGIS geometry conversion correctly.
    """
    lockers_payload = [MOCK_VALID_ITEM_1, MOCK_VALID_ITEM_2]

    await save_to_db(lockers_payload, db_session)

    db_session.expire_all()

    result = await db_session.execute(select(ParcelLocker))
    lockers = result.scalars().all()

    assert len(lockers) == 2
    locker = next((item for item in lockers if item.name == "ADA01M"), None)
    assert locker is not None
    assert locker.city == "Adamów"
    assert locker.is_24_7 is True


@pytest.mark.asyncio
async def test_save_to_db_updates_existing_records(db_session: AsyncSession):
    """
    Tests the ON CONFLICT DO UPDATE behavior. Ensures that providing data
    for an existing locker updates its mutable fields without duplicating.
    """
    existing_locker = ParcelLocker(
        name="ADA01M",
        city="Adamów",
        address="Stary Adres 1",
        status="Disabled",
        is_24_7=False,
        location=WKTElement("POINT(22.0000 51.0000)", srid=4326),
    )
    db_session.add(existing_locker)
    await db_session.commit()

    updated_payload = [MOCK_VALID_ITEM_1]
    await save_to_db(updated_payload, db_session)

    db_session.expire_all()

    result = await db_session.execute(select(ParcelLocker))
    lockers = result.scalars().all()

    assert len(lockers) == 1
    updated_locker = lockers[0]
    assert updated_locker.status == "Operating"
    assert updated_locker.is_24_7 is True


@pytest.mark.asyncio
async def test_save_to_db_skips_invalid_records(db_session: AsyncSession):
    """
    Tests graceful error handling during validation. If a locker payload is missing
    required fields, it should be skipped without interrupting the entire transaction.
    """
    mixed_payload = [MOCK_VALID_ITEM_1, MOCK_INVALID_ITEM]

    await save_to_db(mixed_payload, db_session)

    result = await db_session.execute(select(ParcelLocker))
    lockers = result.scalars().all()

    assert len(lockers) == 1
    assert lockers[0].name == "ADA01M"


@pytest.mark.asyncio
@respx.mock
async def test_fetch_and_save_handles_pagination(db_session: AsyncSession):
    """
    Tests if the synchronization service respects pagination, fetches exactly
    the right number of pages based on total_pages, and stops correctly.
    """
    page_1_response = {
        "count": 2,
        "page": 1,
        "total_pages": 2,
        "items": [MOCK_VALID_ITEM_1],
    }

    page_2_response = {
        "count": 2,
        "page": 2,
        "total_pages": 2,
        "items": [MOCK_VALID_ITEM_2],
    }

    mock_route = respx.get(settings.INPOST_API_URL)
    mock_route.side_effect = [
        Response(200, json=page_1_response),
        Response(200, json=page_2_response),
    ]

    await fetch_and_save_inpost_data()

    assert mock_route.call_count == 2

    result = await db_session.execute(select(ParcelLocker))
    lockers = result.scalars().all()
    assert len(lockers) == 2
