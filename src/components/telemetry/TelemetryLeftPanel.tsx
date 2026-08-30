import React from 'react';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import {
  Activity,
  Satellite,
  Plane,
  Bot,
  Flame,
  Zap,
  Radio,
  Thermometer,
  Wind,
  Maximize2,
  AlertTriangle,
  Droplet,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

export const TelemetryLeftPanel: React.FC = () => {
  const telemetry = useRescueTwinStore((s) => s.telemetry);
  const isInterviewMode = useRescueTwinStore((s) => s.isInterviewMode);
  const triggerDroneScan = useRescueTwinStore((s) => s.triggerDroneScan);
  const triggerSensorSpike = useRescueTwinStore((s) => s.triggerSensorSpike);
  const triggerFlashFlood = useRescueTwinStore((s) => s.triggerFlashFlood);
  const triggerRobotExploration = useRescueTwinStore((s) => s.triggerRobotExploration);
  const selectedElement = useRescueTwinStore((s) => s.digitalTwin.selectedElementId);
  const setSelected = useRescueTwinStore((s) => s.setSelectedElement);
  const setInspectorDrawer = useRescueTwinStore((s) => s.setInspectorDrawer);

  const isVibSpike = telemetry.vibration > 7.0;
  const isDroneScanning = telemetry.drone.status === 'SCANNING';
  const isRobotMoving = telemetry.robot.status === 'TRAVERSING' || telemetry.robot.status === 'SCANNING_DEBRIS';
  const isFloodActive = telemetry.flood.active;

  return (
    <aside className="w-88 xl:w-96 h-full bg-[#0a0f1d]/95 border-r border-cyan-900/30 flex flex-col overflow-y-auto select-none z-20 tech-panel">
      {/* Panel Header */}
      <div className="p-3 border-b border-cyan-900/40 flex items-center justify-between tech-panel-header">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-tech text-sm font-bold tracking-wider text-slate-100 uppercase">
            SENSOR & RECON INTELLIGENCE
          </span>
        </div>
        <button
          onClick={() => setInspectorDrawer(true, 'SN-01')}
          title="Open Telemetry Inspector"
          className="text-[10px] font-mono bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>INSPECT</span>
        </button>
      </div>

      {/* Interactive Action Control Section */}
      <div className="p-3 border-b border-cyan-900/30 bg-slate-950/60 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            SIMULATION TRIGGERS (3.0s PROGRESSIVE)
          </span>
          <span className="text-[9px] font-mono text-cyan-400/80">MULTI-SOURCE</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Drone Scan Trigger */}
          <button
            onClick={triggerDroneScan}
            disabled={isDroneScanning}
            className={`p-2.5 rounded-lg text-xs font-mono font-bold flex flex-col items-start gap-1 transition-all border ${
              isDroneScanning
                ? 'bg-cyan-950 border-cyan-400 text-cyan-200 animate-pulse shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-cyan-500 text-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-1 text-[11px] text-cyan-400">
                <Plane className="w-3.5 h-3.5" />
                DRONE SCAN
              </span>
              <span className="text-[9px] text-slate-500">LiDAR</span>
            </div>
            <span className="text-[9px] text-slate-400 font-normal">Photogrammetry update</span>
          </button>

          {/* Sensor Spike Trigger (3s Progressive) */}
          <button
            onClick={triggerSensorSpike}
            className={`p-2.5 rounded-lg text-xs font-mono font-bold flex flex-col items-start gap-1 transition-all border ${
              isVibSpike
                ? 'bg-red-950 border-red-500 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-red-500 text-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-1 text-[11px] text-red-400">
                <AlertTriangle className={`w-3.5 h-3.5 ${isVibSpike ? 'animate-bounce' : ''}`} />
                SENSOR SPIKE
              </span>
              <span className="text-[9px] bg-red-950 text-red-300 px-1 rounded">3.0s</span>
            </div>
            <span className="text-[9px] text-slate-400 font-normal">Earthquake 8.7 mm/s</span>
          </button>

          {/* Flash Flood Trigger (3s Progressive) */}
          <button
            onClick={triggerFlashFlood}
            className={`p-2.5 rounded-lg text-xs font-mono font-bold flex flex-col items-start gap-1 transition-all border ${
              isFloodActive
                ? 'bg-blue-950 border-blue-400 text-blue-200 shadow-[0_0_15px_rgba(56,189,248,0.5)] animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-blue-500 text-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-1 text-[11px] text-blue-400">
                <Droplet className={`w-3.5 h-3.5 ${isFloodActive ? 'animate-bounce' : ''}`} />
                FLASH FLOOD
              </span>
              <span className="text-[9px] bg-blue-950 text-blue-300 px-1 rounded">3.0s</span>
            </div>
            <span className="text-[9px] text-slate-400 font-normal">+1.85m water surge</span>
          </button>

          {/* Robot Explore Trigger */}
          <button
            onClick={triggerRobotExploration}
            disabled={isRobotMoving}
            className={`p-2.5 rounded-lg text-xs font-mono font-bold flex flex-col items-start gap-1 transition-all border ${
              isRobotMoving
                ? 'bg-emerald-950 border-emerald-400 text-emerald-200 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-emerald-500 text-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <Bot className="w-3.5 h-3.5" />
                ROBOT EXPLORE
              </span>
              <span className="text-[9px] text-slate-500">FLIR</span>
            </div>
            <span className="text-[9px] text-slate-400 font-normal">Basement void traversal</span>
          </button>
        </div>

        {isInterviewMode && (
          <div className="mt-1 p-2 rounded bg-purple-950/40 border border-purple-800/60 text-[10px] font-mono text-purple-200">
            <span className="font-bold text-purple-300">INTERVIEW NOTE:</span> Triggers simulate real asynchronous multi-modal ingestion. Sensor spike & flood surge execute over a realistic 3.0s physics interpolation.
          </div>
        )}
      </div>

      {/* Scrollable Telemetry Cards Container */}
      <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto">
        {/* FLASH FLOOD HYDRODYNAMIC SENSOR TELEMETRY (When Active) */}
        {isFloodActive && (
          <div
            onClick={() => setInspectorDrawer(true, 'FLOOD')}
            className="bg-blue-950/70 hover:bg-blue-950/90 cursor-pointer border border-blue-500/80 rounded-lg p-2.5 flex flex-col gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all"
          >
            <div className="flex items-center justify-between border-b border-blue-900 pb-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-300 text-xs font-mono">
                <Droplet className="w-3.5 h-3.5 text-blue-400" />
                <span>FLASH FLOOD SURGE TELEMETRY</span>
              </div>
              <span className="text-[9px] bg-blue-500 text-slate-950 px-1 rounded font-extrabold flex items-center gap-0.5">
                INSPECT <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
              <div className="bg-slate-950/70 p-1.5 rounded border border-blue-800/40">
                <span className="text-slate-400">Level:</span>
                <div className="font-bold text-blue-300 text-xs">+{telemetry.flood.waterLevelM.toFixed(2)}m</div>
              </div>
              <div className="bg-slate-950/70 p-1.5 rounded border border-blue-800/40">
                <span className="text-slate-400">Velocity:</span>
                <div className="font-bold text-cyan-300 text-xs">{telemetry.flood.flowVelocityMs} m/s</div>
              </div>
              <div className="bg-slate-950/70 p-1.5 rounded border border-blue-800/40">
                <span className="text-slate-400">Rate:</span>
                <div className="font-bold text-amber-300 text-xs">{telemetry.flood.floodRateCmMin} cm/m</div>
              </div>
            </div>
            <div className="text-[9px] font-mono text-red-300 bg-red-950/60 p-1 rounded border border-red-800/50">
              Hazard: Sub-basement ingress submerged. Lower floors collapsed to ground.
            </div>
          </div>
        )}

        {/* 1. SATELLITE DATA CONTEXT */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-lg p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-200">SATELLITE DOWNLINK</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {telemetry.satellite.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800/50">
              <div className="text-[10px] text-slate-400">SAR InSAR Def:</div>
              <div className="font-bold text-cyan-300">{telemetry.satellite.sarDeformationMm} mm/yr</div>
            </div>
            <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800/50">
              <div className="text-[10px] text-slate-400">Optical Res:</div>
              <div className="font-bold text-slate-200">{telemetry.satellite.opticalResolutionM}m Ground</div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Pass: {telemetry.satellite.lastPassTime}</span>
            <span>Coverage: {telemetry.satellite.coveragePct}%</span>
          </div>
        </div>

        {/* 2. LIVE IoT SENSOR TELEMETRY */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-lg p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-200">LIVE IoT SENSOR TELEMETRY</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-300">24 NODES</span>
          </div>

          {/* Key 4 Metric Gauges */}
          <div className="grid grid-cols-2 gap-2">
            {/* Vibration */}
            <div
              onClick={() => setInspectorDrawer(true, 'SN-01')}
              className={`p-2 rounded border cursor-pointer transition-all ${
                isVibSpike
                  ? 'bg-red-950/80 border-red-500 text-red-100 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                  : 'bg-slate-950/70 hover:bg-slate-900 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Activity className={`w-3 h-3 ${isVibSpike ? 'text-red-400' : 'text-cyan-400'}`} />
                  Vibration
                </span>
                {isVibSpike && <span className="text-[9px] bg-red-500 text-white px-1 rounded font-bold">SPIKE</span>}
              </div>
              <div className="text-lg font-mono font-bold mt-1 flex items-baseline gap-1">
                <span className={isVibSpike ? 'text-red-400 text-xl' : 'text-slate-100'}>
                  {telemetry.vibration.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">mm/s</span>
              </div>
              <div className="text-[9px] font-mono text-cyan-400 mt-0.5 flex items-center justify-between">
                <span>{isVibSpike ? 'Nominal: 4.8' : 'Max: 6.5'}</span>
                <span className="text-[8px] underline">Inspect</span>
              </div>
            </div>

            {/* Structural Movement */}
            <div
              onClick={() => setInspectorDrawer(true, 'SN-02')}
              className={`p-2 rounded border cursor-pointer transition-all ${
                telemetry.structuralMovementCm > 5.0
                  ? 'bg-amber-950/80 border-amber-500 text-amber-100'
                  : 'bg-slate-950/70 hover:bg-slate-900 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3 h-3 text-amber-400" />
                  Movement
                </span>
              </div>
              <div className="text-lg font-mono font-bold mt-1 flex items-baseline gap-1">
                <span className={telemetry.structuralMovementCm > 5.0 ? 'text-amber-400 text-xl' : 'text-slate-100'}>
                  {telemetry.structuralMovementCm.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">cm</span>
              </div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">Displacement Delta</div>
            </div>

            {/* Temperature */}
            <div
              onClick={() => setInspectorDrawer(true, 'SN-03')}
              className="p-2 rounded bg-slate-950/70 hover:bg-slate-900 border border-slate-800 text-slate-200 cursor-pointer"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-400" />
                  Temperature
                </span>
              </div>
              <div className="text-lg font-mono font-bold mt-1 flex items-baseline gap-1">
                <span className="text-slate-100">{telemetry.temperature}</span>
                <span className="text-xs text-slate-400">°C</span>
              </div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">Basement Core Hotspot</div>
            </div>

            {/* Gas Level */}
            <div
              onClick={() => setInspectorDrawer(true, 'SN-04')}
              className="p-2 rounded bg-slate-950/70 hover:bg-slate-900 border border-slate-800 text-slate-200 cursor-pointer"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-emerald-400" />
                  Gas Level
                </span>
              </div>
              <div className="text-lg font-mono font-bold mt-1 flex items-baseline gap-1">
                <span className="text-emerald-400 text-sm">{telemetry.gasLevel}</span>
              </div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">{telemetry.gasPpm} ppm (Nominal)</div>
            </div>
          </div>

          {/* Node List preview */}
          <div className="mt-1 flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
            <span className="text-[10px] font-mono text-slate-400">CLICK NODE TO INSPECT / ZOOM:</span>
            {telemetry.sensorNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelected(node.id)}
                className={`p-1.5 rounded text-[10px] font-mono flex items-center justify-between cursor-pointer transition-colors ${
                  selectedElement === node.id
                    ? 'bg-cyan-950 border border-cyan-500 text-cyan-200'
                    : 'bg-slate-950/40 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    node.status === 'CRITICAL' ? 'bg-red-400 animate-ping' : node.status === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  <span className="font-semibold">{node.id}</span>
                  <span className="text-slate-500 truncate max-w-[120px]">{node.location}</span>
                </div>
                <span className={`font-bold ${node.status === 'CRITICAL' ? 'text-red-400' : 'text-slate-200'}`}>
                  {node.value} {node.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. GROUND RESCUE ROBOT (ROBOT-01) */}
        <div
          onClick={() => setSelected('ROBOT')}
          className="bg-slate-900/70 hover:bg-slate-900/90 cursor-pointer border border-slate-800/80 rounded-lg p-2.5 flex flex-col gap-2 transition-colors"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200">ROBOT-01 TELEMETRY</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-1 rounded">
              {telemetry.robot.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
            <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800/40">
              <div className="text-[10px] text-slate-400">Battery</div>
              <div className="font-bold text-slate-200">{telemetry.robot.batteryPct}%</div>
            </div>
            <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800/40">
              <div className="text-[10px] text-slate-400">Distance</div>
              <div className="font-bold text-cyan-300">{telemetry.robot.distanceMeters}m</div>
            </div>
            <div className={`p-1.5 rounded border ${
              telemetry.robot.thermalAnomaly
                ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                : 'bg-slate-950/60 border-slate-800/40 text-slate-200'
            }`}>
              <div className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 text-amber-400" />
                Thermal
              </div>
              <div className="font-bold">{telemetry.robot.thermalAnomaly ? `${telemetry.robot.thermalTempC}°C` : 'NORMAL'}</div>
            </div>
          </div>
          {telemetry.robot.attachmentMounted && (
            <div className="text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 p-1 rounded">
              Mounted: <span className="font-bold">{telemetry.robot.attachmentMounted}</span>
            </div>
          )}
        </div>

        {/* 4. DRONE AERIAL RECON CARD */}
        <div
          onClick={() => setSelected('DRONE')}
          className="bg-slate-900/70 hover:bg-slate-900/90 cursor-pointer border border-slate-800/80 rounded-lg p-2.5 flex flex-col gap-2 transition-colors"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-200">DRONE-01 RECON</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-300">{telemetry.drone.status}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
            <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800/40">
              <div className="text-[10px] text-slate-400">Altitude</div>
              <div className="font-bold text-slate-200">{telemetry.drone.altitude.toFixed(1)}m</div>
            </div>
            <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800/40">
              <div className="text-[10px] text-slate-400">Battery</div>
              <div className="font-bold text-emerald-300">{telemetry.drone.batteryPct}%</div>
            </div>
            <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800/40">
              <div className="text-[10px] text-slate-400">LiDAR Rate</div>
              <div className="font-bold text-cyan-300">420k pts/s</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
