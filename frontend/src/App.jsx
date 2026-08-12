import React, { useState, useEffect } from 'react';
import { apiService } from './services/api';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import GeneratorWorkspace from './pages/GeneratorWorkspace';
import TemplatesPage from './pages/TemplatesPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await apiService.getTemplates();
      setTemplates(data);
      if (data && data.length > 0) {
        const defaultTmpl = data.find(t => t.is_default) || data[0];
        setSelectedTemplate(defaultTmpl);
      }
    } catch (e) {
      console.error("Failed to load templates:", e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Workspace Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              onSelectTemplate={(tmpl) => setSelectedTemplate(tmpl)}
            />
          )}

          {activeTab === 'generator' && (
            <GeneratorWorkspace
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={(tmpl) => setSelectedTemplate(tmpl)}
            />
          )}

          {activeTab === 'templates' && (
            <TemplatesPage
              setActiveTab={setActiveTab}
              onSelectTemplate={(tmpl) => setSelectedTemplate(tmpl)}
            />
          )}

          {activeTab === 'history' && (
            <HistoryPage />
          )}
        </main>
      </div>
    </div>
  );
}
