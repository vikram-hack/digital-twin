from sqlalchemy import Column, String, Integer, Boolean, DateTime
from datetime import datetime
from app.database.engine import Base

class Asset(Base):
    __tablename__ = "assets"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String, index=True)
    department = Column(String, nullable=True)
    criticality = Column(Integer, default=1)
    ip_address = Column(String, nullable=True)
    owner = Column(String, nullable=True)
    description = Column(String, nullable=True)
    privilege_level = Column(Integer, default=1)
    is_compromisable = Column(Boolean, default=True)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
