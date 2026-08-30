import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRescueTwinStore } from '../../state/rescueTwinStore';

export const BuildingStructure: React.FC = () => {
  const collapseStage = useRescueTwinStore((s) => s.digitalTwin.collapseStage);
  const isSpike = useRescueTwinStore((s) => s.telemetry.vibration > 7.0);

  // Group references for animated pieces
  const floor3BrokenRef = useRef<THREE.Group>(null);
  const floor4BrokenRef = useRef<THREE.Group>(null);
  const roofDamagedRef = useRef<THREE.Group>(null);
  const columnFrontLeftRef = useRef<THREE.Mesh>(null);
  const northWallFallingRef = useRef<THREE.Group>(null);
  const rebarGroupRef = useRef<THREE.Group>(null);
  const debrisGroupRef = useRef<THREE.Group>(null);
  const bridgeBrokenRef = useRef<THREE.Group>(null);
  const lowerFoundationRef = useRef<THREE.Group>(null);

  // Procedural debris rocks
  const debrisPiles = useMemo(() => {
    const piles: Array<{ pos: [number, number, number]; rot: [number, number, number]; scale: [number, number, number] }> = [];
    const seed = [
      [-1.8, 0.2, 2.5], [-2.4, 0.3, 2.1], [-1.2, 0.15, 2.8],
      [-3.0, 0.25, 1.2], [-0.5, 0.2, -1.8], [0.8, 0.15, -2.2],
      [-2.8, 0.4, 3.2], [-1.5, 0.35, 1.5], [1.2, 0.2, 3.0],
      [-0.8, 0.2, 1.0], [-2.1, 0.3, -0.5], [1.8, 0.2, -1.5],
    ];
    seed.forEach((pos, idx) => {
      piles.push({
        pos: pos as [number, number, number],
        rot: [Math.sin(idx) * 0.5, Math.cos(idx) * 1.2, Math.sin(idx * 2) * 0.3],
        scale: [0.35 + (idx % 3) * 0.2, 0.25 + (idx % 2) * 0.15, 0.4 + (idx % 4) * 0.15],
      });
    });
    return piles;
  }, []);

  // Smooth piece-by-piece physics interpolation
  useFrame(() => {
    // 1. Floor 3 North Slab Breaking Animation
    if (floor3BrokenRef.current) {
      if (collapseStage === 0) {
        // Intact: flat horizontal
        floor3BrokenRef.current.position.y = THREE.MathUtils.lerp(floor3BrokenRef.current.position.y, 4.6, 0.05);
        floor3BrokenRef.current.rotation.x = THREE.MathUtils.lerp(floor3BrokenRef.current.rotation.x, 0, 0.05);
        floor3BrokenRef.current.rotation.z = THREE.MathUtils.lerp(floor3BrokenRef.current.rotation.z, 0, 0.05);
      } else if (collapseStage === 1) {
        // Earthquake: tilted fractured drop
        floor3BrokenRef.current.position.y = THREE.MathUtils.lerp(floor3BrokenRef.current.position.y, 4.25, 0.05);
        floor3BrokenRef.current.rotation.x = THREE.MathUtils.lerp(floor3BrokenRef.current.rotation.x, 0.25, 0.05);
        floor3BrokenRef.current.rotation.z = THREE.MathUtils.lerp(floor3BrokenRef.current.rotation.z, -0.35, 0.05);
      } else {
        // Flood: collapsed all the way down towards ground
        floor3BrokenRef.current.position.y = THREE.MathUtils.lerp(floor3BrokenRef.current.position.y, 1.2, 0.04);
        floor3BrokenRef.current.rotation.x = THREE.MathUtils.lerp(floor3BrokenRef.current.rotation.x, 0.4, 0.04);
        floor3BrokenRef.current.rotation.z = THREE.MathUtils.lerp(floor3BrokenRef.current.rotation.z, -0.6, 0.04);
      }
    }

    // 2. Floor 4 North Slab Breaking Animation
    if (floor4BrokenRef.current) {
      if (collapseStage === 0) {
        floor4BrokenRef.current.position.y = THREE.MathUtils.lerp(floor4BrokenRef.current.position.y, 6.0, 0.05);
        floor4BrokenRef.current.position.x = THREE.MathUtils.lerp(floor4BrokenRef.current.position.x, -1.0, 0.05);
        floor4BrokenRef.current.rotation.x = THREE.MathUtils.lerp(floor4BrokenRef.current.rotation.x, 0, 0.05);
        floor4BrokenRef.current.rotation.z = THREE.MathUtils.lerp(floor4BrokenRef.current.rotation.z, 0, 0.05);
      } else if (collapseStage === 1) {
        floor4BrokenRef.current.position.y = THREE.MathUtils.lerp(floor4BrokenRef.current.position.y, 5.4, 0.05);
        floor4BrokenRef.current.position.x = THREE.MathUtils.lerp(floor4BrokenRef.current.position.x, -1.4, 0.05);
        floor4BrokenRef.current.rotation.x = THREE.MathUtils.lerp(floor4BrokenRef.current.rotation.x, 0.45, 0.05);
        floor4BrokenRef.current.rotation.z = THREE.MathUtils.lerp(floor4BrokenRef.current.rotation.z, -0.55, 0.05);
      } else {
        floor4BrokenRef.current.position.y = THREE.MathUtils.lerp(floor4BrokenRef.current.position.y, 0.6, 0.04);
        floor4BrokenRef.current.position.x = THREE.MathUtils.lerp(floor4BrokenRef.current.position.x, -1.8, 0.04);
        floor4BrokenRef.current.rotation.z = THREE.MathUtils.lerp(floor4BrokenRef.current.rotation.z, -0.85, 0.04);
      }
    }

    // 3. Roof HVAC Ruin
    if (roofDamagedRef.current) {
      if (collapseStage === 0) {
        roofDamagedRef.current.position.y = THREE.MathUtils.lerp(roofDamagedRef.current.position.y, 7.4, 0.05);
        roofDamagedRef.current.rotation.z = THREE.MathUtils.lerp(roofDamagedRef.current.rotation.z, 0, 0.05);
      } else if (collapseStage === 1) {
        roofDamagedRef.current.position.y = THREE.MathUtils.lerp(roofDamagedRef.current.position.y, 7.1, 0.05);
        roofDamagedRef.current.rotation.z = THREE.MathUtils.lerp(roofDamagedRef.current.rotation.z, -0.2, 0.05);
      } else {
        roofDamagedRef.current.position.y = THREE.MathUtils.lerp(roofDamagedRef.current.position.y, 2.5, 0.04);
        roofDamagedRef.current.rotation.z = THREE.MathUtils.lerp(roofDamagedRef.current.rotation.z, -0.4, 0.04);
      }
    }

    // 4. Front Column Buckling
    if (columnFrontLeftRef.current) {
      if (collapseStage === 0) {
        columnFrontLeftRef.current.scale.set(1, 1, 1);
        columnFrontLeftRef.current.rotation.z = THREE.MathUtils.lerp(columnFrontLeftRef.current.rotation.z, 0, 0.05);
      } else if (collapseStage === 1) {
        columnFrontLeftRef.current.rotation.z = THREE.MathUtils.lerp(columnFrontLeftRef.current.rotation.z, 0.18, 0.05);
      } else {
        columnFrontLeftRef.current.rotation.z = THREE.MathUtils.lerp(columnFrontLeftRef.current.rotation.z, 0.45, 0.04);
      }
    }

    // 5. Falling Wall Fragments (Piece by piece tumble)
    if (northWallFallingRef.current) {
      if (collapseStage === 0) {
        northWallFallingRef.current.position.set(0, 4.5, 0);
        northWallFallingRef.current.rotation.set(0, 0, 0);
        northWallFallingRef.current.scale.set(1, 1, 1);
      } else if (collapseStage === 1) {
        northWallFallingRef.current.position.y = THREE.MathUtils.lerp(northWallFallingRef.current.position.y, 2.2, 0.05);
        northWallFallingRef.current.rotation.x = THREE.MathUtils.lerp(northWallFallingRef.current.rotation.x, 0.8, 0.05);
        northWallFallingRef.current.rotation.z = THREE.MathUtils.lerp(northWallFallingRef.current.rotation.z, -0.4, 0.05);
      } else {
        northWallFallingRef.current.position.y = THREE.MathUtils.lerp(northWallFallingRef.current.position.y, 0.3, 0.04);
        northWallFallingRef.current.rotation.x = THREE.MathUtils.lerp(northWallFallingRef.current.rotation.x, 1.4, 0.04);
      }
    }

    // 6. Exposed Rebar bursting out
    if (rebarGroupRef.current) {
      const targetScale = collapseStage > 0 ? 1 : 0.001;
      rebarGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    }

    // 7. Debris Rubble scattering
    if (debrisGroupRef.current) {
      const debrisScale = collapseStage === 0 ? 0.001 : collapseStage === 1 ? 1 : 1.35;
      debrisGroupRef.current.scale.lerp(new THREE.Vector3(debrisScale, debrisScale, debrisScale), 0.06);
    }

    // 8. Bridge / Road Breakage
    if (bridgeBrokenRef.current) {
      if (collapseStage === 0) {
        bridgeBrokenRef.current.rotation.z = THREE.MathUtils.lerp(bridgeBrokenRef.current.rotation.z, 0, 0.05);
        bridgeBrokenRef.current.position.y = THREE.MathUtils.lerp(bridgeBrokenRef.current.position.y, 0.05, 0.05);
      } else if (collapseStage === 1) {
        bridgeBrokenRef.current.rotation.z = THREE.MathUtils.lerp(bridgeBrokenRef.current.rotation.z, -0.2, 0.05);
        bridgeBrokenRef.current.position.y = THREE.MathUtils.lerp(bridgeBrokenRef.current.position.y, 0.25, 0.05);
      } else {
        bridgeBrokenRef.current.rotation.z = THREE.MathUtils.lerp(bridgeBrokenRef.current.rotation.z, -0.4, 0.04);
        bridgeBrokenRef.current.position.y = THREE.MathUtils.lerp(bridgeBrokenRef.current.position.y, 0.05, 0.04);
      }
    }

    // 9. Lower Foundation Scour on Flood
    if (lowerFoundationRef.current) {
      if (collapseStage === 2) {
        lowerFoundationRef.current.position.y = THREE.MathUtils.lerp(lowerFoundationRef.current.position.y, -0.15, 0.03);
      } else {
        lowerFoundationRef.current.position.y = THREE.MathUtils.lerp(lowerFoundationRef.current.position.y, 0, 0.05);
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Ground Terrain / Foundation Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 26, 32, 32]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.88}
          metalness={0.15}
        />
      </mesh>

      {/* Grid overlay lines on terrain */}
      <gridHelper args={[26, 26, '#00f0ff', '#1e293b']} position={[0, 0.01, 0]} />

      {/* Cracked Road & Broken Bridge Section */}
      <group position={[0, 0.05, 5]}>
        {/* Intact road section */}
        <mesh position={[0, 0, 1.5]} receiveShadow>
          <boxGeometry args={[14, 0.08, 3]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        {/* Road center line markings */}
        {[-4, -2, 0, 2, 4].map((x) => (
          <mesh key={x} position={[x, 0.09, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.0, 0.12]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
        ))}

        {/* Dynamic Bridge Segment (Intact at start, breaks on collapse/flood) */}
        <group ref={bridgeBrokenRef} position={[-4.5, 0.05, -0.5]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.4, 0.2, 2.5]} />
            <meshStandardMaterial color="#334155" roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Emergency Staging Area (Zone C perimeter) */}
      <group position={[3.5, 0.06, 5.0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.8, 0.8, 1.2]} />
          <meshStandardMaterial color="#0284c7" roughness={0.6} />
        </mesh>
        <mesh position={[2.2, 0.4, 0]} castShadow>
          <boxGeometry args={[1.5, 0.8, 1.2]} />
          <meshStandardMaterial color="#0f766e" roughness={0.6} />
        </mesh>
      </group>

      {/* ========================================================
          5-STOREY MODULAR BUILDING WITH PIECE-BY-PIECE COLLAPSE
         ======================================================== */}
      <group ref={lowerFoundationRef}>
        {/* Structural Core Columns */}
        {[
          [-2.5, 3.5, -1.8],
          [2.5, 3.5, -1.8],
          [2.5, 3.5, 1.8],
        ].map(([x, y, z], i) => (
          <mesh key={`col-${i}`} position={[x, y, z]} castShadow receiveShadow>
            <boxGeometry args={[0.4, 7.0, 0.4]} />
            <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.3} />
          </mesh>
        ))}

        {/* Front-Left Column (Buckles dynamically on earthquake/flood) */}
        <mesh
          ref={columnFrontLeftRef}
          position={[-2.5, 2.2, 1.8]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.4, 4.4, 0.4]} />
          <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.3} />
        </mesh>

        {/* Steel I-Beams (Cross girders) */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 4.5, -1.8]} castShadow>
            <boxGeometry args={[5.2, 0.25, 0.25]} />
            <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.8} />
          </mesh>
          <mesh position={[2.5, 4.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <boxGeometry args={[3.8, 0.25, 0.25]} />
            <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.8} />
          </mesh>
        </group>

        {/* FLOOR 0: Foundation / Ground Floor */}
        <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
          <boxGeometry args={[6.2, 0.3, 4.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>

        {/* FLOOR 1 (Elev: 1.6m): Intact */}
        <mesh position={[0, 1.6, 0]} receiveShadow castShadow>
          <boxGeometry args={[6.0, 0.25, 4.2]} />
          <meshStandardMaterial color="#334155" roughness={0.85} />
        </mesh>

        {/* FLOOR 2 (Elev: 3.1m): Mostly Intact */}
        <mesh position={[0.2, 3.1, 0]} receiveShadow castShadow>
          <boxGeometry args={[5.8, 0.25, 4.0]} />
          <meshStandardMaterial color="#334155" roughness={0.85} />
        </mesh>

        {/* FLOOR 3: Modular Pieces */}
        <group position={[0, 0, 0]}>
          {/* Intact East portion */}
          <mesh position={[1.2, 4.6, 0]} receiveShadow castShadow>
            <boxGeometry args={[3.4, 0.25, 3.8]} />
            <meshStandardMaterial color="#334155" roughness={0.85} />
          </mesh>
          {/* Dynamic North-West Slab (Fractures & collapses piece-by-piece) */}
          <group ref={floor3BrokenRef} position={[-1.8, 4.6, 0.4]}>
            <mesh receiveShadow castShadow>
              <boxGeometry args={[2.4, 0.22, 2.8]} />
              <meshStandardMaterial color="#475569" roughness={0.9} />
            </mesh>
          </group>
        </group>

        {/* FLOOR 4: Modular Pieces */}
        <group position={[0, 0, 0]}>
          {/* Intact East portion */}
          <mesh position={[1.0, 6.0, -0.5]} receiveShadow castShadow>
            <boxGeometry args={[3.0, 0.25, 2.6]} />
            <meshStandardMaterial color="#334155" roughness={0.85} />
          </mesh>
          {/* Dynamic North Slab (Breaks and drops) */}
          <group ref={floor4BrokenRef} position={[-1.0, 6.0, 0.2]}>
            <mesh receiveShadow castShadow>
              <boxGeometry args={[2.0, 0.2, 2.0]} />
              <meshStandardMaterial color="#475569" roughness={0.9} />
            </mesh>
          </group>
        </group>

        {/* ROOF: Modular Pieces */}
        <group ref={roofDamagedRef} position={[0, 7.4, 0]}>
          <mesh position={[1.2, 0, -0.6]} receiveShadow castShadow>
            <boxGeometry args={[2.6, 0.2, 2.2]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          {/* HVAC Unit */}
          <mesh position={[1.5, 0.5, -0.8]} castShadow>
            <boxGeometry args={[1.0, 0.8, 0.8]} />
            <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.7} />
          </mesh>
        </group>

        {/* WALLS & FACADES */}
        {/* South Wall with Windows */}
        <mesh position={[0.5, 2.3, 2.0]} castShadow>
          <boxGeometry args={[4.8, 4.2, 0.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        {/* East Reinforced Wall (Safe Zone B shear wall) */}
        <mesh position={[2.9, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 6.8, 4.0]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>

        {/* North Wall: Modular Falling Wall Panels */}
        <group ref={northWallFallingRef} position={[0, 4.5, -2.0]}>
          <mesh position={[-1.2, 0, 0]} castShadow>
            <boxGeometry args={[2.2, 4.0, 0.2]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
        </group>
        {/* North Wall fixed intact lower segment */}
        <mesh position={[1.0, 2.2, -2.0]} castShadow>
          <boxGeometry args={[3.2, 4.0, 0.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>

        {/* Exposed Rebar (Appears dynamically when broken) */}
        <group ref={rebarGroupRef} position={[-1.8, 4.5, 1.8]}>
          {[-0.4, -0.2, 0, 0.2, 0.4].map((offset, idx) => (
            <mesh key={`rbar-${idx}`} position={[offset, idx * 0.1, idx * 0.08]} rotation={[0.3, 0.4, -0.2]}>
              <cylinderGeometry args={[0.02, 0.02, 1.2, 6]} />
              <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.9} />
            </mesh>
          ))}
        </group>

        {/* Broken Glass / Window Remnants */}
        <mesh position={[1.2, 2.2, 2.05]}>
          <planeGeometry args={[1.6, 1.2]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Scattered Rubble & Concrete Debris Piles (Scales dynamically on collapse) */}
        <group ref={debrisGroupRef}>
          {debrisPiles.map((p, i) => (
            <mesh key={`deb-${i}`} position={p.pos} rotation={p.rot} scale={p.scale} castShadow receiveShadow>
              <dodecahedronGeometry args={[0.8, 0]} />
              <meshStandardMaterial color="#475569" roughness={0.95} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Dynamic Structural Stress Visual Indicator (Flashes red on spike) */}
      {isSpike && (
        <pointLight position={[-2.2, 5.0, 1.8]} color="#ef4444" intensity={4} distance={8} />
      )}
    </group>
  );
};
