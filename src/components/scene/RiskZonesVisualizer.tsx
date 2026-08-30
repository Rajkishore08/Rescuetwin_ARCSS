import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import { AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';

export const RiskZonesVisualizer: React.FC = () => {
  const zones = useRescueTwinStore((s) => s.digitalTwin.activeZones);
  const arMode = useRescueTwinStore((s) => s.digitalTwin.arMode);
  const showLabels = useRescueTwinStore((s) => s.digitalTwin.show3DLabels);
  const aiEngine = useRescueTwinStore((s) => s.aiEngine);
  const robotStatus = useRescueTwinStore((s) => s.telemetry.robot.status);
  const setSelected = useRescueTwinStore((s) => s.setSelectedElement);

  const zoneA = zones.ZONE_A;
  const zoneB = zones.ZONE_B;
  const survivorZone = zones.SURVIVOR_ZONE;

  const isCriticalA = zoneA?.riskPct > 60;

  return (
    <group>
      {/* ========================================================
          ZONE A: NORTH SECTION (HIGH STRUCTURAL RISK)
         ======================================================== */}
      {zoneA && (
        <group position={zoneA.center} onClick={(e) => { e.stopPropagation(); setSelected('ZONE_A'); }}>
          <mesh>
            <boxGeometry args={zoneA.size} />
            <meshStandardMaterial
              color={isCriticalA ? '#ef4444' : '#eab308'}
              transparent
              opacity={arMode ? 0.35 : 0.15}
              depthWrite={false}
            />
          </mesh>
          {/* Wireframe box border */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(...zoneA.size)]} />
            <lineBasicMaterial color={isCriticalA ? '#ef4444' : '#eab308'} />
          </lineSegments>

          {/* Compact Floating Technical HUD Label */}
          {showLabels && (
            <Html position={[0, zoneA.size[1] / 2 + 0.35, 0]} center distanceFactor={28}>
              <div className={`pointer-events-none select-none transition-all duration-300 ${
                isCriticalA
                  ? 'border-red-500 bg-red-950/90 text-red-100 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                  : 'border-amber-500/80 bg-slate-900/90 text-amber-200'
              } border rounded px-2 py-1 backdrop-blur-md whitespace-nowrap text-[10px] font-mono flex flex-col gap-0.5 min-w-[130px]`}>
                <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-0.5">
                  <span className="font-bold tracking-wider flex items-center gap-1">
                    <AlertTriangle className={`w-3 h-3 ${isCriticalA ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
                    ZONE A (NORTH)
                  </span>
                  <span className={`text-[8px] px-1 rounded font-bold ${
                    isCriticalA ? 'bg-red-500 text-white' : 'bg-amber-500/30 text-amber-300'
                  }`}>
                    {isCriticalA ? 'CRITICAL' : 'EVAL'}
                  </span>
                </div>
                <div className="flex justify-between text-[9px] pt-0.5">
                  <span className="text-slate-400">RISK:</span>
                  <span className={`font-bold ${isCriticalA ? 'text-red-400 font-extrabold' : 'text-amber-300'}`}>
                    {zoneA.riskPct}%
                  </span>
                </div>
              </div>
            </Html>
          )}
        </group>
      )}

      {/* ========================================================
          ZONE B: EAST WING (SAFE ACCESS EGRESS)
         ======================================================== */}
      {zoneB && (
        <group position={zoneB.center} onClick={(e) => { e.stopPropagation(); setSelected('ZONE_B'); }}>
          <mesh>
            <boxGeometry args={zoneB.size} />
            <meshStandardMaterial
              color="#10b981"
              transparent
              opacity={arMode ? 0.28 : 0.12}
              depthWrite={false}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(...zoneB.size)]} />
            <lineBasicMaterial color="#10b981" />
          </lineSegments>

          {/* Compact Floating Label */}
          {showLabels && (
            <Html position={[0, zoneB.size[1] / 2 + 0.35, 0]} center distanceFactor={28}>
              <div className="pointer-events-none select-none border border-emerald-500/70 bg-slate-900/90 text-emerald-200 rounded px-2 py-1 backdrop-blur-md whitespace-nowrap text-[10px] font-mono flex flex-col gap-0.5 min-w-[120px] shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-0.5">
                  <span className="font-bold tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    ZONE B (EAST)
                  </span>
                  <span className="text-[8px] bg-emerald-500/30 text-emerald-300 px-1 rounded font-bold">
                    SAFE
                  </span>
                </div>
                <div className="flex justify-between text-[9px] pt-0.5">
                  <span className="text-slate-400">RISK:</span>
                  <span className="text-emerald-400 font-bold">{zoneB.riskPct}%</span>
                </div>
              </div>
            </Html>
          )}
        </group>
      )}

      {/* ========================================================
          SURVIVOR PROBABILITY ZONE (BASEMENT CAVITY B-2)
         ======================================================== */}
      {survivorZone && (
        <group position={survivorZone.center} onClick={(e) => { e.stopPropagation(); setSelected('SURVIVOR_ZONE'); }}>
          <mesh>
            <boxGeometry args={survivorZone.size} />
            <meshStandardMaterial
              color="#00f0ff"
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(...survivorZone.size)]} />
            <lineBasicMaterial color="#00f0ff" />
          </lineSegments>

          {/* Compact Floating Tag */}
          {showLabels && (
            <Html position={[0, survivorZone.size[1] / 2 + 0.3, 0]} center distanceFactor={28}>
              <div className="pointer-events-none select-none border border-cyan-400 bg-slate-900/95 text-cyan-200 rounded px-2 py-1 backdrop-blur-md whitespace-nowrap text-[10px] font-mono flex flex-col gap-0.5 min-w-[130px] shadow-[0_0_12px_rgba(0,240,255,0.3)]">
                <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-0.5">
                  <span className="font-bold tracking-wider flex items-center gap-1 text-cyan-300">
                    <UserCheck className="w-3 h-3 text-cyan-400" />
                    SURVIVOR B-2
                  </span>
                  <span className="text-[8px] bg-cyan-500/30 text-cyan-200 px-1 rounded font-bold">
                    {aiEngine.victimProbabilityPct}%
                  </span>
                </div>
                <div className="flex justify-between text-[9px] pt-0.5">
                  <span className="text-slate-400">FLIR:</span>
                  <span className="text-amber-300 font-bold">
                    {robotStatus === 'SCANNING_DEBRIS' ? '37.2°C (VICTIM)' : 'ACOUSTIC'}
                  </span>
                </div>
              </div>
            </Html>
          )}
        </group>
      )}
    </group>
  );
};
