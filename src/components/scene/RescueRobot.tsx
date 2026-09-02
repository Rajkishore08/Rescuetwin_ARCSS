import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import { Bot, Flame } from 'lucide-react';

export const RescueRobot: React.FC = () => {
  const robotRef = useRef<THREE.Group>(null);
  const robotState = useRescueTwinStore((s) => s.telemetry.robot);
  const showLabels = useRescueTwinStore((s) => s.digitalTwin.show3DLabels);
  const selectedElement = useRescueTwinStore((s) => s.digitalTwin.selectedElementId);
  const zoomDist = useRescueTwinStore((s) => s.cameraZoomDistance);
  const setSelected = useRescueTwinStore((s) => s.setSelectedElement);
  const isPrintingDeployed = useRescueTwinStore((s) => s.printing.status === 'DEPLOYED');

  const isSelected = selectedElement === 'ROBOT';
  const dynamicDistanceFactor = Math.max(16, Math.min(38, zoomDist * 1.15));

  useFrame(() => {
    if (robotRef.current) {
      const [tx, ty, tz] = robotState.position;
      robotRef.current.position.lerp(new THREE.Vector3(tx, ty, tz), 0.05);

      if (robotState.status === 'TRAVERSING' || robotState.status === 'SCANNING_DEBRIS') {
        robotRef.current.rotation.y = THREE.MathUtils.lerp(robotRef.current.rotation.y, Math.PI, 0.05);
      } else {
        robotRef.current.rotation.y = THREE.MathUtils.lerp(robotRef.current.rotation.y, 0, 0.05);
      }
    }
  });

  return (
    <group
      ref={robotRef}
      position={[0, 0.2, 4.8]}
      onClick={(e) => {
        e.stopPropagation();
        setSelected('ROBOT');
      }}
    >
      {/* Invisible expanded click hitbox for effortless selection */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          setSelected('ROBOT');
        }}
      >
        <boxGeometry args={[1.5, 1.2, 1.5]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Main Tracked Chassis */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.7, 0.25, 0.9]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.7} />
      </mesh>

      {/* Left Track Assembly */}
      <group position={[-0.42, 0.12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.15, 0.22, 0.95]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {[-0.3, 0, 0.3].map((z, idx) => (
          <mesh key={`wl-${idx}`} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.16, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Right Track Assembly */}
      <group position={[0.42, 0.12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.15, 0.22, 0.95]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {[-0.3, 0, 0.3].map((z, idx) => (
          <mesh key={`wr-${idx}`} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.16, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Sensor Mast / Pan-Tilt FLIR Turret */}
      <group position={[0, 0.35, 0.1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.18, 0.15, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.14, 0.08]} castShadow>
          <boxGeometry args={[0.22, 0.14, 0.2]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.14, 0.19]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          <meshBasicMaterial color={robotState.thermalAnomaly ? '#ef4444' : '#00f0ff'} />
        </mesh>
        <mesh position={[-0.1, 0.25, -0.05]}>
          <cylinderGeometry args={[0.01, 0.01, 0.3, 6]} />
          <meshBasicMaterial color="#94a3b8" />
        </mesh>
      </group>

      {/* Front Articulated Manipulator */}
      <group position={[0, 0.15, 0.5]}>
        <mesh>
          <boxGeometry args={[0.3, 0.1, 0.1]} />
          <meshStandardMaterial color="#475569" />
        </mesh>

        {isPrintingDeployed ? (
          <group position={[0, 0, 0.15]}>
            <mesh castShadow>
              <boxGeometry args={[0.45, 0.12, 0.25]} />
              <meshStandardMaterial color="#00f0ff" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[-0.18, 0, 0.15]} rotation={[0, 0.3, 0]}>
              <boxGeometry args={[0.06, 0.08, 0.22]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
            </mesh>
            <mesh position={[0.18, 0, 0.15]} rotation={[0, -0.3, 0]}>
              <boxGeometry args={[0.06, 0.08, 0.22]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
            </mesh>
          </group>
        ) : (
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[0.5, 0.08, 0.05]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        )}
      </group>

      {/* Headlights */}
      <pointLight position={[0, 0.25, 0.6]} color="#ffffff" intensity={2} distance={5} />

      {/* Reactive Compact Floating 3D Telemetry Label - Shown if global labels ON OR individually clicked */}
      {(showLabels || isSelected) && (
        <Html position={[0, 0.65, 0]} center distanceFactor={dynamicDistanceFactor}>
          <div className={`pointer-events-none select-none border border-emerald-500/80 bg-slate-900/90 text-emerald-200 px-2 py-0.8 rounded backdrop-blur-md text-[10px] font-mono whitespace-nowrap flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.25)] ${
            isSelected ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.7)] scale-110' : ''
          }`}>
            <Bot className="w-3 h-3 text-emerald-400" />
            <span className="font-bold">ROBOT-01</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">BAT:{robotState.batteryPct}%</span>
            {robotState.thermalAnomaly && (
              <span className="text-amber-400 flex items-center gap-0.5 font-bold">
                <Flame className="w-2.5 h-2.5" />
                37.2°C
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};
