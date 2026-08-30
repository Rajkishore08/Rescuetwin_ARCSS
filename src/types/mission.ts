export type SystemStatus = 'OPERATIONAL' | 'DEGRADED' | 'EVALUATING' | 'CRITICAL_HAZARD';

export type MissionPhase = 
  | 'SENSE'
  | 'UNDERSTAND'
  | 'PREDICT'
  | 'ACT'
  | 'ADAPT'
  | 'REPEAT';

export type TechnologyType = 
  | 'SATELLITE'
  | 'DRONES'
  | 'IOT'
  | 'ROBOTICS'
  | 'AI'
  | 'AR'
  | 'PRINTING_3D';

export interface TechStatusItem {
  id: TechnologyType;
  label: string;
  sublabel: string;
  status: 'ONLINE' | 'ACTIVE' | 'CONNECTED' | 'SCANNING' | 'AIRBORNE' | 'DEPLOYED' | 'STANDBY' | 'WARNING';
  metric: string;
  icon: string;
}

export interface MissionEvent {
  id: string;
  timestamp: string;
  source: 'SATELLITE' | 'DRONE' | 'IoT' | 'ROBOT' | 'AI' | 'AR' | '3D_PRINT' | 'SYSTEM';
  level: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  details: string;
  stage: MissionPhase;
}

export interface RouteOption {
  id: 'A' | 'B' | 'C';
  name: string;
  distanceMeters: number;
  structuralRiskPct: number;
  hazardExposurePct: number;
  predictedFutureRiskPct: number;
  survivorReachProbabilityPct: number;
  totalCostScore: number;
  status: 'RECOMMENDED' | 'REJECTED' | 'STANDBY';
  rejectionReason?: string;
  color: string;
}

export interface PrintingRequirement {
  id: string;
  name: string;
  targetUnit: string;
  purpose: string;
  progress: number; // 0 - 100
  status: 'IDLE' | 'PRINTING' | 'READY' | 'DEPLOYED';
  material: string;
  layerHeight: string;
}
