import React, { useState } from 'react';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import {
  X,
  Activity,
  Layers,
  Database,
  TrendingUp,
} from 'lucide-react';

export const TacticalInspectorDrawer: React.FC = () => {
  const isOpen = useRescueTwinStore((s) => s.inspectorDrawerOpen);
  const targetId = useRescueTwinStore((s) => s.inspectorTargetId);
  const setOpen = useRescueTwinStore((s) => s.setInspectorDrawer);
  const telemetry = useRescueTwinStore((s) => s.telemetry);
  const aiEngine = useRescueTwinStore((s) => s.aiEngine);
  const zones = useRescueTwinStore((s) => s.digitalTwin.activeZones);

  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'FEM_STRESS' | 'MQTT_PAYLOAD'>('TELEMETRY');

  if (!isOpen) return null;

  // Identify inspect target details
  const getTargetInfo = () => {
    if (!targetId) {
      return {
        title: 'TACTICAL TELEMETRY DEEP-DIVE',
        subtitle: 'Global Operations Feed',
        category: 'SYSTEM',
      };
    }

    if (targetId.startsWith('SN-')) {
      const node = telemetry.sensorNodes.find((s) => s.id === targetId);
      return {
        title: `${node?.name || targetId} // IoT SENSOR DEEP INSPECTION`,
        subtitle: node?.location || 'Structural Node',
        category: 'IoT SENSOR',
        node,
      };
    }

    if (targetId === 'DRONE') {
      return {
        title: 'DRONE-01 // AUTONOMOUS RECON QUADCOPTER',
        subtitle: 'Point Cloud LiDAR Telemetry & Gimbal Optical Feed',
        category: 'AERIAL RECON',
      };
    }

    if (targetId === 'ROBOT') {
      return {
        title: 'ROBOT-01 // GROUND RESCUE ROVER',
        subtitle: 'Tracked Sub-Basement Traversal & Biometric FLIR Telemetry',
        category: 'GROUND ROBOTICS',
      };
    }

    if (targetId.startsWith('ZONE_')) {
      const zone = zones[targetId];
      return {
        title: `${zone?.name || targetId} // 3D RISK BOUNDING VOLUME`,
        subtitle: zone?.description || 'Spatial Risk Sector',
        category: 'DIGITAL TWIN ZONE',
        zone,
      };
    }

    return {
      title: `${targetId} // DETAILED INSPECTION`,
      subtitle: 'System Sub-Element',
      category: 'TACTICAL ASSET',
    };
  };

  const info = getTargetInfo();

  return (
    <div className="fixed bottom-44 right-0 w-96 xl:w-[450px] h-[520px] z-40 bg-[#0a101f]/98 border-l border-t border-cyan-500/50 rounded-tl-xl shadow-[0_0_40px_rgba(0,240,255,0.25)] flex flex-col overflow-hidden backdrop-blur-xl select-none font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="p-3 bg-slate-900/95 border-b border-cyan-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <div>
            <div className="font-tech text-sm font-bold text-cyan-300 tracking-wider uppercase truncate max-w-[320px]">
              {info.title}
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[320px]">
              {info.subtitle}
            </div>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/80 text-[11px]">
        <button
          onClick={() => setActiveTab('TELEMETRY')}
          className={`flex-1 py-2 text-center font-bold transition-all flex items-center justify-center gap-1 border-b-2 ${
            activeTab === 'TELEMETRY'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3 h-3" />
          <span>TELEMETRY</span>
        </button>

        <button
          onClick={() => setActiveTab('FEM_STRESS')}
          className={`flex-1 py-2 text-center font-bold transition-all flex items-center justify-center gap-1 border-b-2 ${
            activeTab === 'FEM_STRESS'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>FEM STRESS</span>
        </button>

        <button
          onClick={() => setActiveTab('MQTT_PAYLOAD')}
          className={`flex-1 py-2 text-center font-bold transition-all flex items-center justify-center gap-1 border-b-2 ${
            activeTab === 'MQTT_PAYLOAD'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3 h-3" />
          <span>MQTT RAW</span>
        </button>
      </div>

      {/* Body Content */}
      <div className="p-3.5 flex-1 overflow-y-auto space-y-3.5">
        {activeTab === 'TELEMETRY' && (
          <div className="space-y-3">
            {/* Live Signal Graph (Time-Series) */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-200 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  REAL-TIME SIGNAL TIME-SERIES (10s WINDOW)
                </span>
                <span className="text-[10px] text-cyan-400 font-semibold">100 Hz SAMPLING</span>
              </div>

              {/* Visual Simulated Waveform Bars */}
              <div className="h-20 bg-slate-900/60 rounded border border-slate-800/80 p-2 flex items-end gap-1 overflow-hidden relative">
                {/* Horizontal Threshold Guideline */}
                <div className="absolute top-6 left-0 right-0 h-[1px] bg-red-500/40 border-b border-dashed border-red-500/60" />
                <span className="absolute top-1.5 right-2 text-[9px] text-red-400">CRITICAL THRESHOLD: 6.5 mm/s</span>

                {[3.2, 3.8, 4.1, 4.2, 4.5, 4.8, 4.7, 4.8, 5.2, 5.9, 6.4, 7.2, 7.8, 8.4, 8.7, 8.5, 8.7].map((val, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t transition-all duration-300 ${
                      val > 6.5 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-cyan-500/80'
                    }`}
                    style={{ height: `${Math.min((val / 10) * 100, 100)}%` }}
                    title={`t-${17 - idx}s: ${val} mm/s`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Peak Amplitude: <span className="text-white font-bold">{telemetry.vibration.toFixed(1)} mm/s</span></span>
                <span>RMS Jitter: <span className="text-cyan-300 font-bold">0.14 mm/s</span></span>
              </div>
            </div>

            {/* FFT Frequency Domain Spectrum */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-1.5">
              <div className="text-[11px] font-bold text-slate-200 flex items-center justify-between">
                <span>FFT FREQUENCY DOMAIN SPECTRUM</span>
                <span className="text-[10px] text-amber-400">RESONANCE PEAK: 4.2 Hz</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 text-[10px] text-slate-400 text-center">
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <div>1.2 Hz</div>
                  <div className="font-bold text-slate-200">12%</div>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <div>2.8 Hz</div>
                  <div className="font-bold text-slate-200">34%</div>
                </div>
                <div className="p-1.5 rounded bg-amber-950 border border-amber-500/60 text-amber-200">
                  <div>4.2 Hz</div>
                  <div className="font-bold text-amber-400">89%</div>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <div>8.5 Hz</div>
                  <div className="font-bold text-slate-200">22%</div>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <div>16.0 Hz</div>
                  <div className="font-bold text-slate-200">8%</div>
                </div>
              </div>
            </div>

            {/* Key Sensor Metrics List */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Temperature:</div>
                <div className="text-sm font-bold text-amber-300">{telemetry.temperature}°C (Nominal)</div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Gas Concentration:</div>
                <div className="text-sm font-bold text-emerald-400">{telemetry.gasPpm} ppm (CO/CO2 Safe)</div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Displacement Delta:</div>
                <div className="text-sm font-bold text-slate-100">{telemetry.structuralMovementCm.toFixed(1)} cm</div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Flood Water Depth:</div>
                <div className="text-sm font-bold text-cyan-300">+{telemetry.flood.waterLevelM.toFixed(2)} m</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'FEM_STRESS' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-2">
              <div className="text-[11px] font-bold text-slate-200 flex items-center justify-between">
                <span>FINITE ELEMENT (FEM) STRESS ANALYSIS</span>
                <span className="text-[10px] text-cyan-400">VON MISES YIELD</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>Floor 3-4 North Corner Slab:</span>
                    <span className="text-red-400 font-bold">142 MPa (YIELD EXCEEDED)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: '92%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>East Wing Shear Wall Core:</span>
                    <span className="text-emerald-400 font-bold">34 MPa (SAFE MARGIN)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '28%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>Ground Foundation Footing:</span>
                    <span className="text-amber-400 font-bold">68 MPa (MODERATE SCOUR)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: '54%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] space-y-1.5 text-slate-400">
              <div className="text-slate-200 font-bold text-[11px]">AI RESCUE VECTOR RECOMMENDATION:</div>
              <p>
                Dynamic load testing confirms Route B (East shear wall corridor) retains 72% reserve load capacity. Route A intersects active shear fracture in North elevation.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'MQTT_PAYLOAD' && (
          <div className="space-y-2">
            <div className="text-[10px] text-slate-400">LIVE INGESTED MQTT BROKER FRAMES:</div>
            <pre className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-72">
{JSON.stringify(
  {
    topic: "rescuetwin/telemetry/nodes/" + (targetId || "SN-01"),
    timestamp: new Date().toISOString(),
    qos: 1,
    payload: {
      vibration_rms: telemetry.vibration,
      displacement_cm: telemetry.structuralMovementCm,
      temp_c: telemetry.temperature,
      gas_ppm: telemetry.gasPpm,
      flood_depth_m: telemetry.flood.waterLevelM,
      risk_factor: aiEngine.structuralRiskPct / 100,
      biometric_target: telemetry.robot.thermalAnomaly ? "37.2C HUMAN DETECTED" : "NONE",
      recommended_vector: "ROUTE_B",
      checksum: "0x8F94D2"
    }
  },
  null,
  2
)}
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <span>STATUS: LIVE STREAMING</span>
        <button
          onClick={() => setOpen(false)}
          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
        >
          CLOSE INSPECTOR
        </button>
      </div>
    </div>
  );
};
