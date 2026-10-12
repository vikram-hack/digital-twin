from typing import List
import networkx as nx
from app.schemas.simulation import AttackPathNode, LateralMovement

def detect_lateral_movement(path_nodes: List[AttackPathNode], graph: nx.DiGraph) -> List[LateralMovement]:
    movements = []
    
    if len(path_nodes) < 2:
        return movements
        
    for i in range(1, len(path_nodes)):
        prev_node = path_nodes[i-1]
        curr_node = path_nodes[i]
        
        if prev_node.asset_type != curr_node.asset_type:
            movements.append(LateralMovement(
                source_id=prev_node.asset_id,
                target_id=curr_node.asset_id,
                from_type=prev_node.asset_type,
                to_type=curr_node.asset_type,
                description=f"Lateral movement from {prev_node.asset_type} to {curr_node.asset_type}"
            ))
            
    return movements
