from geoalchemy2 import Geography
from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY

from app.core.database import Base


class ParcelLocker(Base):
    __tablename__ = "parcel_lockers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, unique=True, index=True, nullable=False)
    city = Column(String, index=True)
    address = Column(String)
    description = Column(String)
    image_url = Column(String)

    status = Column(String, index=True)
    physical_type = Column(String, index=True)
    is_24_7 = Column(Boolean, default=True)
    easy_access_zone = Column(Boolean, default=False)
    payment_available = Column(Boolean, default=False)

    functions = Column(ARRAY(String))

    location = Column(Geography(geometry_type="POINT", srid=4326))
