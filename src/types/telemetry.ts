export interface IoTSensorNode {
  id: string;
  name: string;
  location: string;
  floor: number;
  type: 'VIBRATION' | 'TEMPERATURE' | 'GAS' | 'STRUCTURAL_MOVEMENT';
  value: number;
  unit: string;
  threshold: number;
  status: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  coords: [number, number, number];
  sparkline: number[];
}

export interface FloodTelemetry {
  active: boolean;
  waterLevelM: number;
  flowVelocityMs: number;
  floodRateCmMin: number;
  breachLocation: string;
  submergedSensors: string[];
}

export interface TelemetryState {
  vibration: number; // mm/s
  temperature: number; // °C
  gasLevel: 'NORMAL' | 'ELEVATED' | 'TOXIC_HAZARD';
  gasPpm: number;
  structuralMovementCm: number;
  flood: FloodTelemetry;
  
  // Drone Telemetry
  drone: {
    status: 'HOVERING' | 'SCANNING' | 'TRANSMITTING' | 'STANDBY';
    altitude: number; // m
    batteryPct: number;
    lidarPointsSec: number;
    position: [number, number, number];
    scanProgress: number; // 0 to 100
  };

  // Ground Robot Telemetry (ROBOT-01)
  robot: {
    status: 'ACTIVE' | 'TRAVERSING' | 'SCANNING_DEBRIS' | 'STANDBY';
    batteryPct: number;
    distanceMeters: number;
    thermalAnomaly: boolean;
    thermalTempC: number;
    position: [number, number, number];
    attachmentMounted: string | null;
  };

  // Satellite Telemetry
  satellite: {
    status: 'CONNECTED' | 'DOWNLINKING' | 'ORBITAL_PASS';
    lastPassTime: string;
    sarDeformationMm: number;
    opticalResolutionM: number;
    geospatialLayer: string;
    coveragePct: number;
  };

  // Active IoT sensors
  sensorNodes: IoTSensorNode[];
}
