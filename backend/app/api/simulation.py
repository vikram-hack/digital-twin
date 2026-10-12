from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
from app.database.engine import get_db
from app.schemas.simulation import SimulationRequest, SimulationResult
from app.services import simulation_service

router = APIRouter(tags=["Simulation"])

@router.post("/simulate", response_model=SimulationResult)
def run_simulation_endpoint(req: SimulationRequest, db: Session = Depends(get_db)):
    return simulation_service.execute_simulation(db, req.initial_asset_id, req.scenario_name)

@router.get("/simulations")
def get_simulations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    sims = simulation_service.get_simulations(db, skip, limit)
    result = []
    for s in sims:
        result.append({
            "id": s.id,
            "initial_asset_id": s.initial_asset_id,
            "scenario_name": s.scenario_name,
            "status": s.status,
            "created_at": s.created_at
        })
    return result

@router.get("/simulations/{sim_id}", response_model=SimulationResult)
def get_simulation(sim_id: str, db: Session = Depends(get_db)):
    sim = simulation_service.get_simulation(db, sim_id)
    if not sim:
        raise HTTPException(status_code=404, detail="Simulation not found")
    
    return json.loads(sim.result_json)
