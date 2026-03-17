import math
import requests


def get_coordinates_from_pincode(pincode: str):
    url = f"https://nominatim.openstreetmap.org/search"
    params = {
        "postalcode": pincode,
        "country": "India",
        "format": "json"
    }

    response = requests.get(url, params=params, headers={
        "User-Agent": "logimeds-app"
    })

    data = response.json()

    if not data:
        return None

    return float(data[0]["lat"]), float(data[0]["lon"])


def calculate_distance_km(coord1, coord2):
    lat1, lon1 = coord1
    lat2, lon2 = coord2

    R = 6371  # Earth radius in km

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return round(R * c, 2)