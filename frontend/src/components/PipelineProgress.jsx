import React from 'react';
import { CheckCircle2, Loader2, Sparkles, FileText, BarChart3, Wand2 } from 'lucide-react';

export default function PipelineProgress({ activeStage }) {
  const stages = [
    { id: 1, name: 'Outline Generation', desc: 'Structuring H2/H3 topic hierarchy', icon: FileText },
    { id: 2, name: 'Article Draft', desc: 'Synthesizing article content & code', icon: Sparkles },
    { id: 3, name: 'AI Quality Scoring', desc: 'Evaluating relevance, readability & SEO', icon: BarChart3 },
    { id: 4, name: 'Auto Refinement', desc: 'Refining content based on score feedback', icon: Wand2 },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-indigo-500/30 bg-indigo-950/20 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
            <span>AI Multi-Stage Generation Pipeline Active</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Executing server-side Google Gemini 2.5 Flash orchestration...
          </p>
        </div>
        <span className="text-xs font-mono text-indigo-300 bg-indigo-900/60 border border-indigo-500/30 px-3 py-1 rounded-full">
          Stage {activeStage} of 4
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isDone = stage.id < activeStage;
          const isCurrent = stage.id === activeStage;
          const isPending = stage.id > activeStage;

          return (
            <div
              key={stage.id}
              className={`p-4 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : isDone
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-slate-300'
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${
                  isCurrent ? 'bg-indigo-500 text-white' : isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">#{stage.id}</span>
                )}
              </div>
              <h4 className="text-xs font-bold text-white">{stage.name}</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">{stage.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
