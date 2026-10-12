from pydantic import BaseModel
from typing import List, Dict, Any

class AIAnalysisRequest(BaseModel):
    simulation_id: str

class AIAnalysisResponse(BaseModel):
    summary: str
    attack_path_explanation: str
    affected_assets_analysis: str
    privilege_escalation_narrative: str
    lateral_movement_narrative: str
    security_weakness_analysis: List[str]
    recommendations: List[str]

class ScenarioGenerationRequest(BaseModel):
    asset_id: str

class ScenarioGenerationResponse(BaseModel):
    scenario_name: str
    description: str
    expected_impact: str
    mitigation_suggestions: List[str]
