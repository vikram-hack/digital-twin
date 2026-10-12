from typing import List
import networkx as nx
from app.schemas.simulation import AttackPathNode, PrivilegeEscalation

def calculate_privilege_escalation(path_nodes: List[AttackPathNode], graph: nx.DiGraph) -> List[PrivilegeEscalation]:
    escalations = []
    
    if not path_nodes:
        return escalations
        
    current_max_privilege = path_nodes[0].privilege_level
    
    for i in range(1, len(path_nodes)):
        node = path_nodes[i]
        if node.privilege_level > current_max_privilege:
            escalations.append(PrivilegeEscalation(
                asset_id=node.asset_id,
                from_level=current_max_privilege,
                to_level=node.privilege_level,
                description=f"Privilege increased from level {current_max_privilege} to {node.privilege_level} on {node.asset_name}"
            ))
            current_max_privilege = node.privilege_level
            
    return escalations
