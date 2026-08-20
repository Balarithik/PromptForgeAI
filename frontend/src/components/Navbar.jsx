import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { apiService } from '../services/api';

export default function Navbar({ activeTab, setActiveTab }) {
  const [apiStatus, setApiStatus] = useState({ loading: true, status: 'offline' });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        await apiService.APIStatus();
        setApiStatus({ loading: false, status: 'online' });
      } catch (error) {
        setApiStatus({ loading: false, status: 'offline' });
      }
    };
    checkStatus();
  }, []);



  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">PromptForge</span>
              <span className="rounded-md bg-indigo-950/80 border border-indigo-500/30 px-1.5 py-0.5 text-xs font-semibold text-indigo-400">
                AI Platform
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Enterprise Article & Blog Engine</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="hidden md:flex items-center space-x-2 rounded-full bg-slate-900 px-3 py-1 border border-slate-800 text-xs text-slate-300">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span>LLM: <strong className="text-white font-medium">Gemini 2.5 Flash</strong></span>
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${apiStatus.status === 'online' ? 'bg-emerald-400 opacity-75' : 'bg-red-400 opacity-75'}`} ></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${apiStatus.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-400 bg-emerald-950/30 border border-emerald-500/20 px-2.5 py-1 rounded-full text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Server-side Key Secured</span>
          </div>

          <button
            onClick={() => setActiveTab('generator')}
            className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-2 text-xs font-medium text-white shadow-md shadow-indigo-600/20 hover:from-indigo-500 hover:to-purple-500 transition-all cursor-pointer"
          >
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">New Generation</span>
          </button>
        </div>
      </div>
    </header>
  );
}