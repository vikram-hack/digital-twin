from app.schemas.ai import ScenarioGenerationResponse

def generate_scenario(asset_id: str, graph_context: dict) -> ScenarioGenerationResponse:
    # Just local implementation for scenario generation
    return ScenarioGenerationResponse(
        scenario_name=f"Compromise of {asset_id}",
        description=f"An attacker gains initial access to {asset_id} and attempts to move laterally and escalate privileges.",
        expected_impact="Potential unauthorized access to connected systems and sensitive data.",
        mitigation_suggestions=[
            "Enable EDR",
            "Review access logs",
            "Apply security patches"
        ]
    )
