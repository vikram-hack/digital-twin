from sqlalchemy import Column, String, Float, Boolean, Integer
from app.database.engine import Base

class AssetRelationship(Base):
    __tablename__ = "asset_relationships"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    source_id = Column(String, index=True)
    target_id = Column(String, index=True)
    relationship_type = Column(String)
    weight = Column(Float, default=1.0)
    is_active = Column(Boolean, default=True)
