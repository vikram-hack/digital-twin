from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database.engine import get_db
from app.schemas.asset import AssetListResponse, AssetDetailSchema
from app.services import asset_service

router = APIRouter(tags=["Assets"])

@router.get("/assets", response_model=AssetListResponse)
def get_assets(
    skip: int = 0, 
    limit: int = 100, 
    type: Optional[str] = None,
    criticality: Optional[int] = None,
    department: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    items, total = asset_service.get_assets(db, skip, limit, type, criticality, department, search)
    return {"items": items, "total": total}

@router.get("/assets/{asset_id}", response_model=AssetDetailSchema)
def get_asset(asset_id: str, db: Session = Depends(get_db)):
    asset = asset_service.get_asset(db, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    rels = asset_service.get_asset_relationships(db, asset_id)
    creds = asset_service.get_asset_credentials(db, asset_id)
    
    asset_dict = {
        "id": asset.id,
        "name": asset.name,
        "type": asset.type,
        "department": asset.department,
        "criticality": asset.criticality,
        "ip_address": asset.ip_address,
        "owner": asset.owner,
        "description": asset.description,
        "privilege_level": asset.privilege_level,
        "is_compromisable": asset.is_compromisable,
        "status": asset.status,
        "created_at": asset.created_at,
        "relationships": [{"id": r.id, "source_id": r.source_id, "target_id": r.target_id, "type": r.relationship_type, "weight": r.weight} for r in rels],
        "credentials": [{"id": c.id, "username": c.username, "privilege_level": c.privilege_level} for c in creds]
    }
    
    return asset_dict
