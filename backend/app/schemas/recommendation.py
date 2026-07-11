from pydantic import BaseModel


class RecommendationRequest(BaseModel):
    target_soc: int


class RecommendationResponse(BaseModel):
    distance_remaining_km: float
    soc_needed_percent: float
    charging_power_kw: float
    charge_rate_percent_per_hour: float
    time_required_hours: float
    recommended_speed_kmh: float
    highway_speed_limit: int | None = None
    message: str