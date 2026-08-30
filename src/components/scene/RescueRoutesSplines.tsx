import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import { Navigation, XCircle, CheckCircle } from 'lucide-react';

export const RescueRoutesSplines: React.FC = () => {
  const routes = useRescueTwinStore((s) => s.routes);
  const showLabels = useRescueTwinStore((s) => s.digitalTwin.show3DLabels);
  const routeA = routes.find((r) => r.id === 'A');
  const routeB = routes.find((r) => r.id === 'B');
  const routeC = routes.find((r) => r.id === 'C');

  // Curve definition for Route A (North direct corridor)
  const curveA = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.2, 4.5),
      new THREE.Vector3(-1.0, 0.25, 2.5),
      new THREE.Vector3(-2.2, 0.4, 1.2),
      new THREE.Vector3(-2.0, 1.8, -0.5),
      new THREE.Vector3(0.6, 0.4, -1.2),
    ]);
  }, []);

  // Curve definition for Route B (East shear wall safe ramp)
  const curveB = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.2, 4.5),
      new THREE.Vector3(2.0, 0.25, 3.5),
      new THREE.Vector3(3.2, 0.3, 1.5),
      new THREE.Vector3(3.0, 0.35, -1.0),
      new THREE.Vector3(1.8, 0.35, -1.8),
      new THREE.Vector3(0.6, 0.3, -1.2),
    ]);
  }, []);

  // Curve definition for Route C (South exterior gantry)
  const curveC = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.2, 4.5),
      new THREE.Vector3(-2.5, 0.25, 4.0),
      new THREE.Vector3(-3.5, 0.3, 2.0),
      new THREE.Vector3(-3.2, 0.3, 0.0),
      new THREE.Vector3(-1.5, 0.3, -1.5),
      new THREE.Vector3(0.6, 0.3, -1.2),
    ]);
  }, []);

  const isARejected = routeA?.status === 'REJECTED';
  const isBRecommended = routeB?.status === 'RECOMMENDED';

  return (
    <group>
      {/* ========================================================
          ROUTE A (North Corridor)
         ======================================================== */}
      {routeA && (
        <group>
          <mesh>
            <tubeGeometry args={[curveA, 64, isARejected ? 0.04 : 0.06, 8, false]} />
            <meshStandardMaterial
              color={isARejected ? '#ef4444' : '#f59e0b'}
              emissive={isARejected ? '#ef4444' : '#f59e0b'}
              emissiveIntensity={isARejected ? 0.8 : 0.3}
              transparent
              opacity={isARejected ? 0.45 : 0.8}
              wireframe={isARejected}
            />
          </mesh>

          {/* Compact Midpoint Tag */}
          {showLabels && (
            <Html position={[-2.0, 1.2, 0.8]} center distanceFactor={28}>
              <div className={`pointer-events-none select-none border rounded px-1.5 py-0.5 backdrop-blur-md text-[9px] font-mono whitespace-nowrap flex items-center gap-1 ${
                isARejected
                  ? 'border-red-500 bg-red-950/90 text-red-200 shadow-[0_0_10px_rgba(239,68,68,0.6)]'
                  : 'border-amber-500/70 bg-slate-900/90 text-amber-200'
              }`}>
                {isARejected ? (
                  <XCircle className="w-3 h-3 text-red-400" />
                ) : (
                  <Navigation className="w-3 h-3 text-amber-400" />
                )}
                <span className="font-bold">ROUTE A</span>
                <span className="text-slate-400">|</span>
                <span className={isARejected ? 'text-red-400 font-bold' : 'text-amber-300'}>
                  {isARejected ? 'REJECTED (76%)' : '38%'}
                </span>
              </div>
            </Html>
          )}
        </group>
      )}

      {/* ========================================================
          ROUTE B (East Shear Ramp - Recommended)
         ======================================================== */}
      {routeB && (
        <group>
          <mesh>
            <tubeGeometry args={[curveB, 64, isBRecommended ? 0.08 : 0.05, 8, false]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={isBRecommended ? 0.9 : 0.4}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Waypoint beacons along Route B */}
          {[
            [2.0, 0.25, 3.5],
            [3.2, 0.3, 1.5],
            [3.0, 0.35, -1.0],
          ].map(([x, y, z], i) => (
            <mesh key={`wp-${i}`} position={[x, y + 0.1, z]}>
              <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
          ))}

          {/* Compact Midpoint Tag */}
          {showLabels && (
            <Html position={[3.2, 0.9, 1.0]} center distanceFactor={28}>
              <div className="pointer-events-none select-none border border-emerald-400 bg-slate-900/95 text-emerald-200 rounded px-2 py-0.8 backdrop-blur-md text-[9px] font-mono whitespace-nowrap flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span className="font-bold">ROUTE B (41m)</span>
                <span className="text-slate-400">|</span>
                <span className="text-emerald-300 font-extrabold">RECOMMENDED (29%)</span>
              </div>
            </Html>
          )}
        </group>
      )}

      {/* ========================================================
          ROUTE C (South Gantry)
         ======================================================== */}
      {routeC && (
        <mesh>
          <tubeGeometry args={[curveC, 64, 0.04, 8, false]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.2}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}
    </group>
  );
};
