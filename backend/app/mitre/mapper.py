from typing import List
import networkx as nx
from sqlalchemy.orm import Session
from app.schemas.simulation import AttackStep
from app.models.mitre import MitreTechnique

def map_simulation_to_techniques(steps: List[AttackStep], graph: nx.DiGraph, db: Session) -> List[AttackStep]:
    # Very basic static mapping for the sake of the requirement
    # Real mapping would query DB for matching TTPs
    
    mapping_rules = {
        "HAS_ACCESS": "T1078", # Valid Accounts
        "CONNECTS_TO": "T1021", # Remote Services
        "READS": "T1005", # Data from Local System
        "WRITES": "T1486", # Data Encrypted for Impact
        "AUTHENTICATES_TO": "T1110", # Brute Force
        "TRUSTS": "T1190", # Exploit Public-Facing App
        "ADMINISTERS": "T1548", # Abuse Elevation Control
        "DEPENDS_ON": "T1087", # Account Discovery
        "HOSTS": "T1059", # Command and Scripting
        "CAN_REACH": "T1018", # Remote System Discovery
    }
    
    for step in steps:
        rel = step.relationship_type
        if rel in mapping_rules:
            step.mitre_technique_id = mapping_rules[rel]
            
    return steps
