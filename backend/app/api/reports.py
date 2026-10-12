from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from datetime import datetime
from app.database.engine import get_db
from app.schemas.report import ReportRequest, ReportResponse, ReportSection
from app.services.simulation_service import get_simulation

router = APIRouter(tags=["Reports"])

@router.post("/reports/generate", response_model=ReportResponse)
def generate_report(req: ReportRequest, db: Session = Depends(get_db)):
    if req.simulation_id:
        sim = get_simulation(db, req.simulation_id)
        if not sim:
            raise HTTPException(status_code=404, detail="Simulation not found")
            
        sections = [
            ReportSection(title="Simulation Summary", content=f"Simulation {sim.id} on scenario '{sim.scenario_name}' completed on {sim.created_at}."),
            ReportSection(title="Technical Details", content="A detailed attack path was identified indicating significant risk.", data={"status": sim.status})
        ]
        title = f"Attack Simulation Report - {sim.scenario_name}"
    else:
        sections = [
            ReportSection(title="Environment Posture", content="Overall posture report based on currently active security controls.")
        ]
        title = "Overall Security Posture Report"
        
    return ReportResponse(
        report_id=str(uuid.uuid4()),
        generated_at=datetime.utcnow().isoformat(),
        title=title,
        sections=sections
    )

@router.get("/reports/{report_id}", response_model=ReportResponse)
def get_report(report_id: str):
    # Dummy for now
    return ReportResponse(
        report_id=report_id,
        generated_at=datetime.utcnow().isoformat(),
        title="Sample Report",
        sections=[]
    )
