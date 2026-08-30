import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import { Navigation, AlertOctagon, CheckCircle2 } from 'lucide-react';

const ROUTE_WAYPOINTS: Record<string, [number, number, number][]> = {
  A: [
    [0, 0.4, 4.5],
    [-1.5, 1.2, 3.0],
    [-2.2, 2.5, 1.5],
    [-1.8, 3.5, 0.2],
    [0.6, 0.3, -1.2],
  ],
  B: [
    [0, 0.4, 4.5],
    [2.0, 1.0, 3.5],
    [3.2, 2.2, 1.0],
    [2.8, 3.2, -0.5],
    [1.5, 1.5, -1.0],
    [0.6, 0.3, -1.2],
  ],
  C: [
    [0, 0.4, 4.5],
    [1.5, 0.4, 4.2],
    [3.0, 0.4, 3.0],
    [3.5, 0.4, 0.5],
    [2.0, 0.4, -1.0],
    [0.6, 0.3, -1.2],
  ],
};

export const RescueRoutesSplines: React.FC = () => {
  const routes = useRescueTwinStore((s) => s.routes);
  const showLabels = useRescueTwinStore((s) => s.digitalTwin.show3DLabels);
  const zoomDist = useRescueTwinStore((s) => s.cameraZoomDistance);
  const setSelected = useRescueTwinStore((s) => s.setSelectedElement);
  const selectedElement = useRescueTwinStore((s) => s.digitalTwin.selectedElementId);

  const dynamicDistanceFactor = Math.max(16, Math.min(38, zoomDist * 1.15));

  const curves = useMemo(() => {
    return routes.map((r) => {
      const waypoints = ROUTE_WAYPOINTS[r.id] || ROUTE_WAYPOINTS['B'];
      const points = waypoints.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.08, 8, false);
      const midPoint = curve.getPoint(0.5);
      return { route: r, waypoints, tubeGeo, midPoint };
    });
  }, [routes]);

  return (
    <group>
      {curves.map(({ route, waypoints, tubeGeo, midPoint }) => {
        const isRecommended = route.status === 'RECOMMENDED';
        const isRejected = route.status === 'REJECTED';
        const isSelected = selectedElement === `ROUTE_${route.id}`;

        const color = isRejected ? '#ef4444' : isRecommended ? '#10b981' : '#eab308';

        return (
          <group
            key={route.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(`ROUTE_${route.id}`);
            }}
          >
            {/* 3D Spline Path Tube */}
            <mesh geometry={tubeGeo}>
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isRecommended ? 0.8 : isRejected ? 0.4 : 0.3}
                roughness={0.2}
                metalness={0.5}
                transparent
                opacity={isRejected ? 0.35 : 0.9}
              />
            </mesh>

            {/* Glowing Waypoint Spheres */}
            {waypoints.map((wp, idx) => (
              <mesh key={`wp-${idx}`} position={wp}>
                <sphereGeometry args={[0.12, 12, 12]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={isRecommended ? 1.0 : 0.4}
                />
              </mesh>
            ))}

            {/* Reactive Floating Route HUD Tag */}
            {showLabels && (
              <Html position={[midPoint.x, midPoint.y + 0.4, midPoint.z]} center distanceFactor={dynamicDistanceFactor}>
                <div className={`pointer-events-none select-none border rounded px-1.5 py-0.5 backdrop-blur-md text-[9px] font-mono whitespace-nowrap flex items-center gap-1 transition-all ${
                  isRejected
                    ? 'border-red-500/80 bg-red-950/90 text-red-300'
                    : isRecommended
                    ? 'border-emerald-400 bg-slate-900/95 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.4)] ring-1 ring-emerald-400/50'
                    : 'border-amber-500/70 bg-slate-900/90 text-amber-200'
                } ${isSelected ? 'ring-1 ring-cyan-400' : ''}`}>
                  <Navigation className="w-2.5 h-2.5" />
                  <span className="font-bold">ROUTE {route.id}</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-300">{route.distanceMeters}m</span>
                  {isRecommended ? (
                    <span className="text-emerald-400 font-extrabold flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> OPTIMAL
                    </span>
                  ) : isRejected ? (
                    <span className="text-red-400 font-bold flex items-center gap-0.5">
                      <AlertOctagon className="w-2.5 h-2.5" /> REJECTED
                    </span>
                  ) : (
                    <span className="text-amber-300 font-semibold">{route.structuralRiskPct}% RISK</span>
                  )}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};
