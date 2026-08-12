import React from 'react';
import { ArrowRight, Tag, Layers, Star } from 'lucide-react';

export default function TemplateCard({ template, onSelect, isSelected }) {
  const categoryColors = {
    seo: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30',
    technical: 'bg-blue-950/80 text-blue-300 border-blue-500/30',
    tutorial: 'bg-purple-950/80 text-purple-300 border-purple-500/30',
    academic: 'bg-amber-950/80 text-amber-300 border-amber-500/30',
    news: 'bg-red-950/80 text-red-300 border-red-500/30',
    explainer: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30',
    case_study: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30',
    product_review: 'bg-teal-950/80 text-teal-300 border-teal-500/30',
    documentation: 'bg-slate-900 text-slate-300 border-slate-700',
    linkedin: 'bg-sky-950/80 text-sky-300 border-sky-500/30',
  };

  const badgeColor = categoryColors[template.category] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <div
      onClick={() => onSelect(template)}
      className={`glass-panel rounded-xl p-5 border transition-all cursor-pointer flex flex-col justify-between group ${
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-950/20'
          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${badgeColor}`}>
            {template.category_display || template.category.toUpperCase()}
          </span>
          {template.is_default && (
            <span className="flex items-center space-x-1 text-[11px] text-amber-400">
              <Star className="h-3 w-3 fill-amber-400" />
              <span>Standard</span>
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
          {template.name}
        </h3>
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {template.description}
        </p>

        {template.variables && template.variables.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {template.variables.map((v, i) => (
              <span key={i} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800 flex items-center space-x-1">
                <Tag className="h-2.5 w-2.5 text-indigo-400" />
                <span>{v.label || v.name}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-medium">
        <span>v{template.version} Engine</span>
        <div className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
          <span>Select Template</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
