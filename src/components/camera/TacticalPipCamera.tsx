import React, { useState } from 'react';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import {
  Flame,
  X,
  Crosshair,
  Maximize2,
  Minimize2,
  Video,
  Radio,
  Compass,
} from 'lucide-react';

export const TacticalPipCamera: React.FC = () => {
  const activePipFeed = useRescueTwinStore((s) => s.activePipFeed);
  const setPipFeed = useRescueTwinStore((s) => s.setPipFeed);
  const telemetry = useRescueTwinStore((s) => s.telemetry);

  const [zoom, setZoom] = useState<'1X' | '2X' | '4X'>('1X');
  const [isMinimized, setIsMinimized] = useState(false);

  if (activePipFeed === 'OFF') {
    return (
      <button
        onClick={() => setPipFeed('ROBOT_FLIR')}
        className="fixed bottom-24 right-4 z-30 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/80 text-cyan-300 px-3 py-1.5 rounded-lg shadow-lg text-xs font-mono flex items-center gap-1.5 transition-all"
        title="Open Live Tactical FPV / FLIR Camera"
      >
        <Video className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="font-bold">LIVE FPV FEED</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-24 right-4 z-30 bg-slate-950/95 border border-cyan-500/70 rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.3)] flex flex-col overflow-hidden backdrop-blur-md select-none font-mono transition-all duration-300 ${
        isMinimized ? 'w-64 h-10' : 'w-76 xl:w-88 h-60 xl:h-64'
      }`}
    >
      {/* Top Feed Control Header */}
      <div className="p-1.5 px-2 bg-slate-900 border-b border-cyan-900/60 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-bold text-slate-200 uppercase">
            {activePipFeed === 'ROBOT_FLIR' ? 'ROBOT-01 // FLIR THERMAL' : 'DRONE-01 // OPTICAL LiDAR'}
          </span>
          <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-1 rounded text-[8px] font-bold">
            REC
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Feed Switcher Button */}
          <button
            onClick={() =>
              setPipFeed(
                activePipFeed === 'ROBOT_FLIR' ? 'DRONE_OPTICAL' : 'ROBOT_FLIR'
              )
            }
            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[9px] border border-cyan-800 transition-colors"
            title="Switch Video Feed"
          >
            {activePipFeed === 'ROBOT_FLIR' ? 'DRONE' : 'FLIR'}
          </button>

          {/* Minimize toggle */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </button>

          {/* Close PiP */}
          <button
            onClick={() => setPipFeed('OFF')}
            className="p-1 rounded bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Video Viewport (If Not Minimized) */}
      {!isMinimized && (
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
          {/* FEED 1: ROBOT FLIR FALSE-COLOR THERMAL */}
          {activePipFeed === 'ROBOT_FLIR' && (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-amber-950 flex items-center justify-center scanline-effect overflow-hidden">
              {/* Noise Grain Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />

              {/* Thermal Hotspot Simulation (Survivor in basement void) */}
              <div className="relative flex items-center justify-center">
                {/* Cold background concrete contours */}
                <div className="w-48 h-32 border-2 border-indigo-500/30 rounded-lg flex items-center justify-center transform -rotate-3">
                  <div className="w-32 h-20 border border-purple-500/40 rounded flex items-center justify-center">
                    {/* Glowing 37.2°C Thermal Heat Blob (Survivor Signature) */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 via-yellow-300 to-white animate-pulse shadow-[0_0_35px_rgba(250,204,21,0.9)] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white blur-[2px]" />
                    </div>
                  </div>
                </div>

                {/* Spot Temperature Box Reticle */}
                <div className="absolute border border-yellow-400 bg-yellow-950/40 px-1.5 py-0.5 rounded text-[9px] text-yellow-300 -top-6 flex items-center gap-1 shadow-md">
                  <Flame className="w-2.5 h-2.5 text-amber-400 animate-bounce" />
                  <span className="font-bold">SPOT: 37.2°C (VICTIM)</span>
                </div>
              </div>

              {/* FLIR Palette Gradient Bar */}
              <div className="absolute right-2 top-3 bottom-3 w-2.5 rounded-full bg-gradient-to-t from-indigo-900 via-purple-700 via-amber-500 to-yellow-200 border border-white/20 flex flex-col justify-between items-center text-[7px] text-white py-1">
                <span>45°</span>
                <span>37°</span>
                <span>20°</span>
              </div>
            </div>
          )}

          {/* FEED 2: DRONE OPTICAL & LiDAR DEPTH */}
          {activePipFeed === 'DRONE_OPTICAL' && (
            <div className="absolute inset-0 bg-[#06101e] flex items-center justify-center scanline-effect overflow-hidden">
              {/* Drone LiDAR Grid Cone Lines */}
              <div className="w-full h-full border border-cyan-500/30 grid grid-cols-6 grid-rows-4 opacity-40" />

              {/* Optical Recon Object Tracking Reticles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-28 h-28 border border-dashed border-cyan-400 rounded-lg flex items-center justify-center animate-pulse">
                  <span className="absolute -top-4 text-[8px] bg-cyan-950 text-cyan-300 px-1 rounded border border-cyan-700">
                    NORTH SECTOR FRACTURE (A)
                  </span>
                </div>
              </div>

              {/* Optical Telemetry Watermark */}
              <div className="absolute top-2 left-2 text-[9px] text-cyan-400 bg-slate-950/80 px-1 rounded border border-cyan-900">
                LiDAR: 420k pts/s | ALT: {telemetry.drone.altitude.toFixed(1)}m
              </div>
            </div>
          )}

          {/* Center Tactical Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
            <Crosshair className="w-12 h-12 text-cyan-400/70" />
          </div>

          {/* Artificial Horizon Pitch Indicators */}
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-40">
            <div className="w-6 h-[1px] bg-cyan-400" />
            <div className="w-6 h-[1px] bg-cyan-400" />
          </div>

          {/* Bottom Video Telemetry HUD */}
          <div className="absolute bottom-1 left-2 right-2 flex items-center justify-between text-[8px] text-slate-300 bg-slate-950/80 p-1 rounded border border-slate-800 pointer-events-none">
            <div className="flex items-center gap-1.5">
              <Radio className="w-2.5 h-2.5 text-emerald-400" />
              <span>RF LINK: 98%</span>
              <span>|</span>
              <Compass className="w-2.5 h-2.5 text-cyan-400" />
              <span>HDG: 042°</span>
            </div>

            {/* Zoom Selector */}
            <div className="flex items-center gap-1 pointer-events-auto">
              {(['1X', '2X', '4X'] as const).map((z) => (
                <button
                  key={z}
                  onClick={() => setZoom(z)}
                  className={`px-1 rounded text-[8px] font-bold ${
                    zoom === z ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
