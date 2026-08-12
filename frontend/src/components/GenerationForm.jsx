import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, Sliders, Globe, AlignLeft, User, MessageSquare, Zap, Play } from 'lucide-react';

export default function GenerationForm({ templates, selectedTemplate, onSelectTemplate, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    template_id: selectedTemplate ? selectedTemplate.id : '',
    topic: '',
    target_audience: '',
    tone: 'Professional & Authoritative',
    language: 'English',
    target_length: 'Medium (~1000 words)',
    pipeline_mode: 'multi_stage',
    custom_instructions: '',
    variables_values: {},
  });

  useEffect(() => {
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        template_id: selectedTemplate.id,
      }));
    }
  }, [selectedTemplate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVariableChange = (varName, value) => {
    setFormData(prev => ({
      ...prev,
      variables_values: {
        ...prev.variables_values,
        [varName]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.topic.trim()) return;
    onSubmit(formData);
  };

  const tones = [
    'Professional & Authoritative',
    'Conversational & Engaging',
    'Technical & Precise',
    'Academic & Formal',
    'Persuasive & High-Converting',
    'Enthusiastic & Inspiring',
    'Executive & Concise'
  ];

  const languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Portuguese'];

  const lengths = [
    { label: 'Short (~500w)', value: 'Short (~500 words)' },
    { label: 'Medium (~1000w)', value: 'Medium (~1000 words)' },
    { label: 'Long (~2000w)', value: 'Long (~2000 words)' }
  ];

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <Sliders className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Article Generation Parameters</h2>
        </div>
        <span className="text-xs text-indigo-400 bg-indigo-950/60 border border-indigo-500/20 px-2.5 py-1 rounded-full font-medium">
          Step 1 of 3
        </span>
      </div>

      {/* Template Selection */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
          <Layers className="h-3.5 w-3.5 text-indigo-400" />
          <span>Active Prompt Template</span>
        </label>
        <select
          name="template_id"
          value={formData.template_id}
          onChange={(e) => {
            const id = e.target.value;
            const t = templates.find(item => item.id == id);
            if (t) onSelectTemplate(t);
          }}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          {templates.map(t => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.category_display || t.category})
            </option>
          ))}
        </select>
        {selectedTemplate && (
          <p className="text-xs text-slate-400 mt-1.5 italic">
            "{selectedTemplate.description}"
          </p>
        )}
      </div>

      {/* Topic Input */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
          <span>Core Topic or Title <span className="text-indigo-400">*</span></span>
        </label>
        <input
          type="text"
          name="topic"
          required
          placeholder="e.g. Building an AI Article Platform with React, Django REST, and PostgreSQL"
          value={formData.topic}
          onChange={handleChange}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Target Audience & Tone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
            <User className="h-3.5 w-3.5 text-indigo-400" />
            <span>Target Audience</span>
          </label>
          <input
            type="text"
            name="target_audience"
            value={formData.target_audience}
            onChange={handleChange}
            placeholder="e.g. Developers, Marketers, C-Suite"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Writing Tone
          </label>
          <select
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
          >
            {tones.map((t, idx) => (
              <option key={idx} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Language & Length */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
            <Globe className="h-3.5 w-3.5 text-indigo-400" />
            <span>Output Language</span>
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
          >
            {languages.map((lang, idx) => (
              <option key={idx} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
            <AlignLeft className="h-3.5 w-3.5 text-indigo-400" />
            <span>Target Article Length</span>
          </label>
          <div className="flex space-x-2">
            {lengths.map((len) => (
              <button
                type="button"
                key={len.value}
                onClick={() => setFormData(prev => ({ ...prev, target_length: len.value }))}
                className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${formData.target_length === len.value
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
              >
                {len.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Template Variables */}
      {selectedTemplate && selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
            Template Specific Variables ({selectedTemplate.name})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedTemplate.variables.map((varDef, i) => (
              <div key={i}>
                <label className="block text-xs text-slate-300 mb-1">{varDef.label || varDef.name}</label>
                <input
                  type="text"
                  placeholder={varDef.placeholder || `Enter ${varDef.name}`}
                  value={formData.variables_values[varDef.name] || ''}
                  onChange={(e) => handleVariableChange(varDef.name, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline Mode Switch */}
      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-3">
        <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider">
          Generation Pipeline Architecture
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            onClick={() => setFormData(prev => ({ ...prev, pipeline_mode: 'direct' }))}
            className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.pipeline_mode === 'direct'
                ? 'bg-indigo-600/20 border-indigo-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
          >
            <input
              type="radio"
              name="pipeline_mode"
              value="direct"
              checked={formData.pipeline_mode === 'direct'}
              onChange={handleChange}
              className="mt-1 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <div className="font-semibold text-xs text-slate-200">Direct Single-Pass</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Fast article generation in a single LLM execution pass.</p>
            </div>
          </label>

          <label
            onClick={() => setFormData(prev => ({ ...prev, pipeline_mode: 'multi_stage' }))}
            className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.pipeline_mode === 'multi_stage'
                ? 'bg-indigo-600/20 border-indigo-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
          >
            <input
              type="radio"
              name="pipeline_mode"
              value="multi_stage"
              checked={formData.pipeline_mode === 'multi_stage'}
              onChange={handleChange}
              className="mt-1 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <div className="font-semibold text-xs text-indigo-300 flex items-center space-x-1">
                <span>Multi-Stage Pipeline</span>
                <span className="text-[9px] bg-indigo-500/30 text-indigo-200 px-1 rounded">Recommended</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Outline → Article → AI Score Evaluation → Auto Refinement.</p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !formData.topic.trim()}
        className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer ${isLoading || !formData.topic.trim()
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30 hover:scale-[1.01]'
          }`}
      >
        {isLoading ? (
          <>
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Executing AI Pipeline...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            <span>Generate Article with {selectedTemplate ? selectedTemplate.name : 'Prompt Engine'}</span>
          </>
        )}
      </button>
    </form>
  );
}
