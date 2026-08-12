import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import TemplateCard from '../components/TemplateCard';
import { Layers, Plus, Filter, Code, Info, History, X, Check } from 'lucide-react';

export default function TemplatesPage({ onSelectTemplate, setActiveTab }) {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewingTemplate, setViewingTemplate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // New template form state
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'general',
    description: '',
    system_prompt: 'You are an expert AI copywriter.',
    user_prompt_template: 'Write a detailed article on topic "{topic}" for target audience "{target_audience}".',
    variables: [{ name: 'custom_var', label: 'Custom Parameter', type: 'text' }]
  });

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTemplates(selectedCategory);
      setTemplates(data);
    } catch (e) {
      console.error("Error loading templates:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      await apiService.createTemplate(newTemplate);
      setShowCreateModal(false);
      loadTemplates();
    } catch (e) {
      console.error("Error creating template:", e);
    }
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'seo', label: 'SEO Blog' },
    { id: 'technical', label: 'Technical Article' },
    { id: 'tutorial', label: 'Tutorial / How-To' },
    { id: 'academic', label: 'Academic Article' },
    { id: 'news', label: 'News Article' },
    { id: 'explainer', label: 'Explainer Article' },
    { id: 'case_study', label: 'Case Study' },
    { id: 'product_review', label: 'Product Review' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'linkedin', label: 'LinkedIn / Social' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Layers className="h-6 w-6 text-indigo-400" />
            <span>Prompt Template Library & Version Control</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintainable, reusable prompt schemas with version history and variable interpolation
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create Custom Template</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="h-4 w-4 text-slate-500 shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tmpl) => (
          <div key={tmpl.id} className="relative group">
            <TemplateCard
              template={tmpl}
              onSelect={(t) => setViewingTemplate(t)}
            />
          </div>
        ))}
      </div>

      {/* Template Detail Modal */}
      {viewingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-3xl rounded-2xl border border-slate-800 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-500/30">
                  v{viewingTemplate.version} Engine
                </span>
                <h2 className="text-xl font-bold text-white mt-1">{viewingTemplate.name}</h2>
              </div>
              <button
                onClick={() => setViewingTemplate(null)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-1">System Prompt</h4>
                <pre className="p-3 bg-slate-950 rounded-lg text-slate-300 font-mono overflow-x-auto border border-slate-800">
                  {viewingTemplate.system_prompt}
                </pre>
              </div>

              <div>
                <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-1">User Prompt Template</h4>
                <pre className="p-3 bg-slate-950 rounded-lg text-indigo-300 font-mono overflow-x-auto border border-slate-800">
                  {viewingTemplate.user_prompt_template}
                </pre>
              </div>

              {viewingTemplate.version_history && viewingTemplate.version_history.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <History className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Version History Logs</span>
                  </h4>
                  <div className="space-y-2">
                    {viewingTemplate.version_history.map((vh) => (
                      <div key={vh.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                        <div>
                          <span className="font-bold text-white">Version {vh.version}</span>
                          <p className="text-slate-400 text-[11px] mt-0.5">{vh.changelog || 'Template revision'}</p>
                        </div>
                        <span className="text-slate-500 text-[10px]">{new Date(vh.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setViewingTemplate(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
              >
                Close View
              </button>
              <button
                onClick={() => {
                  onSelectTemplate(viewingTemplate);
                  setViewingTemplate(null);
                  setActiveTab('generator');
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                Use in Generator Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleCreateTemplate} className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white">Create Custom Prompt Template</h2>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Newsletter Digest"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {categories.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">System Prompt</label>
                <textarea
                  rows="3"
                  value={newTemplate.system_prompt}
                  onChange={(e) => setNewTemplate({ ...newTemplate, system_prompt: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-indigo-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">User Prompt Template</label>
                <textarea
                  rows="4"
                  value={newTemplate.user_prompt_template}
                  onChange={(e) => setNewTemplate({ ...newTemplate, user_prompt_template: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-indigo-300"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Save Prompt Template
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
