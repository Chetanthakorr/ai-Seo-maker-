import React, { useState } from 'react';
import { ModuleType } from '../types';
import { 
  BarChart2, 
  Search, 
  Layers, 
  MapPin, 
  Activity, 
  Globe,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  activeModule: ModuleType;
  onModuleChange: (m: ModuleType) => void;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { id: ModuleType.CONTENT_GAP, label: 'Content Gap Analyzer', icon: Layers },
  { id: ModuleType.TECHNICAL_AUDIT, label: 'SEO Health Doctor', icon: Activity },
  { id: ModuleType.SERP_PLANNER, label: 'SERP Domination', icon: BarChart2 },
  { id: ModuleType.KEYWORD_CLUSTER, label: 'Keyword Clusters', icon: Search },
  { id: ModuleType.LOCAL_SEO, label: 'Local SEO Booster', icon: MapPin },
  { id: ModuleType.COMPETITOR_ANALYSIS, label: 'Competitor Reveal', icon: Globe },
];

export const Layout: React.FC<LayoutProps> = ({ activeModule, onModuleChange, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-slate-950 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            SEOMaster AI
          </h1>
          <p className="text-xs text-slate-500 mt-1">Powered by Gemini 3 Pro</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeModule === item.id
                  ? 'bg-blue-600/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-blue-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeModule === item.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-slate-950 border-b border-slate-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          SEOMaster AI
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950 pt-20 px-4 space-y-2">
           {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onModuleChange(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-lg ${
                activeModule === item.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="md:p-8 p-4 pt-24 md:pt-8 flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-5xl mx-auto pb-20">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
