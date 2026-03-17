from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order
from app.models.courier_quote import CourierQuote
from app.core.dependencies import require_operator_or_admin
# from app.services.shiprocket_service import get_mock_rates
from app.services.easyship_service import get_rates

router = APIRouter(prefix="/rates", tags=["Rates"])

@router.get("/{order_id}")
async def get_rate(
    order_id: str,
    current_user = Depends(require_operator_or_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.tenant_id == current_user.tenant_id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # mock_rates = await get_mock_rates(order)
    rates = await get_rates(order)
    if not rates:
        raise HTTPException(status_code=400, detail="No rates available")

    db.query(CourierQuote).filter(
        CourierQuote.order_id == order_id,
        CourierQuote.tenant_id == current_user.tenant_id
    ).delete()
    db.commit()

    cheapest = min(rates, key=lambda x: x["price"])
    stored_quotes = []

    for rate in rates:
        quote = CourierQuote(
            tenant_id=current_user.tenant_id,
            order_id=order.id,
            courier_name=rate["courier_name"],
            price=rate["price"],
            estimated_days=rate["estimated_days"],
            recommended=(rate["courier_name"] == cheapest["courier_name"]),
            raw_response=rate["raw_response"]
        )
        db.add(quote)
    db.commit()

    saved_quotes = db.query(CourierQuote).filter(
        CourierQuote.order_id == order_id,
        CourierQuote.tenant_id == current_user.tenant_id
    ).all()
    
    for quote in saved_quotes:
        stored_quotes.append({
            "quote_id": str(quote.id),
            "courier_name": quote.courier_name,
            "price": quote.price,
            "estimated_days": quote.estimated_days,
            "recommended": quote.recommended
        })
    return stored_quotes
