import logging

import httpx
from sqlalchemy.dialects.postgresql import insert

from app.core.config import settings
from app.lockers.models import ParcelLocker
from app.core.database import session_manager
from app.lockers.schemas import ParcelLockerCreate

logger = logging.getLogger(__name__)

async def fetch_and_save_inpost_data(ctx=None):
    """
    Fetching InPost data from the API and saving it to the database.
    """
    url = settings.INPOST_API_URL

    async with httpx.AsyncClient() as client:
        page = 1
        while True:
            response = await client.get(url, params={"page": page, "per_page": 500})

            response.raise_for_status()
            data = response.json()

            lockers = data.get("items", [])
            if not lockers:
                break

            await save_to_db(lockers)

            if page >= data.get("total_pages", 0):
                break
            page += 1

    logger.info("InPost data fetched and saved to the database.")


async def save_to_db(lockers):
    async with session_manager.session() as db:
        for locker in lockers:
            try:
                validated_data = ParcelLockerCreate(
                    name=locker["name"],
                    city=locker["address_details"]["city"],
                    address=f"{locker['address_details']['street']} {locker['address_details']['building_number']}",
                    description=locker.get("location_description"),
                    image_url=locker.get("image_url"),
                    status=locker["status"],
                    physical_type=locker.get("physical_type", "other"),
                    is_24_7=locker.get("location_247", True),
                    easy_access_zone=locker.get("easy_access_zone", False),
                    payment_available=locker.get("payment_available", False),
                    functions=locker.get("functions", []),
                    longitude=locker["location"]["longitude"],
                    latitude=locker["location"]["latitude"]
                )
            except Exception as e:
                logger.warning(f"Error validating locker {locker.get('name')}: {e}")
                continue

            db_values = validated_data.model_dump(exclude={"longitude", "latitude"})

            db_values["location"] = f"POINT({validated_data.longitude} {validated_data.latitude})"

            stmt = insert(ParcelLocker).values(**db_values)

            update_dict = {
                "status": validated_data.status,
                "is_24_7": validated_data.is_24_7,
                "easy_access_zone": validated_data.easy_access_zone,
                "payment_available": validated_data.payment_available,
                "functions": validated_data.functions,
                "description": validated_data.description
            }

            stmt = stmt.on_conflict_do_update(
                index_elements=['name'],
                set_=update_dict
            )

            await db.execute(stmt)
        await db.commit()