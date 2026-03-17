from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.order import Order
from app.models.shipment import Shipment
from app.core.dependencies import require_operator_or_admin

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats(
    current_user = Depends(require_operator_or_admin),
    db: Session = Depends(get_db)
):
    tenant_id = current_user.tenant_id 
    
    total_orders = db.query(Order).filter(
        Order.tenant_id == tenant_id
    ).count()
    shipped_orders = db.query(Order).filter(
        Order.tenant_id == tenant_id,
        Order.shipment_status == "shipped"
    ).count()
    pending_orders = db.query(Order).filter(
        Order.tenant_id == tenant_id,
        Order.shipment_status == "pending"
    ).count()
    total_weight_shipped = db.query(
        func.sum(Order.chargeable_weight_kg)
    ).filter(
        Order.tenant_id == tenant_id,
        Order.shipment_status == "shipped"
    ).scalar() or 0

    most_used_courier = db.query(
        Shipment.courier_name,
        func.count(Shipment.id).label("count")
    ).filter(
        Shipment.tenant_id == tenant_id
    ).group_by(
        Shipment.courier_name
    ).order_by(
        func.count(Shipment.id).desc()
    ).first()

    delivered_count = db.query(Shipment).filter(
        Shipment.tenant_id == tenant_id,
        Shipment.tracking_status == "delivered"
    ).count()

    delivery_success_rate = (
        (delivered_count / shipped_orders) * 100
        if shipped_orders > 0 else 0
    )

    
    return {
        "total_orders": total_orders,
        "shipped_orders": shipped_orders,
        "pending_orders": pending_orders,
        "total_weight_shipped": round(total_weight_shipped, 2),
        "most_used_courier": most_used_courier[0] if most_used_courier else None,
        "delivery_success_rate": round(delivery_success_rate, 2)
    }