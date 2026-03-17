import random
import string
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.courier_quote import CourierQuote
from app.models.order import Order
from app.models.shipment import Shipment
from app.core.dependencies import require_operator_or_admin


router = APIRouter(prefix="/shipments", tags=["Shipments"])


SHIPMENT_STAGES = [
    "created",
    "picked_up",
    "in_transit",
    "out_for_delivery",
    "delivered"
]


def generate_awb():
    return "AWB" + "".join(random.choices(string.digits, k=10))


@router.post("/select/{quote_id}")
def select_courier(
    quote_id: str,
    current_user=Depends(require_operator_or_admin),
    db: Session = Depends(get_db)
):
    quote = db.query(CourierQuote).filter(
        CourierQuote.id == quote_id,
        CourierQuote.tenant_id == current_user.tenant_id
    ).first()

    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    order = db.query(Order).filter(
        Order.id == quote.order_id,
        Order.tenant_id == current_user.tenant_id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")


    existing_shipment = db.query(Shipment).filter(
        Shipment.order_id == order.id,
        Shipment.tenant_id == current_user.tenant_id
    ).first()

    if existing_shipment:
        raise HTTPException(status_code=400, detail="Shipment already created")


    order.shipment_status = "shipped"

    shipment = Shipment(
        tenant_id=current_user.tenant_id,
        order_id=order.id,
        courier_name=quote.courier_name,
        awb_number=generate_awb(),
        tracking_status="created"
    )

    db.add(shipment)
    db.commit()
    db.refresh(shipment)

    return {
        "message": "Shipment created",
        "shipment_id": str(shipment.id),
        "awb_number": shipment.awb_number,
        "courier": shipment.courier_name,
        "tracking_status": shipment.tracking_status
    }


@router.get("/")
def list_shipments(
    current_user=Depends(require_operator_or_admin),
    db: Session = Depends(get_db)
):
    shipments = db.query(Shipment).filter(
        Shipment.tenant_id == current_user.tenant_id
    ).all()

    return [
        {
            "id": str(shipment.id),
            "order_id": str(shipment.order_id),
            "courier": shipment.courier_name,
            "awb_number": shipment.awb_number,
            "tracking_status": shipment.tracking_status,
            "created_at": shipment.created_at
        }
        for shipment in shipments
    ]


@router.get("/track/{order_id}")
def track_shipment(
    order_id: str,
    current_user=Depends(require_operator_or_admin),
    db: Session = Depends(get_db)
):
    shipment = db.query(Shipment).filter(
        Shipment.order_id == order_id,
        Shipment.tenant_id == current_user.tenant_id
    ).first()

    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    return {
        "shipment_id": str(shipment.id),
        "order_id": str(shipment.order_id),
        "courier": shipment.courier_name,
        "awb_number": shipment.awb_number,
        "tracking_status": shipment.tracking_status
    }


@router.post("/advance/{shipment_id}")
def advance_shipment(
    shipment_id: str,
    current_user=Depends(require_operator_or_admin),
    db: Session = Depends(get_db)
):
    shipment = db.query(Shipment).filter(
        Shipment.id == shipment_id,
        Shipment.tenant_id == current_user.tenant_id
    ).first()

    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    current_stage = shipment.tracking_status

    if current_stage not in SHIPMENT_STAGES:
        raise HTTPException(status_code=400, detail="Invalid shipment state")

    current_index = SHIPMENT_STAGES.index(current_stage)

    if current_index < len(SHIPMENT_STAGES) - 1:
        new_status = SHIPMENT_STAGES[current_index + 1]
        shipment.tracking_status = new_status

        if new_status == "delivered":
            order = db.query(Order).filter(
                Order.id == shipment.order_id  # remove tenant filter temporarily to test
            ).first()

            print(f"DEBUG: shipment.order_id = {shipment.order_id}")
            print(f"DEBUG: order found = {order}")

            if order:
                order.shipment_status = "delivered"
                db.flush()
            else:
                print("DEBUG: Order NOT found — ID mismatch?")

        db.commit()
        db.refresh(shipment)

    return {
        "shipment_id": str(shipment.id),
        "tracking_status": shipment.tracking_status
    }