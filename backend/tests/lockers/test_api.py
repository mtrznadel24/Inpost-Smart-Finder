import pytest
from geoalchemy2.elements import WKTElement
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.lockers.models import ParcelLocker


@pytest.fixture
async def sample_locker(db_session: AsyncSession) -> ParcelLocker:
    """
    Creates a sample parcel locker in Warsaw for testing spatial queries.
    """
    locker = ParcelLocker(
        name="WAW01A",
        city="Warszawa",
        address="Testowa 1",
        status="Operating",
        is_24_7=True,
        location=WKTElement("POINT(21.0122 52.2297)", srid=4326)
    )
    db_session.add(locker)
    await db_session.commit()
    await db_session.refresh(locker)
    return locker


@pytest.mark.asyncio
async def test_get_locker_details_success(client: AsyncClient, sample_locker: ParcelLocker):
    """
    Test if we can fetch details of a specific locker and if PostGIS
    correctly converts the location to longitude and latitude.
    """
    url = f"{settings.API_V1_STR}/lockers/{sample_locker.id}"
    response = await client.get(url)

    assert response.status_code == 200
    data = response.json()

    assert data["name"] == "WAW01A"
    assert data["city"] == "Warszawa"
    assert data["longitude"] == 21.0122
    assert data["latitude"] == 52.2297


@pytest.mark.asyncio
async def test_get_locker_details_not_found(client: AsyncClient):
    """
    Test if querying a non-existent locker returns a 404 error.
    """
    url = f"{settings.API_V1_STR}/lockers/99999"
    response = await client.get(url)

    assert response.status_code == 404
    assert response.json()["detail"] == "Parcel locker not found"


@pytest.mark.asyncio
async def test_get_lockers_in_scope_found(client: AsyncClient, sample_locker: ParcelLocker):
    """
    Test if the Bounding Box filter successfully finds a locker inside its area.
    (Bounding box coordinates created around Warsaw).
    """
    url = f"{settings.API_V1_STR}/lockers/in-scope"
    response = await client.get(
        url,
        params={
            "min_lat": 52.0,
            "max_lat": 53.0,
            "min_lon": 20.0,
            "max_lon": 22.0
        }
    )

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 1
    assert data[0]["name"] == "WAW01A"


@pytest.mark.asyncio
async def test_get_lockers_in_scope_not_found(client: AsyncClient, sample_locker: ParcelLocker):
    """
    Test if the Bounding Box filter correctly ignores a locker outside its area.
    (Bounding box coordinates created around Krakow).
    """
    url = f"{settings.API_V1_STR}/lockers/in-scope"
    response = await client.get(
        url,
        params={
            "min_lat": 49.0,
            "max_lat": 50.5,
            "min_lon": 19.0,
            "max_lon": 20.0
        }
    )

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 0


@pytest.mark.asyncio
async def test_get_lockers_in_scope_validation_error(client: AsyncClient):
    """Test if missing mandatory bounding box parameters raises a 422 error."""
    url = f"{settings.API_V1_STR}/lockers/in-scope"
    response = await client.get(url, params={})

    assert response.status_code == 422