import React from 'react';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Activity,
  Droplet,
  Bot,
  Plane,
  Printer,
  Glasses,
} from 'lucide-react';

export const MissionTimelineScrubber: React.FC = () => {
  const timelineSec = useRescueTwinStore((s) => s.timelineSec);
  const setTimelineSec = useRescueTwinStore((s) => s.setTimelineSec);
  const isDemoRunning = useRescueTwinStore((s) => s.isDemoRunning);
  const startDemo = useRescueTwinStore((s) => s.startDemo);
  const pauseDemo = useRescueTwinStore((s) => s.pauseDemo);
  const resetMission = useRescueTwinStore((s) => s.resetMission);

  const milestones = [
    { sec: 0, label: '00:00 INTACT', icon: Clock, color: 'text-slate-300' },
    { sec: 6, label: '00:06 DRONE', icon: Plane, color: 'text-cyan-400' },
    { sec: 12, label: '00:12 QUAKE', icon: Activity, color: 'text-red-400' },
    { sec: 20, label: '00:20 FLOOD', icon: Droplet, color: 'text-blue-400' },
    { sec: 28, label: '00:28 ROBOT', icon: Bot, color: 'text-emerald-400' },
    { sec: 36, label: '00:36 AR HUD', icon: Glasses, color: 'text-purple-400' },
    { sec: 42, label: '00:42 PRINT', icon: Printer, color: 'text-cyan-300' },
  ];

  const formatTimeline = (sec: number) => {
    const s = Math.floor(sec);
    return `00:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-[#080d1a] border-t border-cyan-900/40 p-2 px-4 flex flex-col gap-1.5 select-none font-mono text-xs shadow-inner">
      {/* Top Scrubber Controls & Keyframes */}
      <div className="flex items-center justify-between gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={isDemoRunning ? pauseDemo : startDemo}
            className={`px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all border ${
              isDemoRunning
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
            }`}
          >
            {isDemoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isDemoRunning ? 'PAUSE TIMELINE' : 'PLAY TIMELINE'}</span>
          </button>

          <button
            onClick={resetMission}
            className="p-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 text-[11px] transition-colors"
            title="Reset to 00:00 Normal Intact State"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-0.5 rounded border border-cyan-900/60 text-cyan-300 font-bold">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span className="text-[12px]">{formatTimeline(timelineSec)}</span>
            <span className="text-[9px] text-slate-500">/ 00:45</span>
          </div>
        </div>

        {/* Milestone Keyframe Quick-Jump Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[10px] text-slate-500 uppercase font-semibold hidden md:inline">KEYFRAMES:</span>
          {milestones.map((m) => {
            const Icon = m.icon;
            const isCurrent = Math.abs(timelineSec - m.sec) <= 3;
            return (
              <button
                key={m.sec}
                onClick={() => setTimelineSec(m.sec)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all border whitespace-nowrap ${
                  isCurrent
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                    : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-2.5 h-2.5 ${m.color}`} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Time Slider Track */}
      <div className="relative w-full flex items-center group py-1">
        <input
          type="range"
          min="0"
          max="45"
          step="0.2"
          value={timelineSec}
          onChange={(e) => setTimelineSec(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none border border-slate-800 shadow-inner"
        />

        {/* Milestone Marker Dots along Track */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-1">
          {milestones.map((m) => (
            <div
              key={m.sec}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                timelineSec >= m.sec ? 'bg-cyan-400 shadow-[0_0_6px_rgba(0,240,255,0.8)]' : 'bg-slate-700'
              }`}
              style={{ left: `${(m.sec / 45) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
