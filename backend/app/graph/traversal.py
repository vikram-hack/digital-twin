import networkx as nx
from typing import List, Set, Dict, Any

def apply_security_controls(G: nx.DiGraph, active_controls: List[Dict[str, Any]]) -> nx.DiGraph:
    """
    Applies active security controls to the graph by modifying edge weights or removing edges.
    """
    H = G.copy()
    
    for control in active_controls:
        protected_assets = control.get("protected_asset_ids", [])
        if not protected_assets:
            continue
            
        c_type = control.get("type", "")
        
        if c_type in ["network", "architecture"] and control.get("name") in ["Network Segmentation", "Zero Trust Architecture"]:
            # Block edges to protected assets
            edges_to_remove = []
            for u, v, data in H.edges(data=True):
                if v in protected_assets:
                    edges_to_remove.append((u, v))
            H.remove_edges_from(edges_to_remove)
        else:
            # Increase cost/weight for edges targeting protected assets
            for u, v, data in H.edges(data=True):
                if v in protected_assets:
                    H[u][v]['weight'] = data.get('weight', 1.0) + (control.get("effectiveness", 50) / 10.0)
                    
    return H

def find_attack_paths(G: nx.DiGraph, start_node_id: str) -> List[List[str]]:
    """
    Finds all paths from start_node_id to any other reachable node using BFS/DFS.
    Returns list of paths, where each path is a list of node IDs.
    """
    if start_node_id not in G:
        return []
        
    all_paths = []
    
    # Use BFS to find shortest paths to all reachable nodes
    paths_dict = nx.single_source_shortest_path(G, start_node_id)
    
    for target_id, path in paths_dict.items():
        if target_id != start_node_id:
            all_paths.append(path)
            
    return all_paths

def get_reachable_assets(G: nx.DiGraph, start_node_id: str) -> List[str]:
    """
    Returns list of all node IDs reachable from start_node_id.
    """
    if start_node_id not in G:
        return []
    
    reachable = nx.descendants(G, start_node_id)
    reachable.add(start_node_id)
    return list(reachable)
