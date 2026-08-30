import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { BuildingStructure } from './BuildingStructure';
import { RiskZonesVisualizer } from './RiskZonesVisualizer';
import { QuadcopterDrone } from './QuadcopterDrone';
import { RescueRobot } from './RescueRobot';
import { IoTSensorNodes3D } from './IoTSensorNodes3D';
import { RescueRoutesSplines } from './RescueRoutesSplines';
import { FlashFloodSimulation } from './FlashFloodSimulation';
import { CameraController } from './CameraController';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import {
  Eye,
  ShieldAlert,
  Crosshair,
  Droplet,
  Tag,
  Maximize,
  Minimize,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

export const DigitalTwinCanvas: React.FC = () => {
  const arMode = useRescueTwinStore((s) => s.digitalTwin.arMode);
  const showLabels = useRescueTwinStore((s) => s.digitalTwin.show3DLabels);
  const toggle3DLabels = useRescueTwinStore((s) => s.toggle3DLabels);
  const cameraPreset = useRescueTwinStore((s) => s.digitalTwin.cameraPreset);
  const setCameraPreset = useRescueTwinStore((s) => s.setCameraPreset);
  const is3DFullscreen = useRescueTwinStore((s) => s.is3DFullscreen);
  const toggle3DFullscreen = useRescueTwinStore((s) => s.toggle3DFullscreen);
  const setInspectorDrawer = useRescueTwinStore((s) => s.setInspectorDrawer);
  const zoomDistance = useRescueTwinStore((s) => s.cameraZoomDistance);
  const setCameraZoomDistance = useRescueTwinStore((s) => s.setCameraZoomDistance);
  const isSpike = useRescueTwinStore((s) => s.telemetry.vibration > 7.0);
  const isFlood = useRescueTwinStore((s) => s.telemetry.flood.active);
  const floodLevel = useRescueTwinStore((s) => s.telemetry.flood.waterLevelM);

  return (
    <div
      className={`relative bg-[#080c14] overflow-hidden select-none transition-all duration-300 ${
        is3DFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen'
          : 'w-full h-full'
      }`}
    >
      {/* 3D Canvas Viewport */}
      <Canvas
        shadows
        camera={{ position: [14, 12, 16], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={['#080c14']} />
        <fog attach="fog" args={['#080c14', 20, 50]} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[12, 20, 10]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
          shadow-bias={-0.0001}
        />
        {/* Disaster ambiance lights */}
        <pointLight position={[-10, 8, -10]} color="#00f0ff" intensity={0.8} distance={30} />
        <pointLight position={[10, 6, 12]} color="#38bdf8" intensity={0.5} distance={25} />

        <Suspense fallback={null}>
          <BuildingStructure />
          <RiskZonesVisualizer />
          <QuadcopterDrone />
          <RescueRobot />
          <IoTSensorNodes3D />
          <RescueRoutesSplines />
          <FlashFloodSimulation />
          <CameraController />
        </Suspense>
      </Canvas>

      {/* AR RESPONDER HUD SYNTHETIC OVERLAY */}
      {arMode && (
        <div className="pointer-events-none absolute inset-0 border-2 border-cyan-500/40 bg-cyan-950/5 flex flex-col justify-between p-4 z-10 scanline-effect">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-950/90 border border-cyan-400 px-3 py-1.5 rounded text-xs font-mono text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <Crosshair className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="font-bold tracking-widest">AR RESPONDER HUD // SPATIAL SYNCHRONIZED</span>
              <span className="bg-cyan-500 text-slate-950 px-1 rounded text-[10px] font-extrabold">LIVE</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-700 px-2.5 py-1 rounded text-[11px] font-mono text-slate-300">
              FIELD OF VIEW: 94° | LATENCY: 8ms
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="bg-slate-950/90 border border-emerald-500/80 p-2.5 rounded text-xs font-mono text-emerald-300 max-w-xs shadow-lg">
              <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                <Eye className="w-4 h-4" />
                <span>ACTIVE AR WAYPOINT: ROUTE B</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                Follow green optical corridor along East Shear Wall. Avoid North stairwell breach.
              </div>
            </div>

            {isSpike && (
              <div className="bg-red-950/90 border border-red-500 p-2.5 rounded text-xs font-mono text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse">
                <div className="font-bold flex items-center gap-1.5 text-red-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span>SECTOR A COLLAPSE DANGER</span>
                </div>
                <div className="text-[10px] text-red-300 mt-0.5">
                  VIBRATION: 8.7 mm/s | STRUCTURAL RISK: 76%
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Flash Flood Active HUD Banner */}
      {isFlood && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 bg-blue-950/90 border border-blue-400 text-blue-200 px-4 py-1.5 rounded-full shadow-[0_0_25px_rgba(56,189,248,0.5)] flex items-center gap-2 text-xs font-mono animate-bounce">
          <Droplet className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-bold">FLASH FLOOD INUNDATION ACTIVE:</span>
          <span className="text-white font-extrabold">+{floodLevel.toFixed(2)}m SURGE</span>
          <span className="text-[10px] bg-blue-500 text-slate-950 px-1.5 rounded font-bold">RUSHING 3.4 m/s</span>
        </div>
      )}

      {/* DEDICATED ZOOM IN / ZOOM OUT SLIDER CONTROLLER (Left Bottom HUD) */}
      <div className="absolute bottom-10 left-3 z-30 flex items-center gap-2 bg-slate-900/95 border border-slate-700/90 p-1.5 px-3 rounded-lg backdrop-blur-md shadow-xl text-xs font-mono text-slate-300">
        <button
          onClick={() => setCameraZoomDistance(zoomDistance + 3)}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        {/* Dedicated Zoom Slider */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-bold">ZOOM:</span>
          <input
            type="range"
            min="6"
            max="38"
            step="1"
            value={zoomDistance}
            onChange={(e) => setCameraZoomDistance(parseFloat(e.target.value))}
            className="w-24 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none border border-slate-800"
            title={`Camera Distance: ${zoomDistance.toFixed(0)}m`}
          />
          <span className="text-[10px] text-cyan-300 w-8 text-right font-semibold">
            {zoomDistance.toFixed(0)}m
          </span>
        </div>

        <button
          onClick={() => setCameraZoomDistance(zoomDistance - 3)}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setCameraZoomDistance(24)}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          title="Reset Zoom to 24m"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Floating Viewport Camera, Label, Inspector & Fullscreen Toolbar */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-slate-900/95 border border-slate-700/90 p-1.5 rounded-lg backdrop-blur-md shadow-xl">
        {/* Fullscreen 3D Toggle */}
        <button
          onClick={toggle3DFullscreen}
          title={is3DFullscreen ? "Exit Fullscreen 3D" : "Expand 3D Digital Twin to Full Screen"}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all border ${
            is3DFullscreen
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
              : 'bg-cyan-950 hover:bg-cyan-900 border-cyan-500/80 text-cyan-300'
          }`}
        >
          {is3DFullscreen ? (
            <>
              <Minimize className="w-3.5 h-3.5" />
              <span>EXIT FULLSCREEN</span>
            </>
          ) : (
            <>
              <Maximize className="w-3.5 h-3.5" />
              <span>FULLSCREEN 3D</span>
            </>
          )}
        </button>

        {/* Toggle 3D Labels */}
        <button
          onClick={toggle3DLabels}
          title={showLabels ? "Hide 3D scene text tags" : "Show 3D scene text tags"}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-all border ${
            showLabels
              ? 'bg-cyan-950 border-cyan-500/80 text-cyan-300'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tag className="w-3 h-3" />
          <span>{showLabels ? 'LABELS: ON' : 'LABELS: OFF'}</span>
        </button>

        {/* Open Inspector */}
        <button
          onClick={() => setInspectorDrawer(true)}
          title="Open Tactical Telemetry Inspector Drawer"
          className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
        >
          <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
          <span>INSPECT</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-700 mx-0.5" />

        <span className="text-[10px] font-mono text-slate-400 px-1 font-semibold">VIEW:</span>
        {(['COMMAND', 'AERIAL', 'BUILDING', 'ROBOT'] as const).map((preset) => (
          <button
            key={preset}
            onClick={() => setCameraPreset(preset)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-all ${
              cameraPreset === preset
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Viewport Coordinate Watermark */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none font-mono text-[10px] text-slate-500 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-2">
        <span className="text-cyan-400 font-bold">RESCUETWIN 3D ENGINE</span>
        <span>27°42'14"N 85°19'30"E</span>
        <span>ELEV: 1,350m</span>
        <span>FPS: 60</span>
      </div>
    </div>
  );
};
