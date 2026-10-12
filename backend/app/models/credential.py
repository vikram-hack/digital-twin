from sqlalchemy import Column, String, Integer, Boolean
from app.database.engine import Base

class Credential(Base):
    __tablename__ = "credentials"

    id = Column(String, primary_key=True, index=True)
    asset_id = Column(String, index=True)
    username = Column(String)
    privilege_level = Column(Integer, default=1)
    description = Column(String, nullable=True)
    has_db_access = Column(Boolean, default=False)
    is_simulated = Column(Boolean, default=True)
