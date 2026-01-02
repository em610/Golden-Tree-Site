
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ChatBot from './components/ChatBot';
import Analysis from './components/Analysis';
import { AppView } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <ChatBot />;
      case 'analysis':
        return <Analysis />;
      case 'site-control':
        return (
          <div className="h-full flex flex-col items-center justify-center p-12 cyber-panel border border-cyan-500/10 border-dashed bg-black/40">
            <div className="w-24 h-24 border border-cyan-500/10 flex items-center justify-center mb-8 bg-cyan-500/5">
              <i className="fas fa-tower-observation text-4xl text-cyan-900"></i>
            </div>
            <h2 className="text-sm font-bold text-cyan-400 mono tracking-[0.4em] uppercase">Site_Intelligence_Vault</h2>
            <p className="text-slate-600 mt-4 text-center text-[10px] mono max-w-md leading-relaxed uppercase">
              CENTRAL HUB FOR ZONES, PACKAGES, AND LONG-LEAD PROCUREMENT TRACKING. 
              CONNECT TO GOOGLE DRIVE TO MAP SITE ENTITIES.
            </p>
            <button className="mt-10 px-8 py-3 bg-cyan-500/10 border border-cyan-500 text-cyan-400 font-bold mono text-[10px] hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)] uppercase tracking-widest">
              INITIALIZE_DRIVE_SYNC
            </button>
            <div className="mt-12 grid grid-cols-3 gap-8 opacity-20">
               <div className="text-center">
                  <p className="text-[8px] mono mb-1">PACKAGES</p>
                  <p className="text-xs font-bold mono">14_ACTIVE</p>
               </div>
               <div className="text-center">
                  <p className="text-[8px] mono mb-1">ZONES</p>
                  <p className="text-xs font-bold mono">06_IDENTIFIED</p>
               </div>
               <div className="text-center">
                  <p className="text-[8px] mono mb-1">SLA_COMP</p>
                  <p className="text-xs font-bold mono">92.4%</p>
               </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}
    </Layout>
  );
};

export default App;
