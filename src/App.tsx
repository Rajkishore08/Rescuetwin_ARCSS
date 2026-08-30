import React, { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { TelemetryLeftPanel } from './components/telemetry/TelemetryLeftPanel';
import { DigitalTwinCanvas } from './components/scene/DigitalTwinCanvas';
import { AIEngineRightPanel } from './components/ai/AIEngineRightPanel';
import { BottomControlBar } from './components/status/BottomControlBar';
import { ArchitectureModal } from './components/modals/ArchitectureModal';
import { TacticalInspectorDrawer } from './components/inspector/TacticalInspectorDrawer';
import { TacticalPipCamera } from './components/camera/TacticalPipCamera';
import { useRescueTwinStore } from './state/rescueTwinStore';

export const App: React.FC = () => {
  const is3DFullscreen = useRescueTwinStore((s) => s.is3DFullscreen);
  const toggle3DFullscreen = useRescueTwinStore((s) => s.toggle3DFullscreen);
  const tickMissionTime = useRescueTwinStore((s) => s.tickMissionTime);

  // Global Mission Timer Tick
  useEffect(() => {
    const timer = setInterval(() => {
      tickMissionTime();
    }, 1000);
    return () => clearInterval(timer);
  }, [tickMissionTime]);

  // ESC key exits Fullscreen 3D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && is3DFullscreen) {
        toggle3DFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [is3DFullscreen, toggle3DFullscreen]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#060911] text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. TOP HEADER & TELEMETRY STATUS BAR */}
      <Header />

      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT COLUMN: Multi-Source Sensor Feeds & Triggers */}
        <TelemetryLeftPanel />

        {/* CENTER COLUMN: Interactive 3D Digital Twin Simulation */}
        <main className="flex-1 h-full relative overflow-hidden">
          <DigitalTwinCanvas />
          {/* Floating Picture-in-Picture Tactical Camera Feed */}
          <TacticalPipCamera />
        </main>

        {/* RIGHT COLUMN: AI Inference & Decision Engine */}
        <AIEngineRightPanel />
      </div>

      {/* 3. BOTTOM CONTROL BAR: Timeline Scrubber, Closed Loop Cycle & 7 Tech Status */}
      <BottomControlBar />

      {/* 4. ARCHITECTURAL & TECHNICAL MODAL */}
      <ArchitectureModal />

      {/* 5. TACTICAL DEEP-DIVE INSPECTOR DRAWER */}
      <TacticalInspectorDrawer />
    </div>
  );
};

export default App;
