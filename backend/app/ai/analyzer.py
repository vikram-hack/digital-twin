import json
from app.schemas.simulation import SimulationResult
from app.schemas.ai import AIAnalysisResponse
from app.ai.provider import is_openai_available, get_ai_provider
from app.ai.local_analyzer import local_analyze_simulation

def analyze_simulation(sim_result: SimulationResult, graph_context: dict) -> AIAnalysisResponse:
    if is_openai_available():
        client = get_ai_provider()
        prompt = f"""
        Analyze the following cyber attack simulation result and provide a JSON response.
        Simulation Data: {sim_result.model_dump_json()}
        
        Required JSON format:
        {{
            "summary": "...",
            "attack_path_explanation": "...",
            "affected_assets_analysis": "...",
            "privilege_escalation_narrative": "...",
            "lateral_movement_narrative": "...",
            "security_weakness_analysis": ["..."],
            "recommendations": ["..."]
        }}
        """
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            data = json.loads(response.choices[0].message.content)
            return AIAnalysisResponse(**data)
        except Exception:
            # Fallback on error
            return local_analyze_simulation(sim_result, graph_context)
    else:
        return local_analyze_simulation(sim_result, graph_context)
