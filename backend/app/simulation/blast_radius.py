from typing import List
import networkx as nx
from app.schemas.simulation import BlastRadius

def calculate_blast_radius(reachable_assets: List[str], graph: nx.DiGraph) -> BlastRadius:
    by_type = {}
    critical_count = 0
    
    for node_id in reachable_assets:
        if node_id not in graph:
            continue
            
        node_type = graph.nodes[node_id].get("type", "unknown")
        by_type[node_type] = by_type.get(node_type, 0) + 1
        
        if graph.nodes[node_id].get("criticality", 1) >= 4:
            critical_count += 1
            
    return BlastRadius(
        total_assets=len(reachable_assets),
        critical_assets=critical_count,
        by_type=by_type
    )
