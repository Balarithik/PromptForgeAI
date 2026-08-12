import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Layers, CheckCircle2, ChevronDown } from 'lucide-react';

export default function AIPolishToolbar({ onExecuteAction, isEditing }) {
  const [activeAction, setActiveAction] = useState(null);

  const actions = [
    { id: 'improve_writing', label: 'Improve Writing', category: 'Quality', icon: '✨' },
    { id: 'simplify', label: 'Simplify Text', category: 'Tone', icon: '💡' },
    { id: 'make_professional', label: 'Make Professional', category: 'Tone', icon: '💼' },
    { id: 'make_beginner_friendly', label: 'Beginner Friendly', category: 'Tone', icon: '🌱' },
    { id: 'expand', label: 'Expand Content', category: 'Structure', icon: '🔍' },
    { id: 'summarize', label: 'Summarize', category: 'Structure', icon: '📝' },
    { id: 'add_examples', label: 'Add Code / Examples', category: 'Enhance', icon: '💻' },
    { id: 'generate_faq', label: 'Generate FAQ Section', category: 'Enhance', icon: '❓' },
    { id: 'improve_seo', label: 'Improve SEO Ranking', category: 'SEO', icon: '🚀' },
    { id: 'generate_intro', label: 'Generate Introduction', category: 'Structure', icon: '🎯' },
    { id: 'generate_conclusion', label: 'Generate Conclusion', category: 'Structure', icon: '🏁' },
    { id: 'convert_to_social', label: 'Convert to Social / LinkedIn', category: 'Format', icon: '📱' },
  ];

  const handleTrigger = (actionId) => {
    setActiveAction(actionId);
    onExecuteAction(actionId);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-slate-950/60 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Wand2 className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            AI Inline Polish & Transformation Actions
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">12 AI Tools</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {actions.map((act) => {
          const isLoadingThis = isEditing && activeAction === act.id;
          return (
            <button
              key={act.id}
              disabled={isEditing}
              onClick={() => handleTrigger(act.id)}
              className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                isLoadingThis
                  ? 'bg-indigo-600 border-indigo-400 text-white animate-pulse'
                  : isEditing
                  ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-indigo-500/40 hover:text-white'
              }`}
            >
              <span className="text-base">{act.icon}</span>
              <div className="overflow-hidden">
                <div className="text-xs font-medium truncate">{act.label}</div>
                <div className="text-[9px] text-slate-500 font-mono truncate">{act.category}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
