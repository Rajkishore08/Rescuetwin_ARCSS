import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import { AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';

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
  const survivorZone = zones.SURVIVOR_ZONE;

  const isCriticalA = zoneA?.riskPct > 60;
  const isSelectedA = selectedElement === 'ZONE_A';
  const isSelectedB = selectedElement === 'ZONE_B';
  const isSelectedSurvivor = selectedElement === 'SURVIVOR_ZONE';

  // Reactive distance factor based on camera zoom distance
  const dynamicDistanceFactor = Math.max(16, Math.min(38, zoomDist * 1.15));

  return (
    <group>
      {/* ZONE A: NORTH SECTION */}
      {zoneA && (
        <group position={zoneA.center}>
          {/* Volumetric zone box - raycast=null so clicks pass through to building, sensors, drone, robot */}
          <mesh raycast={() => null}>
            <boxGeometry args={zoneA.size} />
            <meshStandardMaterial
              color={isCriticalA ? '#ef4444' : '#eab308'}
              transparent
              opacity={isSelectedA ? 0.4 : arMode ? 0.35 : 0.15}
              depthWrite={false}
            />
          </mesh>
          {/* Wireframe border outline */}
          <lineSegments raycast={() => null}>
            <edgesGeometry args={[new THREE.BoxGeometry(...zoneA.size)]} />
            <lineBasicMaterial color={isSelectedA ? '#00f0ff' : isCriticalA ? '#ef4444' : '#eab308'} />
          </lineSegments>

          {/* Clickable Ground Footprint Ring for Zone selection without blocking building */}
          <mesh
            position={[0, -zoneA.size[1] / 2 + 0.04, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setSelected('ZONE_A');
            }}
          >
            <ringGeometry args={[0.8, 1.4, 16]} />
            <meshBasicMaterial
              color={isSelectedA ? '#00f0ff' : isCriticalA ? '#ef4444' : '#eab308'}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
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
                    ? 'border-red-500 bg-red-950/90 text-red-100 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                    : 'border-amber-500/80 bg-slate-900/90 text-amber-200'
                } ${isSelectedA ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.6)]' : ''} border rounded px-2 py-1 backdrop-blur-md whitespace-nowrap text-[10px] font-mono flex flex-col gap-0.5 min-w-[130px]`}
              >
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

      {/* ZONE B: EAST WING */}
      {zoneB && (
        <group position={zoneB.center}>
          {/* Volumetric zone box - raycast=null so clicks pass through */}
          <mesh raycast={() => null}>
            <boxGeometry args={zoneB.size} />
            <meshStandardMaterial
              color="#10b981"
              transparent
              opacity={isSelectedB ? 0.35 : arMode ? 0.28 : 0.12}
              depthWrite={false}
            />
          </mesh>
          <lineSegments raycast={() => null}>
            <edgesGeometry args={[new THREE.BoxGeometry(...zoneB.size)]} />
            <lineBasicMaterial color={isSelectedB ? '#00f0ff' : '#10b981'} />
          </lineSegments>

          {/* Clickable Ground Footprint Ring for Zone selection without blocking building */}
          <mesh
            position={[0, -zoneB.size[1] / 2 + 0.04, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setSelected('ZONE_B');
            }}
          >
            <ringGeometry args={[0.8, 1.4, 16]} />
            <meshBasicMaterial
              color={isSelectedB ? '#00f0ff' : '#10b981'}
              transparent
              opacity={0.6}
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
                className={`cursor-pointer select-none border border-emerald-500/70 bg-slate-900/90 text-emerald-200 rounded px-2 py-1 backdrop-blur-md whitespace-nowrap text-[10px] font-mono flex flex-col gap-0.5 min-w-[120px] shadow-[0_0_10px_rgba(16,185,129,0.2)] ${
                  isSelectedB ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.6)]' : ''
                }`}
              >
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

      {/* SURVIVOR PROBABILITY ZONE */}
      {survivorZone && (
        <group position={survivorZone.center}>
          <mesh raycast={() => null}>
            <boxGeometry args={survivorZone.size} />
            <meshStandardMaterial
              color="#00f0ff"
              transparent
              opacity={isSelectedSurvivor ? 0.35 : 0.2}
              depthWrite={false}
            />
          </mesh>
          <lineSegments raycast={() => null}>
            <edgesGeometry args={[new THREE.BoxGeometry(...survivorZone.size)]} />
            <lineBasicMaterial color={isSelectedSurvivor ? '#ffffff' : '#00f0ff'} />
          </lineSegments>

          {/* Clickable Ground Marker for Survivor Zone */}
          <mesh
            position={[0, -survivorZone.size[1] / 2 + 0.04, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setSelected('SURVIVOR_ZONE');
            }}
          >
            <ringGeometry args={[0.5, 1.0, 16]} />
            <meshBasicMaterial
              color={isSelectedSurvivor ? '#00f0ff' : '#38bdf8'}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Reactive Scaled HUD Label - Shown if global labels ON OR individually clicked */}
          {(showLabels || isSelectedSurvivor) && (
            <Html position={[0, survivorZone.size[1] / 2 + 0.3, 0]} center distanceFactor={dynamicDistanceFactor}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected('SURVIVOR_ZONE');
                }}
                className={`cursor-pointer select-none border border-cyan-400 bg-slate-900/95 text-cyan-200 rounded px-2 py-1 backdrop-blur-md whitespace-nowrap text-[10px] font-mono flex flex-col gap-0.5 min-w-[130px] shadow-[0_0_12px_rgba(0,240,255,0.3)] ${
                  isSelectedSurvivor ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.6)]' : ''
                }`}
              >
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
