from sqlalchemy.orm import Session
from app.models.asset import Asset
from app.models.relationship import AssetRelationship
from app.models.credential import Credential

def get_asset(db: Session, asset_id: str):
    return db.query(Asset).filter(Asset.id == asset_id).first()

def get_assets(db: Session, skip: int = 0, limit: int = 100, asset_type: str = None, criticality: int = None, department: str = None, search: str = None):
    query = db.query(Asset)
    if asset_type:
        query = query.filter(Asset.type == asset_type)
    if criticality:
        query = query.filter(Asset.criticality == criticality)
    if department:
        query = query.filter(Asset.department == department)
    if search:
        query = query.filter(Asset.name.ilike(f"%{search}%"))
    
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return items, total

def get_asset_relationships(db: Session, asset_id: str):
    rels = db.query(AssetRelationship).filter(
        (AssetRelationship.source_id == asset_id) | (AssetRelationship.target_id == asset_id)
    ).all()
    return rels

def get_asset_credentials(db: Session, asset_id: str):
    return db.query(Credential).filter(Credential.asset_id == asset_id).all()
