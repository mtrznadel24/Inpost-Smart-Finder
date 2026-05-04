from typing import List

from fastapi import APIRouter, Depends

from .schemas import LockerQueryParams, ParcelLockerDetailsResponse, ParcelLockerResponse

router = APIRouter(tags=["Lockers"])


@router.get("/in-scope", response_model=List[ParcelLockerResponse])
def get_lockers_in_scope(filters: LockerQueryParams = Depends()):
    """
    Fetches lightweight parcel locker data visible within the current map bounding box.
    """
    pass


@router.get("/{locker_id}", response_model=ParcelLockerDetailsResponse)
def get_locker_details(locker_id: int):
    """
    Fetches full details of a specific parcel locker by its ID.
    """
    pass