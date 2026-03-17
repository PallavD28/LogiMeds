from pydantic import BaseModel, Field

class OrderCreateSchema(BaseModel):
    origin_pincode: str
    destination_pincode: str

    length_cm: float = Field(..., gt=0)
    width_cm: float = Field(..., gt=0)
    height_cm: float = Field(..., gt=0)

    actual_weight_kg: float = Field(..., gt=0)
    declared_value: float| None = None
    is_cold_chain: bool = False

class OrderResponseSchema(BaseModel):
    id: str
    chargeable_weight_kg: float
    volumetric_weight_kg: float
    shipment_status: str

