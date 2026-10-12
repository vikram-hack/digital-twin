from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.schemas.topology import TopologyResponse
from app.graph.topology import get_topology_data

router = APIRouter(tags=["Topology"])

@router.get("/topology", response_model=TopologyResponse)
def get_topology(db: Session = Depends(get_db)):
    data = get_topology_data(db)
    return data
