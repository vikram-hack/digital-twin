from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

class AttackStep(BaseModel):
    step_number: int
    source_asset_id: str
    target_asset_id: str
    relationship_type: str
    mitre_technique_id: Optional[str] = None
    description: str

class AttackPathNode(BaseModel):
    asset_id: str
    asset_name: str
    asset_type: str
    criticality: int
    privilege_level: int
    reached_via: Optional[str] = None
    step_number: int

class PrivilegeEscalation(BaseModel):
    asset_id: str
    from_level: int
    to_level: int
    description: str

class LateralMovement(BaseModel):
    source_id: str
    target_id: str
    from_type: str
    to_type: str
    description: str

class BlastRadius(BaseModel):
    total_assets: int
    critical_assets: int
    by_type: Dict[str, int]

class RiskScore(BaseModel):
    score: int
    level: str # Low, Medium, High, Critical
    factors: List[str]

class SimulationRequest(BaseModel):
    initial_asset_id: str
    scenario_name: Optional[str] = None

class SimulationResult(BaseModel):
    id: str
    initial_asset_id: str
    reachable_assets: List[str]
    attack_path: List[AttackPathNode]
    all_paths: List[List[str]]
    steps: List[AttackStep]
    privilege_escalations: List[PrivilegeEscalation]
    lateral_movements: List[LateralMovement]
    blast_radius: BlastRadius
    risk_score: RiskScore
    mitre_techniques_mapped: List[str]
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)
