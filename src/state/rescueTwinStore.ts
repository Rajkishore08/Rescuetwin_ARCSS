import { create } from 'zustand';
import type { MissionEvent, MissionPhase, RouteOption, SystemStatus, TechStatusItem, PrintingRequirement } from '../types/mission';
import type { IoTSensorNode, TelemetryState } from '../types/telemetry';
import type { AIEngineState, CameraPreset, DigitalTwinState, ZoneState } from '../types/digitalTwin';
import { calculateStructuralRisk } from '../services/riskEngine';
import { calculateOptimalRescueRoutes } from '../services/routeEngine';
import { sound } from '../services/soundFx';

export type PipFeedType = 'ROBOT_FLIR' | 'DRONE_OPTICAL' | 'OFF';

export interface RescueTwinStore {
  // Global metadata
  systemStatus: SystemStatus;
  missionPhase: MissionPhase;
  missionTimeSec: number;
  timelineSec: number;
  isDemoRunning: boolean;
  demoTimerIds: Array<ReturnType<typeof setTimeout>>;
  demoStepIndex: number;
  isInterviewMode: boolean;
  architectureModalOpen: boolean;
  is3DFullscreen: boolean;
  soundEnabled: boolean;
  activePipFeed: PipFeedType;
  cameraZoomDistance: number;

  // Domain states
  telemetry: TelemetryState;
  digitalTwin: DigitalTwinState;
  aiEngine: AIEngineState;
  routes: RouteOption[];
  events: MissionEvent[];
  techStatus: TechStatusItem[];
  printing: PrintingRequirement;
  inspectorDrawerOpen: boolean;
  inspectorTargetId: string | null;

  // Actions & Triggers
  setCameraZoomDistance: (dist: number) => void;
  setTimelineSec: (sec: number) => void;
  setPipFeed: (feed: PipFeedType) => void;
  triggerDroneScan: () => void;
  triggerSensorSpike: () => void;
  triggerRobotExploration: () => void;
  triggerAiRecalculate: () => void;
  triggerFlashFlood: () => void;
  trigger3DPrint: () => void;
  toggleArMode: () => void;
  toggle3DLabels: () => void;
  toggle3DFullscreen: () => void;
  toggleInterviewMode: () => void;
  setArchitectureModal: (open: boolean) => void;
  setInspectorDrawer: (open: boolean, targetId?: string | null) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  setSelectedElement: (id: string | null) => void;
  toggleSound: () => void;
  resetMission: () => void;
  startDemo: () => void;
  pauseDemo: () => void;
  tickMissionTime: () => void;
  updateDigitalTwin: (actionName: string, payload?: Record<string, unknown>) => void;
}

const initialSensorNodes: IoTSensorNode[] = [
  {
    id: 'SN-01',
    name: 'North Shear Column #1',
    location: 'North Elevation - Floor 3',
    floor: 3,
    type: 'VIBRATION',
    value: 4.8,
    unit: 'mm/s',
    threshold: 6.5,
    status: 'NOMINAL',
    coords: [-2.2, 5.2, 2.0],
    sparkline: [3.8, 4.1, 4.2, 4.5, 4.8, 4.7, 4.8],
  },
  {
    id: 'SN-02',
    name: 'East Wing Stairwell',
    location: 'East Corridor - Floor 2',
    floor: 2,
    type: 'STRUCTURAL_MOVEMENT',
    value: 2.4,
    unit: 'cm',
    threshold: 5.0,
    status: 'NOMINAL',
    coords: [2.5, 3.2, 0.5],
    sparkline: [1.8, 2.0, 2.1, 2.2, 2.3, 2.4, 2.4],
  },
  {
    id: 'SN-03',
    name: 'Basement Thermal Probe',
    location: 'Sub-Basement B1',
    floor: -1,
    type: 'TEMPERATURE',
    value: 71,
    unit: '°C',
    threshold: 85,
    status: 'WARNING',
    coords: [0.5, 0.4, -1.5],
    sparkline: [62, 65, 68, 70, 71, 70, 71],
  },
  {
    id: 'SN-04',
    name: 'Core Air Intake Gas Sniffer',
    location: 'Central Shaft - Floor 1',
    floor: 1,
    type: 'GAS',
    value: 24,
    unit: 'ppm',
    threshold: 50,
    status: 'NOMINAL',
    coords: [0, 1.8, 0],
    sparkline: [18, 20, 22, 21, 23, 24, 24],
  },
  {
    id: 'SN-05',
    name: 'West Facade Tiltmeter',
    location: 'West Parapet - Floor 4',
    floor: 4,
    type: 'STRUCTURAL_MOVEMENT',
    value: 1.1,
    unit: 'cm',
    threshold: 4.0,
    status: 'NOMINAL',
    coords: [-3.0, 7.0, -1.5],
    sparkline: [0.8, 0.9, 1.0, 1.1, 1.0, 1.1, 1.1],
  },
  {
    id: 'SN-06',
    name: 'South Egress Accelerometer',
    location: 'South Portal - Ground',
    floor: 0,
    type: 'VIBRATION',
    value: 1.8,
    unit: 'mm/s',
    threshold: 5.0,
    status: 'NOMINAL',
    coords: [1.5, 0.5, 3.2],
    sparkline: [1.5, 1.6, 1.7, 1.8, 1.7, 1.8, 1.8],
  },
];

const initialZones: Record<string, ZoneState> = {
  ZONE_A: {
    id: 'ZONE_A',
    name: 'ZONE A — NORTH ELEVATION',
    label: 'STRUCTURAL MONITORING',
    riskPct: 31,
    status: 'SAFE',
    color: '#eab308',
    description: 'Structure monitored. Sensors nominal.',
    center: [-2.2, 5.0, 1.8],
    size: [3.8, 5.0, 3.5],
  },
  ZONE_B: {
    id: 'ZONE_B',
    name: 'ZONE B — EAST WING',
    label: 'MODERATE RISK / ACCESS',
    riskPct: 29,
    status: 'SAFE',
    color: '#10b981',
    description: 'Reinforced concrete shear wall intact. Primary emergency egress.',
    center: [2.5, 3.5, -0.5],
    size: [3.5, 6.0, 4.0],
  },
  ZONE_C: {
    id: 'ZONE_C',
    name: 'ZONE C — SOUTH APRON',
    label: 'SAFE STAGING ACCESS',
    riskPct: 14,
    status: 'SAFE',
    color: '#00f0ff',
    description: 'Debris-cleared ground staging perimeter for robot and responder ingress.',
    center: [0.0, 0.4, 3.8],
    size: [8.0, 0.8, 4.0],
  },
  SURVIVOR_ZONE: {
    id: 'SURVIVOR_ZONE',
    name: 'SURVIVOR PROBABILITY ZONE',
    label: 'SURVIVOR VOID DETECTED',
    riskPct: 45,
    status: 'MODERATE',
    color: '#f59e0b',
    description: 'Basement cavity B-2: acoustic resonance and thermal signature detected.',
    center: [0.6, 0.3, -1.2],
    size: [2.5, 1.5, 2.5],
  },
};

const initialEvents: MissionEvent[] = [
  {
    id: 'evt-01',
    timestamp: '00:11:05',
    source: 'SATELLITE',
    level: 'info',
    title: 'Satellite SAR Downlink Synchronized',
    details: 'Sentinel-1 InSAR coherence map ingested. Normal 3D building baseline initialized.',
    stage: 'SENSE',
  },
  {
    id: 'evt-02',
    timestamp: '00:11:42',
    source: 'IoT',
    level: 'info',
    title: 'Mesh IoT Network 24/24 Nodes Online',
    details: 'Vibration 4.8 mm/s, Temp 71°C, Gas normal. Structural movement 2.4 cm.',
    stage: 'SENSE',
  },
  {
    id: 'evt-03',
    timestamp: '00:12:10',
    source: 'AI',
    level: 'success',
    title: 'Initial Digital Twin Baseline Synthesized',
    details: 'Composite structural risk evaluated at 31%. Building intact. Route B selected as optimal ingress.',
    stage: 'PREDICT',
  },
];

const initialTechStatus: TechStatusItem[] = [
  { id: 'SATELLITE', label: 'SATELLITE', sublabel: 'SAR / OPTICAL', status: 'CONNECTED', metric: 'Pass 4min ago', icon: 'Satellite' },
  { id: 'DRONES', label: 'DRONES', sublabel: 'AUTONOMOUS QUAD', status: 'AIRBORNE', metric: '100% Battery', icon: 'Plane' },
  { id: 'IOT', label: 'IoT SENSORS', sublabel: 'STRUCTURAL MESH', status: 'ONLINE', metric: '24 Nodes', icon: 'Cpu' },
  { id: 'ROBOTICS', label: 'ROBOTICS', sublabel: 'ROBOT-01 ROVER', status: 'ACTIVE', metric: 'Ready at Base', icon: 'Bot' },
  { id: 'AI', label: 'AI ENGINE', sublabel: 'RISK INFERENCE', status: 'ACTIVE', metric: 'Lat: 18ms', icon: 'Brain' },
  { id: 'AR', label: 'AR RESPONDER', sublabel: 'SPATIAL HUD', status: 'ONLINE', metric: 'HUD Synced', icon: 'Glasses' },
  { id: 'PRINTING_3D', label: '3D PRINTING', sublabel: 'RAPID TOOLING', status: 'STANDBY', metric: 'Ready', icon: 'Printer' },
];

export const useRescueTwinStore = create<RescueTwinStore>((set, get) => ({
  systemStatus: 'OPERATIONAL',
  missionPhase: 'SENSE',
  missionTimeSec: 762,
  timelineSec: 0,
  isDemoRunning: false,
  demoTimerIds: [],
  demoStepIndex: 0,
  isInterviewMode: false,
  architectureModalOpen: false,
  is3DFullscreen: false,
  soundEnabled: true,
  activePipFeed: 'ROBOT_FLIR',
  cameraZoomDistance: 24, // Default camera orbit distance
  inspectorDrawerOpen: false,
  inspectorTargetId: null,

  telemetry: {
    vibration: 4.8,
    temperature: 71,
    gasLevel: 'NORMAL',
    gasPpm: 24,
    structuralMovementCm: 2.4,
    flood: {
      active: false,
      waterLevelM: 0.0,
      flowVelocityMs: 0.0,
      floodRateCmMin: 0,
      breachLocation: 'North-West Retaining Canal',
      submergedSensors: [],
    },
    drone: {
      status: 'HOVERING',
      altitude: 12.4,
      batteryPct: 94,
      lidarPointsSec: 420000,
      position: [-3.8, 8.5, 4.2],
      scanProgress: 0,
    },
    robot: {
      status: 'ACTIVE',
      batteryPct: 78,
      distanceMeters: 14,
      thermalAnomaly: false,
      thermalTempC: 22.4,
      position: [0.0, 0.2, 4.8],
      attachmentMounted: null,
    },
    satellite: {
      status: 'CONNECTED',
      lastPassTime: '4m ago',
      sarDeformationMm: 4.2,
      opticalResolutionM: 0.3,
      geospatialLayer: 'OpenStreetMap 3D + USGS Terrain',
      coveragePct: 99.4,
    },
    sensorNodes: initialSensorNodes,
  },

  digitalTwin: {
    buildingIntegrityPct: 100,
    collapseStage: 0,
    geometryUpdated: false,
    activeZones: initialZones,
    cameraPreset: 'COMMAND',
    arMode: false,
    show3DLabels: true,
    wireframeOverlay: false,
    stressHeatmapVisible: true,
    selectedElementId: null,
  },

  aiEngine: {
    isInferring: false,
    confidencePct: 87,
    structuralRiskPct: 31,
    victimProbabilityPct: 82,
    recommendedRouteId: 'B',
    riskDecomposition: calculateStructuralRisk({
      vibration: 4.8,
      structuralMovementCm: 2.4,
      temperature: 71,
      gasPpm: 24,
      debrisInstabilityFactor: 0.2,
    }).decomposition,
    predictionSummary: 'Building baseline stable. Monitored intact floors with load-bearing beams nominal.',
    actionRecommendation: 'Deploy ROBOT-01 via Route B. Maintain continuous LiDAR envelope.',
    reasoningTimeline: [
      { time: '10:00', action: 'Route B recommended', details: 'Optimal balance of distance (41m) and baseline safety (29% hazard).', level: 'decision' },
    ],
  },

  routes: calculateOptimalRescueRoutes(31, 29, 14).routes,
  events: initialEvents,
  techStatus: initialTechStatus,
  printing: {
    id: 'PRT-904',
    name: 'Custom Robotic Rebar Spreader & Gripper',
    targetUnit: 'ROBOT-01',
    purpose: 'Stabilize fractured floor slab and breach basement void',
    progress: 0,
    status: 'IDLE',
    material: 'Carbon-Fiber Reinforced PEEK',
    layerHeight: '0.12 mm',
  },

  setCameraZoomDistance: (dist: number) => {
    const clamped = Math.max(5, Math.min(42, dist));
    set({ cameraZoomDistance: clamped });
  },

  setPipFeed: (feed: PipFeedType) => {
    sound.playClick();
    set({ activePipFeed: feed });
  },

  // TIME MACHINE TIMELINE SCRUBBER
  setTimelineSec: (tSec: number) => {
    const clamped = Math.max(0, Math.min(45, tSec));

    if (clamped < 6) {
      // 0-5s: Intact Baseline
      set((state) => ({
        timelineSec: clamped,
        systemStatus: 'OPERATIONAL',
        missionPhase: 'SENSE',
        telemetry: {
          ...state.telemetry,
          vibration: 4.8,
          structuralMovementCm: 2.4,
          flood: { ...state.telemetry.flood, active: false, waterLevelM: 0, flowVelocityMs: 0 },
          drone: { ...state.telemetry.drone, status: 'HOVERING', scanProgress: 0 },
          robot: { ...state.telemetry.robot, status: 'ACTIVE', thermalAnomaly: false, thermalTempC: 22.4, distanceMeters: 14, attachmentMounted: null },
        },
        digitalTwin: { ...state.digitalTwin, collapseStage: 0, buildingIntegrityPct: 100, arMode: false },
        aiEngine: { ...state.aiEngine, structuralRiskPct: 31, victimProbabilityPct: 82, recommendedRouteId: 'B' },
        printing: { ...state.printing, status: 'IDLE', progress: 0 },
        routes: calculateOptimalRescueRoutes(31, 29, 14).routes,
      }));
    } else if (clamped < 12) {
      // 6-11s: Drone LiDAR Scan
      set((state) => ({
        timelineSec: clamped,
        systemStatus: 'OPERATIONAL',
        missionPhase: 'UNDERSTAND',
        telemetry: {
          ...state.telemetry,
          vibration: 4.8,
          drone: { ...state.telemetry.drone, status: 'SCANNING', scanProgress: 75 },
          flood: { ...state.telemetry.flood, active: false, waterLevelM: 0 },
        },
        digitalTwin: { ...state.digitalTwin, collapseStage: 0, buildingIntegrityPct: 92 },
      }));
    } else if (clamped < 20) {
      // 12-19s: Earthquake Progressive Spike & Collapse Stage 1
      const p = (clamped - 12) / 8;
      const vib = 4.8 + p * (8.7 - 4.8);
      const disp = 2.4 + p * (6.8 - 2.4);
      const risk = Math.round(31 + p * (76 - 31));

      set((state) => ({
        timelineSec: clamped,
        systemStatus: 'CRITICAL_HAZARD',
        missionPhase: 'PREDICT',
        telemetry: {
          ...state.telemetry,
          vibration: parseFloat(vib.toFixed(1)),
          structuralMovementCm: parseFloat(disp.toFixed(1)),
          flood: { ...state.telemetry.flood, active: false, waterLevelM: 0 },
        },
        digitalTwin: {
          ...state.digitalTwin,
          collapseStage: 1,
          buildingIntegrityPct: Math.round(100 - p * 48),
        },
        aiEngine: { ...state.aiEngine, structuralRiskPct: risk },
        routes: calculateOptimalRescueRoutes(risk, 29, 14).routes,
      }));
    } else if (clamped < 28) {
      // 20-27s: Flash Flood Inundation & Ground Collapse Stage 2
      const p = (clamped - 20) / 8;
      const water = p * 1.85;
      const flow = p * 3.4;

      set((state) => ({
        timelineSec: clamped,
        systemStatus: 'CRITICAL_HAZARD',
        missionPhase: 'PREDICT',
        telemetry: {
          ...state.telemetry,
          vibration: 8.7,
          flood: {
            active: true,
            waterLevelM: parseFloat(water.toFixed(2)),
            flowVelocityMs: parseFloat(flow.toFixed(1)),
            floodRateCmMin: 42,
            breachLocation: 'North-West Retaining Canal',
            submergedSensors: ['SN-03 (Basement)', 'SN-06 (Ground Apron)'],
          },
        },
        digitalTwin: {
          ...state.digitalTwin,
          collapseStage: 2,
          buildingIntegrityPct: Math.round(52 - p * 28),
        },
        aiEngine: { ...state.aiEngine, structuralRiskPct: 92 },
      }));
    } else if (clamped < 36) {
      // 28-35s: Robot Traversal & FLIR Thermal Discovery
      set((state) => ({
        timelineSec: clamped,
        systemStatus: 'CRITICAL_HAZARD',
        missionPhase: 'ACT',
        telemetry: {
          ...state.telemetry,
          robot: {
            ...state.telemetry.robot,
            status: 'SCANNING_DEBRIS',
            thermalAnomaly: true,
            thermalTempC: 37.2,
            distanceMeters: 34,
            position: [0.6, 0.3, -1.2],
          },
        },
        digitalTwin: { ...state.digitalTwin, collapseStage: 2, arMode: false },
        aiEngine: { ...state.aiEngine, victimProbabilityPct: 91 },
      }));
    } else if (clamped < 42) {
      // 36-41s: AR Responder HUD Mode
      set((state) => ({
        timelineSec: clamped,
        digitalTwin: { ...state.digitalTwin, arMode: true },
        printing: { ...state.printing, status: 'PRINTING', progress: 65 },
      }));
    } else {
      // 42-45s: 3D Tool Printed & Mounted
      set((state) => ({
        timelineSec: clamped,
        digitalTwin: { ...state.digitalTwin, arMode: true },
        printing: { ...state.printing, status: 'DEPLOYED', progress: 100 },
        telemetry: {
          ...state.telemetry,
          robot: { ...state.telemetry.robot, attachmentMounted: 'Carbon-Fiber Rebar Gripper' },
        },
      }));
    }
  },

  toggleSound: () => {
    const next = !get().soundEnabled;
    sound.enabled = next;
    set({ soundEnabled: next });
  },

  toggle3DFullscreen: () => {
    sound.playClick();
    set((state) => ({ is3DFullscreen: !state.is3DFullscreen }));
  },

  toggle3DLabels: () => {
    sound.playClick();
    set((state) => ({
      digitalTwin: {
        ...state.digitalTwin,
        show3DLabels: !state.digitalTwin.show3DLabels,
      },
    }));
  },

  setArchitectureModal: (open: boolean) => {
    set({ architectureModalOpen: open });
  },

  setInspectorDrawer: (open: boolean, targetId?: string | null) => {
    sound.playClick();
    set({
      inspectorDrawerOpen: open,
      inspectorTargetId: targetId !== undefined ? targetId : get().inspectorTargetId,
    });
  },

  toggleInterviewMode: () => {
    sound.playClick();
    set((state) => ({ isInterviewMode: !state.isInterviewMode }));
  },

  setCameraPreset: (preset: CameraPreset) => {
    sound.playClick();
    set((state) => ({
      digitalTwin: { ...state.digitalTwin, cameraPreset: preset },
    }));
  },

  setSelectedElement: (id: string | null) => {
    sound.playClick();
    set((state) => ({
      digitalTwin: { ...state.digitalTwin, selectedElementId: id },
      inspectorDrawerOpen: !!id,
      inspectorTargetId: id,
    }));
  },

  toggleArMode: () => {
    sound.playRadarSweep();
    const newArState = !get().digitalTwin.arMode;
    const now = formatMissionTime(get().missionTimeSec);
    set((state) => ({
      digitalTwin: { ...state.digitalTwin, arMode: newArState },
      techStatus: state.techStatus.map((t) =>
        t.id === 'AR'
          ? {
              ...t,
              status: (newArState ? 'ACTIVE' : 'ONLINE') as TechStatusItem['status'],
              metric: newArState ? 'HUD LIVE (12 Targets)' : 'HUD Synced',
            }
          : t
      ),
      events: [
        {
          id: `evt-${Date.now()}`,
          timestamp: now,
          source: 'AR',
          level: newArState ? 'success' : 'info',
          title: newArState ? 'AR Responder View Engaged' : 'AR HUD Disengaged',
          details: newArState ? 'Synthesizing spatial hazards & survivor tags onto responder HUD.' : 'Returned to default tactical camera projection.',
          stage: 'ACT',
        },
        ...state.events,
      ],
    }));
  },

  tickMissionTime: () => {
    set((state) => ({
      missionTimeSec: state.missionTimeSec + 1,
      timelineSec: state.isDemoRunning ? (state.timelineSec + 1) % 46 : state.timelineSec,
    }));
  },

  // Central Closed-Loop Update Function
  updateDigitalTwin: (actionName: string, payload?: Record<string, unknown>) => {
    const state = get();
    const now = formatMissionTime(state.missionTimeSec);

    switch (actionName) {
      case 'DRONE_SCAN':
        state.triggerDroneScan();
        break;
      case 'SENSOR_SPIKE':
        state.triggerSensorSpike();
        break;
      case 'FLASH_FLOOD':
        state.triggerFlashFlood();
        break;
      case 'ROBOT_EXPLORE':
        state.triggerRobotExploration();
        break;
      case 'AI_RECALCULATE':
        state.triggerAiRecalculate();
        break;
      case '3D_PRINT':
        state.trigger3DPrint();
        break;
      default:
        console.warn('Unknown digital twin update:', actionName, payload, now);
    }
  },

  // FULL 360-DEGREE MULTI-SECTOR DRONE SCANNING SEQUENCE (0 -> 25 -> 50 -> 75 -> 100%)
  triggerDroneScan: () => {
    sound.playRadarSweep();
    const now = formatMissionTime(get().missionTimeSec);

    set((state) => ({
      missionPhase: 'SENSE',
      timelineSec: 6,
      telemetry: {
        ...state.telemetry,
        drone: {
          ...state.telemetry.drone,
          status: 'SCANNING',
          scanProgress: 10,
          lidarPointsSec: 420000,
        },
      },
      techStatus: state.techStatus.map((t) =>
        t.id === 'DRONES' ? { ...t, status: 'SCANNING' as const, metric: 'Sector North (10%)...' } : t
      ),
      events: [
        {
          id: `evt-${Date.now()}-1`,
          timestamp: now,
          source: 'DRONE',
          level: 'info',
          title: 'Aerial 360° Photogrammetry & LiDAR Scan Started',
          details: 'Quadcopter scanning North, East, South, and West facades (420k pts/s).',
          stage: 'SENSE',
        },
        ...state.events,
      ],
    }));

    // Step 1 (1.0s): Sector North 35%
    setTimeout(() => {
      sound.playRadarSweep();
      set((state) => ({
        telemetry: {
          ...state.telemetry,
          drone: { ...state.telemetry.drone, scanProgress: 35, lidarPointsSec: 850000 },
        },
        techStatus: state.techStatus.map((t) =>
          t.id === 'DRONES' ? { ...t, metric: 'Sector East (35%)...' } : t
        ),
      }));
    }, 1000);

    // Step 2 (2.2s): Sector East & Shear Wall 65%
    setTimeout(() => {
      sound.playRadarSweep();
      set((state) => ({
        telemetry: {
          ...state.telemetry,
          drone: { ...state.telemetry.drone, scanProgress: 65, lidarPointsSec: 1350000 },
        },
        techStatus: state.techStatus.map((t) =>
          t.id === 'DRONES' ? { ...t, metric: 'Sector South (65%)...' } : t
        ),
      }));
    }, 2200);

    // Step 3 (3.4s): Sector South & Roof 88%
    setTimeout(() => {
      sound.playRadarSweep();
      set((state) => ({
        telemetry: {
          ...state.telemetry,
          drone: { ...state.telemetry.drone, scanProgress: 88, lidarPointsSec: 1650000 },
        },
        techStatus: state.techStatus.map((t) =>
          t.id === 'DRONES' ? { ...t, metric: 'Roof Envelope (88%)...' } : t
        ),
      }));
    }, 3400);

    // Step 4 (4.5s): 100% Full Scan Complete & Point Cloud Ingested
    setTimeout(() => {
      sound.playSuccess();
      const updatedTime = formatMissionTime(get().missionTimeSec);
      set((state) => ({
        missionPhase: 'UNDERSTAND',
        telemetry: {
          ...state.telemetry,
          drone: {
            ...state.telemetry.drone,
            status: 'HOVERING',
            scanProgress: 100,
            lidarPointsSec: 1850000,
            position: [-3.8, 8.5, 4.2],
          },
        },
        digitalTwin: {
          ...state.digitalTwin,
          geometryUpdated: true,
        },
        techStatus: state.techStatus.map((t) =>
          t.id === 'DRONES' ? { ...t, status: 'AIRBORNE' as const, metric: '360° Mesh Ingested (100%)' } : t
        ),
        events: [
          {
            id: `evt-${Date.now()}-2`,
            timestamp: updatedTime,
            source: 'DRONE',
            level: 'success',
            title: 'Full 360° Photogrammetry Scan Complete (1.85M pts)',
            details: 'All 4 structural elevations & roof surface aligned with Digital Twin 3D mesh.',
            stage: 'UNDERSTAND',
          },
          ...state.events,
        ],
      }));
    }, 4500);
  },

  // PROGRESSIVE 3-SECOND SENSOR SPIKE & EARTHQUAKE COLLAPSE
  triggerSensorSpike: () => {
    sound.playAlert();
    const now = formatMissionTime(get().missionTimeSec);

    set((state) => ({
      systemStatus: 'EVALUATING',
      missionPhase: 'SENSE',
      timelineSec: 12,
      events: [
        {
          id: `evt-${Date.now()}-spk-init`,
          timestamp: now,
          source: 'IoT',
          level: 'warning',
          title: 'Seismic Inception Detected (Progressive Spike 3.0s)',
          details: 'Accelerometers registered initial shear wave. Multi-node telemetry ramping up.',
          stage: 'SENSE',
        },
        ...state.events,
      ],
    }));

    setTimeout(() => {
      sound.playAlert();
      set((state) => {
        const sensors = state.telemetry.sensorNodes.map((s) =>
          s.id === 'SN-01' ? { ...s, value: 5.9, status: 'WARNING' as const, sparkline: [...s.sparkline.slice(1), 5.9] } : s
        );
        return {
          telemetry: { ...state.telemetry, vibration: 5.9, structuralMovementCm: 3.8, sensorNodes: sensors },
          aiEngine: { ...state.aiEngine, structuralRiskPct: 48 },
        };
      });
    }, 800);

    setTimeout(() => {
      sound.playAlert();
      set((state) => {
        const sensors = state.telemetry.sensorNodes.map((s) =>
          s.id === 'SN-01' ? { ...s, value: 7.4, status: 'CRITICAL' as const, sparkline: [...s.sparkline.slice(1), 7.4] } : s
        );
        return {
          telemetry: { ...state.telemetry, vibration: 7.4, structuralMovementCm: 5.2, sensorNodes: sensors },
          digitalTwin: { ...state.digitalTwin, collapseStage: 1, buildingIntegrityPct: 65 },
          aiEngine: { ...state.aiEngine, structuralRiskPct: 64 },
        };
      });
    }, 1800);

    setTimeout(() => {
      sound.playAlert();
      const finalTime = formatMissionTime(get().missionTimeSec);
      const spikedVib = 8.7;
      const spikedDisp = 6.8;
      const riskResult = calculateStructuralRisk({
        vibration: spikedVib,
        structuralMovementCm: spikedDisp,
        temperature: 78,
        gasPpm: 38,
        debrisInstabilityFactor: 0.85,
      });

      set((state) => {
        const updatedSensors = state.telemetry.sensorNodes.map((s) => {
          if (s.id === 'SN-01') return { ...s, value: spikedVib, status: 'CRITICAL' as const, sparkline: [...s.sparkline.slice(1), spikedVib] };
          if (s.id === 'SN-02') return { ...s, value: spikedDisp, status: 'WARNING' as const, sparkline: [...s.sparkline.slice(1), spikedDisp] };
          return s;
        });

        const updatedZones = {
          ...state.digitalTwin.activeZones,
          ZONE_A: {
            ...state.digitalTwin.activeZones.ZONE_A,
            riskPct: riskResult.riskPct,
            status: 'CRITICAL' as const,
            color: '#ef4444',
            description: 'CRITICAL SEISMIC RESIDUAL: 8.7 mm/s vibration spike. North section collapsed piece-by-piece.',
          },
        };

        return {
          systemStatus: 'CRITICAL_HAZARD',
          missionPhase: 'PREDICT',
          telemetry: {
            ...state.telemetry,
            vibration: spikedVib,
            structuralMovementCm: spikedDisp,
            temperature: 78,
            sensorNodes: updatedSensors,
          },
          digitalTwin: {
            ...state.digitalTwin,
            collapseStage: 1,
            buildingIntegrityPct: 52,
            activeZones: updatedZones,
          },
          aiEngine: {
            ...state.aiEngine,
            confidencePct: 93,
            structuralRiskPct: riskResult.riskPct,
            riskDecomposition: riskResult.decomposition,
            predictionSummary: 'North Section structural failure. Floor 3-4 slabs fractured and collapsed piece-by-piece.',
          },
          techStatus: state.techStatus.map((t) =>
            t.id === 'IOT' ? { ...t, status: 'WARNING' as const, metric: '8.7 mm/s SPIKE' } : t
          ),
          events: [
            {
              id: `evt-${Date.now()}-spike-complete`,
              timestamp: finalTime,
              source: 'IoT',
              level: 'danger',
              title: 'EARTHQUAKE SENSOR SPIKE COMPLETE (8.7 mm/s)',
              details: 'Progressive 3.0s seismic resonance completed. North columns buckled, Floor 3-4 dropped.',
              stage: 'UNDERSTAND',
            },
            ...state.events,
          ],
        };
      });
    }, 3000);
  },

  // PROGRESSIVE 3-SECOND FLASH FLOOD SURGE & GROUND COLLAPSE
  triggerFlashFlood: () => {
    sound.playAlert();
    const now = formatMissionTime(get().missionTimeSec);

    set((state) => ({
      systemStatus: 'EVALUATING',
      missionPhase: 'SENSE',
      timelineSec: 20,
      telemetry: {
        ...state.telemetry,
        flood: {
          active: true,
          waterLevelM: 0.4,
          flowVelocityMs: 1.2,
          floodRateCmMin: 20,
          breachLocation: 'North-West Retaining Canal',
          submergedSensors: [],
        },
      },
      events: [
        {
          id: `evt-${Date.now()}-fld-1`,
          timestamp: now,
          source: 'SYSTEM',
          level: 'warning',
          title: 'Canal Retaining Wall Burst // Water Inflow Starting',
          details: 'Flash flood water surging at 1.2 m/s. Spilling towards ground staging perimeter.',
          stage: 'SENSE',
        },
        ...state.events,
      ],
    }));

    setTimeout(() => {
      sound.playRadarSweep();
      set((state) => ({
        telemetry: {
          ...state.telemetry,
          flood: { ...state.telemetry.flood, waterLevelM: 1.1, flowVelocityMs: 2.4, floodRateCmMin: 35 },
        },
        digitalTwin: { ...state.digitalTwin, collapseStage: 2, buildingIntegrityPct: 38 },
        aiEngine: { ...state.aiEngine, structuralRiskPct: 84 },
      }));
    }, 1500);

    setTimeout(() => {
      sound.playAlert();
      const floodCompleteTime = formatMissionTime(get().missionTimeSec);

      set((state) => ({
        systemStatus: 'CRITICAL_HAZARD',
        missionPhase: 'PREDICT',
        telemetry: {
          ...state.telemetry,
          flood: {
            active: true,
            waterLevelM: 1.85,
            flowVelocityMs: 3.4,
            floodRateCmMin: 42,
            breachLocation: 'North-West Retaining Canal',
            submergedSensors: ['SN-03 (Basement)', 'SN-06 (Ground Apron)'],
          },
        },
        digitalTwin: {
          ...state.digitalTwin,
          collapseStage: 2,
          buildingIntegrityPct: 24,
        },
        aiEngine: {
          ...state.aiEngine,
          confidencePct: 96,
          structuralRiskPct: 92,
          predictionSummary: 'FLASH FLOOD INUNDATION ACTIVE: Water surging at 3.4 m/s. Foundation scoured, lower floors collapsed to ground level.',
          actionRecommendation: 'EVACUATE GROUND AND BASEMENT. Route C submerged. Strictly deploy via Route B elevated shear ramp.',
        },
        events: [
          {
            id: `evt-${Date.now()}-flood-full`,
            timestamp: floodCompleteTime,
            source: 'SYSTEM',
            level: 'danger',
            title: 'FLASH FLOOD SURGE PEAK // BUILDING COLLAPSED TO GROUND',
            details: '1.85m water surge at 3.4 m/s. Foundation undermined and lower structure collapsed to ground level.',
            stage: 'PREDICT',
          },
          ...state.events,
        ],
      }));
    }, 3000);
  },

  // ROBOT EXPLORATION
  triggerRobotExploration: () => {
    sound.playRadarSweep();
    const now = formatMissionTime(get().missionTimeSec);

    set((state) => ({
      missionPhase: 'ACT',
      timelineSec: 28,
      telemetry: {
        ...state.telemetry,
        robot: {
          ...state.telemetry.robot,
          status: 'TRAVERSING',
          distanceMeters: 28,
          position: [0.6, 0.3, -0.8],
        },
      },
      techStatus: state.techStatus.map((t) =>
        t.id === 'ROBOTICS' ? { ...t, status: 'ACTIVE' as const, metric: 'Traversing Void' } : t
      ),
      events: [
        {
          id: `evt-${Date.now()}-rob1`,
          timestamp: now,
          source: 'ROBOT',
          level: 'info',
          title: 'ROBOT-01 Dispatched into Sub-Basement Void',
          details: 'Tracked rover traversing debris field via South access.',
          stage: 'ACT',
        },
        ...state.events,
      ],
    }));

    setTimeout(() => {
      sound.playSuccess();
      const updatedTime = formatMissionTime(get().missionTimeSec);

      set((state) => ({
        telemetry: {
          ...state.telemetry,
          robot: {
            ...state.telemetry.robot,
            status: 'SCANNING_DEBRIS',
            thermalAnomaly: true,
            thermalTempC: 37.2,
            distanceMeters: 34,
            position: [0.6, 0.3, -1.2],
          },
        },
        aiEngine: {
          ...state.aiEngine,
          victimProbabilityPct: 91,
          actionRecommendation: 'Survivor localized in Basement Cavity B-2. Clear debris path using robotic gripper.',
        },
        techStatus: state.techStatus.map((t) =>
          t.id === 'ROBOTICS' ? { ...t, status: 'ACTIVE' as const, metric: 'Survivor Found (37.2°C)' } : t
        ),
        events: [
          {
            id: `evt-${Date.now()}-rob2`,
            timestamp: updatedTime,
            source: 'ROBOT',
            level: 'success',
            title: 'Possible Survivor Detected in Basement Cavity',
            details: 'FLIR biometric thermal reading: 37.2°C. Victim probability upgraded from 82% → 91%.',
            stage: 'ACT',
          },
          ...state.events,
        ],
      }));
    }, 1500);
  },

  // AI RECALCULATE
  triggerAiRecalculate: () => {
    sound.playAlert();
    const state = get();
    const now = formatMissionTime(state.missionTimeSec);

    const { routes, recommendedId, reason } = calculateOptimalRescueRoutes(
      state.aiEngine.structuralRiskPct,
      29,
      14
    );

    set((s) => ({
      missionPhase: 'PREDICT',
      routes,
      aiEngine: {
        ...s.aiEngine,
        isInferring: false,
        recommendedRouteId: recommendedId,
        predictionSummary: 'North Section collapse active. Route A path blocked by shattered floor slab debris.',
        actionRecommendation: reason,
      },
      events: [
        {
          id: `evt-${Date.now()}-ai1`,
          timestamp: now,
          source: 'AI',
          level: 'danger',
          title: 'Route A Rejected by AI Decision Engine',
          details: 'Distance 28m rejected: 76% collapse hazard in North corridor. Diverting responders away.',
          stage: 'PREDICT',
        },
        {
          id: `evt-${Date.now()}-ai2`,
          timestamp: now,
          source: 'AI',
          level: 'success',
          title: 'Route B Confirmed: Optimal Safe Ingress',
          details: 'Route B (41m, 29% risk) confirmed. Safe access via intact East shear wall corridor.',
          stage: 'PREDICT',
        },
        ...s.events,
      ],
    }));
  },

  // 3D PRINTING
  trigger3DPrint: () => {
    sound.playClick();
    const now = formatMissionTime(get().missionTimeSec);

    set((state) => ({
      missionPhase: 'ADAPT',
      timelineSec: 42,
      printing: {
        ...state.printing,
        status: 'PRINTING',
        progress: 15,
      },
      techStatus: state.techStatus.map((t) =>
        t.id === 'PRINTING_3D' ? { ...t, status: 'ACTIVE' as const, metric: 'Fabricating Tool...' } : t
      ),
      events: [
        {
          id: `evt-${Date.now()}-prt1`,
          timestamp: now,
          source: '3D_PRINT',
          level: 'info',
          title: 'Adaptive 3D Printing Triggered',
          details: 'Mission Requirement: Custom robotic rebar gripper for Basement B-2 void clearance.',
          stage: 'ADAPT',
        },
        ...state.events,
      ],
    }));

    const steps = [40, 75, 100];
    steps.forEach((pct, idx) => {
      setTimeout(() => {
        if (pct === 100) {
          sound.playSuccess();
          const printFinishTime = formatMissionTime(get().missionTimeSec);
          set((state) => ({
            printing: {
              ...state.printing,
              progress: 100,
              status: 'DEPLOYED',
            },
            telemetry: {
              ...state.telemetry,
              robot: {
                ...state.telemetry.robot,
                attachmentMounted: 'Carbon-Fiber Rebar Gripper',
              },
            },
            techStatus: state.techStatus.map((t) =>
              t.id === 'PRINTING_3D' ? { ...t, status: 'DEPLOYED' as const, metric: 'Tool Deployed' } : t
            ),
            events: [
              {
                id: `evt-${Date.now()}-prt2`,
                timestamp: printFinishTime,
                source: '3D_PRINT',
                level: 'success',
                title: 'Component Ready & Robot Attachment Deployed',
                details: 'Custom carbon-fiber shoring clamp mounted to ROBOT-01 manipulator arm.',
                stage: 'ADAPT',
              },
              ...state.events,
            ],
          }));
        } else {
          set((state) => ({
            printing: { ...state.printing, progress: pct },
          }));
        }
      }, (idx + 1) * 700);
    });
  },

  // RESET MISSION
  resetMission: () => {
    get().demoTimerIds.forEach((t) => clearTimeout(t));

    sound.playClick();
    set({
      systemStatus: 'OPERATIONAL',
      missionPhase: 'SENSE',
      missionTimeSec: 762,
      timelineSec: 0,
      isDemoRunning: false,
      demoTimerIds: [],
      demoStepIndex: 0,
      cameraZoomDistance: 24,
      inspectorDrawerOpen: false,
      inspectorTargetId: null,
      telemetry: {
        vibration: 4.8,
        temperature: 71,
        gasLevel: 'NORMAL',
        gasPpm: 24,
        structuralMovementCm: 2.4,
        flood: {
          active: false,
          waterLevelM: 0.0,
          flowVelocityMs: 0.0,
          floodRateCmMin: 0,
          breachLocation: 'North-West Retaining Canal',
          submergedSensors: [],
        },
        drone: {
          status: 'HOVERING',
          altitude: 12.4,
          batteryPct: 94,
          lidarPointsSec: 420000,
          position: [-3.8, 8.5, 4.2],
          scanProgress: 0,
        },
        robot: {
          status: 'ACTIVE',
          batteryPct: 78,
          distanceMeters: 14,
          thermalAnomaly: false,
          thermalTempC: 22.4,
          position: [0.0, 0.2, 4.8],
          attachmentMounted: null,
        },
        satellite: {
          status: 'CONNECTED',
          lastPassTime: '4m ago',
          sarDeformationMm: 4.2,
          opticalResolutionM: 0.3,
          geospatialLayer: 'OpenStreetMap 3D + USGS Terrain',
          coveragePct: 99.4,
        },
        sensorNodes: initialSensorNodes,
      },
      digitalTwin: {
        buildingIntegrityPct: 100,
        collapseStage: 0,
        geometryUpdated: false,
        activeZones: initialZones,
        cameraPreset: 'COMMAND',
        arMode: false,
        show3DLabels: true,
        wireframeOverlay: false,
        stressHeatmapVisible: true,
        selectedElementId: null,
      },
      aiEngine: {
        isInferring: false,
        confidencePct: 87,
        structuralRiskPct: 31,
        victimProbabilityPct: 82,
        recommendedRouteId: 'B',
        riskDecomposition: calculateStructuralRisk({
          vibration: 4.8,
          structuralMovementCm: 2.4,
          temperature: 71,
          gasPpm: 24,
          debrisInstabilityFactor: 0.2,
        }).decomposition,
        predictionSummary: 'Building baseline stable. Monitored intact floors with load-bearing beams nominal.',
        actionRecommendation: 'Deploy ROBOT-01 via Route B. Maintain continuous LiDAR envelope.',
        reasoningTimeline: [
          { time: '10:00', action: 'Route B recommended', details: 'Optimal balance of distance (41m) and baseline safety (29% hazard).', level: 'decision' },
        ],
      },
      routes: calculateOptimalRescueRoutes(31, 29, 14).routes,
      events: initialEvents,
      techStatus: initialTechStatus,
      printing: {
        id: 'PRT-904',
        name: 'Custom Robotic Rebar Spreader & Gripper',
        targetUnit: 'ROBOT-01',
        purpose: 'Stabilize fractured floor slab and breach basement void',
        progress: 0,
        status: 'IDLE',
        material: 'Carbon-Fiber Reinforced PEEK',
        layerHeight: '0.12 mm',
      },
    });
  },

  // DEMO MODE AUTOMATION
  startDemo: () => {
    const state = get();
    if (state.isDemoRunning) return;

    sound.playRadarSweep();
    get().setCameraPreset('COMMAND');

    const t1 = setTimeout(() => {
      get().triggerDroneScan();
      get().setCameraPreset('AERIAL');
    }, 4000);

    const t2 = setTimeout(() => {
      get().triggerSensorSpike();
      get().setCameraPreset('BUILDING');
    }, 10000);

    const t3 = setTimeout(() => {
      get().triggerFlashFlood();
    }, 17000);

    const t4 = setTimeout(() => {
      get().triggerRobotExploration();
      get().setCameraPreset('ROBOT');
    }, 23000);

    const t5 = setTimeout(() => {
      get().triggerAiRecalculate();
      get().setCameraPreset('COMMAND');
    }, 29000);

    const t6 = setTimeout(() => {
      get().toggleArMode();
    }, 35000);

    const t7 = setTimeout(() => {
      get().trigger3DPrint();
    }, 40000);

    const t8 = setTimeout(() => {
      set({ isDemoRunning: false, demoTimerIds: [] });
      sound.playSuccess();
    }, 45000);

    set({ isDemoRunning: true, demoTimerIds: [t1, t2, t3, t4, t5, t6, t7, t8] });
  },

  pauseDemo: () => {
    get().demoTimerIds.forEach((t) => clearTimeout(t));
    set({ isDemoRunning: false, demoTimerIds: [] });
    sound.playClick();
  },
}));

function formatMissionTime(sec: number): string {
  const hrs = Math.floor(sec / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
