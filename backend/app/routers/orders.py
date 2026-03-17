from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order
from app.schemas.order import OrderCreateSchema
from app.services.weight_service import ( calculate_volumetric_weight, calculate_chargeable_weight)
from app.services.distance_service import (get_coordinates_from_pincode, calculate_distance_km)
from app.core.dependencies import require_operator_or_admin
import uuid

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/")
def create_order(
    data: OrderCreateSchema,
    current_user = Depends(require_operator_or_admin),
    db: Session = Depends(get_db)
    
):
    volumetric_weight = calculate_volumetric_weight(
        data.length_cm,
        data.width_cm,
        data.height_cm
    )

    chargeable_weight = calculate_chargeable_weight(
        data.actual_weight_kg,
        volumetric_weight
    )
    
    origin_coords = get_coordinates_from_pincode(data.origin_pincode)
    destination_coords = get_coordinates_from_pincode(data.destination_pincode)

    distance_km = None

    if origin_coords and destination_coords:
        distance_km = calculate_distance_km(origin_coords, destination_coords)
    

    order = Order(
        tenant_id=current_user.tenant_id,
        created_by=current_user.id,
        origin_pincode=data.origin_pincode,
        destination_pincode=data.destination_pincode,
        length_cm=data.length_cm,
        width_cm=data.width_cm,
        height_cm=data.height_cm,
        actual_weight_kg=data.actual_weight_kg,
        volumetric_weight_kg=volumetric_weight,
        chargeable_weight_kg=chargeable_weight,
        declared_value=data.declared_value,
        is_cold_chain=data.is_cold_chain,
        distance_km=distance_km
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return {
        "id": str(order.id),
        "volumetric_weight_kg": order.volumetric_weight_kg,
        "chargeable_weight_kg": order.chargeable_weight_kg,
        "distance_km": order.distance_km,
        "shipment_status": order.shipment_status
    }

@router.get("/")
def list_orders(
    current_user = Depends(require_operator_or_admin),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).filter(
        Order.tenant_id == current_user.tenant_id
    ).all()

    return [
        {
            "id": str(order.id),
            "origin": order.origin_pincode,
            "destination": order.destination_pincode,
            "chargeable_weight": order.chargeable_weight_kg,
            "distance_km": order.distance_km,
            "shipment_status": order.shipment_status,
            "created_at": order.created_at
        }
        for order in orders
    ]