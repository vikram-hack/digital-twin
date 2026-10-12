import networkx as nx
from sqlalchemy.orm import Session
from app.models.asset import Asset
from app.models.relationship import AssetRelationship
from typing import Dict, Any

def build_graph(db: Session) -> nx.DiGraph:
    """
    Builds a directed graph representing the digital twin topology.
    Nodes are assets, edges are relationships.
    """
    G = nx.DiGraph()
    
    # Load all assets
    assets = db.query(Asset).all()
    for asset in assets:
        G.add_node(
            asset.id,
            name=asset.name,
            type=asset.type,
            department=asset.department,
            criticality=asset.criticality,
            privilege_level=asset.privilege_level,
            is_compromisable=asset.is_compromisable
        )
        
    # Load all active relationships
    relationships = db.query(AssetRelationship).filter(AssetRelationship.is_active == True).all()
    for rel in relationships:
        G.add_edge(
            rel.source_id,
            rel.target_id,
            id=rel.id,
            type=rel.relationship_type,
            weight=rel.weight
        )
        
    return G

def get_topology_data(db: Session) -> Dict[str, Any]:
    """
    Returns topology data formatted for frontend visualization (React Flow, etc).
    """
    assets = db.query(Asset).all()
    relationships = db.query(AssetRelationship).filter(AssetRelationship.is_active == True).all()
    
    nodes = []
    for a in assets:
        nodes.append({
            "id": a.id,
            "label": a.name,
            "type": a.type,
            "department": a.department,
            "criticality": a.criticality,
            "privilege_level": a.privilege_level,
            "data": {
                "is_compromisable": a.is_compromisable
            }
        })
        
    edges = []
    for r in relationships:
        edges.append({
            "id": f"e-{r.id}",
            "source": r.source_id,
            "target": r.target_id,
            "label": r.relationship_type,
            "type": r.relationship_type,
            "weight": r.weight
        })
        
    return {"nodes": nodes, "edges": edges}
