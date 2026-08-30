import React from 'react';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import { MissionTimelineScrubber } from '../timeline/MissionTimelineScrubber';
import {
  Satellite,
  Plane,
  Cpu,
  Bot,
  Brain,
  Glasses,
  Printer,
  ChevronRight,
  Radio,
} from 'lucide-react';

export const BottomControlBar: React.FC = () => {
  const missionPhase = useRescueTwinStore((s) => s.missionPhase);
  const techStatus = useRescueTwinStore((s) => s.techStatus);
  const events = useRescueTwinStore((s) => s.events);
  const isInterviewMode = useRescueTwinStore((s) => s.isInterviewMode);
  const setSelected = useRescueTwinStore((s) => s.setSelectedElement);

  const stages = [
    { id: 'SENSE', label: '1. SENSE', sub: 'Multi-Modal Ingest' },
    { id: 'UNDERSTAND', label: '2. UNDERSTAND', sub: 'Digital Twin Mesh' },
    { id: 'PREDICT', label: '3. PREDICT', sub: 'AI Risk Inference' },
    { id: 'ACT', label: '4. ACT', sub: 'Robotics & AR' },
    { id: 'ADAPT', label: '5. ADAPT', sub: '3D Rapid Tooling' },
    { id: 'REPEAT', label: '6. REPEAT', sub: 'Continuous Loop' },
  ];

  const getTechIcon = (iconName: string) => {
    switch (iconName) {
      case 'Satellite': return <Satellite className="w-3.5 h-3.5" />;
      case 'Plane': return <Plane className="w-3.5 h-3.5" />;
      case 'Cpu': return <Cpu className="w-3.5 h-3.5" />;
      case 'Bot': return <Bot className="w-3.5 h-3.5" />;
      case 'Brain': return <Brain className="w-3.5 h-3.5" />;
      case 'Glasses': return <Glasses className="w-3.5 h-3.5" />;
      case 'Printer': return <Printer className="w-3.5 h-3.5" />;
      default: return <Radio className="w-3.5 h-3.5" />;
    }
  };

  const latestEvent = events[0];

  return (
    <footer className="bg-[#070b16] border-t border-cyan-900/50 flex flex-col z-30 select-none">
      {/* 1. INTERACTIVE MISSION TIMELINE SCRUBBER ("TIME MACHINE") */}
      <MissionTimelineScrubber />

      {/* 2. CONTINUOUS 6-STAGE CLOSED-LOOP ENGINE BAR */}
      <div className="bg-[#050811] px-4 py-1.5 border-b border-cyan-950/60 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] font-mono text-slate-500 font-bold">CLOSED LOOP:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-1 justify-center max-w-4xl">
          {stages.map((stg, idx) => {
            const isActive = missionPhase === stg.id;
            return (
              <React.Fragment key={stg.id}>
                <div
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.6)] animate-pulse'
                      : 'bg-slate-900/60 border border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-semibold">{stg.label}</span>
                </div>
                {idx < stages.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Latest Stream Event Marquee */}
        {latestEvent && (
          <div className="hidden lg:flex items-center gap-2 max-w-xs shrink-0 text-[11px] font-mono text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span className="text-cyan-400 font-semibold shrink-0">[{latestEvent.source}]:</span>
            <span className="truncate">{latestEvent.title}</span>
          </div>
        )}
      </div>

      {/* 3. 7 CORE DISASTER TECHNOLOGIES STATUS GRID */}
      <div className="px-3 py-1.5 grid grid-cols-7 gap-1.5 text-xs font-mono bg-[#070b16]">
        {techStatus.map((t) => {
          const isWarning = t.status === 'WARNING';
          const isActive = t.status === 'ACTIVE' || t.status === 'AIRBORNE' || t.status === 'SCANNING';
          return (
            <div
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`p-1.5 px-2 rounded-md border flex items-center justify-between cursor-pointer transition-all ${
                isWarning
                  ? 'bg-red-950/40 border-red-500/80 text-red-200 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                  : isActive
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                  : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className={isWarning ? 'text-red-400' : isActive ? 'text-cyan-400' : 'text-slate-400'}>
                  {getTechIcon(t.icon)}
                </span>
                <div className="truncate">
                  <div className="font-bold text-[10px] truncate leading-tight">{t.label}</div>
                  <div className="text-[8px] text-slate-400 truncate">{t.metric}</div>
                </div>
              </div>
              <span className={`text-[8px] px-1 py-0.2 rounded font-extrabold ${
                isWarning ? 'bg-red-500 text-white' : isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {t.status}
              </span>
            </div>
          );
        })}
      </div>

      {isInterviewMode && (
        <div className="bg-purple-950/90 border-t border-purple-800/80 px-4 py-1 flex items-center justify-between text-[10px] font-mono text-purple-200">
          <span className="font-bold flex items-center gap-1">
            <Brain className="w-3 h-3 text-purple-400" />
            INTERVIEW ARCHITECTURAL ADVANTAGE:
          </span>
          <span>Scrubber continuously evaluates spatial states without full page re-renders using WebGL instancing.</span>
        </div>
      )}
    </footer>
  );
};
