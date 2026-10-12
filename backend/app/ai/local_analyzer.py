from app.schemas.simulation import SimulationResult
from app.schemas.ai import AIAnalysisResponse

def local_analyze_simulation(sim_result: SimulationResult, graph_context: dict) -> AIAnalysisResponse:
    target_asset = sim_result.attack_path[-1].asset_name if sim_result.attack_path else "unknown"
    start_asset = sim_result.attack_path[0].asset_name if sim_result.attack_path else "unknown"
    
    summary = f"Simulation of compromised {start_asset} reveals a multi-stage attack path reaching {sim_result.blast_radius.total_assets} assets including {sim_result.blast_radius.critical_assets} critical systems. The simulated attacker progresses from {start_asset} to {target_asset}."
    
    path_details = " -> ".join([f"{n.asset_name}" for n in sim_result.attack_path])
    attack_path_explanation = f"The attacker used the following path: {path_details}. "
    for step in sim_result.steps:
        attack_path_explanation += f"From {step.source_asset_id} to {step.target_asset_id} via {step.relationship_type}. "
        
    affected_assets_analysis = f"A total of {sim_result.blast_radius.total_assets} assets were compromised. Breakdown by type: {sim_result.blast_radius.by_type}."
    
    priv_esc = "No privilege escalation detected."
    if sim_result.privilege_escalations:
        priv_esc = "Privilege escalation occurred: " + "; ".join([e.description for e in sim_result.privilege_escalations])
        
    lat_mov = "No lateral movement detected."
    if sim_result.lateral_movements:
        lat_mov = "Lateral movement occurred: " + "; ".join([m.description for m in sim_result.lateral_movements])
        
    weaknesses = [
        "Overly permissive trust relationships allowing lateral movement",
        "Insufficient network segmentation between critical tiers"
    ]
    if sim_result.privilege_escalations:
        weaknesses.append("Lack of proper privilege access management (PAM)")
        
    recommendations = [
        "Implement Multi-Factor Authentication on all critical access points",
        "Review and restrict network segmentation rules",
        "Apply Zero Trust principles for internal application access"
    ]
    
    return AIAnalysisResponse(
        summary=summary,
        attack_path_explanation=attack_path_explanation,
        affected_assets_analysis=affected_assets_analysis,
        privilege_escalation_narrative=priv_esc,
        lateral_movement_narrative=lat_mov,
        security_weakness_analysis=weaknesses,
        recommendations=recommendations
    )
