import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base

class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"))
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"))

    courier_name = Column(String, nullable=False)
    awb_number = Column(String, nullable=False)
    tracking_status = Column(String, default="created")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    