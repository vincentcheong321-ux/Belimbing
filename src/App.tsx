import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, Presentation } from 'lucide-react';
import VisitorForm from './components/VisitorForm';
import GuardDashboard from './components/GuardDashboard';
import ProposalDeck from './components/ProposalDeck';
import { AppMode } from './types';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);

  // Initialize state based on URL and listen for history changes
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      // Simple client-side routing
      if (path === '/guard' || path === '/guard/') {
        setMode(AppMode.GUARD);
      } else if (path === '/visitor' || path === '/visitor/') {
        setMode(AppMode.VISITOR);
      } else if (path === '/presentation') {
        setMode(AppMode.PRESENTATION);
      } else {
        setMode(AppMode.HOME);
      }
    };

    // Set initial state
    handleLocationChange();

    // Listen for back/forward navigation
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
      case AppMode.VISITOR:
        return <VisitorForm onBack={() => navigateTo(AppMode.HOME)} />;
      case AppMode.GUARD:
        return <GuardDashboard onBack={() => navigateTo(AppMode.HOME)} />;
      case AppMode.PRESENTATION:
        return <ProposalDeck onClose={() => navigateTo(AppMode.HOME)} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full">
              <div className="text-center mb-12">
                <div className="inline-block p-4 rounded-full bg-emerald-500/10 mb-6 border border-emerald-500/20">
                   <Shield className="w-16 h-16 text-emerald-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                  Belim<span className="text-emerald-400">bing</span>
                </h1>
              </div>

              {/* Main Action Area - Visitor Check-in Only */}
              <div className="flex justify-center mb-16">
                <button 
                  onClick={() => navigateTo(AppMode.VISITOR)}
                  className="group relative overflow-hidden bg-white hover:bg-slate-50 p-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-lg text-left"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <UserPlus size={120} />
                  </div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="bg-indigo-100 p-4 rounded-full text-indigo-600 mb-6">
                      <UserPlus size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Visitor Check-in</h2>
                    <p className="text-slate-500 text-lg mb-8">
                      Generate a temporary QR access pass for your visit today. Valid for 24 hours.
                    </p>
                    <div className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-wide group-hover:bg-emerald-600 transition-colors shadow-lg">
                      Start Registration
                    </div>
                  </div>
                </button>
              </div>
              
              <div className="text-center">
                 <button 
                   onClick={() => navigateTo(AppMode.PRESENTATION)}
                   className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium border-b border-dashed border-slate-600 hover:border-white pb-0.5"
                 >
                   <Presentation size={16} />
                   View Project Proposal
                 </button>
                 
                 <footer className="mt-8 text-slate-600 text-sm">
                   &copy; {new Date().getFullYear()} Belimbing System. Malaysia Standard Compliance.
                 </footer>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderContent();
}