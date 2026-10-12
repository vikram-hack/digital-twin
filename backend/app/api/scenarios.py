from fastapi import APIRouter

router = APIRouter(tags=["Scenarios"])

SCENARIOS = [
    {"id": "compromised-employee", "name": "Compromised Employee Workstation", "start_asset_id": "hr-pc-01", "description": "An employee falls for a phishing email, giving attacker access to HR workstation."},
    {"id": "compromised-web-server", "name": "Compromised Web Server", "start_asset_id": "web-server-01", "description": "Attacker exploits a vulnerability on the public facing web server."},
    {"id": "compromised-app-server", "name": "Compromised Application Server", "start_asset_id": "app-server-01", "description": "Internal application server is compromised through an insecure dependency."},
    {"id": "compromised-admin", "name": "Compromised Admin Workstation", "start_asset_id": "exec-pc-01", "description": "Executive's device is compromised, leading to admin portal access."},
    {"id": "compromised-db-account", "name": "Compromised Database Account", "start_asset_id": "customer-db", "description": "Database credentials leaked, attacker has direct DB access."},
    {"id": "exposed-internal-api", "name": "Exposed Internal API", "start_asset_id": "internal-api", "description": "Internal API accidentally exposed to external network."}
]

@router.get("/scenarios")
def get_scenarios():
    return SCENARIOS

@router.get("/scenarios/{scenario_id}")
def get_scenario(scenario_id: str):
    for s in SCENARIOS:
        if s["id"] == scenario_id:
            return s
    return {"error": "Not found"}
