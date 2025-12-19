
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Shield, Smartphone, Zap, Database, Lock, Layout, CheckCircle, User, CreditCard, Scan, FileText, Activity, Code, Cloud, Cpu, ShieldCheck, Tablet } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ProposalDeckProps {
  onClose: () => void;
}

// --- Demo Simulation Components ---

const DemoScreen1Visitor = () => (
  <div className="p-6 h-full flex flex-col bg-white">
    <div className="mb-6">
       <h3 className="font-bold text-slate-800 text-lg">Visitor Reg</h3>
       <p className="text-xs text-slate-400">Step 1: Visitor fills details</p>
    </div>
    <div className="space-y-3 opacity-80">
       <div className="bg-slate-100 p-3 rounded-lg flex gap-3 items-center border border-slate-200">
          <User size={16} className="text-slate-400" />
          <div className="h-2 w-24 bg-slate-300 rounded"></div>
       </div>
       <div className="bg-slate-100 p-3 rounded-lg flex gap-3 items-center border border-slate-200">
          <CreditCard size={16} className="text-slate-400" />
          <div className="h-2 w-32 bg-slate-300 rounded"></div>
       </div>
       <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-100 p-3 rounded-lg flex gap-3 items-center border border-slate-200">
             <div className="h-2 w-8 bg-slate-300 rounded"></div>
          </div>
          <div className="bg-slate-100 p-3 rounded-lg flex gap-3 items-center border border-slate-200">
             <div className="h-2 w-8 bg-slate-300 rounded"></div>
          </div>
       </div>
       <div className="mt-8 bg-emerald-500 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-200">
          Generate Pass
       </div>
    </div>
  </div>
);

const DemoScreen2QR = () => (
  <div className="h-full flex flex-col items-center justify-center bg-emerald-600 text-white p-6">
    <div className="bg-white p-4 rounded-xl shadow-2xl mb-6">
       <QRCodeSVG value="DEMO" size={140} />
    </div>
    <h3 className="font-bold text-xl mb-1">Pass Ready</h3>
    <p className="text-emerald-100 text-xs">Valid for 24 Hours</p>
  </div>
);

const DemoScreen3Scan = () => (
  <div className="h-full bg-slate-900 relative flex flex-col items-center justify-center overflow-hidden">
    <div className="absolute inset-0 opacity-30 bg-slate-800"></div>
    <div className="w-48 h-48 border-2 border-emerald-400 rounded-lg relative z-10 overflow-hidden bg-black/20 backdrop-blur-sm">
       <div className="w-full h-0.5 bg-emerald-400 absolute top-0 animate-scan shadow-[0_0_15px_rgba(52,211,153,1)]"></div>
    </div>
    <div className="absolute bottom-12 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs">
       Guard Scanning QR
    </div>
  </div>
);

const DemoScreen4Success = () => (
  <div className="h-full bg-slate-50 flex flex-col p-6">
    <div className="bg-emerald-100 border border-emerald-200 rounded-xl p-4 flex items-center gap-4 mb-6">
       <div className="bg-emerald-500 rounded-full p-2 text-white">
          <CheckCircle size={20} />
       </div>
       <div>
          <h3 className="font-bold text-emerald-800">Verified</h3>
          <p className="text-xs text-emerald-600">Entry Logged</p>
       </div>
    </div>
    <div className="space-y-4">
      <div className="h-2 w-full bg-slate-200 rounded"></div>
      <div className="h-2 w-2/3 bg-slate-200 rounded"></div>
      <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
    </div>
  </div>
);

const DemoSimulation = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
     <div className="relative mx-auto bg-slate-800 border-[12px] border-slate-800 rounded-[2.5rem] h-[480px] w-[240px] shadow-2xl overflow-hidden transform-gpu">
        <div className="w-[80px] h-[16px] bg-slate-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
        <div className="w-full h-full bg-white relative rounded-[1.8rem] overflow-hidden">
            {step === 0 && <DemoScreen1Visitor />}
            {step === 1 && <DemoScreen2QR />}
            {step === 2 && <DemoScreen3Scan />}
            {step === 3 && <DemoScreen4Success />}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-30">
               {[0,1,2,3].map(i => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === step ? 'bg-emerald-500' : 'bg-slate-300'}`} />
               ))}
            </div>
        </div>
     </div>
  )
}

const ProposalDeck: React.FC<ProposalDeckProps> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      bg: "bg-slate-900",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in">
          <div className="p-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
             <Shield className="w-24 h-24 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-6xl font-extrabold text-white tracking-tight mb-4 uppercase">
              Belim<span className="text-emerald-400">bing</span>
            </h1>
            <p className="text-2xl text-slate-300 font-light">
              Modern QR Visitor Management Solution
            </p>
          </div>
          <div className="mt-12 flex gap-4 text-sm text-slate-500 uppercase tracking-widest font-semibold">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Faster Entry</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Zero Logbooks</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      bg: "bg-slate-800",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center h-full px-12">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 rounded-lg bg-red-500/10 text-red-400 font-bold uppercase tracking-wider text-sm">
              Current Challenges
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              No More Handwritten <span className="text-red-400">Logbooks</span>
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              Paper-based systems are slow, insecure, and create unnecessary stress for security personnel. It is time to modernize.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: FileText, title: "Illegible Records", desc: "Handwritten data is often impossible to read during audits." },
              { icon: Activity, title: "Heavy Workload", desc: "Guards spend too much time manually writing down details." },
              { icon: Lock, title: "Data Exposure", desc: "Visitor IC and phone numbers are visible to anyone in the lobby." }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-700/50 p-6 rounded-xl border border-slate-600 flex items-start gap-4">
                <div className="p-3 bg-slate-800 rounded-lg text-red-400">
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      bg: "bg-emerald-900",
      content: (
        <div className="flex flex-col h-full px-12 justify-center">
          <div className="mb-12">
            <div className="inline-block px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider text-sm mb-4">
              The Proposed Solution
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">Web-Based QR System</h2>
            <p className="text-xl text-emerald-100/70 max-w-3xl">
              A comprehensive digital ecosystem that eliminates paper and streamlines visitor arrivals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10">
               <div className="text-emerald-300 font-bold text-lg mb-4">Visitor Registration</div>
               <p className="text-emerald-100/60 text-sm">Visitors enter information (Name, IC, Vehicle No) via web link. System automatically generates a unique QR code for fast check-in.</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10">
               <div className="text-emerald-300 font-bold text-lg mb-4">Guard Check-In</div>
               <p className="text-emerald-100/60 text-sm">Guard scans the QR code. All visitor details appear instantly. Guard confirms entry and the system logs it to the database.</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10">
               <div className="text-emerald-300 font-bold text-lg mb-4">Digital Visitor Log</div>
               <p className="text-emerald-100/60 text-sm">All entries recorded in a secure database. Searchable, downloadable, and auditable with accurate timestamps.</p>
             </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      bg: "bg-indigo-950",
      content: (
        <div className="grid md:grid-cols-2 gap-16 items-center h-full px-12">
          <div className="order-2 md:order-1">
             <DemoSimulation />
          </div>
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-lg font-bold text-indigo-200 tracking-widest uppercase">Live Process Demo</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">Seamless Workflow</h2>
            <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold shrink-0">1</div>
                  <p className="text-indigo-200/80">Visitor registers online via smartphone before or upon arrival.</p>
               </div>
               <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold shrink-0">2</div>
                  <p className="text-indigo-200/80">A digital pass (QR) is issued instantly to the visitor.</p>
               </div>
               <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold shrink-0">3</div>
                  <p className="text-indigo-200/80">Guard scans the pass for 3-second verification and logging.</p>
               </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      bg: "bg-slate-900",
      content: (
         <div className="flex flex-col items-center justify-center h-full text-center max-w-5xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-white mb-12">Benefits to the Condominium</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left w-full">
               {[
                 { icon: Zap, title: "Faster Check-In", desc: "Reduces congestion at the guard house significantly." },
                 { icon: Database, title: "Cleaner Records", desc: "Standardized digital data eliminates messy handwriting." },
                 { icon: Activity, title: "Reduced Workload", desc: "Guards focus on security instead of data entry." },
                 { icon: Shield, title: "Higher Security", desc: "Accurate, real-time records for immediate auditing." },
                 { icon: Layout, title: "Modernization", desc: "Updates the property image to modern standards." },
                 { icon: Smartphone, title: "Zero Hardware", desc: "No purchase needed. Works on existing smartphones/tablets." }
               ].map((benefit, i) => (
                  <div key={i} className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <div className="text-emerald-400 mb-3"><benefit.icon size={24} /></div>
                    <h3 className="text-white font-bold mb-1">{benefit.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{benefit.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      )
    },
    {
      id: 6,
      bg: "bg-slate-850",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-5xl mx-auto px-6">
          <div className="inline-block px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold uppercase tracking-wider text-sm mb-4">
            Architecture
          </div>
          <h2 className="text-4xl font-bold text-white mb-12">Technical Overview</h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-left w-full">
            {[
              { icon: Globe, title: "Web-Based", desc: "No application installation required. Accessible via any browser." },
              { icon: Code, title: "Modern Stack", desc: "Built using modern, scalable technologies for longevity." },
              { icon: Cloud, title: "Cloud-Hosted", desc: "Securely hosted in the cloud with automated data backups." },
              { icon: Lock, title: "Enterprise Security", desc: "Secure API endpoints and advanced database encryption." },
              { icon: Tablet, title: "Device Agnostic", desc: "Works perfectly on phones or tablets at the guardhouse." }
            ].map((tech, i) => (
              <div key={i} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-start gap-4">
                <div className="text-indigo-400 mt-1 shrink-0"><tech.icon size={24} /></div>
                <div>
                  <h3 className="text-white font-bold mb-1">{tech.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 7,
      bg: "bg-gradient-to-br from-slate-900 to-emerald-900",
      content: (
         <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-5xl font-bold text-white mb-8">Modernize Today</h2>
            <button onClick={onClose} className="bg-white text-emerald-900 px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl">
               Explore System
            </button>
            <p className="mt-12 text-slate-400 text-sm">
               Project Proposal • {new Date().getFullYear()}
            </p>
         </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(c => c + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(c => c - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length]);

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
         <div className="font-bold text-slate-500 text-sm tracking-widest uppercase">
            Proposal Slide {currentSlide + 1}/{slides.length}
         </div>
         <button 
           onClick={onClose}
           className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
         >
           <X size={24} />
         </button>
      </div>

      <div className={`flex-1 relative overflow-hidden transition-colors duration-500 ${slides[currentSlide].bg}`}>
         <div className="absolute inset-0 flex items-center justify-center p-8 md:p-20 overflow-y-auto">
            {slides[currentSlide].content}
         </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center gap-6 z-50 pointer-events-none">
         <button 
           onClick={prevSlide}
           disabled={currentSlide === 0}
           className={`pointer-events-auto p-4 rounded-full backdrop-blur-md transition-all ${currentSlide === 0 ? 'bg-white/5 text-white/20' : 'bg-white/10 text-white hover:bg-white/20 hover:scale-110'}`}
         >
           <ChevronLeft size={32} />
         </button>
         <button 
           onClick={nextSlide}
           disabled={currentSlide === slides.length - 1}
           className={`pointer-events-auto p-4 rounded-full backdrop-blur-md transition-all ${currentSlide === slides.length - 1 ? 'bg-white/5 text-white/20' : 'bg-white/10 text-white hover:bg-white/20 hover:scale-110'}`}
         >
           <ChevronRight size={32} />
         </button>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
         <div 
           className="h-full bg-emerald-500 transition-all duration-300"
           style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
         ></div>
      </div>
    </div>
  );
};

// Internal icon proxy for Globe which was missing in imports
const Globe = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

export default ProposalDeck;
