import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import StatCard from '../components/StatCard';
import TemplateCard from '../components/TemplateCard';
import { FileText, Award, Layers, Zap, ArrowRight, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export default function Dashboard({ setActiveTab, onSelectTemplate }) {
  const [stats, setStats] = useState({
    total_articles: 0,
    avg_quality_score: 88.5,
    active_templates: 10,
    total_words_generated: 0,
    recent_articles: []
  });
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, tData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getTemplates()
      ]);
      setStats(sData);
      setTemplates(tData);
    } catch (e) {
      console.error("Error loading dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/40 p-6 md:p-8 border border-indigo-500/30">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Platform Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            Create Enterprise Blog Posts & Articles in Seconds
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Select a reusable prompt template, configure target audience & tone, and let our multi-stage Gemini AI pipeline handle outline creation, drafting, quality evaluation, and automatic polishing.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('generator')}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-500 transition-all cursor-pointer"
            >
              <Zap className="h-4 w-4" />
              <span>Launch Article Generator</span>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className="flex items-center space-x-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 px-5 py-2.5 text-xs font-bold text-slate-200 transition-all cursor-pointer"
            >
              <Layers className="h-4 w-4 text-indigo-400" />
              <span>Explore 10 Templates</span>
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Articles Generated"
          value={stats.total_articles}
          subtext="Total completed drafts"
          icon={FileText}
          color="indigo"
        />
        <StatCard
          title="Avg Quality Score"
          value={`${stats.avg_quality_score}%`}
          subtext="Relevance & SEO audited"
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Active Prompt Templates"
          value={stats.active_templates}
          subtext="SEO, Tech, Academic, B2B..."
          icon={Layers}
          color="purple"
        />
        <StatCard
          title="Total Words Generated"
          value={stats.total_words_generated.toLocaleString()}
          subtext="Publication-ready content"
          icon={Zap}
          color="amber"
        />
      </div>

      {/* Recommended Templates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Featured Prompt Templates</h2>
            <p className="text-xs text-slate-400">Choose a structured engine to initiate article generation</p>
          </div>
          <button
            onClick={() => setActiveTab('templates')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
          >
            <span>View All ({templates.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.slice(0, 6).map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              onSelect={(tmpl) => {
                onSelectTemplate(tmpl);
                setActiveTab('generator');
              }}
            />
          ))}
        </div>
      </div>

      {/* Recent Generated Articles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Generated Articles</h2>
            <p className="text-xs text-slate-400">Your latest platform outputs and quality scores</p>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
          >
            <span>Article Library</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {stats.recent_articles && stats.recent_articles.length > 0 ? (
          <div className="glass-panel rounded-2xl border border-slate-800 divide-y divide-slate-800/60 overflow-hidden">
            {stats.recent_articles.map((art) => (
              <div key={art.id} className="p-4 hover:bg-slate-900/40 transition-colors flex items-center justify-between">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white truncate">{art.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-medium">
                      {art.template_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <span>Topic: {art.topic}</span>
                    <span>•</span>
                    <span>{art.word_count} words</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1 text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(art.created_at).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {art.evaluation && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                      {art.evaluation.overall_score}% Quality
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setActiveTab('generator');
                    }}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-8 border border-slate-800 text-center space-y-3">
            <CheckCircle2 className="h-8 w-8 text-indigo-400 mx-auto opacity-80" />
            <h3 className="text-sm font-bold text-white">No articles generated yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Select a template and start generating your first AI article to see quality metrics and generation history.
            </p>
            <button
              onClick={() => setActiveTab('generator')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Zap className="h-4 w-4" />
              <span>Create First Article</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
