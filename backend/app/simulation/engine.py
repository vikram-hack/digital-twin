from sqlalchemy.orm import Session
from typing import List, Dict, Any
import json
import uuid
from datetime import datetime

from app.models.security_control import SecurityControl
from app.models.simulation import Simulation
from app.graph.topology import build_graph
from app.graph.traversal import apply_security_controls, find_attack_paths, get_reachable_assets
from app.simulation.privilege import calculate_privilege_escalation
from app.simulation.lateral import detect_lateral_movement
from app.simulation.blast_radius import calculate_blast_radius
from app.simulation.risk import calculate_risk_score
from app.mitre.mapper import map_simulation_to_techniques
from app.schemas.simulation import (
    SimulationResult, AttackPathNode, AttackStep, 
    PrivilegeEscalation, LateralMovement, BlastRadius, RiskScore
)

def run_simulation(db: Session, initial_asset_id: str, scenario_name: str = None) -> SimulationResult:
    # 1. Build Graph
    base_graph = build_graph(db)
    
    # 2. Check active controls
    controls_orm = db.query(SecurityControl).filter(SecurityControl.is_enabled == True).all()
    active_controls = []
    for c in controls_orm:
        protected = []
        try:
            if c.protected_asset_ids:
                protected = json.loads(c.protected_asset_ids)
        except:
            pass
        active_controls.append({
            "id": c.id,
            "name": c.name,
            "type": c.type,
            "protected_asset_ids": protected,
            "effectiveness": c.effectiveness
        })
        
    # 3. Apply controls to graph
    sim_graph = apply_security_controls(base_graph, active_controls)
    
    # 4 & 5. Find reachable assets
    reachable = get_reachable_assets(sim_graph, initial_asset_id)
    
    # 8. Build all paths
    all_paths = find_attack_paths(sim_graph, initial_asset_id)
    
    # 7. Select primary attack path: prefer deepest path with highest cumulative impact
    target_path = []
    if all_paths:
        # Score paths by: cumulative criticality + privilege escalation + length bonus
        # This ensures we show the full multi-hop attack chain, not just shortest path
        def path_score(p):
            total_crit = sum(
                sim_graph.nodes[n].get("criticality", 1) for n in p
            )
            priv_levels = [sim_graph.nodes[n].get("privilege_level", 1) for n in p]
            max_priv = max(priv_levels) if priv_levels else 1
            length_bonus = len(p) * 3  # strongly reward longer paths
            return total_crit + max_priv * 3 + length_bonus
            
        sorted_paths = sorted(all_paths, key=path_score, reverse=True)
        target_path = sorted_paths[0]
    elif initial_asset_id in sim_graph:
        target_path = [initial_asset_id]
        
    # 6. Build attack path nodes
    attack_path_nodes = []
    steps = []
    for i, node_id in enumerate(target_path):
        node_data = sim_graph.nodes[node_id]
        reached_via = None
        if i > 0:
            prev_id = target_path[i-1]
            edge_data = sim_graph.get_edge_data(prev_id, node_id, {})
            reached_via = edge_data.get("type", "UNKNOWN")
            
            # Record step
            steps.append(AttackStep(
                step_number=i,
                source_asset_id=prev_id,
                target_asset_id=node_id,
                relationship_type=reached_via,
                description=f"Attacker moved from {prev_id} to {node_id} via {reached_via}"
            ))
            
        attack_path_nodes.append(AttackPathNode(
            asset_id=node_id,
            asset_name=node_data.get("name", node_id),
            asset_type=node_data.get("type", "unknown"),
            criticality=node_data.get("criticality", 1),
            privilege_level=node_data.get("privilege_level", 1),
            reached_via=reached_via,
            step_number=i
        ))
        
    # Map steps to MITRE techniques
    steps = map_simulation_to_techniques(steps, sim_graph, db)
    mapped_techniques = list(set([s.mitre_technique_id for s in steps if s.mitre_technique_id]))
        
    # 9 & 10. Escalarion & Movement
    priv_esc = calculate_privilege_escalation(attack_path_nodes, sim_graph)
    lat_mov = detect_lateral_movement(attack_path_nodes, sim_graph)
    
    # 11 & 12. Blast & Risk
    blast = calculate_blast_radius(reachable, sim_graph)
    risk = calculate_risk_score(blast, priv_esc, lat_mov, len(active_controls))
    
    sim_id = str(uuid.uuid4())
    
    result = SimulationResult(
        id=sim_id,
        initial_asset_id=initial_asset_id,
        reachable_assets=reachable,
        attack_path=attack_path_nodes,
        all_paths=all_paths,
        steps=steps,
        privilege_escalations=priv_esc,
        lateral_movements=lat_mov,
        blast_radius=blast,
        risk_score=risk,
        mitre_techniques_mapped=mapped_techniques,
        timestamp=datetime.utcnow()
    )
    
    # 13. Save simulation
    sim_record = Simulation(
        id=sim_id,
        initial_asset_id=initial_asset_id,
        scenario_name=scenario_name or f"Simulate from {initial_asset_id}",
        result_json=result.model_dump_json(),
        status="completed"
    )
    db.add(sim_record)
    db.commit()
    
    return result
