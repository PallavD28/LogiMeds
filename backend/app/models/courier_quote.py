import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base

class CourierQuote(Base):
    __tablename__ = "courier_quotes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"))
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"))

    courier_name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    estimated_days = Column(Float, nullable=False)

    recommended = Column(Boolean, default=False)

    raw_response = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    