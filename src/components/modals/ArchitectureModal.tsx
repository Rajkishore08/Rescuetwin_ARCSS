import React from 'react';
import { useRescueTwinStore } from '../../state/rescueTwinStore';
import { X, Server, Layers, Cpu, Radio, Shield, Network } from 'lucide-react';

export const ArchitectureModal: React.FC = () => {
  const isOpen = useRescueTwinStore((s) => s.architectureModalOpen);
  const setOpen = useRescueTwinStore((s) => s.setArchitectureModal);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none">
      <div className="w-full max-w-4xl bg-[#0b1222] border border-cyan-500/40 rounded-xl shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900/90 border-b border-cyan-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="font-tech text-lg font-bold tracking-wider text-slate-100 uppercase">
                RESCUETWIN // SYSTEM ARCHITECTURE SPECIFICATION
              </h2>
              <p className="text-xs font-mono text-cyan-400">
                PROTOTYPE LOCAL PIPELINE vs PRODUCTION EDGE FUSION STACK
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 font-mono text-xs">
          {/* Mission Core Value */}
          <div className="p-3.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <div className="text-cyan-300 font-bold text-sm font-tech tracking-wider">
                CORE VALUE PROPOSITION:
              </div>
              <div className="text-slate-200 mt-0.5">
                "We don't just map the disaster. We model how it is continuously changing."
              </div>
            </div>
            <div className="text-right text-[11px] text-cyan-400 hidden sm:block">
              SEE THE UNSEEN.<br />PREDICT THE UNSAFE.<br />RESCUE SMARTER.
            </div>
          </div>

          {/* Architecture Pipeline Flow Diagram */}
          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              END-TO-END DATA FUSION & INGESTION PIPELINE
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[11px]">
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800 flex flex-col gap-1">
                <div className="text-cyan-400 font-bold flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5" />
                  1. SENSING LAYER
                </div>
                <div className="text-slate-400 text-[10px]">
                  • IoT Mesh (Vibration, Gas, Temp)<br />
                  • Aerial Drone (LiDAR + RGB)<br />
                  • Ground Robot (FLIR + Biometric)<br />
                  • Satellite InSAR / SAR
                </div>
              </div>

              <div className="p-3 rounded bg-slate-900/80 border border-slate-800 flex flex-col gap-1">
                <div className="text-amber-400 font-bold flex items-center gap-1">
                  <Server className="w-3.5 h-3.5" />
                  2. INGESTION & BROKER
                </div>
                <div className="text-slate-400 text-[10px]">
                  • MQTT Broker (EMQX / Mosquitto)<br />
                  • FastAPI Ingestion Gateway<br />
                  • Data Validation & Smoothing<br />
                  • TimescaleDB + PostGIS GeoDB
                </div>
              </div>

              <div className="p-3 rounded bg-slate-900/80 border border-slate-800 flex flex-col gap-1">
                <div className="text-purple-400 font-bold flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" />
                  3. AI INFERENCE & TWIN
                </div>
                <div className="text-slate-400 text-[10px]">
                  • Graph Neural Network (GNN)<br />
                  • Structural FEM Stress Solver<br />
                  • Multi-Objective Cost Router<br />
                  • 3D Spatial Deformation Mesh
                </div>
              </div>

              <div className="p-3 rounded bg-slate-900/80 border border-slate-800 flex flex-col gap-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  4. ACTUATION & AR
                </div>
                <div className="text-slate-400 text-[10px]">
                  • Low-Latency WebSockets<br />
                  • WebGL / Three.js Command Center<br />
                  • Responder AR Glass Projection<br />
                  • Adaptive 3D Tool Slicing
                </div>
              </div>
            </div>
          </div>

          {/* Prototype vs Production Comparison Table */}
          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              IMPLEMENTATION SPECIFICATION
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-900/90 text-cyan-300 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">SUBSYSTEM</th>
                    <th className="p-2.5">THIS PROTOTYPE (DEMO MODE)</th>
                    <th className="p-2.5">PRODUCTION SCALE SPEC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-200">Ingestion / Pub-Sub</td>
                    <td className="p-2.5 text-cyan-300">Synchronized State Engine & Micro-Timers</td>
                    <td className="p-2.5 text-slate-400">MQTT Broker (QoS 1) + Kafka Stream Processor</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-200">AI Risk Engine</td>
                    <td className="p-2.5 text-cyan-300">Multi-factor deterministic decomposition</td>
                    <td className="p-2.5 text-slate-400">Physics-Informed GNN + Bayesian Hazard Estimator</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-200">Route Optimization</td>
                    <td className="p-2.5 text-cyan-300">Multi-objective heuristic cost function</td>
                    <td className="p-2.5 text-slate-400">Dynamic A* / RRT* with probabilistic risk penalties</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-200">3D Digital Twin</td>
                    <td className="p-2.5 text-cyan-300">Three.js / React Three Fiber GPU Shaders</td>
                    <td className="p-2.5 text-slate-400">WebGPU Digital Twin + Unreal Engine 5 Pixel Streaming</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-200">AR Guidance</td>
                    <td className="p-2.5 text-cyan-300">Synthetic WebGL spatial viewport overlay</td>
                    <td className="p-2.5 text-slate-400">WebXR / OpenXR for Magic Leap 2 / Apple Vision Pro</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-200">3D Tool Manufacturing</td>
                    <td className="p-2.5 text-cyan-300">Simulated additive tool progress & mounting</td>
                    <td className="p-2.5 text-slate-400">OctoPrint API / Klipper direct G-code fabrication</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono">
            Designed for Aerospace & Disaster Operations Command Briefings
          </div>
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs shadow-md transition-colors"
          >
            RETURN TO COMMAND CENTER
          </button>
        </div>
      </div>
    </div>
  );
};
