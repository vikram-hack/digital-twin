from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.models.security_control import SecurityControl
from app.schemas.whatif import WhatIfRequest, WhatIfResponse, ComparisonResult
from app.services.simulation_service import execute_simulation

router = APIRouter(tags=["What-If Analysis"])

@router.post("/what-if", response_model=WhatIfResponse)
def run_whatif_analysis(req: WhatIfRequest, db: Session = Depends(get_db)):
    # 1. Run baseline simulation
    baseline = execute_simulation(db, req.initial_asset_id, "Baseline")
    
    # 2. Store original control states and apply modified ones
    controls = db.query(SecurityControl).all()
    original_states = {c.id: c.is_enabled for c in controls}
    
    for c in controls:
        if c.id in req.toggled_controls:
            c.is_enabled = req.toggled_controls[c.id]
    
    db.commit()
    
    try:
        # 3. Run modified simulation
        modified = execute_simulation(db, req.initial_asset_id, "What-If Modified")
        
        # 4. Compare
        paths_blocked = len(baseline.all_paths) - len(modified.all_paths)
        assets_saved = baseline.blast_radius.total_assets - modified.blast_radius.total_assets
        risk_change = modified.risk_score.score - baseline.risk_score.score
        blast_change = modified.blast_radius.total_assets - baseline.blast_radius.total_assets
        
        summary = f"Applying new security controls blocked {paths_blocked} attack paths and saved {assets_saved} assets from compromise. Overall risk score changed by {risk_change} points."
        
        comparison = ComparisonResult(
            paths_blocked=paths_blocked,
            assets_saved=assets_saved,
            risk_score_change=risk_change,
            blast_radius_change=blast_change,
            summary=summary
        )
        
        return WhatIfResponse(
            baseline=baseline,
            modified=modified,
            comparison=comparison
        )
        
    finally:
        # 5. Restore original control states
        for c in controls:
            c.is_enabled = original_states[c.id]
        db.commit()
