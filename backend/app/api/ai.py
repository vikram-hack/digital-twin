from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from app.database.engine import get_db
from app.schemas.ai import AIAnalysisRequest, AIAnalysisResponse, ScenarioGenerationRequest, ScenarioGenerationResponse
from app.schemas.simulation import SimulationResult
from app.services.simulation_service import get_simulation
from app.ai.analyzer import analyze_simulation
from app.ai.scenario_generator import generate_scenario as gen_scenario
from app.graph.topology import get_topology_data

router = APIRouter(tags=["AI Integration"])

@router.post("/ai/analyze", response_model=AIAnalysisResponse)
def analyze_sim_endpoint(req: AIAnalysisRequest, db: Session = Depends(get_db)):
    sim = get_simulation(db, req.simulation_id)
    if not sim:
        raise HTTPException(status_code=404, detail="Simulation not found")
        
    sim_result = SimulationResult(**json.loads(sim.result_json))
    graph_context = get_topology_data(db)
    
    return analyze_simulation(sim_result, graph_context)

@router.post("/ai/generate-scenario", response_model=ScenarioGenerationResponse)
def generate_scenario_endpoint(req: ScenarioGenerationRequest, db: Session = Depends(get_db)):
    graph_context = get_topology_data(db)
    return gen_scenario(req.asset_id, graph_context)
