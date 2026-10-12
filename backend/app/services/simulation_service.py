from sqlalchemy.orm import Session
from app.simulation.engine import run_simulation
from app.models.simulation import Simulation
import json

def execute_simulation(db: Session, initial_asset_id: str, scenario_name: str = None):
    return run_simulation(db, initial_asset_id, scenario_name)

def get_simulations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Simulation).order_by(Simulation.created_at.desc()).offset(skip).limit(limit).all()

def get_simulation(db: Session, simulation_id: str):
    return db.query(Simulation).filter(Simulation.id == simulation_id).first()
