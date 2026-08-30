export type CameraPreset = 'COMMAND' | 'AERIAL' | 'BUILDING' | 'ROBOT';

export interface ZoneState {
  id: 'ZONE_A' | 'ZONE_B' | 'ZONE_C' | 'SURVIVOR_ZONE';
  name: string;
  label: string;
  riskPct: number;
  status: 'SAFE' | 'MODERATE' | 'HIGH_RISK' | 'CRITICAL';
  color: string;
  description: string;
  center: [number, number, number];
  size: [number, number, number];
}

export interface RiskDecomposition {
  vibrationContribution: number;
  structuralDamage: number;
  temperatureContribution: number;
  hazardContribution: number;
  recentRateOfChange: number;
  totalComputedRiskPct: number;
}

export interface AIEngineState {
  isInferring: boolean;
  confidencePct: number;
  structuralRiskPct: number;
  victimProbabilityPct: number;
  recommendedRouteId: 'A' | 'B' | 'C';
  riskDecomposition: RiskDecomposition;
  predictionSummary: string;
  actionRecommendation: string;
  reasoningTimeline: Array<{
    time: string;
    action: string;
    details: string;
    level: 'nominal' | 'warning' | 'critical' | 'decision';
  }>;
}

export interface DigitalTwinState {
  buildingIntegrityPct: number;
  geometryUpdated: boolean;
  collapseStage: 0 | 1 | 2; // 0: Normal Intact, 1: Earthquake Partial Collapse, 2: Flood Ground Collapse
  activeZones: Record<string, ZoneState>;
  cameraPreset: CameraPreset;
  arMode: boolean;
  show3DLabels: boolean;
  wireframeOverlay: boolean;
  stressHeatmapVisible: boolean;
  selectedElementId: string | null;
}
