from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class TopologyNode(BaseModel):
    id: str
    label: str
    type: str
    department: Optional[str] = None
    criticality: int
    privilege_level: int
    data: Dict[str, Any] = {}

class TopologyEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str
    type: str
    weight: float

class TopologyResponse(BaseModel):
    nodes: List[TopologyNode]
    edges: List[TopologyEdge]
