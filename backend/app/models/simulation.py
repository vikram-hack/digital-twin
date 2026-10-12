from sqlalchemy import Column, String, DateTime, Text
from datetime import datetime
from app.database.engine import Base

class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(String, primary_key=True, index=True)
    initial_asset_id = Column(String, index=True)
    scenario_name = Column(String, nullable=True)
    result_json = Column(Text) # JSON string of SimulationResult
    status = Column(String, default="completed")
    created_at = Column(DateTime, default=datetime.utcnow)
