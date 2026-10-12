export interface Asset {
  id: string;
  name: string;
  type: 'user' | 'workstation' | 'server' | 'database' | 'application' | 'security_system';
  criticality: number;
  department: string;
  ip_address: string;
  owner?: string;
  privilege_level?: number;
  status?: string;
  description?: string;
  is_compromisable?: boolean;
}

export interface TopologyNode {
  id: string;
  name: string;
  type: string;
  criticality: number;
  status: string;
  privilege_level: number;
  department: string;
  ip_address: string;
  position?: { x: number; y: number };
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  relationship_type: string;
  is_active: boolean;
  label?: string;
}

export interface TopologyResponse {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
}

export interface AttackPathNode {
  asset_id: string;
  asset_name: string;
  asset_type: string;
  criticality: number;
  privilege_level: number;
  reached_via: string | null;
  step_number: number;
  mitre_technique?: string | null;
  reason_reachable?: string;
  potential_impact?: string;
  security_controls?: string[];
  is_entry?: boolean;
}

export interface PrivilegeEscalation {
  step: number;
  from_asset: string;
  to_asset: string;
  from_level: number;
  to_level: number;
  from_level_name: string;
  to_level_name: string;
}

export interface LateralMovement {
  step: number;
  from_asset: string;
  to_asset: string;
  from_type: string;
  to_type: string;
  relationship: string;
}

export interface BlastRadius {
  total_assets: number;
  critical_assets: number;
  users: number;
  servers: number;
  databases: number;
  applications: number;
  workstations: number;
  security_systems: number;
}

export interface RiskFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
}

export interface RiskScore {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors?: RiskFactor[];
}

export interface MappedTechnique {
  technique_id: string;
  technique_name: string;
  tactic: string;
  description?: string;
  step?: number;
}

export interface SecurityControl {
  id: string;
  name: string;
  type: string;
  description: string;
  is_enabled: boolean;
  protected_asset_ids: string[];
  effect_description: string;
  effectiveness: number;
}

export interface AttackStep {
  step_number: number;
  source_asset_id: string;
  target_asset_id: string;
  relationship_type: string;
  description: string;
  mitre_technique_id?: string;
  mitre_technique_name?: string;
}

export interface SimulationResult {
  id: string;
  initial_asset_id: string;
  scenario_name: string;
  attack_path: AttackPathNode[];
  all_paths: string[][];
  reachable_assets: string[];
  privilege_escalations: PrivilegeEscalation[];
  lateral_movements: LateralMovement[];
  blast_radius: BlastRadius;
  risk_score: RiskScore;
  mitre_techniques_mapped: string[];
  steps?: AttackStep[];
  timestamp: string;
}

export interface SimulationRecord {
  id: string;
  initial_asset_id: string;
  scenario_name: string;
  status: string;
  created_at: string;
  result_json?: string;
}

export interface WhatIfComparison {
  blast_radius_change: number;
  risk_score_change: number;
  paths_blocked: number;
  assets_saved?: number;
  assets_protected?: string[];
  summary?: string;
}

export interface WhatIfResponse {
  baseline: SimulationResult;
  modified: SimulationResult;
  comparison: WhatIfComparison;
}

export interface Recommendation {
  title: string;
  description: string;
  affected_path?: string;
  expected_effect?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface AIAnalysisResponse {
  provider: 'openai' | 'local';
  summary: string;
  attack_path_explanation: string;
  affected_assets: string[];
  privilege_escalation: string[];
  lateral_movement: string[];
  blast_radius_analysis: string;
  mitre_techniques: string[];
  security_weaknesses: string[];
  recommendations: Recommendation[];
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  initial_asset_id: string;
  difficulty: string;
  tags: string[];
}

export interface MitreTechnique {
  id: string;
  technique_id: string;
  name: string;
  tactic: string;
  description: string;
  detection?: string;
}

export interface DashboardStats {
  counts: {
    total_assets: number;
    critical_assets: number;
    total_simulations: number;
    active_controls: number;
  };
  recent_simulations: {
    id: string;
    scenario: string;
    date: string;
    risk_level?: string;
    assets_affected?: number;
  }[];
  asset_distribution?: Record<string, number>;
  risk_distribution?: Record<string, number>;
}
