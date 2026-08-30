import React, { useEffect } from 'react';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Volume2,
  VolumeX,
  Server,
  Radio,
} from 'lucide-react';

export const Header: React.FC = () => {
  const systemStatus = useRescueTwinStore((s) => s.systemStatus);
  const missionTimeSec = useRescueTwinStore((s) => s.missionTimeSec);
  const isDemoRunning = useRescueTwinStore((s) => s.isDemoRunning);
  const isInterviewMode = useRescueTwinStore((s) => s.isInterviewMode);
  const soundEnabled = useRescueTwinStore((s) => s.soundEnabled);
  const tickMissionTime = useRescueTwinStore((s) => s.tickMissionTime);
  const startDemo = useRescueTwinStore((s) => s.startDemo);
  const pauseDemo = useRescueTwinStore((s) => s.pauseDemo);
  const resetMission = useRescueTwinStore((s) => s.resetMission);
  const toggleInterviewMode = useRescueTwinStore((s) => s.toggleInterviewMode);
  const toggleSound = useRescueTwinStore((s) => s.toggleSound);
  const setArchitectureModal = useRescueTwinStore((s) => s.setArchitectureModal);

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      tickMissionTime();
    }, 1000);
    return () => clearInterval(timer);
  }, [tickMissionTime]);

  // Format mission time
  const formatTime = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isCritical = systemStatus === 'CRITICAL_HAZARD';

  return (
    <header className="h-14 bg-[#0a0f1d] border-b border-cyan-900/40 px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Brand & Identity */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Activity className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-tech text-xl font-bold tracking-widest text-slate-100 uppercase">
                RESCUE<span className="text-cyan-400">TWIN</span>
              </h1>
              <span className="text-[10px] font-mono font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 px-1.5 py-0.2 rounded">
                v2.4 PROTOTYPE
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 tracking-wider">
              AUTONOMOUS DISASTER DIGITAL TWIN // MULTI-SOURCE RESCUE
            </div>
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="h-6 w-[1px] bg-slate-800 hidden md:block" />

        {/* Mission Context */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-400">SCENARIO:</span>
            <span className="text-slate-200 font-semibold">NEPAL 7.8M QUAKE — SECTOR 4</span>
          </div>
        </div>
      </div>

      {/* Center Status Badges */}
      <div className="flex items-center gap-3">
        {/* System Status Indicator */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded border text-xs font-mono transition-all ${
          isCritical
            ? 'bg-red-950/90 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse'
            : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className="font-semibold">
            STATUS: {isCritical ? 'CRITICAL STRUCTURAL HAZARD' : 'OPERATIONAL'}
          </span>
        </div>

        {/* Mission Clock */}
        <div className="bg-slate-900/90 border border-slate-700/80 px-3 py-1 rounded font-mono text-xs text-slate-200 flex items-center gap-2">
          <span className="text-slate-500">T+:</span>
          <span className="font-bold text-cyan-300 tracking-wider">{formatTime(missionTimeSec)}</span>
        </div>
      </div>

      {/* Right Controls & Demo Triggers */}
      <div className="flex items-center gap-2">
        {/* Interactive Demo Mode Button */}
        <button
          onClick={isDemoRunning ? pauseDemo : startDemo}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all shadow-md ${
            isDemoRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/30 animate-pulse'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/30'
          }`}
        >
          {isDemoRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isDemoRunning ? 'PAUSE DEMO (45s)' : 'START DEMO'}</span>
        </button>

        {/* Reset Mission */}
        <button
          onClick={resetMission}
          title="Reset simulation state to nominal"
          className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-mono text-[11px]">RESET</span>
        </button>

        {/* Interview Mode Toggle */}
        <button
          onClick={toggleInterviewMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono transition-all border ${
            isInterviewMode
              ? 'bg-purple-950/90 border-purple-500 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-semibold">{isInterviewMode ? 'INTERVIEW MODE: ON' : 'INTERVIEW MODE'}</span>
        </button>

        {/* Architecture Modal Button */}
        <button
          onClick={() => setArchitectureModal(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500/60 text-cyan-300 text-xs font-mono transition-colors"
        >
          <Server className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">ARCHITECTURE</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
        </button>
      </div>
    </header>
  );
};
