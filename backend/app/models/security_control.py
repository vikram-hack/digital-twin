from sqlalchemy import Column, String, Integer, Boolean, Text
from app.database.engine import Base

class SecurityControl(Base):
    __tablename__ = "security_controls"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    description = Column(String)
    is_enabled = Column(Boolean, default=True)
    protected_asset_ids = Column(String) # JSON string
    effect_description = Column(String)
    effectiveness = Column(Integer, default=50) # 0-100
