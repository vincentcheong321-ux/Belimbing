
import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, Presentation, BellRing } from 'lucide-react';
import VisitorForm from './components/VisitorForm';
import GuardDashboard from './components/GuardDashboard';
import ProposalDeck from './components/ProposalDeck';
import { AppMode } from './types';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/guard' || path === '/guard/') setMode(AppMode.GUARD);
      else if (path === '/visitor' || path === '/visitor/') setMode(AppMode.VISITOR);
      else if (path === '/presentation') setMode(AppMode.PRESENTATION);
      else setMode(AppMode.HOME);
    };
    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (newMode: AppMode) => {
    let path = '/';
    if (newMode === AppMode.GUARD) path = '/guard';
    else if (newMode === AppMode.VISITOR) path = '/visitor';
    else if (newMode === AppMode.PRESENTATION) path = '/presentation';
    window.history.pushState({}, '', path);
    setMode(newMode);
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.VISITOR: return <VisitorForm onBack={() => navigateTo(AppMode.HOME)} />;
      case AppMode.GUARD: return <GuardDashboard onBack={() => navigateTo(AppMode.HOME)} />;
      case AppMode.PRESENTATION: return <ProposalDeck onClose={() => navigateTo(AppMode.HOME)} />;
      default: return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <div className="inline-block p-4 rounded-full bg-emerald-500/10 mb-6 border border-emerald-500/20">
                 <Shield className="w-16 h-16 text-emerald-400" />
              </div>
              <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">
                Belim<span className="text-emerald-400">bing</span>
              </h1>
              <p className="text-slate-400">Secure. Smart. Seamless.</p>
            </div>

            <div className="flex justify-center mb-16">
              <button 
                onClick={() => navigateTo(AppMode.VISITOR)}
                className="group relative overflow-hidden bg-white p-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-lg text-left"
              >
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 mb-6">
                    <UserPlus size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">Pre-Register</h2>
                  <p className="text-slate-500 text-lg mb-8">Register yourself or guests for instant check-in. Purpose selection & resident alerts included.</p>
                  <div className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-wide group-hover:bg-emerald-600 transition-colors shadow-lg flex items-center justify-center gap-2">
                    <BellRing size={16} /> Start Registration
                  </div>
                </div>
              </button>
            </div>
            
            <div className="text-center">
               <button onClick={() => navigateTo(AppMode.PRESENTATION)} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium border-b border-dashed border-slate-600 pb-0.5">
                 <Presentation size={16} /> View Advanced Features & Proposal
               </button>
               <footer className="mt-8 text-slate-600 text-sm"> &copy; {new Date().getFullYear()} Belimbing. Smart Residential Solutions.</footer>
            </div>
          </div>
        </div>
      );
    }
  };

  return renderContent();
}
