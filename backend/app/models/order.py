import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"))
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    origin_pincode = Column(String, nullable=False)
    destination_pincode = Column(String, nullable=False)

    length_cm = Column(Float, nullable=False)
    width_cm = Column(Float, nullable=False)
    height_cm = Column(Float, nullable=False)

    actual_weight_kg = Column(Float, nullable=False)
    volumetric_weight_kg = Column(Float, nullable=False)
    chargeable_weight_kg = Column(Float, nullable=False)

    declared_value = Column(Float, nullable=False)
    is_cold_chain = Column(Boolean, default=False)

    shipment_status = Column(String, default="pending")
    distance_km = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())