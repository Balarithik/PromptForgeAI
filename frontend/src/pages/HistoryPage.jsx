import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { History, Search, Download, Trash2, Eye, Copy, Check, FileText, Calendar, Award, X } from 'lucide-react';

export default function HistoryPage() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await apiService.getArticles();
      setArticles(data);
    } catch (e) {
      console.error("Error fetching articles:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await apiService.deleteArticle(id);
      if (selectedArticle && selectedArticle.id === id) {
        setSelectedArticle(null);
      }
      loadArticles();
    } catch (e) {
      console.error("Error deleting article:", e);
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = articles.filter(art =>
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.template_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <History className="h-6 w-6 text-indigo-400" />
            <span>Generated Article Library & History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Persisted history of generated articles, evaluation audits, and model logs
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search articles by title or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Articles List / Table */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((art) => (
            <div
              key={art.id}
              className="glass-panel rounded-xl p-5 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-white hover:text-indigo-300 transition-colors cursor-pointer" onClick={() => setSelectedArticle(art)}>
                    {art.title}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-medium">
                    {art.template_name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {art.generation_pipeline_used === 'multi_stage' ? 'Multi-Stage' : 'Direct'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-1">
                  Topic: <strong className="text-slate-300">{art.topic}</strong> | Target Audience: {art.target_audience}
                </p>

                <div className="flex items-center space-x-4 text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <FileText className="h-3 w-3 text-indigo-400" />
                    <span>{art.word_count} words</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-indigo-400" />
                    <span>{new Date(art.created_at).toLocaleString()}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                {art.evaluation && (
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Score</div>
                    <span className="text-sm font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg inline-block">
                      {art.evaluation.overall_score}%
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setSelectedArticle(art)}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-all text-xs font-semibold cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => handleDelete(art.id)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors cursor-pointer"
                  title="Delete Article"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 border border-slate-800 text-center space-y-3">
          <History className="h-10 w-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No articles found</h3>
          <p className="text-xs text-slate-400">
            {searchTerm ? "No articles match your search query." : "Generate your first article to start building your library."}
          </p>
        </div>
      )}

      {/* Detail Article View Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-4xl rounded-2xl border border-slate-800 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-500/30">
                    {selectedArticle.template_name}
                  </span>
                  <span className="text-xs text-slate-400">{selectedArticle.word_count} words</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">{selectedArticle.title}</h2>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 overflow-y-auto max-h-[500px] prose-dark">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedArticle.content}
              </ReactMarkdown>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Created: {new Date(selectedArticle.created_at).toLocaleString()}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleCopy(selectedArticle.content)}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-indigo-400" />}
                  <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
                </button>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
