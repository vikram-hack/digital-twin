from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class AssetSchema(BaseModel):
    id: str
    name: str
    type: str
    department: Optional[str] = None
    criticality: int
    ip_address: Optional[str] = None
    owner: Optional[str] = None
    description: Optional[str] = None
    privilege_level: int
    is_compromisable: bool
    status: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class AssetDetailSchema(AssetSchema):
    relationships: List[dict] = []
    credentials: List[dict] = []

class AssetListResponse(BaseModel):
    items: List[AssetSchema]
    total: int
