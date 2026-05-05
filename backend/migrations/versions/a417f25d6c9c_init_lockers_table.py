"""init_lockers_table

Revision ID: a417f25d6c9c
Revises:
Create Date: 2026-05-04 11:29:03.112738

"""

from typing import Sequence, Union

import geoalchemy2
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "a417f25d6c9c"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "parcel_lockers",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("city", sa.String(), nullable=True),
        sa.Column("address", sa.String(), nullable=True),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("image_url", sa.String(), nullable=True),
        sa.Column("status", sa.String(), nullable=True),
        sa.Column("physical_type", sa.String(), nullable=True),
        sa.Column("is_24_7", sa.Boolean(), nullable=True),
        sa.Column("easy_access_zone", sa.Boolean(), nullable=True),
        sa.Column("payment_available", sa.Boolean(), nullable=True),
        sa.Column("functions", postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column(
            "location",
            geoalchemy2.types.Geography(
                geometry_type="POINT",
                srid=4326,
                from_text="ST_GeogFromText",
                name="geography",
                spatial_index=False,
            ),
            nullable=True,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "idx_parcel_lockers_location",
        "parcel_lockers",
        ["location"],
        unique=False,
        postgresql_using="gist",
    )
    op.create_index(
        op.f("ix_parcel_lockers_city"), "parcel_lockers", ["city"], unique=False
    )
    op.create_index(
        op.f("ix_parcel_lockers_id"), "parcel_lockers", ["id"], unique=False
    )
    op.create_index(
        op.f("ix_parcel_lockers_name"), "parcel_lockers", ["name"], unique=True
    )
    op.create_index(
        op.f("ix_parcel_lockers_physical_type"),
        "parcel_lockers",
        ["physical_type"],
        unique=False,
    )
    op.create_index(
        op.f("ix_parcel_lockers_status"), "parcel_lockers", ["status"], unique=False
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_parcel_lockers_status"), table_name="parcel_lockers")
    op.drop_index(op.f("ix_parcel_lockers_physical_type"), table_name="parcel_lockers")
    op.drop_index(op.f("ix_parcel_lockers_name"), table_name="parcel_lockers")
    op.drop_index(op.f("ix_parcel_lockers_id"), table_name="parcel_lockers")
    op.drop_index(op.f("ix_parcel_lockers_city"), table_name="parcel_lockers")
    op.drop_index(
        "idx_parcel_lockers_location",
        table_name="parcel_lockers",
        postgresql_using="gist",
    )
    op.drop_table("parcel_lockers")
