import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRescueTwinStore } from '../../state/rescueTwinStore';

export const FlashFloodSimulation: React.FC = () => {
  const waterMeshRef = useRef<THREE.Mesh>(null);
  const surgeParticlesRef = useRef<THREE.Points>(null);
  const debrisGroupRef = useRef<THREE.Group>(null);

  const flood = useRescueTwinStore((s) => s.telemetry.flood);
  const isFloodActive = flood.active;

  // Particle positions for rushing water foam / spray
  const { particlePositions, particleVelocities } = useMemo(() => {
    const count = 350;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Start near the broken bridge / north-west breach canal
      pos[i * 3] = -8 + Math.random() * 4;
      pos[i * 3 + 1] = 0.2 + Math.random() * 0.5;
      pos[i * 3 + 2] = 4 + Math.random() * 4;

      vel[i * 3] = 2.5 + Math.random() * 2.0; // rushing towards right (+X)
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      vel[i * 3 + 2] = -1.5 - Math.random() * 1.5; // rushing into building (-Z)
    }

    return { particlePositions: pos, particleVelocities: vel };
  }, []);

  // Floating debris objects
  const floatingDebris = useMemo(() => {
    return [
      { initPos: [-4.0, 0.3, 3.5], size: [0.6, 0.15, 0.4], color: '#78350f' },
      { initPos: [-2.5, 0.2, 2.0], size: [0.8, 0.1, 0.3], color: '#334155' },
      { initPos: [0.2, 0.25, 1.2], size: [0.5, 0.2, 0.5], color: '#475569' },
      { initPos: [-1.5, 0.3, -1.0], size: [0.7, 0.12, 0.35], color: '#713f12' },
    ];
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. Water plane elevation & wave ripple animation
    if (waterMeshRef.current) {
      // Target water level: if active, rise to flood.waterLevelM; if inactive, rest at ground level 0.06m
      const targetY = isFloodActive ? Math.min(0.06 + flood.waterLevelM * 0.65, 1.35) : 0.06;
      waterMeshRef.current.position.y = THREE.MathUtils.lerp(waterMeshRef.current.position.y, targetY, 0.04);

      // Wave ripple oscillation
      const geom = waterMeshRef.current.geometry as THREE.PlaneGeometry;
      const posAttr = geom.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const u = posAttr.getX(i);
        const v = posAttr.getY(i);
        const z = isFloodActive
          ? Math.sin(u * 1.2 + t * 4.0) * 0.08 + Math.cos(v * 1.5 + t * 3.5) * 0.06
          : Math.sin(u * 0.4 + t * 1.0) * 0.01;
        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;
    }

    // 2. Rushing flood spray particles
    if (surgeParticlesRef.current && isFloodActive) {
      const posAttr = surgeParticlesRef.current.geometry.attributes.position;
      const count = posAttr.count;

      for (let i = 0; i < count; i++) {
        let x = posAttr.getX(i) + particleVelocities[i * 3] * 0.05;
        let y = posAttr.getY(i) + Math.sin(t * 8 + i) * 0.02;
        let z = posAttr.getZ(i) + particleVelocities[i * 3 + 2] * 0.05;

        // Reset particle if it rushes across the zone
        if (x > 8 || z < -6) {
          x = -8 + Math.random() * 3;
          z = 4 + Math.random() * 3;
          y = 0.2 + Math.random() * 0.4;
        }

        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;
    }

    // 3. Floating debris bobbing & drifting
    if (debrisGroupRef.current && isFloodActive) {
      debrisGroupRef.current.children.forEach((child, idx) => {
        const currentWaterY = waterMeshRef.current ? waterMeshRef.current.position.y : 0.2;
        child.position.y = currentWaterY + Math.sin(t * 3.0 + idx) * 0.04;
        child.rotation.z = Math.sin(t * 2.5 + idx) * 0.15;
        child.rotation.x = Math.cos(t * 2.0 + idx) * 0.12;
      });
    }
  });

  return (
    <group>
      {/* Dynamic Rising & Rushing Flood Water Plane */}
      <mesh
        ref={waterMeshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.06, 0]}
        receiveShadow
      >
        <planeGeometry args={[26, 26, 32, 32]} />
        <meshStandardMaterial
          color={isFloodActive ? '#0284c7' : '#0369a1'}
          roughness={0.08}
          metalness={0.85}
          transparent
          opacity={isFloodActive ? 0.88 : 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rushing Foam Spray Particles (Active during flood surge) */}
      {isFloodActive && (
        <points ref={surgeParticlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particlePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.18}
            color="#e0f2fe"
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Floating Submerged Debris */}
      {isFloodActive && (
        <group ref={debrisGroupRef}>
          {floatingDebris.map((item, i) => (
            <mesh
              key={`fdeb-${i}`}
              position={item.initPos as [number, number, number]}
              castShadow
            >
              <boxGeometry args={item.size as [number, number, number]} />
              <meshStandardMaterial color={item.color} roughness={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {/* Flood Breach Light & Caustic Glow */}
      {isFloodActive && (
        <pointLight
          position={[-4.0, 1.5, 3.0]}
          color="#38bdf8"
          intensity={4}
          distance={16}
        />
      )}
    </group>
  );
};
