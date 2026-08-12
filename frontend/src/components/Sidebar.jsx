import React from 'react';
import { LayoutDashboard, FileText, Layers, History, Settings, ChevronRight } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'generator', label: 'Article Generator', icon: FileText, badge: 'AI Engine' },
    { id: 'templates', label: 'Prompt Templates', icon: Layers, badge: '10 Ready' },
    { id: 'history', label: 'Article Library', icon: History, badge: null },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950 p-4 hidden md:block flex-col justify-between">
      <div className="space-y-6">
        <div>
          <h2 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Navigation Workspace
          </h2>
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  ) : (
                    isActive && <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800/60">
          <h2 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            System Information
          </h2>
          <div className="mt-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Dynamic Engine:</span>
              <span className="text-slate-200 font-mono">v2.4.0</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Pipeline Mode:</span>
              <span className="text-emerald-400 font-mono">Multi-Stage</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>DB Target:</span>
              <span className="text-indigo-400 font-mono">PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 mt-6">
        <p className="text-xs font-medium text-slate-200">Production Ready</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Secure REST API & LLM integration active.</p>
      </div>
    </aside>
  );
}
