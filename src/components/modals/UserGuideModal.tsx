import React, { useState } from 'react';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import {
  X,
  BookOpen,
  CheckCircle2,
  Play,
  Bot,
  Plane,
  Radio,
  Eye,
  Crosshair,
  Printer,
  Droplet,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  MousePointer,
  Move,
  ZoomIn,
} from 'lucide-react';

export const UserGuideModal: React.FC = () => {
  const isOpen = useRescueTwinStore((s) => s.guideModalOpen);
  const setOpen = useRescueTwinStore((s) => s.setGuideModalOpen);
  const startDemo = useRescueTwinStore((s) => s.startDemo);
  const resetMission = useRescueTwinStore((s) => s.resetMission);
  const triggerDroneScan = useRescueTwinStore((s) => s.triggerDroneScan);
  const triggerSensorSpike = useRescueTwinStore((s) => s.triggerSensorSpike);
  const triggerFlashFlood = useRescueTwinStore((s) => s.triggerFlashFlood);
  const triggerRobotExploration = useRescueTwinStore((s) => s.triggerRobotExploration);
  const triggerAiRecalculate = useRescueTwinStore((s) => s.triggerAiRecalculate);
  const trigger3DPrint = useRescueTwinStore((s) => s.trigger3DPrint);
  const toggleArMode = useRescueTwinStore((s) => s.toggleArMode);
  const setCameraPreset = useRescueTwinStore((s) => s.setCameraPreset);
  const setTimelineSec = useRescueTwinStore((s) => s.setTimelineSec);

  const [activeTab, setActiveTab] = useState<'QUICKSTART' | 'STEPS' | 'CONTROLS' | 'FAQ'>('STEPS');
  const [activeStep, setActiveStep] = useState<number>(0);

  if (!isOpen) return null;

  const demoSteps = [
    {
      title: 'Step 1: Baseline Intact State',
      time: '00:00',
      icon: Radio,
      badge: 'NORMAL BASELINE',
      color: 'text-cyan-400',
      description:
        'The 5-storey commercial building is structurally sound (100% integrity). 24 IoT sensors monitor baseline vibration (1.2 mm/s), and satellite InSAR confirms ground stability.',
      actionLabel: 'Load Intact Baseline',
      onTrigger: () => {
        resetMission();
        setTimelineSec(0);
        setCameraPreset('COMMAND');
      },
    },
    {
      title: 'Step 2: Aerial Drone Photogrammetry Scan',
      time: '00:06',
      icon: Plane,
      badge: 'DRONE AIRBORNE',
      color: 'text-sky-400',
      description:
        'The autonomous quadcopter drone takes off and flies a 360° orbit around the building, collecting 420,000 LiDAR points per second to generate a high-density 3D digital surface.',
      actionLabel: 'Launch Drone Scan',
      onTrigger: () => {
        triggerDroneScan();
        setTimelineSec(6);
        setCameraPreset('AERIAL');
      },
    },
    {
      title: 'Step 3: Earthquake Shockwave & Fracture',
      time: '00:12',
      icon: ShieldAlert,
      badge: 'SEISMIC FRACTURE',
      color: 'text-red-400',
      description:
        'An aftershock hits! Columns buckle, Floor 3 & 4 slabs crack and drop, North wall panels tumble, and internal rebar wires burst out piece-by-piece. Structural integrity drops to 42%.',
      actionLabel: 'Trigger Earthquake Collapse',
      onTrigger: () => {
        triggerSensorSpike();
        setTimelineSec(12);
        setCameraPreset('BUILDING');
      },
    },
    {
      title: 'Step 4: Flash Flood Inundation Surge',
      time: '00:20',
      icon: Droplet,
      badge: 'WATER SURGE +1.85m',
      color: 'text-blue-400',
      description:
        'A +1.85m hydrodynamic water surge rushes in at 3.4 m/s. Lower foundation scours, causing the building to sink down, completely submerging Route C on the south ground.',
      actionLabel: 'Trigger Flash Flood',
      onTrigger: () => {
        triggerFlashFlood();
        setTimelineSec(20);
        setCameraPreset('COMMAND');
      },
    },
    {
      title: 'Step 5: Robot POV & Survivor Heat Detection',
      time: '00:28',
      icon: Bot,
      badge: 'ROBOT POV COCKPIT',
      color: 'text-emerald-400',
      description:
        'ROBOT-01 crawls into the dark basement rubble. Look through the robot\'s first-person POV to see cracked pillars, rebar cages, and the glowing 37.2°C body temperature of a trapped survivor.',
      actionLabel: 'Enter Robot First-Person POV',
      onTrigger: () => {
        triggerRobotExploration();
        setTimelineSec(28);
        setCameraPreset('ROBOT_POV');
      },
    },
    {
      title: 'Step 6: AI Dynamic Route Optimization',
      time: '00:34',
      icon: Crosshair,
      badge: 'AI ROUTE ENGINE',
      color: 'text-amber-400',
      description:
        'The AI recalculates extraction paths: Route A is REJECTED (collapse danger), Route C is REJECTED (submerged in flood), and Route B (East Shear Wall) is designated as the OPTIMAL path.',
      actionLabel: 'Calculate Safe Path',
      onTrigger: () => {
        triggerAiRecalculate();
        setTimelineSec(34);
        setCameraPreset('COMMAND');
      },
    },
    {
      title: 'Step 7: AR Spatial HUD & 3D Rapid Print',
      time: '00:42',
      icon: Printer,
      badge: 'AR + 3D TOOLING',
      color: 'text-purple-400',
      description:
        'Turn on Augmented Reality green guidance corridors for rescue teams, while the on-site mobile 3D printer manufactures a carbon-fiber rebar spreader to hold up broken beams.',
      actionLabel: 'Deploy AR & 3D Print Tool',
      onTrigger: () => {
        toggleArMode();
        trigger3DPrint();
        setTimelineSec(42);
        setCameraPreset('ROBOT');
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md select-none font-mono">
      <div className="w-full max-w-4xl bg-[#0b1222] border border-cyan-500/50 rounded-2xl shadow-[0_0_60px_rgba(0,240,255,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 px-6 bg-slate-900/90 border-b border-cyan-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <BookOpen className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-tech text-lg font-bold tracking-wider text-slate-100 uppercase">
                  RESCUETWIN // INTERACTIVE USER & DEMO GUIDE
                </h2>
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                  BEGINNER FRIENDLY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Learn how everything works and follow the step-by-step presentation script
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-slate-800 bg-slate-950/60 text-xs">
          {[
            { id: 'STEPS', label: '🎬 STEP-BY-STEP LIVE DEMO' },
            { id: 'QUICKSTART', label: '⚡ 30-SEC SUMMARY' },
            { id: 'CONTROLS', label: '🎮 3D CONTROLS CHEATSHEET' },
            { id: 'FAQ', label: '💡 COMMON QUESTIONS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 font-bold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs flex-1">
          {/* TAB 1: STEP-BY-STEP LIVE DEMO */}
          {activeTab === 'STEPS' && (
            <div className="space-y-6">
              <div className="bg-cyan-950/40 border border-cyan-500/30 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-cyan-300 font-bold text-sm">
                    Interactive Walkthrough Mode
                  </div>
                  <div className="text-slate-300 text-[11px] mt-0.5">
                    Click any step below to automatically trigger the 3D action, adjust camera angles, and test the digital twin!
                  </div>
                </div>
                <button
                  onClick={() => {
                    startDemo();
                    setOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>RUN FULL 45s AUTO DEMO</span>
                </button>
              </div>

              {/* Step Pills Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
                {demoSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isActive = activeStep === idx;
                  return (
                    <button
                      key={`step-btn-${idx}`}
                      onClick={() => setActiveStep(idx)}
                      className={`p-2 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                        isActive
                          ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)] ring-1 ring-cyan-400'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500">
                          0{idx + 1}
                        </span>
                        <StepIcon className={`w-3.5 h-3.5 ${step.color}`} />
                      </div>
                      <span className={`text-[10px] font-bold line-clamp-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {step.title.split(':')[1] || step.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Step Showcase Card */}
              {(() => {
                const current = demoSteps[activeStep];
                const StepIcon = current.icon;
                return (
                  <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                          <StepIcon className={`w-5 h-5 ${current.color}`} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-100">
                            {current.title}
                          </div>
                          <div className="text-[11px] text-cyan-400">
                            TIMECODE: {current.time} | STATUS: {current.badge}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          current.onTrigger();
                          setOpen(false);
                        }}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all hover:scale-105"
                      >
                        <Sparkles className="w-4 h-4 fill-current" />
                        <span>{current.actionLabel}</span>
                      </button>
                    </div>

                    <div className="text-slate-200 text-xs leading-relaxed">
                      {current.description}
                    </div>

                    {/* What to say prompt */}
                    <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg">
                      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">
                        🎙️ Presentation Speech Tip:
                      </div>
                      <p className="text-[11px] text-slate-300 italic">
                        "{current.description}"
                      </p>
                    </div>

                    {/* Step Navigation Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                        className="px-3 py-1.5 rounded bg-slate-800 disabled:opacity-30 text-slate-300 text-xs"
                      >
                        ← Previous Step
                      </button>

                      <span className="text-[11px] text-slate-500">
                        Step {activeStep + 1} of {demoSteps.length}
                      </span>

                      <button
                        disabled={activeStep === demoSteps.length - 1}
                        onClick={() => setActiveStep((prev) => Math.min(demoSteps.length - 1, prev + 1))}
                        className="px-3 py-1.5 rounded bg-cyan-950 border border-cyan-600/60 text-cyan-300 text-xs font-bold flex items-center gap-1 hover:bg-cyan-900"
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 2: 30-SEC SUMMARY */}
          {activeTab === 'QUICKSTART' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-cyan-950/60 border border-cyan-500/40 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  What is RESCUETWIN in 30 Seconds?
                </h3>
                <p className="text-slate-200 text-xs leading-relaxed">
                  RESCUETWIN is a real-time 3D Digital Twin that protects first responders during earthquakes and floods. 
                  It connects flying drones, crawling robots, satellites, and structural sensors into one live map. 
                  When buildings shake or water rises, it calculates the safest rescue routes and deploys 3D-printed tools to hold up collapsing beams.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    1. Real-Time 3D Synchrony
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Columns buckle, slabs fracture piece-by-piece, and flood waters rise in real time based on live sensor data.
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Bot className="w-4 h-4" />
                    2. Ground Robot POV & FLIR Thermal
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    ROBOT-01 crawls into dark rubble voids to pinpoint trapped survivor body heat (37.2°C) via false-color thermal vision.
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Crosshair className="w-4 h-4" />
                    3. Dynamic AI Route Calculation
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    AI rejects damaged or submerged corridors and highlights the safest extraction route for rescue crews.
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-purple-400 flex items-center gap-1.5">
                    <Printer className="w-4 h-4" />
                    4. Adaptive 3D Rapid Tooling
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    3D prints carbon-fiber shoring braces directly on-site to stabilize unstable concrete slabs.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 3D CONTROLS CHEATSHEET */}
          {activeTab === 'CONTROLS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/40 mx-auto flex items-center justify-center text-cyan-400">
                    <MousePointer className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-slate-200">Rotate (360° Orbit)</div>
                  <div className="text-slate-400 text-[11px]">
                    Hold <span className="text-cyan-300 font-bold">Left Mouse Button</span> and drag anywhere to smoothly rotate around the disaster scene.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/40 mx-auto flex items-center justify-center text-cyan-400">
                    <Move className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-slate-200">Pan View</div>
                  <div className="text-slate-400 text-[11px]">
                    Hold <span className="text-cyan-300 font-bold">Right Mouse Button</span> (or two-finger drag) to move the viewport left/right/up/down.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/40 mx-auto flex items-center justify-center text-cyan-400">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-slate-200">Zoom In & Out</div>
                  <div className="text-slate-400 text-[11px]">
                    Use the <span className="text-cyan-300 font-bold">Mouse Scroll Wheel</span> or the bottom-right Zoom Slider (6m to 38m).
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2">
                <div className="font-bold text-cyan-300 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Click Any Object to Inspect Its Data
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  By default, 3D text labels are kept <span className="text-white font-bold">OFF</span> for a clean view. 
                  When you click on any building, drone, ground rover, sensor node, or colored route line, its data tag pops up instantly!
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: COMMON QUESTIONS */}
          {activeTab === 'FAQ' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-slate-200">
                  Q: Is this a static pre-rendered animation or a live 3D engine?
                </div>
                <div className="text-slate-400 text-[11px]">
                  A: It is a live WebGL 3D simulation running in real-time in your browser using Three.js and React. You can freely rotate, zoom, and interact with all elements anytime.
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-slate-200">
                  Q: How does the AI decide which path is safe?
                </div>
                <div className="text-slate-400 text-[11px]">
                  A: It calculates Cost = (Distance × 0.8) + (Structural Risk × 2.2) + Flood Penalty. Routes above 60% risk or under water are rejected automatically.
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-slate-200">
                  Q: What is the Canva link for?
                </div>
                <div className="text-slate-400 text-[11px]">
                  A: It links to our official project pitch deck: <a href="https://canva.link/eq7jq85dahr7hj1" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">canva.link/eq7jq85dahr7hj1</a>.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Ready for presentation & live demonstration</span>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            GOT IT / CLOSE GUIDE
          </button>
        </div>
      </div>
    </div>
  );
};
