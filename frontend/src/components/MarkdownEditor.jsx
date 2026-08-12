import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Download, Code, Eye, Columns, Check, FileText, Clock, Hash } from 'lucide-react';

export default function MarkdownEditor({ content, onChangeContent, articleTitle }) {
  const [viewMode, setViewMode] = useState('split'); // 'split', 'editor', 'preview'
  const [copied, setCopied] = useState(false);

  const wordCount = content ? content.trim().split(/\s+/).length : 0;
  const charCount = content ? content.length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  const handleCopy = (mode = 'markdown') => {
    let textToCopy = content;
    if (mode === 'plain') {
      textToCopy = content.replace(/#+\s/g, '').replace(/[*_`~]/g, '');
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (type = 'md') => {
    const filename = `${(articleTitle || 'article').toLowerCase().replace(/[^a-z0-9]/g, '_')}.${type}`;
    let blobContent = content;
    let mimeType = 'text/markdown';

    if (type === 'html') {
      mimeType = 'text/html';
      blobContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${articleTitle || 'Exported Article'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #222; }
    h1, h2, h3 { color: #111; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
    pre { background: #222; color: #fff; padding: 16px; border-radius: 6px; overflow-x: auto; }
    blockquote { border-left: 4px solid #6366f1; padding-left: 16px; color: #555; margin: 0; }
  </style>
</head>
<body>
  ${content.replace(/\n/g, '<br/>')}
</body>
</html>`;
    }

    const blob = new Blob([blobContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-full min-h-[600px]">
      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
              viewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Split View</span>
          </button>
          <button
            onClick={() => setViewMode('editor')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
              viewMode === 'editor' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Raw Markdown</span>
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
              viewMode === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Live Preview</span>
          </button>
        </div>

        {/* Stats */}
        <div className="hidden lg:flex items-center space-x-4 text-xs text-slate-400">
          <div className="flex items-center space-x-1">
            <FileText className="h-3.5 w-3.5 text-indigo-400" />
            <span>{wordCount} Words</span>
          </div>
          <div className="flex items-center space-x-1">
            <Hash className="h-3.5 w-3.5 text-indigo-400" />
            <span>{charCount} Chars</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5 text-indigo-400" />
            <span>~{readingTime} min read</span>
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => handleCopy('markdown')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-indigo-400" />}
            <span>{copied ? 'Copied!' : 'Copy MD'}</span>
          </button>

          <button
            onClick={() => handleDownload('md')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-indigo-400" />
            <span>Export .md</span>
          </button>

          <button
            onClick={() => handleDownload('html')}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-indigo-400" />
            <span>Export .html</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 min-h-[500px]">
        {/* Editor Area */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className={`p-4 flex flex-col ${viewMode === 'editor' ? 'col-span-2' : ''}`}>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
              <span>Markdown Source Editor</span>
              <span className="text-slate-600 font-mono">Editable</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => onChangeContent(e.target.value)}
              className="flex-1 w-full bg-slate-950 font-mono text-sm text-slate-200 p-4 rounded-xl border border-slate-800/80 focus:outline-none focus:border-indigo-500/60 resize-none leading-relaxed"
              placeholder="# Enter or generate article content..."
            />
          </div>
        )}

        {/* Live Preview Area */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`p-6 overflow-y-auto max-h-[700px] ${viewMode === 'preview' ? 'col-span-2' : ''}`}>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-4 flex justify-between border-b border-slate-800 pb-2">
              <span>Live Article Render</span>
              <span className="text-emerald-400 font-medium flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Preview</span>
              </span>
            </div>
            <div className="prose-dark">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || '*No content available. Generate an article to preview.*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
