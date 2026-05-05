from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.core.database import DbSessionDep

from .crud import get_locker_by_id, get_lockers_in_bbox
from .schemas import (
    LockerQueryParams,
    ParcelLockerDetailsResponse,
    ParcelLockerResponse,
)

router = APIRouter(tags=["Lockers"])


@router.get("/in-scope", response_model=List[ParcelLockerResponse])
async def get_lockers_in_scope(
    db: DbSessionDep, filters: LockerQueryParams = Depends()
):
    """
    Fetches lightweight parcel locker data visible within the current map bounding box.
    """
    return await get_lockers_in_bbox(db=db, params=filters)


@router.get("/{locker_id}", response_model=ParcelLockerDetailsResponse)
async def get_locker_details(db: DbSessionDep, locker_id: int):
    """
    Fetches full details of a specific parcel locker by its ID.
    """
    locker = await get_locker_by_id(db=db, locker_id=locker_id)
    if not locker:
        raise HTTPException(status_code=404, detail="Parcel locker not found")
    return locker
