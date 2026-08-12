import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import GenerationForm from '../components/GenerationForm';
import PipelineProgress from '../components/PipelineProgress';
import MarkdownEditor from '../components/MarkdownEditor';
import AIPolishToolbar from '../components/AIPolishToolbar';
import QualityEvaluation from '../components/QualityEvaluation';
import { Sparkles, ArrowLeft, Check, RefreshCw, Wand2, ShieldCheck } from 'lucide-react';

export default function GeneratorWorkspace({ templates, selectedTemplate, onSelectTemplate }) {
  const [activeArticle, setActiveArticle] = useState(null);
  const [articleContent, setArticleContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pipelineStage, setPipelineStage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState(null);

  // Set default template if none selected
  useEffect(() => {
    if (!selectedTemplate && templates.length > 0) {
      onSelectTemplate(templates[0]);
    }
  }, [templates, selectedTemplate, onSelectTemplate]);

  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setError(null);
    setPipelineStage(1);

    // Simulate stage progress feedback
    const stageTimer1 = setTimeout(() => setPipelineStage(2), 1200);
    const stageTimer2 = setTimeout(() => setPipelineStage(3), 2600);
    const stageTimer3 = setTimeout(() => setPipelineStage(4), 3800);

    try {
      const result = await apiService.generateArticle(formData);
      setActiveArticle(result);
      setArticleContent(result.content);
    } catch (e) {
      console.error("Generation error:", e);
      setError("Failed to generate article. Please check your network or try again.");
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setIsLoading(false);
      setPipelineStage(0);
    }
  };

  const handleAIEditAction = async (actionType) => {
    if (!activeArticle) return;
    setIsEditing(true);
    try {
      const res = await apiService.performAIEdit(activeArticle.id, { action_type: actionType });
      setActiveArticle(res.article);
      setArticleContent(res.article.content);
    } catch (e) {
      console.error("AI edit error:", e);
    } finally {
      setIsEditing(false);
    }
  };

  const handleAutoRefine = async () => {
    if (!activeArticle) return;
    setIsRefining(true);
    try {
      const res = await apiService.performAIEdit(activeArticle.id, { action_type: 'improve_writing' });
      setActiveArticle(res.article);
      setArticleContent(res.article.content);
    } catch (e) {
      console.error("Auto refine error:", e);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-indigo-400" />
            <span>AI Article Generation Studio</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Engineered with Gemini 2.5 Flash & dynamic prompt variable interpolation
          </p>
        </div>

        {activeArticle && (
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center space-x-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Article ID #{activeArticle.id} Ready</span>
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Main Workspace Layout: Form on Left, Output & Editor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-6">
          <GenerationForm
            templates={templates}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={onSelectTemplate}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column: Active Output Workspace */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Generation Progress Stepper */}
          {isLoading && pipelineStage > 0 && (
            <PipelineProgress activeStage={pipelineStage} />
          )}

          {/* Markdown Editor & Live Preview */}
          <div className="space-y-4">
            <MarkdownEditor
              content={articleContent}
              onChangeContent={(val) => setArticleContent(val)}
              articleTitle={activeArticle?.title}
            />

            {/* AI Polish Toolbar */}
            {activeArticle && (
              <AIPolishToolbar
                onExecuteAction={handleAIEditAction}
                isEditing={isEditing}
              />
            )}

            {/* Quality Evaluation Panel */}
            {activeArticle && activeArticle.evaluation && (
              <QualityEvaluation
                evaluation={activeArticle.evaluation}
                onAutoRefine={handleAutoRefine}
                isRefining={isRefining}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
