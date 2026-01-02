
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard' as AppView, icon: 'fa-microchip', label: 'SYSTEM_DASH' },
    { id: 'analysis' as AppView, icon: 'fa-braille', label: 'NEURAL_SCAN' },
    { id: 'chat' as AppView, icon: 'fa-satellite-dish', label: 'COMMS_UPLINK' },
    { id: 'site-control' as AppView, icon: 'fa-building-shield', label: 'SITE_CONTROL' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-black/95 border-r border-cyan-500/20 flex flex-col z-20">
        <div className="p-8 border-b border-cyan-500/20 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-cyan-500 flex items-center justify-center shadow-[0_0_10px_rgba(0,243,255,0.3)] bg-cyan-900/20">
              <i className="fas fa-city text-cyan-400 text-sm"></i>
            </div>
            <span className="font-bold text-lg tracking-[0.2em] text-cyan-400 hud-header">BUILDSENSE</span>
          </div>
          <span className="text-[10px] mono text-cyan-800 tracking-tighter">OS_VERSION_2049.5.1_LUX</span>
        </div>
        
        <nav className="flex-1 p-6 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 border transition-all duration-300 group ${
                activeView === item.id 
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.1)]' 
                  : 'border-transparent text-slate-500 hover:text-cyan-500 hover:border-cyan-500/30'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-sm ${activeView === item.id ? 'animate-pulse' : ''}`}></i>
              <span className="font-bold text-xs mono tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-cyan-500/20">
          <div className="bg-cyan-950/20 border border-cyan-500/10 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500 opacity-30 animate-pulse"></div>
            <p className="text-[9px] mono text-cyan-500 uppercase font-bold mb-2 flex justify-between">
              <span>Syncing_Project</span>
              <span className="animate-ping text-emerald-500">●</span>
            </p>
            <p className="text-xs font-bold text-slate-300 truncate mb-2">LUX_VILLA_BALI_R2</p>
            <div className="w-full bg-slate-900 h-1 border border-cyan-500/20 overflow-hidden">
              <div className="bg-cyan-500 h-full w-2/3 shadow-[0_0_8px_#00f3ff]"></div>
            </div>
            <div className="flex justify-between mt-2 text-[8px] mono text-cyan-700">
              <span>QA_PASS: 82%</span>
              <span>HOLD_POINTS: 4</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative bg-black">
        <header className="h-16 bg-black/40 border-b border-cyan-500/20 px-8 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-6">
             <div className="flex flex-col">
                <h1 className="text-sm font-bold text-cyan-400 mono tracking-[0.3em]">
                  {activeView.replace('-', '_').toUpperCase()}_INTERFACE
                </h1>
                <div className="flex gap-1 mt-1">
                   {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={`h-[2px] w-4 ${i <= 6 ? 'bg-cyan-500' : 'bg-slate-800'}`}></div>)}
                </div>
             </div>
          </div>
          <div className="flex items-center gap-6 mono text-[10px]">
            <div className="text-cyan-800 hidden md:block">
              ACTIVE_SECTOR: INTERIOR_FINISH_L2
            </div>
            <div className="w-px h-6 bg-cyan-500/20"></div>
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 animate-pulse">LUX_STANDARDS_ACTIVE</span>
              <div className="w-10 h-10 border border-cyan-500/30 flex items-center justify-center bg-cyan-500/5 text-cyan-500 shadow-inner">
                JD
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-cyan-500/30"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-cyan-500/30"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-cyan-500/30"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-cyan-500/30"></div>
          
          <div className="relative z-10 h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
