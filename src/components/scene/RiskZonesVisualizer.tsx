import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import { AlertTriangle, ShieldCheck, UserCheck, Compass } from 'lucide-react';

export const RiskZonesVisualizer: React.FC = () => {
  const zones = useRescueTwinStore((s) => s.digitalTwin.activeZones);
  const arMode = useRescueTwinStore((s) => s.digitalTwin.arMode);
  const showLabels = useRescueTwinStore((s) => s.digitalTwin.show3DLabels);
  const selectedElement = useRescueTwinStore((s) => s.digitalTwin.selectedElementId);
  const zoomDist = useRescueTwinStore((s) => s.cameraZoomDistance);
  const aiEngine = useRescueTwinStore((s) => s.aiEngine);
  const robotStatus = useRescueTwinStore((s) => s.telemetry.robot.status);
  const setSelected = useRescueTwinStore((s) => s.setSelectedElement);

  const zoneA = zones.ZONE_A;
  const zoneB = zones.ZONE_B;
  const zoneC = zones.ZONE_C;
  const survivorZone = zones.SURVIVOR_ZONE;

  const isCriticalA = zoneA?.riskPct > 60;
  const isSelectedA = selectedElement === 'ZONE_A';
  const isSelectedB = selectedElement === 'ZONE_B';
  const isSelectedC = selectedElement === 'ZONE_C';
  const isSelectedSurvivor = selectedElement === 'SURVIVOR_ZONE';

  // Reactive distance factor based on camera zoom distance
  const dynamicDistanceFactor = Math.max(16, Math.min(38, zoomDist * 1.15));

  return (
    <group>
      {/* ========================================================
          ZONE A: NORTH SECTION (SEISMIC COLLAPSE SECTOR)
         ======================================================== */}
      {zoneA && (
        <group position={zoneA.center}>
          {/* Volumetric zone translucent visualization */}
          <mesh raycast={() => null}>
            <boxGeometry args={zoneA.size} />
            <meshStandardMaterial
              color={isCriticalA ? '#ef4444' : '#eab308'}
              transparent
              opacity={isSelectedA ? 0.35 : arMode ? 0.28 : 0.12}
              depthWrite={false}
            />
          </mesh>

          {/* Wireframe border lines - clickable to select Zone A */}
          <lineSegments
            onClick={(e) => {
              e.stopPropagation();
              setSelected('ZONE_A');
            }}
          >
            <edgesGeometry args={[new THREE.BoxGeometry(...zoneA.size)]} />
            <lineBasicMaterial
              color={isSelectedA ? '#00f0ff' : isCriticalA ? '#ef4444' : '#eab308'}
              linewidth={isSelectedA ? 2 : 1}
            />
          </lineSegments>

          {/* Ground Footprint Plane - Clickable anywhere on Zone A footprint */}
          <mesh
            position={[0, -zoneA.size[1] / 2 + 0.05, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setSelected('ZONE_A');
            }}
          >
            <planeGeometry args={[zoneA.size[0], zoneA.size[2]]} />
            <meshBasicMaterial
              color={isSelectedA ? '#00f0ff' : isCriticalA ? '#ef4444' : '#eab308'}
              transparent
              opacity={isSelectedA ? 0.45 : 0.2}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Ground boundary outline */}
          <mesh
            position={[0, -zoneA.size[1] / 2 + 0.06, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setSelected('ZONE_A');
            }}
          >
            <ringGeometry args={[1.2, 1.4, 4]} />
            <meshBasicMaterial color={isSelectedA ? '#00f0ff' : isCriticalA ? '#ef4444' : '#eab308'} />
          </mesh>

          {/* Reactive Scaled HUD Label - Shown if global labels ON OR individually clicked */}
          {(showLabels || isSelectedA) && (
            <Html position={[0, zoneA.size[1] / 2 + 0.35, 0]} center distanceFactor={dynamicDistanceFactor}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected('ZONE_A');
                }}
                className={`cursor-pointer select-none transition-all duration-300 ${
                  isCriticalA
                    ? 'border-red-500 bg-red-950/95 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.6)]'
                    : 'border-amber-500/80 bg-slate-950/95 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                } ${isSelectedA ? 'ring-2 ring-cyan-400 shadow-[0_0_24px_rgba(0,240,255,0.8)] scale-105' : ''} border rounded px-2.5 py-1.5 backdrop-blur-md whitespace-nowrap text-[10px] font-mono flex flex-col gap-0.5 min-w-[140px]`}
              >
                <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-0.5">
                  <span className="font-bold tracking-wider flex items-center gap-1">
                    <AlertTriangle className={`w-3.5 h-3.5 ${isCriticalA ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
                    ZONE A (NORTH ELEVATION)
                  </span>
                  <span className={`text-[8px] px-1 rounded font-bold ${
                    isCriticalA ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-500/30 text-amber-300'
                  }`}>
                    {isCriticalA ? 'CRITICAL' : 'EVAL'}
                  </span>
                </div>
                <div className="flex justify-between text-[9px] pt-0.5">
                  <span className="text-slate-400">STRUCTURAL RISK:</span>
                  <span className={`font-bold ${isCriticalA ? 'text-red-400 font-extrabold' : 'text-amber-300'}`}>
                    {zoneA.riskPct}%
                  </span>
                </div>
                <div className="text-[8px] text-slate-400 truncate max-w-[150px]">
                  {isCriticalA ? 'North column buckled. Avoid corridor.' : 'Monitored intact section.'}
                </div>
              </div>
            </Html>
          )}
        </group>
      )}

      {/* ========================================================
          ZONE B: EAST WING (SAFE ACCESS & EGRESS CORRIDOR)
         ======================================================== */}
      {zoneB && (
        <group position={zoneB.center}>
          {/* Volumetric zone translucent visualization */}
          <mesh raycast={() => null}>
            <boxGeometry args={zoneB.size} />
            <meshStandardMaterial
              color="#10b981"
              transparent
              opacity={isSelectedB ? 0.35 : arMode ? 0.28 : 0.12}
              depthWrite={false}
            />
          </mesh>

          {/* Wireframe border lines - clickable to select Zone B */}
          <lineSegments
            onClick={(e) => {
              e.stopPropagation();
              setSelected('ZONE_B');
            }}
          >
            <edgesGeometry args={[new THREE.BoxGeometry(...zoneB.size)]} />
            <lineBasicMaterial
              color={isSelectedB ? '#00f0ff' : '#10b981'}
              linewidth={isSelectedB ? 2 : 1}
            />
          </lineSegments>

          {/* Ground Footprint Plane - Clickable anywhere on Zone B footprint */}
          <mesh
            position={[0, -zoneB.size[1] / 2 + 0.05, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setSelected('ZONE_B');
            }}
          >
            <planeGeometry args={[zoneB.size[0], zoneB.size[2]]} />
            <meshBasicMaterial
              color={isSelectedB ? '#00f0ff' : '#10b981'}
              transparent
              opacity={isSelectedB ? 0.45 : 0.2}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Reactive Scaled HUD Label - Shown if global labels ON OR individually clicked */}
          {(showLabels || isSelectedB) && (
            <Html position={[0, zoneB.size[1] / 2 + 0.35, 0]} center distanceFactor={dynamicDistanceFactor}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected('ZONE_B');
                }}
                className={`cursor-pointer select-none border border-emerald-500/80 bg-slate-950/95 text-emerald-200 rounded px-2.5 py-1.5 backdrop-blur-md whitespace-nowrap text-[10px] font-mono flex flex-col gap-0.5 min-w-[130px] shadow-[0_0_12px_rgba(16,185,129,0.3)] ${
                  isSelectedB ? 'ring-2 ring-cyan-400 shadow-[0_0_24px_rgba(0,240,255,0.8)] scale-105' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-0.5">
                  <span className="font-bold tracking-wider flex items-center gap-1 text-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    ZONE B (EAST WING)
                  </span>
                  <span className="text-[8px] bg-emerald-500/30 text-emerald-300 px-1 rounded font-bold">
                    SAFE EGRESS
                  </span>
                </div>
                <div className="flex justify-between text-[9px] pt-0.5">
                  <span className="text-slate-400">STRUCTURAL RISK:</span>
                  <span className="text-emerald-400 font-bold">{zoneB.riskPct}%</span>
                </div>
                <div className="text-[8px] text-slate-400 truncate max-w-[150px]">
                  Shear wall reinforced. Optimal path.
                </div>
              </div>
            </Html>
          )}
        </group>
      )}

      {/* ========================================================
          ZONE C: SOUTH APRON STAGING PERIMETER
         ======================================================== */}
      {zoneC && (
        <group position={zoneC.center}>
          {/* Ground Footprint Plane - Clickable to select Zone C */}
          <mesh
            position={[0, 0.05, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setSelected('ZONE_C');
            }}
          >
            <planeGeometry args={[zoneC.size[0], zoneC.size[2]]} />
            <meshBasicMaterial
              color={isSelectedC ? '#00f0ff' : '#0284c7'}
              transparent
              opacity={isSelectedC ? 0.35 : 0.15}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Wireframe border outline */}
          <lineSegments
            position={[0, 0.06, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setSelected('ZONE_C');
            }}
          >
            <edgesGeometry args={[new THREE.BoxGeometry(zoneC.size[0], 0.1, zoneC.size[2])]} />
            <lineBasicMaterial color={isSelectedC ? '#00f0ff' : '#38bdf8'} />
          </lineSegments>

          {/* Reactive Scaled HUD Label - Shown if global labels ON OR individually clicked */}
          {(showLabels || isSelectedC) && (
            <Html position={[0, 1.2, 0]} center distanceFactor={dynamicDistanceFactor}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected('ZONE_C');
                }}
                className={`cursor-pointer select-none border border-cyan-500/80 bg-slate-950/95 text-cyan-200 rounded px-2.5 py-1.5 backdrop-blur-md whitespace-nowrap text-[10px] font-mono flex flex-col gap-0.5 min-w-[130px] shadow-[0_0_12px_rgba(0,240,255,0.3)] ${
                  isSelectedC ? 'ring-2 ring-cyan-400 shadow-[0_0_24px_rgba(0,240,255,0.8)] scale-105' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-0.5">
                  <span className="font-bold tracking-wider flex items-center gap-1 text-cyan-300">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    ZONE C (SOUTH APRON)
                  </span>
                  <span className="text-[8px] bg-cyan-500/30 text-cyan-200 px-1 rounded font-bold">
                    STAGING
                  </span>
                </div>
                <div className="flex justify-between text-[9px] pt-0.5">
                  <span className="text-slate-400">PERIMETER RISK:</span>
                  <span className="text-cyan-400 font-bold">{zoneC.riskPct}%</span>
                </div>
                <div className="text-[8px] text-slate-400 truncate max-w-[150px]">
                  Base staging perimeter for rover and drones.
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
        <group position={survivorZone.center}>
          {/* Volumetric zone translucent visualization */}
          <mesh raycast={() => null}>
            <boxGeometry args={survivorZone.size} />
            <meshStandardMaterial
              color="#00f0ff"
              transparent
              opacity={isSelectedSurvivor ? 0.35 : 0.2}
              depthWrite={false}
            />
          </mesh>

          {/* Clickable wireframe border */}
          <lineSegments
            onClick={(e) => {
              e.stopPropagation();
              setSelected('SURVIVOR_ZONE');
            }}
          >
            <edgesGeometry args={[new THREE.BoxGeometry(...survivorZone.size)]} />
            <lineBasicMaterial color={isSelectedSurvivor ? '#ffffff' : '#00f0ff'} />
          </lineSegments>

          {/* Clickable Ground Marker Plane */}
          <mesh
            position={[0, -survivorZone.size[1] / 2 + 0.05, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setSelected('SURVIVOR_ZONE');
            }}
          >
            <planeGeometry args={[survivorZone.size[0], survivorZone.size[2]]} />
            <meshBasicMaterial
              color={isSelectedSurvivor ? '#00f0ff' : '#f59e0b'}
              transparent
              opacity={isSelectedSurvivor ? 0.5 : 0.25}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Reactive Scaled HUD Label - Shown if global labels ON OR individually clicked */}
          {(showLabels || isSelectedSurvivor) && (
            <Html position={[0, survivorZone.size[1] / 2 + 0.35, 0]} center distanceFactor={dynamicDistanceFactor}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected('SURVIVOR_ZONE');
                }}
                className={`cursor-pointer select-none border border-cyan-400 bg-slate-950/95 text-cyan-200 rounded px-2.5 py-1.5 backdrop-blur-md whitespace-nowrap text-[10px] font-mono flex flex-col gap-0.5 min-w-[140px] shadow-[0_0_15px_rgba(0,240,255,0.4)] ${
                  isSelectedSurvivor ? 'ring-2 ring-cyan-400 shadow-[0_0_24px_rgba(0,240,255,0.8)] scale-105' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-0.5">
                  <span className="font-bold tracking-wider flex items-center gap-1 text-cyan-300">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    SURVIVOR VOID B-2
                  </span>
                  <span className="text-[8px] bg-cyan-500/30 text-cyan-200 px-1 rounded font-bold">
                    {aiEngine.victimProbabilityPct}% PROB
                  </span>
                </div>
                <div className="flex justify-between text-[9px] pt-0.5">
                  <span className="text-slate-400">FLIR THERMAL:</span>
                  <span className="text-amber-300 font-bold">
                    {robotStatus === 'SCANNING_DEBRIS' ? '37.2°C (SURVIVOR)' : 'ACOUSTIC VOID'}
                  </span>
                </div>
                <div className="text-[8px] text-slate-400 truncate max-w-[150px]">
                  Sub-basement pocket cavity.
                </div>
              </div>
            </Html>
          )}
        </group>
      )}
    </group>
  );
};
