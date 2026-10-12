import json
from app.database.engine import SessionLocal
from app.models.asset import Asset
from app.models.relationship import AssetRelationship
from app.models.security_control import SecurityControl
from app.models.mitre import MitreTechnique

def seed_database():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Asset).first():
            return

        # Users
        users = [
            Asset(id="alice-johnson", name="Alice Johnson", type="user", department="HR", criticality=2, privilege_level=1, owner="HR", is_compromisable=True),
            Asset(id="bob-smith", name="Bob Smith", type="user", department="Finance", criticality=2, privilege_level=1, owner="Finance", is_compromisable=True),
            Asset(id="charlie-davis", name="Charlie Davis", type="user", department="IT", criticality=3, privilege_level=3, owner="IT", is_compromisable=True),
            Asset(id="david-wilson", name="David Wilson", type="user", department="Engineering", criticality=2, privilege_level=2, owner="Engineering", is_compromisable=True),
            Asset(id="emma-brown", name="Emma Brown (Administrator)", type="user", department="IT", criticality=5, privilege_level=5, owner="IT", is_compromisable=True),
            Asset(id="frank-miller", name="Frank Miller", type="user", department="Executive", criticality=4, privilege_level=2, owner="Executive", is_compromisable=True),
            Asset(id="grace-lee", name="Grace Lee", type="user", department="Security", criticality=3, privilege_level=3, owner="Security", is_compromisable=True),
            Asset(id="henry-taylor", name="Henry Taylor", type="user", department="Operations", criticality=2, privilege_level=1, owner="Operations", is_compromisable=True),
            Asset(id="ivy-chen", name="Ivy Chen", type="user", department="Engineering", criticality=2, privilege_level=2, owner="Engineering", is_compromisable=True),
            Asset(id="james-wilson", name="James Wilson", type="user", department="IT", criticality=4, privilege_level=4, owner="IT", is_compromisable=True)
        ]
        
        # Workstations
        workstations = [
            Asset(id="hr-pc-01", name="HR-PC-01", type="workstation", department="HR", criticality=2, privilege_level=1, is_compromisable=True),
            Asset(id="fin-pc-01", name="FIN-PC-01", type="workstation", department="Finance", criticality=3, privilege_level=1, is_compromisable=True),
            Asset(id="dev-pc-01", name="DEV-PC-01", type="workstation", department="Engineering", criticality=2, privilege_level=1, is_compromisable=True),
            Asset(id="it-pc-01", name="IT-PC-01", type="workstation", department="IT", criticality=3, privilege_level=1, is_compromisable=True),
            Asset(id="exec-pc-01", name="EXEC-PC-01", type="workstation", department="Executive", criticality=4, privilege_level=1, is_compromisable=True),
            Asset(id="sec-pc-01", name="SEC-PC-01", type="workstation", department="Security", criticality=3, privilege_level=1, is_compromisable=True),
        ]

        # Servers
        servers = [
            Asset(id="web-server-01", name="WEB-SERVER-01", type="server", department="IT", criticality=4, privilege_level=2, is_compromisable=True),
            Asset(id="app-server-01", name="APP-SERVER-01", type="server", department="IT", criticality=5, privilege_level=3, is_compromisable=True),
            Asset(id="file-server-01", name="FILE-SERVER-01", type="server", department="IT", criticality=4, privilege_level=3, is_compromisable=True),
            Asset(id="ad-server-01", name="AD-SERVER-01", type="server", department="IT", criticality=5, privilege_level=5, is_compromisable=True),
            Asset(id="backup-server-01", name="BACKUP-SERVER-01", type="server", department="IT", criticality=4, privilege_level=3, is_compromisable=True),
            Asset(id="log-server-01", name="LOG-SERVER-01", type="server", department="IT", criticality=3, privilege_level=2, is_compromisable=True),
        ]

        # Databases
        databases = [
            Asset(id="customer-db", name="CUSTOMER-DB", type="database", department="IT", criticality=5, privilege_level=3, is_compromisable=True),
            Asset(id="hr-db", name="HR-DB", type="database", department="HR", criticality=5, privilege_level=3, is_compromisable=True),
            Asset(id="finance-db", name="FINANCE-DB", type="database", department="Finance", criticality=5, privilege_level=4, is_compromisable=True),
            Asset(id="audit-db", name="AUDIT-DB", type="database", department="Security", criticality=4, privilege_level=3, is_compromisable=True),
        ]

        # Applications
        applications = [
            Asset(id="employee-portal", name="Employee Portal", type="application", department="HR", criticality=3, privilege_level=2, is_compromisable=True),
            Asset(id="finance-app", name="Finance Application", type="application", department="Finance", criticality=4, privilege_level=3, is_compromisable=True),
            Asset(id="crm-app", name="CRM Application", type="application", department="Sales", criticality=4, privilege_level=3, is_compromisable=True),
            Asset(id="internal-api", name="Internal API", type="application", department="Engineering", criticality=4, privilege_level=3, is_compromisable=True),
            Asset(id="admin-portal", name="Admin Portal", type="application", department="IT", criticality=5, privilege_level=4, is_compromisable=True),
        ]

        # Security Systems
        security_systems = [
            Asset(id="firewall-01", name="Corporate Firewall", type="security_system", department="Security", criticality=5, privilege_level=4, is_compromisable=False),
            Asset(id="siem-01", name="SIEM System", type="security_system", department="Security", criticality=4, privilege_level=3, is_compromisable=False),
            Asset(id="edr-01", name="EDR Solution", type="security_system", department="Security", criticality=4, privilege_level=3, is_compromisable=False),
            Asset(id="ids-01", name="IDS System", type="security_system", department="Security", criticality=3, privilege_level=2, is_compromisable=False),
            Asset(id="iam-01", name="IAM System", type="security_system", department="Security", criticality=5, privilege_level=5, is_compromisable=False),
            Asset(id="vpn-01", name="VPN Gateway", type="security_system", department="IT", criticality=4, privilege_level=3, is_compromisable=False),
        ]

        db.add_all(users + workstations + servers + databases + applications + security_systems)
        db.commit()

        # Relationships
        relationships = [
            # Path 1
            AssetRelationship(source_id="hr-pc-01", target_id="alice-johnson", relationship_type="HAS_ACCESS", weight=1.0),
            AssetRelationship(source_id="hr-pc-01", target_id="employee-portal", relationship_type="CONNECTS_TO", weight=1.0),
            AssetRelationship(source_id="alice-johnson", target_id="employee-portal", relationship_type="HAS_ACCESS", weight=1.0),
            AssetRelationship(source_id="employee-portal", target_id="app-server-01", relationship_type="CONNECTS_TO", weight=1.0),
            AssetRelationship(source_id="app-server-01", target_id="customer-db", relationship_type="READS", weight=1.0),
            AssetRelationship(source_id="app-server-01", target_id="hr-db", relationship_type="READS", weight=1.0),
            AssetRelationship(source_id="customer-db", target_id="audit-db", relationship_type="DEPENDS_ON", weight=1.0),
            
            # Path 2
            AssetRelationship(source_id="employee-portal", target_id="internal-api", relationship_type="CONNECTS_TO", weight=1.0),
            AssetRelationship(source_id="internal-api", target_id="app-server-01", relationship_type="CONNECTS_TO", weight=1.0),
            AssetRelationship(source_id="app-server-01", target_id="ad-server-01", relationship_type="AUTHENTICATES_TO", weight=1.0),
            AssetRelationship(source_id="ad-server-01", target_id="admin-portal", relationship_type="TRUSTS", weight=1.0),
            AssetRelationship(source_id="admin-portal", target_id="backup-server-01", relationship_type="ADMINISTERS", weight=1.0),
            AssetRelationship(source_id="admin-portal", target_id="file-server-01", relationship_type="ADMINISTERS", weight=1.0),

            # Path 3
            AssetRelationship(source_id="fin-pc-01", target_id="bob-smith", relationship_type="HAS_ACCESS", weight=1.0),
            AssetRelationship(source_id="fin-pc-01", target_id="finance-app", relationship_type="CONNECTS_TO", weight=1.0),
            AssetRelationship(source_id="bob-smith", target_id="finance-app", relationship_type="HAS_ACCESS", weight=1.0),
            AssetRelationship(source_id="finance-app", target_id="finance-db", relationship_type="READS", weight=1.0),
            AssetRelationship(source_id="finance-app", target_id="finance-db", relationship_type="WRITES", weight=1.0),
            AssetRelationship(source_id="finance-app", target_id="app-server-01", relationship_type="DEPENDS_ON", weight=1.0),

            # Path 4
            AssetRelationship(source_id="web-server-01", target_id="app-server-01", relationship_type="CONNECTS_TO", weight=1.0),
            AssetRelationship(source_id="web-server-01", target_id="employee-portal", relationship_type="HOSTS", weight=1.0),
            AssetRelationship(source_id="web-server-01", target_id="crm-app", relationship_type="HOSTS", weight=1.0),

            # Path 5
            AssetRelationship(source_id="emma-brown", target_id="ad-server-01", relationship_type="ADMINISTERS", weight=1.0),
            AssetRelationship(source_id="emma-brown", target_id="admin-portal", relationship_type="HAS_ACCESS", weight=1.0),
            AssetRelationship(source_id="emma-brown", target_id="iam-01", relationship_type="ADMINISTERS", weight=1.0),
            AssetRelationship(source_id="charlie-davis", target_id="it-pc-01", relationship_type="HAS_ACCESS", weight=1.0),
            AssetRelationship(source_id="it-pc-01", target_id="admin-portal", relationship_type="CONNECTS_TO", weight=1.0),
            AssetRelationship(source_id="it-pc-01", target_id="file-server-01", relationship_type="CONNECTS_TO", weight=1.0),

            # Path 6
            AssetRelationship(source_id="james-wilson", target_id="customer-db", relationship_type="ADMINISTERS", weight=1.0),
            AssetRelationship(source_id="james-wilson", target_id="hr-db", relationship_type="ADMINISTERS", weight=1.0),
            AssetRelationship(source_id="james-wilson", target_id="finance-db", relationship_type="ADMINISTERS", weight=1.0),
            AssetRelationship(source_id="james-wilson", target_id="audit-db", relationship_type="ADMINISTERS", weight=1.0),

            # Path 7
            AssetRelationship(source_id="dev-pc-01", target_id="david-wilson", relationship_type="HAS_ACCESS", weight=1.0),
            AssetRelationship(source_id="dev-pc-01", target_id="internal-api", relationship_type="CONNECTS_TO", weight=1.0),
            AssetRelationship(source_id="dev-pc-01", target_id="app-server-01", relationship_type="CONNECTS_TO", weight=1.0),
            AssetRelationship(source_id="david-wilson", target_id="internal-api", relationship_type="HAS_ACCESS", weight=1.0),
            AssetRelationship(source_id="ivy-chen", target_id="dev-pc-01", relationship_type="HAS_ACCESS", weight=1.0),

            # Path 8
            AssetRelationship(source_id="backup-server-01", target_id="file-server-01", relationship_type="CONNECTS_TO", weight=1.0),
            AssetRelationship(source_id="backup-server-01", target_id="customer-db", relationship_type="CAN_REACH", weight=1.0),
            AssetRelationship(source_id="backup-server-01", target_id="hr-db", relationship_type="CAN_REACH", weight=1.0),
            AssetRelationship(source_id="log-server-01", target_id="siem-01", relationship_type="CONNECTS_TO", weight=1.0),
            AssetRelationship(source_id="app-server-01", target_id="log-server-01", relationship_type="CONNECTS_TO", weight=1.0),

            # Path 9
            AssetRelationship(source_id="firewall-01", target_id="web-server-01", relationship_type="TRUSTS", weight=1.0),
            AssetRelationship(source_id="firewall-01", target_id="vpn-01", relationship_type="TRUSTS", weight=1.0),
            AssetRelationship(source_id="edr-01", target_id="hr-pc-01", relationship_type="TRUSTS", weight=1.0),
            AssetRelationship(source_id="edr-01", target_id="fin-pc-01", relationship_type="TRUSTS", weight=1.0),
            AssetRelationship(source_id="iam-01", target_id="ad-server-01", relationship_type="TRUSTS", weight=1.0),

            # Path 10
            AssetRelationship(source_id="exec-pc-01", target_id="frank-miller", relationship_type="HAS_ACCESS", weight=1.0),
            AssetRelationship(source_id="exec-pc-01", target_id="crm-app", relationship_type="CONNECTS_TO", weight=1.0),
            AssetRelationship(source_id="frank-miller", target_id="crm-app", relationship_type="HAS_ACCESS", weight=1.0),
            AssetRelationship(source_id="crm-app", target_id="customer-db", relationship_type="READS", weight=1.0),
            AssetRelationship(source_id="crm-app", target_id="app-server-01", relationship_type="DEPENDS_ON", weight=1.0),
        ]
        
        db.add_all(relationships)
        db.commit()

        controls = [
            SecurityControl(id="mfa", name="Multi-Factor Authentication", type="authentication", description="MFA", is_enabled=True, protected_asset_ids=json.dumps(["admin-portal", "employee-portal", "finance-app"]), effect_description="", effectiveness=80),
            SecurityControl(id="firewall", name="Firewall Rules", type="network", description="Firewall", is_enabled=True, protected_asset_ids=json.dumps(["web-server-01", "app-server-01"]), effect_description="", effectiveness=70),
            SecurityControl(id="network-segmentation", name="Network Segmentation", type="network", description="Network Segmentation", is_enabled=False, protected_asset_ids=json.dumps(["backup-server-01", "finance-db"]), effect_description="", effectiveness=90),
            SecurityControl(id="edr", name="Endpoint Detection & Response", type="endpoint", description="EDR", is_enabled=True, protected_asset_ids=json.dumps(["hr-pc-01", "fin-pc-01", "dev-pc-01"]), effect_description="", effectiveness=75),
            SecurityControl(id="ids", name="Intrusion Detection System", type="network", description="IDS", is_enabled=True, protected_asset_ids=json.dumps(["app-server-01", "web-server-01"]), effect_description="", effectiveness=65),
            SecurityControl(id="siem", name="SIEM Monitoring", type="monitoring", description="SIEM", is_enabled=True, protected_asset_ids=json.dumps(["customer-db", "hr-db"]), effect_description="", effectiveness=60),
            SecurityControl(id="least-privilege", name="Least Privilege Policy", type="policy", description="Least Privilege", is_enabled=False, protected_asset_ids=json.dumps([]), effect_description="", effectiveness=85),
            SecurityControl(id="pam", name="Privileged Access Management", type="authentication", description="PAM", is_enabled=False, protected_asset_ids=json.dumps(["ad-server-01", "admin-portal"]), effect_description="", effectiveness=90),
            SecurityControl(id="zero-trust", name="Zero Trust Architecture", type="architecture", description="Zero Trust", is_enabled=False, protected_asset_ids=json.dumps([]), effect_description="", effectiveness=95),
            SecurityControl(id="credential-rotation", name="Credential Rotation", type="policy", description="Rotation", is_enabled=False, protected_asset_ids=json.dumps([]), effect_description="", effectiveness=70),
        ]
        db.add_all(controls)
        db.commit()

        mitre_techs = [
            MitreTechnique(id="T1078", technique_id="T1078", name="Valid Accounts", tactic="Initial Access", description="", detection=""),
            MitreTechnique(id="T1566", technique_id="T1566", name="Phishing", tactic="Initial Access", description="", detection=""),
            MitreTechnique(id="T1059", technique_id="T1059", name="Command and Scripting Interpreter", tactic="Execution", description="", detection=""),
            MitreTechnique(id="T1021", technique_id="T1021", name="Remote Services", tactic="Lateral Movement", description="", detection=""),
            MitreTechnique(id="T1003", technique_id="T1003", name="OS Credential Dumping", tactic="Credential Access", description="", detection=""),
            MitreTechnique(id="T1548", technique_id="T1548", name="Abuse Elevation Control Mechanism", tactic="Privilege Escalation", description="", detection=""),
            MitreTechnique(id="T1071", technique_id="T1071", name="Application Layer Protocol", tactic="Command and Control", description="", detection=""),
            MitreTechnique(id="T1486", technique_id="T1486", name="Data Encrypted for Impact", tactic="Impact", description="", detection=""),
            MitreTechnique(id="T1087", technique_id="T1087", name="Account Discovery", tactic="Discovery", description="", detection=""),
            MitreTechnique(id="T1049", technique_id="T1049", name="System Network Connections Discovery", tactic="Discovery", description="", detection=""),
            MitreTechnique(id="T1110", technique_id="T1110", name="Brute Force", tactic="Credential Access", description="", detection=""),
            MitreTechnique(id="T1098", technique_id="T1098", name="Account Manipulation", tactic="Persistence", description="", detection=""),
            MitreTechnique(id="T1190", technique_id="T1190", name="Exploit Public-Facing Application", tactic="Initial Access", description="", detection=""),
            MitreTechnique(id="T1560", technique_id="T1560", name="Archive Collected Data", tactic="Collection", description="", detection=""),
            MitreTechnique(id="T1005", technique_id="T1005", name="Data from Local System", tactic="Collection", description="", detection=""),
            MitreTechnique(id="T1040", technique_id="T1040", name="Network Sniffing", tactic="Credential Access", description="", detection=""),
            MitreTechnique(id="T1018", technique_id="T1018", name="Remote System Discovery", tactic="Discovery", description="", detection=""),
            MitreTechnique(id="T1083", technique_id="T1083", name="File and Directory Discovery", tactic="Discovery", description="", detection=""),
        ]
        db.add_all(mitre_techs)
        db.commit()

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()
