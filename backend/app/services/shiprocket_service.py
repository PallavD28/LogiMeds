import random

async def get_mock_rates(order):
    """Simulate fetching shipping rates from Shiprocket API based on order details."""

    base_rate = 50
    weight_factor = order.chargeable_weight_kg * 40

    couriers = [
        {"name": "DelhiVery", "speed": 3},
        {"name": "BlueDart", "speed": 2},
        {"name": "DHL", "speed": 1},
        {"name": " Ecom Express", "speed": 4}
    ]

    results = []

    for courier in couriers:
        price = base_rate + weight_factor + random.randint(20, 100)

        results.append({
            "courier_name": courier["name"],
            "price": round(price, 2),
            "estimated_days": courier["speed"],
            "raw_response": {"mock": True}
        })

    return results