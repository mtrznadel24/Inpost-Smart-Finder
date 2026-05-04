from sqlalchemy import select, and_, func
from sqlalchemy.ext.asyncio import AsyncSession
from geoalchemy2.functions import ST_X, ST_Y, ST_MakeEnvelope
from sqlalchemy import cast
from geoalchemy2 import Geometry

from app.lockers.models import ParcelLocker
from app.lockers.schemas import LockerQueryParams


async def get_lockers_in_bbox(db: AsyncSession, params: LockerQueryParams):
    """
    Fetches lockers within a specific geographic bounding box using PostGIS.
    """
    bbox_filter = ST_MakeEnvelope(
        params.min_lon, params.min_lat,
        params.max_lon, params.max_lat,
        4326
    )

    query = select(
        ParcelLocker.id,
        ParcelLocker.name,
        ParcelLocker.status,
        ParcelLocker.physical_type,
        ST_X(cast(ParcelLocker.location, Geometry)).label("longitude"),
        ST_Y(cast(ParcelLocker.location, Geometry)).label("latitude")
    ).where(
        func.ST_Within(cast(ParcelLocker.location, Geometry), bbox_filter)
    )

    if params.is_24_7 is not None:
        query = query.where(ParcelLocker.is_24_7 == params.is_24_7)

    if params.payment_available is not None:
        query = query.where(ParcelLocker.payment_available == params.payment_available)

    if params.easy_access_zone is not None:
        query = query.where(ParcelLocker.easy_access_zone == params.easy_access_zone)

    if params.status:
        query = query.where(ParcelLocker.status == params.status)

    if params.physical_type:
        query = query.where(ParcelLocker.physical_type == params.physical_type.value)

    if params.function:
        query = query.where(ParcelLocker.functions.contains([params.function]))

    query = query.limit(params.limit)

    result = await db.execute(query)
    return result.mappings().all()


async def get_locker_by_id(db: AsyncSession, locker_id: int):
    """
    Fetches all details for a single locker, converting location to lon/lat.
    """
    query = select(
        ParcelLocker.id,
        ParcelLocker.name,
        ParcelLocker.city,
        ParcelLocker.address,
        ParcelLocker.description,
        ParcelLocker.image_url,
        ParcelLocker.status,
        ParcelLocker.physical_type,
        ParcelLocker.is_24_7,
        ParcelLocker.easy_access_zone,
        ParcelLocker.payment_available,
        ParcelLocker.functions,
        ST_X(cast(ParcelLocker.location, Geometry)).label("longitude"),
        ST_Y(cast(ParcelLocker.location, Geometry)).label("latitude")
    ).where(ParcelLocker.id == locker_id)

    result = await db.execute(query)
    return result.mappings().first()