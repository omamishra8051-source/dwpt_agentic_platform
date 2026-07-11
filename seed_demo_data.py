import sys
import time

import requests

BASE_URL = "http://127.0.0.1:8000"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def post(endpoint: str, payload: dict) -> dict | None:
    """POST to *endpoint*, return the JSON body (the response 'data' or the
    entire body depending on what the API returns)."""
    url = f"{BASE_URL}/{endpoint.lstrip('/')}"
    try:
        resp = requests.post(url, json=payload, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except requests.ConnectionError:
        print(f"  [ERROR] Cannot connect to {url}. Is the backend running?")
        sys.exit(1)
    except requests.HTTPError as exc:
        print(f"  [ERROR] {exc.response.status_code} for POST {url}: {exc.response.text}")
        return None


def put(endpoint: str, payload: dict) -> dict | None:
    """PUT to *endpoint*, return the JSON body."""
    url = f"{BASE_URL}/{endpoint.lstrip('/')}"
    try:
        resp = requests.put(url, json=payload, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except requests.ConnectionError:
        print(f"  [ERROR] Cannot connect to {url}. Is the backend running?")
        sys.exit(1)
    except requests.HTTPError as exc:
        print(f"  [ERROR] {exc.response.status_code} for PUT {url}: {exc.response.text}")
        return None


def get(endpoint: str) -> dict | list | None:
    """GET from *endpoint*, return the JSON body."""
    url = f"{BASE_URL}/{endpoint.lstrip('/')}"
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except requests.ConnectionError:
        print(f"  [ERROR] Cannot connect to {url}. Is the backend running?")
        sys.exit(1)
    except requests.HTTPError as exc:
        print(f"  [ERROR] {exc.response.status_code} for GET {url}: {exc.response.text}")
        return None


# ---------------------------------------------------------------------------
# Highway helpers
# ---------------------------------------------------------------------------

def find_highway_by_name(name: str) -> dict | None:
    """Return the highway dict whose *name* matches, or None."""
    highways = get("/highways/")
    if not highways:
        return None
    for h in highways:
        if h["name"] == name:
            return h
    return None


def create_highway(name: str, length_km: int, speed_limit: int,
                   lane_count: int, traffic_density: str = "Low",
                   status: str = "Active") -> dict | None:
    """Create a highway, or return existing one if name already exists."""
    existing = find_highway_by_name(name)
    if existing:
        print(f"  [SKIP] Highway '{name}' already exists (id={existing['id']})")
        return existing

    payload = {
        "name": name,
        "length_km": length_km,
        "speed_limit": speed_limit,
        "lane_count": lane_count,
        "traffic_density": traffic_density,
        "status": status,
    }
    result = post("/highways/", payload)
    if result:
        print(f"  [CREATED] Highway '{name}' (id={result['id']})")
    return result


def update_highway_count(highway_id: int, count: int) -> dict | None:
    """Set the *charging_station_count* field on a highway."""
    # We must read the existing highway to keep other fields intact.
    existing = get(f"/highways/{highway_id}")
    if not existing:
        print(f"  [ERROR] Cannot find highway id={highway_id} to update count")
        return None
    payload = {
        "name": existing["name"],
        "length_km": existing["length_km"],
        "speed_limit": existing["speed_limit"],
        "lane_count": existing["lane_count"],
        "charging_station_count": count,
        "traffic_density": existing["traffic_density"],
        "status": existing["status"],
    }
    result = put(f"/highways/{highway_id}", payload)
    if result:
        print(f"  [UPDATED] Highway '{existing['name']}' station count -> {count}")
    return result


# ---------------------------------------------------------------------------
# Charging-station helpers
# ---------------------------------------------------------------------------

def find_station_by_name(name: str) -> dict | None:
    """Return the station dict whose *name* matches, or None."""
    stations = get("/charging-stations/")
    if not stations:
        return None
    for s in stations:
        if s["name"] == name:
            return s
    return None


def create_station(name: str, location: str, power_output_kw: float,
                   position_km: int, highway_id: int,
                   status: str = "Available") -> dict | None:
    """Create a charging station, or return existing one if name already exists."""
    existing = find_station_by_name(name)
    if existing:
        print(f"  [SKIP] Station '{name}' already exists (id={existing['id']})")
        return existing

    payload = {
        "name": name,
        "location": location,
        "power_output_kw": power_output_kw,
        "position_km": position_km,
        "highway_id": highway_id,
        "status": status,
    }
    result = post("/charging-stations/", payload)
    if result:
        print(f"  [CREATED] Station '{name}' (id={result['id']}, pos={position_km} km)")
    return result


# ---------------------------------------------------------------------------
# Vehicle helpers
# ---------------------------------------------------------------------------

def create_vehicle(manufacturer: str, model: str, battery_capacity: str,
                   soc: int, status: str = "Idle", position_km: int = 0,
                   target_soc: int | None = None,
                   highway_id: int | None = None,
                   charging_station_id: int | None = None,
                   battery_health: str = "Good") -> dict | None:
    """Create a vehicle with all fields in one POST."""
    payload = {
        "manufacturer": manufacturer,
        "model": model,
        "battery_capacity": battery_capacity,
        "soc": soc,
        "status": status,
        "position_km": position_km,
        "battery_health": battery_health,
    }
    if target_soc is not None:
        payload["target_soc"] = target_soc
    if highway_id is not None:
        payload["highway_id"] = highway_id
    if charging_station_id is not None:
        payload["charging_station_id"] = charging_station_id

    result = post("/vehicles/", payload)
    if result:
        print(f"  [CREATED] {manufacturer} {model} (id={result['id']}, "
              f"soc={result['soc']}, status={result['status']})")
    return result


# ===========================================================================
# MAIN
# ===========================================================================

def main():
    print("=" * 60)
    print("  DWPT Agentic Platform — Seed Demo Data")
    print("=" * 60)

    # ------------------------------------------------------------------
    # 1. HIGHWAYS
    # ------------------------------------------------------------------
    print("\n--- Creating Highways ---")

    highway_definitions = [
        {
            "name": "NH44 Bengaluru-Hyderabad",
            "length_km": 350,
            "speed_limit": 80,
            "lane_count": 3,
            "traffic_density": "High",
            "status": "Active",
        },
        {
            "name": "NH75 Bengaluru-Mangaluru",
            "length_km": 280,
            "speed_limit": 60,
            "lane_count": 2,
            "traffic_density": "Medium",
            "status": "Active",
        },
        {
            "name": "NH48 Bengaluru-Mumbai",
            "length_km": 450,
            "speed_limit": 80,
            "lane_count": 3,
            "traffic_density": "High",
            "status": "Active",
        },
        {
            "name": "Outer Ring Road Bengaluru",
            "length_km": 65,
            "speed_limit": 60,
            "lane_count": 4,
            "traffic_density": "High",
            "status": "Active",
        },
        {
            "name": "Devanahalli Airport Link Road",
            "length_km": 9,
            "speed_limit": 40,
            "lane_count": 2,
            "traffic_density": "Medium",
            "status": "Active",
        },
    ]

    highways: dict[str, dict] = {}
    for hdef in highway_definitions:
        h = create_highway(**hdef)
        if h:
            highways[hdef["name"]] = h

    if not highways:
        print("[FATAL] No highways created — aborting.")
        sys.exit(1)

    # ------------------------------------------------------------------
    # 2. CHARGING STATIONS
    # ------------------------------------------------------------------
    print("\n--- Creating Charging Stations ---")

    station_definitions = [
        # NH44 (id stored in highways dict)
        {"name": "Doddaballapur EV Hub",      "location": "Doddaballapur",     "power_output_kw": 150, "position_km": 30},
        {"name": "Hoskote Fast Charge",        "location": "Hoskote",           "power_output_kw": 120, "position_km": 60},
        {"name": "Mulbagal Supercharger",      "location": "Mulbagal",          "power_output_kw": 150, "position_km": 100},
        {"name": "Kolar Power Station",        "location": "Kolar",             "power_output_kw": 120, "position_km": 140},

        # NH75
        {"name": "Ramanagara Charging Point",  "location": "Ramanagara",        "power_output_kw": 100, "position_km": 25},
        {"name": "Kunigal EV Station",         "location": "Kunigal",           "power_output_kw": 120, "position_km": 75},
        {"name": "Nelamangala Fast Charge",    "location": "Nelamangala",       "power_output_kw": 100, "position_km": 130},
        {"name": "Mangaluru Port Charger",     "location": "Mangaluru",         "power_output_kw": 150, "position_km": 260},

        # NH48
        {"name": "Nelamangala Hub",            "location": "Nelamangala",       "power_output_kw": 150, "position_km": 35},
        {"name": "Tumkur Express Charge",      "location": "Tumkur",            "power_output_kw": 120, "position_km": 80},
        {"name": "Hassan Power Hub",           "location": "Hassan",            "power_output_kw": 150, "position_km": 180},
        {"name": "Sakleshpur EV Point",        "location": "Sakleshpur",        "power_output_kw": 100, "position_km": 230},

        # Outer Ring Road
        {"name": "Marathahalli ORR Charger",   "location": "Marathahalli",      "power_output_kw": 120, "position_km": 15},
        {"name": "Hebbal ORR Station",         "location": "Hebbal",            "power_output_kw": 150, "position_km": 40},
        {"name": "Banashankari ORR Point",     "location": "Banashankari",      "power_output_kw": 100, "position_km": 55},

        # Airport Link Road (very short — vehicles loop visibly)
        {"name": "Devanahalli Airport Charger", "location": "Devanahalli",      "power_output_kw": 150, "position_km": 5},
        {"name": "Airport Terminal EV Point",  "location": "Airport Terminal",  "power_output_kw": 120, "position_km": 8},
    ]

    highway_stations: dict[str, list[dict]] = {
        "NH44 Bengaluru-Hyderabad": [
            station_definitions[0],
            station_definitions[1],
            station_definitions[2],
            station_definitions[3],
        ],
        "NH75 Bengaluru-Mangaluru": [
            station_definitions[4],
            station_definitions[5],
            station_definitions[6],
            station_definitions[7],
        ],
        "NH48 Bengaluru-Mumbai": [
            station_definitions[8],
            station_definitions[9],
            station_definitions[10],
            station_definitions[11],
        ],
        "Outer Ring Road Bengaluru": [
            station_definitions[12],
            station_definitions[13],
            station_definitions[14],
        ],
        "Devanahalli Airport Link Road": [
            station_definitions[15],
            station_definitions[16],
        ],
    }

    stations: dict[str, list[dict]] = {}
    for hname, sdefs in highway_stations.items():
        highway = highways[hname]
        stations[hname] = []
        for sdef in sdefs:
            s = create_station(
                name=sdef["name"],
                location=sdef["location"],
                power_output_kw=sdef["power_output_kw"],
                position_km=sdef["position_km"],
                highway_id=highway["id"],
            )
            if s:
                stations[hname].append(s)

        # Update charging_station_count for the highway
        update_highway_count(highway["id"], len(stations[hname]))

    # ------------------------------------------------------------------
    # 3. VEHICLES
    # ------------------------------------------------------------------
    print("\n--- Creating Vehicles ---")

    # Resolve station IDs by name for easy lookup
    all_stations = get("/charging-stations/")
    station_by_name: dict[str, dict] = {}
    if all_stations:
        for s in all_stations:
            station_by_name[s["name"]] = s

    # Helper to look up a station id by name
    def sid(name: str) -> int:
        return station_by_name[name]["id"]

    # Helper to look up a highway id by name
    def hid(name: str) -> int:
        return highways[name]["id"]

    # --- CHARGING vehicles (demo requirements) ---

    # Near-complete: SOC 84, target 85 — finishes almost immediately
    create_vehicle(
        manufacturer="Tata",
        model="Nexon EV",
        battery_capacity="40.5 kWh",
        soc=84,
        status="Charging",
        position_km=45,
        target_soc=85,
        highway_id=hid("NH44 Bengaluru-Hyderabad"),
        charging_station_id=sid("Hoskote Fast Charge"),
    )

    # Medium charge: SOC 58, target 65 — finishes in a few seconds
    create_vehicle(
        manufacturer="Mahindra",
        model="XUV400",
        battery_capacity="39.4 kWh",
        soc=58,
        status="Charging",
        position_km=120,
        target_soc=65,
        highway_id=hid("NH48 Bengaluru-Mumbai"),
        charging_station_id=sid("Tumkur Express Charge"),
    )

    # Long charge: SOC 25, target 80 — long session
    create_vehicle(
        manufacturer="MG",
        model="Comet EV",
        battery_capacity="17.3 kWh",
        soc=25,
        status="Charging",
        position_km=20,
        target_soc=80,
        highway_id=hid("NH75 Bengaluru-Mangaluru"),
        charging_station_id=sid("Ramanagara Charging Point"),
    )

    # Another charging vehicle on ORR
    create_vehicle(
        manufacturer="Hyundai",
        model="Ioniq 5",
        battery_capacity="72.6 kWh",
        soc=40,
        status="Charging",
        position_km=38,
        target_soc=75,
        highway_id=hid("Outer Ring Road Bengaluru"),
        charging_station_id=sid("Hebbal ORR Station"),
    )

    # Charging at Airport Link — vehicle loops visibly
    create_vehicle(
        manufacturer="Ather",
        model="450X",
        battery_capacity="2.9 kWh",
        soc=15,
        status="Charging",
        position_km=3,
        target_soc=90,
        highway_id=hid("Devanahalli Airport Link Road"),
        charging_station_id=sid("Devanahalli Airport Charger"),
    )

    # --- IN TRANSIT vehicles ---

    create_vehicle(
        manufacturer="BYD",
        model="Atto 3",
        battery_capacity="60.5 kWh",
        soc=72,
        status="In Transit",
        position_km=150,
        highway_id=hid("NH44 Bengaluru-Hyderabad"),
    )

    create_vehicle(
        manufacturer="Ola Fleet",
        model="S1 Pro",
        battery_capacity="3.97 kWh",
        soc=65,
        status="In Transit",
        position_km=220,
        highway_id=hid("NH44 Bengaluru-Hyderabad"),
    )

    create_vehicle(
        manufacturer="Citroen",
        model="eC3",
        battery_capacity="29.2 kWh",
        soc=88,
        status="In Transit",
        position_km=90,
        highway_id=hid("NH75 Bengaluru-Mangaluru"),
    )

    create_vehicle(
        manufacturer="Tata",
        model="Tiago EV",
        battery_capacity="19.2 kWh",
        soc=55,
        status="In Transit",
        position_km=170,
        highway_id=hid("NH75 Bengaluru-Mangaluru"),
    )

    create_vehicle(
        manufacturer="Mahindra",
        model="BE 6e",
        battery_capacity="79 kWh",
        soc=90,
        status="In Transit",
        position_km=200,
        highway_id=hid("NH48 Bengaluru-Mumbai"),
    )

    create_vehicle(
        manufacturer="Hyundai",
        model="Kona Electric",
        battery_capacity="39.2 kWh",
        soc=45,
        status="In Transit",
        position_km=350,
        highway_id=hid("NH48 Bengaluru-Mumbai"),
    )

    create_vehicle(
        manufacturer="MG",
        model="ZS EV",
        battery_capacity="50.3 kWh",
        soc=62,
        status="In Transit",
        position_km=20,
        highway_id=hid("Outer Ring Road Bengaluru"),
    )

    create_vehicle(
        manufacturer="BYD",
        model="Seal",
        battery_capacity="82.5 kWh",
        soc=78,
        status="In Transit",
        position_km=45,
        highway_id=hid("Outer Ring Road Bengaluru"),
    )

    create_vehicle(
        manufacturer="Ola Fleet",
        model="S1 X",
        battery_capacity="3.5 kWh",
        soc=30,
        status="In Transit",
        position_km=3,
        highway_id=hid("Devanahalli Airport Link Road"),
    )

    create_vehicle(
        manufacturer="Citroen",
        model="eC3",
        battery_capacity="29.2 kWh",
        soc=50,
        status="In Transit",
        position_km=6,
        highway_id=hid("Devanahalli Airport Link Road"),
    )

    # --- IDLE vehicle ---

    create_vehicle(
        manufacturer="Ather",
        model="450 Gen 3",
        battery_capacity="2.9 kWh",
        soc=100,
        status="Idle",
        position_km=0,
        highway_id=hid("NH44 Bengaluru-Hyderabad"),
    )

    # --- Additional charging vehicle for visual variety ---
    create_vehicle(
        manufacturer="Tata",
        model="Punch EV",
        battery_capacity="35 kWh",
        soc=30,
        status="Charging",
        position_km=55,
        target_soc=85,
        highway_id=hid("Outer Ring Road Bengaluru"),
        charging_station_id=sid("Banashankari ORR Point"),
    )

    # ------------------------------------------------------------------
    # DONE
    # ------------------------------------------------------------------
    print("\n" + "=" * 60)
    print("  Seeding complete! Open the dashboard at:")
    print(f"  {BASE_URL}")
    print("=" * 60)


if __name__ == "__main__":
    main()
