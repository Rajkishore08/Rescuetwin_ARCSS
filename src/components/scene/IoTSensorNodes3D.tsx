import React from 'react';
import { Html } from '@react-three/drei';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import { Activity, Thermometer, Wind, Maximize2 } from 'lucide-react';

export const IoTSensorNodes3D: React.FC = () => {
  const sensorNodes = useRescueTwinStore((s) => s.telemetry.sensorNodes);
  const showLabels = useRescueTwinStore((s) => s.digitalTwin.show3DLabels);
  const zoomDist = useRescueTwinStore((s) => s.cameraZoomDistance);
  const setSelected = useRescueTwinStore((s) => s.setSelectedElement);
  const selectedElement = useRescueTwinStore((s) => s.digitalTwin.selectedElementId);

  const dynamicDistanceFactor = Math.max(16, Math.min(38, zoomDist * 1.15));

  return (
    <group>
      {sensorNodes.map((sensor) => {
        const isCritical = sensor.status === 'CRITICAL';
        const isWarning = sensor.status === 'WARNING';
        const isSelected = selectedElement === sensor.id;

        const color = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';

        const getIcon = () => {
          switch (sensor.type) {
            case 'VIBRATION': return <Activity className="w-2.5 h-2.5" />;
            case 'TEMPERATURE': return <Thermometer className="w-2.5 h-2.5" />;
            case 'GAS': return <Wind className="w-2.5 h-2.5" />;
            case 'STRUCTURAL_MOVEMENT': return <Maximize2 className="w-2.5 h-2.5" />;
          }
        };

        return (
          <group
            key={sensor.id}
            position={sensor.coords}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(sensor.id);
            }}
          >
            {/* Invisible expanded click hitbox for effortless tap */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                setSelected(sensor.id);
              }}
            >
              <sphereGeometry args={[0.35, 8, 8]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            {/* Core glowing sensor beacon */}
            <mesh>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isCritical ? 0.9 : 0.4}
              />
            </mesh>

            {/* Concentric Pulse Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.14, 0.2, 24]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={isCritical ? 0.8 : 0.4}
                side={2}
              />
            </mesh>

            {/* Point light for spatial illumination */}
            <pointLight color={color} intensity={isCritical ? 2.0 : 0.6} distance={2.5} />

            {/* Compact Reactive Technical Tooltip Tag - Shown if global labels ON OR individually clicked */}
            {(showLabels || isSelected) && (
              <Html position={[0, 0.25, 0]} center distanceFactor={dynamicDistanceFactor}>
                <div className={`pointer-events-none select-none border rounded px-1.5 py-0.5 backdrop-blur-md text-[9px] font-mono whitespace-nowrap flex items-center gap-1 transition-all ${
                  isCritical
                    ? 'border-red-500 bg-red-950/90 text-red-200 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-bounce'
                    : isWarning
                    ? 'border-amber-500/80 bg-slate-900/90 text-amber-200'
                    : 'border-cyan-500/50 bg-slate-900/80 text-cyan-200'
                } ${isSelected ? 'ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.7)] scale-110' : ''}`}>
                  <span className={isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-cyan-400'}>
                    {getIcon()}
                  </span>
                  <span className="font-semibold">{sensor.id}</span>
                  <span className="text-slate-400">|</span>
                  <span className={`font-bold ${isCritical ? 'text-red-300' : 'text-slate-100'}`}>
                    {sensor.value}{sensor.unit}
                  </span>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};
