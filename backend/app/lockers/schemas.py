from enum import Enum
from typing import List, Optional

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


class ParcelLockerResponse(ParcelLockerCreate):
    id: int

    class Config:
        from_attributes = True
