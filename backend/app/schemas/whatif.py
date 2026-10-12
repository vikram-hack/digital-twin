from pydantic import BaseModel
from typing import List, Dict, Any
from app.schemas.simulation import SimulationResult

class WhatIfRequest(BaseModel):
    initial_asset_id: str
    toggled_controls: Dict[str, bool] # control_id -> new is_enabled state

class ComparisonResult(BaseModel):
    paths_blocked: int
    assets_saved: int
    risk_score_change: int # negative means improvement
    blast_radius_change: int
    summary: str

class WhatIfResponse(BaseModel):
    baseline: SimulationResult
    modified: SimulationResult
    comparison: ComparisonResult
