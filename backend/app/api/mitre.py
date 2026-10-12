from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.engine import get_db
from app.models.mitre import MitreTechnique

router = APIRouter(tags=["MITRE ATT&CK"])

@router.get("/mitre")
def get_mitre_techniques(db: Session = Depends(get_db)):
    techs = db.query(MitreTechnique).all()
    return [{"id": t.id, "technique_id": t.technique_id, "name": t.name, "tactic": t.tactic} for t in techs]

@router.get("/mitre/{technique_id}")
def get_mitre_technique(technique_id: str, db: Session = Depends(get_db)):
    t = db.query(MitreTechnique).filter(MitreTechnique.technique_id == technique_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Technique not found")
    return {"id": t.id, "technique_id": t.technique_id, "name": t.name, "tactic": t.tactic, "description": t.description}
