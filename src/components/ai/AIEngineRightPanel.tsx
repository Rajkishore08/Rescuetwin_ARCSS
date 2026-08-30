import React from 'react';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import {
  Brain,
  ShieldAlert,
  UserCheck,
  TrendingUp,
  Cpu,
  Eye,
  Printer,
  ChevronRight,
  CheckCircle,
  XCircle,
  Code2,
} from 'lucide-react';

export const AIEngineRightPanel: React.FC = () => {
  const aiEngine = useRescueTwinStore((s) => s.aiEngine);
  const routes = useRescueTwinStore((s) => s.routes);
  const printing = useRescueTwinStore((s) => s.printing);
  const arMode = useRescueTwinStore((s) => s.digitalTwin.arMode);
  const isInterviewMode = useRescueTwinStore((s) => s.isInterviewMode);

  const triggerAiRecalculate = useRescueTwinStore((s) => s.triggerAiRecalculate);
  const toggleArMode = useRescueTwinStore((s) => s.toggleArMode);
  const trigger3DPrint = useRescueTwinStore((s) => s.trigger3DPrint);

  const isCriticalRisk = aiEngine.structuralRiskPct > 60;
  const isPrinting = printing.status === 'PRINTING';

  return (
    <aside className="w-88 xl:w-96 h-full bg-[#0a0f1d]/95 border-l border-cyan-900/30 flex flex-col overflow-y-auto select-none z-20 tech-panel">
      {/* Panel Header */}
      <div className="p-3 border-b border-cyan-900/40 flex items-center justify-between tech-panel-header">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyan-400" />
          <span className="font-tech text-sm font-bold tracking-wider text-slate-100 uppercase">
            AI DECISION & ROUTE ENGINE
          </span>
        </div>
        <span className="text-[10px] font-mono bg-blue-950 text-cyan-300 border border-cyan-700/60 px-1.5 py-0.5 rounded">
          SIMULATED INFERENCE
        </span>
      </div>

      {/* Interactive Action Control Section */}
      <div className="p-3 border-b border-cyan-900/30 bg-slate-950/60 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            DECISION ENGINE ACTIONS
          </span>
          <span className="text-[9px] font-mono text-cyan-400/80">REACTIVE PIPELINE</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={triggerAiRecalculate}
            className="px-2 py-2 rounded text-xs font-mono font-bold flex flex-col items-center gap-1 transition-all border bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-cyan-500 text-slate-200 shadow-sm"
          >
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px]">AI RECALCULATE</span>
          </button>

          <button
            onClick={toggleArMode}
            className={`px-2 py-2 rounded text-xs font-mono font-bold flex flex-col items-center gap-1 transition-all border ${
              arMode
                ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-cyan-500 text-slate-200 shadow-sm'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px]">{arMode ? 'AR HUD: ON' : 'AR VIEW'}</span>
          </button>

          <button
            onClick={trigger3DPrint}
            disabled={isPrinting || printing.status === 'DEPLOYED'}
            className={`px-2 py-2 rounded text-xs font-mono font-bold flex flex-col items-center gap-1 transition-all border ${
              isPrinting
                ? 'bg-purple-950 border-purple-400 text-purple-200 animate-pulse'
                : printing.status === 'DEPLOYED'
                ? 'bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-purple-500 text-slate-200 shadow-sm'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px]">3D PRINT TOOL</span>
          </button>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col gap-3">
        {/* 1. CURRENT AI INFERENCE STATE */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-lg p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-xs font-mono font-bold text-slate-200">STATE INFERENCE METRICS</span>
            <span className="text-[10px] font-mono text-cyan-300">
              Confidence: <span className="font-bold">{aiEngine.confidencePct}%</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Structural Risk */}
            <div className={`p-2 rounded border transition-all ${
              isCriticalRisk
                ? 'bg-red-950/80 border-red-500 text-red-100 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                : 'bg-slate-950/70 border-slate-800 text-slate-200'
            }`}>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldAlert className={`w-3 h-3 ${isCriticalRisk ? 'text-red-400' : 'text-amber-400'}`} />
                  Structural Risk
                </span>
              </div>
              <div className="text-2xl font-mono font-bold mt-1 flex items-baseline justify-between">
                <span className={isCriticalRisk ? 'text-red-400 font-extrabold' : 'text-amber-400'}>
                  {aiEngine.structuralRiskPct}%
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">
                  {isCriticalRisk ? 'UNSTABLE' : 'STABLE'}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isCriticalRisk ? 'bg-red-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${aiEngine.structuralRiskPct}%` }}
                />
              </div>
            </div>

            {/* Victim Likelihood */}
            <div className="p-2 rounded bg-slate-950/70 border border-slate-800 text-slate-200">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-cyan-400" />
                  Survivor Likelihood
                </span>
              </div>
              <div className="text-2xl font-mono font-bold mt-1 flex items-baseline justify-between">
                <span className="text-cyan-300 font-extrabold">{aiEngine.victimProbabilityPct}%</span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">LOCALIZED</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${aiEngine.victimProbabilityPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* AI Prediction & Action Recommendation */}
          <div className="p-2 rounded bg-slate-950/80 border border-slate-800/80 flex flex-col gap-1 text-xs font-mono">
            <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              AI PREDICTION:
            </div>
            <p className="text-slate-200 text-[11px] leading-relaxed pl-2.5 border-l border-cyan-500/40">
              "{aiEngine.predictionSummary}"
            </p>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              TACTICAL RECOMMENDATION:
            </div>
            <p className="text-emerald-200 text-[11px] leading-relaxed pl-2.5 border-l border-emerald-500/40 font-medium">
              "{aiEngine.actionRecommendation}"
            </p>
          </div>
        </div>

        {/* 2. DYNAMIC RISK DECOMPOSITION (INTERVIEW TRANSPARENCY) */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-lg p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-200">RISK DECOMPOSITION</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Total: {aiEngine.structuralRiskPct}%</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Vibration Contribution:</span>
              <span className={`font-bold ${aiEngine.riskDecomposition.vibrationContribution > 20 ? 'text-red-400' : 'text-slate-200'}`}>
                +{aiEngine.riskDecomposition.vibrationContribution} pts
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Structural Damage / Disp:</span>
              <span className="text-slate-200 font-bold">+{aiEngine.riskDecomposition.structuralDamage} pts</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Thermal / Temperature:</span>
              <span className="text-slate-200 font-bold">+{aiEngine.riskDecomposition.temperatureContribution} pts</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Hazard / Gas Level:</span>
              <span className="text-slate-200 font-bold">+{aiEngine.riskDecomposition.hazardContribution} pts</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Rate of Debris Instability:</span>
              <span className="text-slate-200 font-bold">+{aiEngine.riskDecomposition.recentRateOfChange} pts</span>
            </div>
          </div>
        </div>

        {/* 3. RESCUE ROUTE OPTIMIZATION MATRIX */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-lg p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-xs font-mono font-bold text-slate-200">RESCUE ROUTE COMPARISON</span>
            <span className="text-[10px] font-mono text-cyan-400">COST OPTIMIZED</span>
          </div>

          <div className="space-y-2">
            {routes.map((route) => {
              const isRec = route.status === 'RECOMMENDED';
              const isRej = route.status === 'REJECTED';

              return (
                <div
                  key={route.id}
                  className={`p-2 rounded border text-xs font-mono transition-all ${
                    isRec
                      ? 'bg-emerald-950/60 border-emerald-500/70 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : isRej
                      ? 'bg-red-950/50 border-red-500/60 opacity-80'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {isRec ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isRej ? (
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                      <span className="font-bold text-slate-100">{route.name}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      isRec
                        ? 'bg-emerald-500 text-slate-950'
                        : isRej
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {route.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 mt-1.5 text-[10px] text-slate-400">
                    <div>Dist: <span className="text-slate-200 font-semibold">{route.distanceMeters}m</span></div>
                    <div>Risk: <span className={`font-bold ${isRej ? 'text-red-400' : 'text-emerald-400'}`}>{route.structuralRiskPct}%</span></div>
                    <div>Cost Score: <span className="text-cyan-300 font-semibold">{route.totalCostScore}</span></div>
                  </div>

                  {route.rejectionReason && (
                    <div className="mt-1 text-[10px] text-red-300/90 bg-red-950/80 p-1 rounded border border-red-800/40">
                      Reason: {route.rejectionReason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interview Explainability Note */}
          {isInterviewMode && (
            <div className="p-2 rounded bg-purple-950/50 border border-purple-800/60 text-[10px] font-mono text-purple-200 flex flex-col gap-1">
              <div className="font-bold text-purple-300 flex items-center gap-1">
                <Code2 className="w-3 h-3" />
                <span>ROUTE COST MATHEMATICAL FORMULATION:</span>
              </div>
              <div>Cost = (0.8 × Distance) + (2.2 × Structural Risk). Route B is prioritized because path safety outweighs raw physical brevity.</div>
            </div>
          )}
        </div>

        {/* 4. ADAPTIVE 3D PRINTING FABRICATION MODULE */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-lg p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Printer className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-mono font-bold text-slate-200">ADAPTIVE 3D PRINTING</span>
            </div>
            <span className={`text-[10px] font-mono px-1 rounded ${
              printing.status === 'DEPLOYED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : printing.status === 'PRINTING'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {printing.status}
            </span>
          </div>

          <div className="flex flex-col gap-1 text-xs font-mono">
            <div className="text-[11px] font-semibold text-slate-200">{printing.name}</div>
            <div className="text-[10px] text-slate-400">Target: {printing.targetUnit} | Mat: {printing.material}</div>
            <div className="text-[10px] text-slate-400">Purpose: {printing.purpose}</div>

            {/* Progress bar */}
            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
              <span>Fabrication Progress:</span>
              <span className="text-purple-300 font-bold">{printing.progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${printing.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 5. AI REASONING TIMELINE */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-lg p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-xs font-mono font-bold text-slate-200">AI REASONING TIMELINE</span>
            <span className="text-[10px] font-mono text-slate-400">CHRONOLOGICAL</span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {aiEngine.reasoningTimeline.map((item, idx) => (
              <div key={idx} className="p-1.5 rounded bg-slate-950/60 border border-slate-800/60 text-[10px] font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">{item.time}</span>
                  <span className={`font-semibold ${
                    item.level === 'critical' ? 'text-red-400' : item.level === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {item.action}
                  </span>
                </div>
                <div className="text-slate-400 mt-0.5">{item.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
