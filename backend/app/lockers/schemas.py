from enum import Enum
from typing import List, Optional

from fastapi import Query
from pydantic import BaseModel


class PhysicalTypeEnum(str, Enum):
    screenless = "screenless"
    modular = "modular"
    newfm = "newfm"
    next = "next"
    other = "other"


class ParcelLockerCreate(BaseModel):
    name: str
    city: Optional[str] = None
    address: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

    status: str
    physical_type: Optional[str] = "other"
    is_24_7: bool = True
    easy_access_zone: bool = False
    payment_available: bool = False
    functions: List[str] = []

    longitude: float
    latitude: float

class ParcelLockerResponse(BaseModel):
    id: int
    name: str

    status: str
    physical_type: Optional[str] = "other"

    longitude: float
    latitude: float

    class Config:
        from_attributes = True

class ParcelLockerDetailsResponse(ParcelLockerCreate):
    id: int

    class Config:
        from_attributes = True


class LockerQueryParams:
    def __init__(
        self,
        min_lat: float = Query(..., description="Southern boundary of the map bounding box"),
        max_lat: float = Query(..., description="Northern boundary of the map bounding box"),
        min_lon: float = Query(..., description="Western boundary of the map bounding box"),
        max_lon: float = Query(..., description="Eastern boundary of the map bounding box"),
        is_24_7: Optional[bool] = Query(None, description="Filter by 24/7 availability"),
        payment_available: Optional[bool] = Query(None, description="Filter by payment availability"),
        physical_type: Optional[PhysicalTypeEnum] = Query(None, description="Filter by locker physical type"),
        limit: int = Query(500, ge=1, le=2000, description="Maximum number of results to return")
    ):
        self.min_lat = min_lat
        self.max_lat = max_lat
        self.min_lon = min_lon
        self.max_lon = max_lon
        self.is_24_7 = is_24_7
        self.payment_available = payment_available
        self.physical_type = physical_type
        self.limit = limit
