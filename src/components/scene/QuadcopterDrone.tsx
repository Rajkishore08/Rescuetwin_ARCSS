import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import { Plane, Zap } from 'lucide-react';

export const QuadcopterDrone: React.FC = () => {
  const droneGroupRef = useRef<THREE.Group>(null);
  const prop1Ref = useRef<THREE.Mesh>(null);
  const prop2Ref = useRef<THREE.Mesh>(null);
  const prop3Ref = useRef<THREE.Mesh>(null);
  const prop4Ref = useRef<THREE.Mesh>(null);
  const scanConeRef = useRef<THREE.Mesh>(null);
  const sweepRingRef = useRef<THREE.Mesh>(null);
  const pointCloudRef = useRef<THREE.Points>(null);

  const droneState = useRescueTwinStore((s) => s.telemetry.drone);
  const showLabels = useRescueTwinStore((s) => s.digitalTwin.show3DLabels);
  const zoomDist = useRescueTwinStore((s) => s.cameraZoomDistance);
  const isScanning = droneState.status === 'SCANNING';
  const setSelected = useRescueTwinStore((s) => s.setSelectedElement);

  const dynamicDistanceFactor = Math.max(16, Math.min(38, zoomDist * 1.15));

  // Simulated LiDAR point cloud particles
  const particleCount = 120;
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6.0;
      pos[i * 3 + 1] = Math.random() * 7.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6.0;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  // Animate propellers & hover/scan trajectory
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Propeller spinning
    const spinSpeed = 30;
    if (prop1Ref.current) prop1Ref.current.rotation.y += spinSpeed;
    if (prop2Ref.current) prop2Ref.current.rotation.y -= spinSpeed;
    if (prop3Ref.current) prop3Ref.current.rotation.y += spinSpeed;
    if (prop4Ref.current) prop4Ref.current.rotation.y -= spinSpeed;

    if (droneGroupRef.current) {
      if (isScanning) {
        // Complete 360-degree orbital scanning flight pattern
        const radius = 7.5;
        const speed = 1.0;
        const x = Math.sin(t * speed) * radius;
        const z = Math.cos(t * speed) * radius;
        const y = 8.5 + Math.sin(t * 2.0) * 1.2;
        droneGroupRef.current.position.set(x, y, z);
        droneGroupRef.current.rotation.y = t * speed + Math.PI / 2;
        droneGroupRef.current.rotation.z = Math.sin(t * speed) * 0.15;
        droneGroupRef.current.rotation.x = Math.cos(t * speed) * 0.15;
      } else {
        // Gentle realistic hover
        const baseX = -3.8;
        const baseZ = 4.2;
        const baseY = 8.5 + Math.sin(t * 2.0) * 0.15;
        droneGroupRef.current.position.set(baseX + Math.sin(t * 0.5) * 0.1, baseY, baseZ + Math.cos(t * 0.5) * 0.1);
        droneGroupRef.current.rotation.set(0, 0, Math.sin(t * 1.5) * 0.04);
      }
    }

    // Animate scan cone & sweep rings
    if (scanConeRef.current) {
      scanConeRef.current.rotation.y = t * 3.0;
    }
    if (sweepRingRef.current) {
      sweepRingRef.current.position.y = -2.0 - Math.sin(t * 4.0) * 3.0;
      sweepRingRef.current.scale.setScalar(1.0 + Math.abs(Math.sin(t * 2.0)) * 0.8);
    }
  });

  return (
    <group
      ref={droneGroupRef}
      position={droneState.position}
      onClick={(e) => {
        e.stopPropagation();
        setSelected('DRONE');
      }}
    >
      {/* Central Drone Chassis */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.14, 0.6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Top GPS / Avionics Dome */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.12, 16]} />
        <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* 4 Carbon Fiber Carbon Arms (X-Configuration) */}
      {[
        [-0.5, 0, -0.5],
        [0.5, 0, -0.5],
        [-0.5, 0, 0.5],
        [0.5, 0, 0.5],
      ].map(([x, y, z], i) => (
        <group key={`arm-${i}`} position={[x, y, z]}>
          <mesh rotation={[0, (i % 2 === 0 ? 1 : -1) * (Math.PI / 4), 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 4 Propellers */}
      <mesh ref={prop1Ref} position={[-0.5, 0.15, -0.5]}>
        <boxGeometry args={[0.7, 0.015, 0.05]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.85} />
      </mesh>
      <mesh ref={prop2Ref} position={[0.5, 0.15, -0.5]}>
        <boxGeometry args={[0.7, 0.015, 0.05]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.85} />
      </mesh>
      <mesh ref={prop3Ref} position={[-0.5, 0.15, 0.5]}>
        <boxGeometry args={[0.7, 0.015, 0.05]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.85} />
      </mesh>
      <mesh ref={prop4Ref} position={[0.5, 0.15, 0.5]}>
        <boxGeometry args={[0.7, 0.015, 0.05]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.85} />
      </mesh>

      {/* Gimbal Camera Underneath */}
      <group position={[0, -0.15, 0.1]}>
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Strobe Navigation LEDs */}
      <pointLight position={[-0.5, 0, 0.5]} color="#22c55e" intensity={1} distance={2} />
      <pointLight position={[0.5, 0, 0.5]} color="#ef4444" intensity={1} distance={2} />

      {/* Dynamic Full 360-Degree LiDAR Scanning Cones & Laser Mesh */}
      {isScanning && (
        <group position={[0, -0.2, 0]}>
          <mesh ref={scanConeRef} position={[0, -3.8, 0]}>
            <cylinderGeometry args={[0.1, 4.2, 7.6, 18, 8, true]} />
            <meshBasicMaterial
              color="#00f0ff"
              wireframe
              transparent
              opacity={0.45}
              side={THREE.DoubleSide}
            />
          </mesh>

          <mesh ref={sweepRingRef} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 1.8, 32]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} side={THREE.DoubleSide} />
          </mesh>

          <points ref={pointCloudRef} geometry={particleGeo}>
            <pointsMaterial color="#22d3ee" size={0.12} transparent opacity={0.8} />
          </points>

          <pointLight color="#00f0ff" intensity={4} distance={12} />
        </group>
      )}

      {/* Reactive Compact Floating 3D Telemetry Label */}
      {showLabels && (
        <Html position={[0, 0.6, 0]} center distanceFactor={dynamicDistanceFactor}>
          <div className="pointer-events-none select-none border border-cyan-500/80 bg-slate-900/95 text-cyan-200 px-2 py-1 rounded backdrop-blur-md text-[10px] font-mono whitespace-nowrap flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            <Plane className="w-3 h-3 text-cyan-400" />
            <span className="font-bold">DRONE-01</span>
            <span className="text-slate-400">|</span>
            <span className={isScanning ? 'text-cyan-300 font-bold animate-pulse' : 'text-emerald-300 font-semibold'}>
              {isScanning ? `SCANNING (${droneState.scanProgress}%)` : droneState.status}
            </span>
            {isScanning && <Zap className="w-2.5 h-2.5 text-amber-400 animate-spin" />}
          </div>
        </Html>
      )}
    </group>
  );
};
