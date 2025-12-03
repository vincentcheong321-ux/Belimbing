import React, { useState } from 'react';
import { Shield, UserPlus, Presentation } from 'lucide-react';
import VisitorForm from './components/VisitorForm';
import GuardDashboard from './components/GuardDashboard';
import ProposalDeck from './components/ProposalDeck';
import { AppMode } from './types';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);

  const renderContent = () => {
    switch (mode) {
      case AppMode.VISITOR:
        return <VisitorForm onBack={() => setMode(AppMode.HOME)} />;
      case AppMode.GUARD:
        return <GuardDashboard onBack={() => setMode(AppMode.HOME)} />;
      case AppMode.PRESENTATION:
        return <ProposalDeck onClose={() => setMode(AppMode.HOME)} />;
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
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                  Secure, efficient, and AI-powered visitor management system for modern residences.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
                <button 
                  onClick={() => setMode(AppMode.VISITOR)}
                  className="group relative overflow-hidden bg-white hover:bg-slate-50 p-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <UserPlus size={120} />
                  </div>
                  <div className="relative z-10 flex flex-col items-start">
                    <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600 mb-4">
                      <UserPlus size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Visitor Check-in</h2>
                    <p className="text-slate-500 text-left">
                      Generate a temporary QR access pass for your visit today. Valid for 24 hours.
                    </p>
                  </div>
                </button>

                <button 
                  onClick={() => setMode(AppMode.GUARD)}
                  className="group relative overflow-hidden bg-slate-800 hover:bg-slate-750 p-8 rounded-2xl shadow-2xl border border-slate-700 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Shield size={120} className="text-emerald-500" />
                  </div>
                  <div className="relative z-10 flex flex-col items-start">
                    <div className="bg-emerald-900/30 p-3 rounded-lg text-emerald-400 mb-4 border border-emerald-500/20">
                      <Shield size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Guard Portal</h2>
                    <p className="text-slate-400 text-left">
                      Security personnel login to scan passes and log entries securely.
                    </p>
                  </div>
                </button>
              </div>
              
              <div className="text-center">
                 <button 
                   onClick={() => setMode(AppMode.PRESENTATION)}
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
