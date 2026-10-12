from app.schemas.simulation import BlastRadius, PrivilegeEscalation, LateralMovement, RiskScore
from typing import List

def calculate_risk_score(
    blast_radius: BlastRadius, 
    privilege_escalations: List[PrivilegeEscalation], 
    lateral_moves: List[LateralMovement], 
    active_controls_count: int
) -> RiskScore:
    """
    base=(reachable_count*3 + critical_count*10 + priv_escalations*8 + lateral_moves*5), 
    divided by max(1, active_controls*0.8), normalized 0-100
    """
    
    reachable_count = blast_radius.total_assets
    critical_count = blast_radius.critical_assets
    priv_escalations = len(privilege_escalations)
    lateral_moves_count = len(lateral_moves)
    
    base_score = (reachable_count * 3) + (critical_count * 10) + (priv_escalations * 8) + (lateral_moves_count * 5)
    
    divisor = max(1.0, active_controls_count * 0.8)
    
    raw_score = base_score / divisor
    
    # Normalize 0-100
    final_score = min(100, int(raw_score))
    
    level = "Low"
    if final_score > 80:
        level = "Critical"
    elif final_score > 50:
        level = "High"
    elif final_score > 25:
        level = "Medium"
        
    factors = []
    if critical_count > 0:
        factors.append(f"{critical_count} critical assets exposed")
    if priv_escalations > 0:
        factors.append(f"{priv_escalations} instances of privilege escalation")
    if lateral_moves_count > 0:
        factors.append(f"{lateral_moves_count} lateral movements detected")
    if active_controls_count == 0:
        factors.append("No active security controls mitigating the attack")
        
    return RiskScore(
        score=final_score,
        level=level,
        factors=factors
    )
