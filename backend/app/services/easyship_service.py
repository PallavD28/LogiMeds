import httpx
import os

EASYSHIP_API_TOKEN = os.getenv("EASYSHIP_API_TOKEN")
EASYSHIP_BASE = "https://public-api.easyship.com/2024-09"


async def get_rates(order) -> list[dict]:
    try:
        payload = {
            "origin_address": {
                "country_alpha2": "IN",
                "postal_code":    str(order.origin_pincode),
                "city":           "Origin",
            },
            "destination_address": {
                "country_alpha2": "IN",
                "postal_code":    str(order.destination_pincode),
                "city":           "Destination",
            },
            "incoterms": "DDU",
            "insurance": {"is_insured": False},
            "shipping_settings": {
                "units": {
                    "weight":     "kg",
                    "dimensions": "cm",
                }
            },
            "parcels": [
                {
                    "total_actual_weight": order.chargeable_weight_kg,
                    "box": {
                        "length": float(order.length_cm),
                        "width":  float(order.width_cm),
                        "height": float(order.height_cm),
                    },
                    "items": [
                        {
                            "quantity":               1,
                            "item_category_id":       7,
                            "declared_customs_value": float(order.declared_value or 500),
                            "declared_currency":      "INR",
                            "description":            "Pharmaceutical goods",
                        }
                    ],
                }
            ],
        }

        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{EASYSHIP_BASE}/rates",
                headers={
                    "Authorization": f"Bearer {EASYSHIP_API_TOKEN}",
                    "Content-Type":  "application/json",
                    "accept":        "application/json",
                },
                json=payload,
                timeout=15.0,
            )

            if res.status_code != 200:
                print(f"[Easyship] {res.status_code} error: {res.text}")
                return _fallback(order)

            data = res.json()

        rates = data.get("rates", [])

        if not rates:
            print("[Easyship] No rates returned — falling back to mock")
            return _fallback(order)

        results = []
        for r in rates:
            results.append({
                "courier_name":   r.get("courier_name", "Unknown"),
                "price":          round(float(r.get("total_charge", 0)), 2),
                "estimated_days": _delivery_days(r),
                "raw_response":   r,
            })

        results.sort(key=lambda x: x["price"])
        return results

    except Exception as e:
        print(f"[Easyship] API error: {e} — falling back to mock rates")
        return _fallback(order)


def _delivery_days(rate: dict) -> int:
    min_days = rate.get("min_delivery_time")
    max_days = rate.get("max_delivery_time")
    if min_days:
        return int(min_days)
    if max_days:
        return int(max_days)
    return 0


def _fallback(order) -> list[dict]:
    import random
    base = 50 + order.chargeable_weight_kg * 40
    couriers = [
        {"courier_name": "Delhivery",    "estimated_days": 3},
        {"courier_name": "BlueDart",     "estimated_days": 2},
        {"courier_name": "DHL",          "estimated_days": 1},
        {"courier_name": "Ecom Express", "estimated_days": 4},
    ]
    return sorted(
        [
            {
                "courier_name":   c["courier_name"],
                "price":          round(base + random.randint(20, 100), 2),
                "estimated_days": c["estimated_days"],
                "raw_response":   {"mock": True},
            }
            for c in couriers
        ],
        key=lambda x: x["price"],
    )