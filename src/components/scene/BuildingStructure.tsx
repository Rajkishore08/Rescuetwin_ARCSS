import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import { Building2 } from 'lucide-react';

export const BuildingStructure: React.FC = () => {
  const collapseStage = useRescueTwinStore((s) => s.digitalTwin.collapseStage);
  const isSpike = useRescueTwinStore((s) => s.telemetry.vibration > 7.0);
  const setSelected = useRescueTwinStore((s) => s.setSelectedElement);
  const selectedElement = useRescueTwinStore((s) => s.digitalTwin.selectedElementId);
  const showLabels = useRescueTwinStore((s) => s.digitalTwin.show3DLabels);
  const buildingIntegrity = useRescueTwinStore((s) => s.digitalTwin.buildingIntegrityPct);
  const vibration = useRescueTwinStore((s) => s.telemetry.vibration);
  const zoomDist = useRescueTwinStore((s) => s.cameraZoomDistance);

  const isSelectedBuilding = selectedElement === 'BUILDING';
  const dynamicDistanceFactor = Math.max(16, Math.min(38, zoomDist * 1.15));

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
        floor3BrokenRef.current.position.y = THREE.MathUtils.lerp(floor3BrokenRef.current.position.y, 4.6, 0.05);
        floor3BrokenRef.current.rotation.x = THREE.MathUtils.lerp(floor3BrokenRef.current.rotation.x, 0, 0.05);
        floor3BrokenRef.current.rotation.z = THREE.MathUtils.lerp(floor3BrokenRef.current.rotation.z, 0, 0.05);
      } else if (collapseStage === 1) {
        floor3BrokenRef.current.position.y = THREE.MathUtils.lerp(floor3BrokenRef.current.position.y, 4.25, 0.05);
        floor3BrokenRef.current.rotation.x = THREE.MathUtils.lerp(floor3BrokenRef.current.rotation.x, 0.25, 0.05);
        floor3BrokenRef.current.rotation.z = THREE.MathUtils.lerp(floor3BrokenRef.current.rotation.z, -0.35, 0.05);
      } else {
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

    // 6. Exposed Rebar Wire Twist
    if (rebarGroupRef.current) {
      if (collapseStage === 0) {
        rebarGroupRef.current.scale.set(0, 0, 0);
      } else if (collapseStage === 1) {
        rebarGroupRef.current.scale.set(1, 1, 1);
        rebarGroupRef.current.rotation.z = THREE.MathUtils.lerp(rebarGroupRef.current.rotation.z, 0.3, 0.05);
      } else {
        rebarGroupRef.current.scale.set(1.2, 1.2, 1.2);
        rebarGroupRef.current.rotation.z = THREE.MathUtils.lerp(rebarGroupRef.current.rotation.z, 0.6, 0.04);
      }
    }

    // 7. Debris Pile Scaling
    if (debrisGroupRef.current) {
      if (collapseStage === 0) {
        debrisGroupRef.current.scale.set(0.01, 0.01, 0.01);
      } else if (collapseStage === 1) {
        debrisGroupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      } else {
        debrisGroupRef.current.scale.lerp(new THREE.Vector3(1.6, 1.3, 1.6), 0.04);
      }
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
      <group
        ref={lowerFoundationRef}
        onClick={(e) => {
          e.stopPropagation();
          setSelected('BUILDING');
        }}
      >
        {/* Structural Core Columns */}
        {[
          [-2.5, 3.5, -1.8],
          [2.5, 3.5, -1.8],
          [2.5, 3.5, 1.8],
        ].map(([x, y, z], i) => (
          <mesh key={`col-${i}`} position={[x, y, z]} castShadow receiveShadow>
            <boxGeometry args={[0.4, 7.0, 0.4]} />
            <meshStandardMaterial
              color="#334155"
              roughness={0.7}
              metalness={0.3}
            />
          </mesh>
        ))}

        {/* Dynamic Column Front-Left (Buckles under stress) */}
        <mesh ref={columnFrontLeftRef} position={[-2.5, 3.5, 1.8]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 7.0, 0.4]} />
          <meshStandardMaterial
            color={collapseStage > 0 ? '#b91c1c' : '#334155'}
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>

        {/* Floor 0: Ground Foundation Slab */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[6.5, 0.2, 5.0]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>

        {/* Floor 1: Intact Concrete Floor Slab */}
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.2, 0.22, 4.6]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>

        {/* Floor 2: Intact Floor Slab */}
        <mesh position={[0, 3.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.2, 0.22, 4.6]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>

        {/* Floor 3: Dynamic Fractured Slab (Splits piece-by-piece on quake/flood) */}
        <group ref={floor3BrokenRef} position={[-1.0, 4.6, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.2, 0.22, 4.6]} />
            <meshStandardMaterial color="#475569" roughness={0.7} />
          </mesh>
          {/* Cracked edge detail */}
          <mesh position={[2.1, 0.05, 0]}>
            <boxGeometry args={[0.2, 0.15, 4.4]} />
            <meshStandardMaterial color="#1f2937" roughness={0.9} />
          </mesh>
        </group>
        {/* Floor 3 East Intact Half */}
        <mesh position={[2.1, 4.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.22, 4.6]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>

        {/* Floor 4: Broken Upper Slab (Tilts and fractures downwards) */}
        <group ref={floor4BrokenRef} position={[-1.0, 6.0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.2, 0.22, 4.6]} />
            <meshStandardMaterial color="#475569" roughness={0.7} />
          </mesh>
        </group>
        {/* Floor 4 East Intact Half */}
        <mesh position={[2.1, 6.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.22, 4.6]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>

        {/* Roof Parapet & HVAC Platform */}
        <group ref={roofDamagedRef} position={[0, 7.4, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[6.4, 0.25, 4.8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>

          {/* HVAC Unit & Telecom Antennas on Roof */}
          <mesh position={[1.5, 0.6, 0.5]} castShadow>
            <boxGeometry args={[1.4, 0.9, 1.2]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
          <mesh position={[-1.8, 0.5, -0.8]} castShadow>
            <boxGeometry args={[1.0, 0.7, 1.0]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          {/* Radio Mast */}
          <mesh position={[2.2, 1.5, -1.5]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, 2.5, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
        </group>

        {/* East Shear Wall (Reinforced Concrete Ingress - Intact Primary Corridor) */}
        <mesh position={[3.05, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 6.8, 4.6]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>

        {/* South Portal Wall with Doorways */}
        <mesh position={[0, 1.0, 2.25]} castShadow receiveShadow>
          <boxGeometry args={[5.8, 1.8, 0.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>

        {/* North Wall: Dynamic Tumbling Concrete Panels */}
        <group ref={northWallFallingRef} position={[0, 4.5, 0]}>
          <mesh position={[-1.2, 0, -2.25]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 3.2, 0.25]} />
            <meshStandardMaterial color="#475569" roughness={0.85} />
          </mesh>
          <mesh position={[-2.4, -0.6, -2.25]} rotation={[0, 0, -0.3]} castShadow>
            <boxGeometry args={[1.2, 2.0, 0.25]} />
            <meshStandardMaterial color="#334155" roughness={0.9} />
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

        {/* Reactive Technical Label for Building - Shown if global labels ON OR if building is clicked */}
        {(showLabels || isSelectedBuilding) && (
          <Html position={[0, collapseStage === 2 ? 3.8 : 8.8, 0]} center distanceFactor={dynamicDistanceFactor}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelected('BUILDING');
              }}
              className={`cursor-pointer select-none border rounded px-2.5 py-1.5 backdrop-blur-md text-[10px] font-mono whitespace-nowrap flex flex-col gap-1 transition-all ${
                collapseStage > 0
                  ? 'border-red-500/90 bg-slate-950/95 text-red-200 shadow-[0_0_16px_rgba(239,68,68,0.5)]'
                  : 'border-cyan-500/80 bg-slate-950/95 text-cyan-200 shadow-[0_0_14px_rgba(0,240,255,0.4)]'
              } ${isSelectedBuilding ? 'ring-2 ring-cyan-400 shadow-[0_0_24px_rgba(0,240,255,0.8)] scale-105' : ''}`}
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-0.5">
                <span className="font-bold tracking-wider flex items-center gap-1.5 text-cyan-300">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  5-STOREY COMMERCIAL STRUCTURE
                </span>
                <span className={`text-[8px] px-1.5 py-0.2 rounded font-bold ${
                  buildingIntegrity < 50
                    ? 'bg-red-500 text-white animate-pulse'
                    : buildingIntegrity < 80
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-500/30 text-emerald-300'
                }`}>
                  {buildingIntegrity < 50 ? 'CRITICAL FAILURE' : buildingIntegrity < 80 ? 'DAMAGED' : 'NOMINAL'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[9px] gap-3">
                <span className="text-slate-400">
                  INTEGRITY: <span className={`font-bold ${buildingIntegrity < 50 ? 'text-red-400' : 'text-emerald-400'}`}>{buildingIntegrity}%</span>
                </span>
                <span className="text-slate-400">
                  VIB: <span className={`font-bold ${vibration > 6 ? 'text-red-400' : 'text-cyan-300'}`}>{vibration} mm/s</span>
                </span>
                <span className="text-slate-400">
                  STATUS: <span className="text-cyan-300 font-bold">{collapseStage === 0 ? 'INTACT BASELINE' : collapseStage === 1 ? 'SEISMIC FRACTURE' : 'FLOOD SCOURED'}</span>
                </span>
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* Dynamic Structural Stress Visual Indicator (Flashes red on spike) */}
      {isSpike && (
        <pointLight position={[-2.2, 5.0, 1.8]} color="#ef4444" intensity={4} distance={8} />
      )}
    </group>
  );
};
