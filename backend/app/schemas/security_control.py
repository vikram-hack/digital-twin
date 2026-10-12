from pydantic import BaseModel, ConfigDict
from typing import List

class SecurityControlSchema(BaseModel):
    id: str
    name: str
    type: str
    description: str
    is_enabled: bool
    protected_asset_ids: str
    effect_description: str
    effectiveness: int
    
    model_config = ConfigDict(from_attributes=True)

class ToggleRequest(BaseModel):
    is_enabled: bool
