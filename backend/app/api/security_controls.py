from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.engine import get_db
from app.models.security_control import SecurityControl
from app.schemas.security_control import SecurityControlSchema, ToggleRequest

router = APIRouter(tags=["Security Controls"])

@router.get("/security-controls", response_model=List[SecurityControlSchema])
def get_controls(db: Session = Depends(get_db)):
    return db.query(SecurityControl).all()

@router.post("/security-controls/{control_id}/toggle", response_model=SecurityControlSchema)
def toggle_control(control_id: str, req: ToggleRequest = None, db: Session = Depends(get_db)):
    control = db.query(SecurityControl).filter(SecurityControl.id == control_id).first()
    if not control:
        raise HTTPException(status_code=404, detail="Control not found")
        
    if req is not None:
        control.is_enabled = req.is_enabled
    else:
        control.is_enabled = not control.is_enabled
        
    db.commit()
    db.refresh(control)
    return control
