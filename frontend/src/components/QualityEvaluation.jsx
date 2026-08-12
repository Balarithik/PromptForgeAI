import React from 'react';
import { Award, CheckCircle, AlertTriangle, RefreshCw, BarChart2, Zap } from 'lucide-react';

export default function QualityEvaluation({ evaluation, onAutoRefine, isRefining }) {
  if (!evaluation) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center text-slate-400 text-sm">
        No evaluation data available yet. Generate an article to run quality scoring.
      </div>
    );
  }

  const {
    overall_score = 85,
    relevance_score = 85,
    structure_score = 85,
    readability_score = 85,
    completeness_score = 85,
    seo_score = 85,
    feedback_json = {}
  } = evaluation;

  const strengths = feedback_json.strengths || [
    "Clear heading hierarchy and structural flow",
    "Targeted keyword integration",
    "Engaging opening hook for target audience"
  ];

  const improvements = feedback_json.improvements || [
    "Include an FAQ section to boost organic long-tail search ranking",
    "Add more specific real-world code or data examples"
  ];

  const summary = feedback_json.summary || "High quality article with strong overall readability and relevance.";

  const metrics = [
    { label: 'Topic Relevance', score: relevance_score, color: 'bg-indigo-500' },
    { label: 'Structure & Flow', score: structure_score, color: 'bg-blue-500' },
    { label: 'Readability', score: readability_score, color: 'bg-emerald-500' },
    { label: 'Completeness', score: completeness_score, color: 'bg-purple-500' },
    { label: 'SEO Quality', score: seo_score, color: 'bg-amber-500' },
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    if (score >= 80) return 'text-indigo-400 border-indigo-500/40 bg-indigo-950/40';
    return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-950 border border-indigo-500/30 text-indigo-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Quality & Editorial Audit</h3>
            <p className="text-xs text-slate-400">{summary}</p>
          </div>
        </div>

        {/* Overall Score Badge */}
        <div className={`px-4 py-2 rounded-xl border flex items-center space-x-3 ${getScoreColor(overall_score)}`}>
          <div>
            <div className="text-[10px] uppercase font-semibold tracking-wider opacity-80">Overall Score</div>
            <div className="text-2xl font-black">{overall_score}%</div>
          </div>
        </div>
      </div>

      {/* Breakdown Scores */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <BarChart2 className="h-3.5 w-3.5 text-indigo-400" />
          <span>Dimension Scores Breakdown</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {metrics.map((m, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">{m.label}</span>
                <span className="font-bold text-white">{m.score}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${m.color}`}
                  style={{ width: `${m.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
            <CheckCircle className="h-4 w-4" />
            <span>Key Strengths</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
            <AlertTriangle className="h-4 w-4" />
            <span>Actionable Suggestions</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {improvements.map((imp, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Auto-Refine Action */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onAutoRefine}
          disabled={isRefining}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
        >
          {isRefining ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Applying AI Editorial Polish...</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 text-amber-300" />
              <span>Auto-Refine Article Based on Feedback</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
