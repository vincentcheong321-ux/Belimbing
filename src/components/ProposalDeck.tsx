
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Shield, Smartphone, Zap, Brain, Lock, Layout, CheckCircle, User, CreditCard, Scan, Loader2 } from 'lucide-react';
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
       
       <div className="absolute cursor-pointer top-[60%] left-[60%]">
          <div className="w-8 h-8 bg-white/50 rounded-full animate-ping absolute"></div>
          <div className="w-8 h-8 bg-white/80 rounded-full border-2 border-emerald-500 relative z-10"></div>
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
    <div className="mt-8 bg-white/20 w-full h-10 rounded-lg flex items-center justify-center text-sm font-medium">
       Download
    </div>
  </div>
);

const DemoScreen3Scan = () => (
  <div className="h-full bg-slate-900 relative flex flex-col items-center justify-center overflow-hidden">
    <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
    <div className="w-48 h-48 border-2 border-emerald-400 rounded-lg relative z-10 overflow-hidden bg-black/20 backdrop-blur-sm">
       <div className="w-full h-0.5 bg-emerald-400 absolute top-0 animate-scan shadow-[0_0_15px_rgba(52,211,153,1)]"></div>
    </div>
    <div className="absolute bottom-12 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs">
       Align QR Code
    </div>
    <div className="absolute top-8 left-0 right-0 text-center text-white font-medium">
       Guard Terminal
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
          <h3 className="font-bold text-emerald-800">Access Granted</h3>
          <p className="text-xs text-emerald-600">Entry Logged</p>
       </div>
    </div>
    
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
       <div className="text-xs font-bold text-slate-400 uppercase mb-2">AI Log Generated</div>
       <div className="space-y-2">
          <div className="h-2 w-full bg-slate-100 rounded"></div>
          <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
          <div className="h-2 w-5/6 bg-slate-100 rounded"></div>
       </div>
    </div>
  </div>
);

const DemoSimulation = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 3500); // Cycle every 3.5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
     /* Outer phone shell with overflow-hidden to clip content */
     <div className="relative mx-auto bg-slate-800 border-[12px] border-slate-800 rounded-[2.5rem] h-[500px] w-[260px] shadow-2xl overflow-hidden transform-gpu">
        {/* Notch */}
        <div className="w-[100px] h-[18px] bg-slate-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20 pointer-events-none"></div>
        
        {/* Inner Screen Container - Adjusted radius to 1.7rem for perfect fit without bleed */}
        <div className="w-full h-full bg-white relative rounded-[1.7rem] overflow-hidden z-0">
            {step === 0 && <DemoScreen1Visitor />}
            {step === 1 && <DemoScreen2QR />}
            {step === 2 && <DemoScreen3Scan />}
            {step === 3 && <DemoScreen4Success />}
            
            {/* Step Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-30 pointer-events-none">
               {[0,1,2,3].map(i => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === step ? 'bg-emerald-500 w-3' : 'bg-slate-300'}`} />
               ))}
            </div>
            
            {/* Context Label */}
            <div className="absolute top-2 left-0 right-0 text-[10px] text-center font-bold text-slate-400 z-10 pt-2 pointer-events-none">
               {step === 0 && "VISITOR APP"}
               {step === 1 && "VISITOR APP"}
               {step === 2 && "GUARD APP"}
               {step === 3 && "GUARD APP"}
            </div>
        </div>
     </div>
  )
}

// --- End Demo Components ---

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
          <h1 className="text-6xl font-extrabold text-white tracking-tight mb-4">
            Belim<span className="text-emerald-400">bing</span>
          </h1>
          <p className="text-2xl text-slate-300 font-light tracking-wide">
            Next-Generation Visitor Management System
          </p>
        </div>
        <div className="mt-12 flex gap-4 text-sm text-slate-500 uppercase tracking-widest font-semibold">
          <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Secure</span>
          <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Efficient</span>
          <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Compliant</span>
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
            The Problem
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            Traditional Security is <span className="text-red-400">Obsolete</span>
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed">
            Manual logbooks are the bottleneck of modern residential security. They create congestion, offer poor data privacy, and are often illegible for auditing.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: Layout, title: "Inefficient Process", desc: "Long queues at guardhouses during peak hours." },
            { icon: Lock, title: "Data Privacy Risks", desc: "Visitor personal data (IC/Phone) exposed in open books." },
            { icon: Zap, title: "No Real-time Validation", desc: "Guards cannot instantly verify past entry history." }
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
            The Solution
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">Seamless Digital Entry</h2>
          <p className="text-xl text-emerald-100/70 max-w-3xl">
            A specialized web application tailored for the Malaysian condominium context, enabling self-service registration and rapid verification.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center">
             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-300">
               <Smartphone size={32} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Visitor Pre-Reg</h3>
             <p className="text-emerald-100/60">Visitors fill details (IC, Lot No) via web link to generate a secure QR code.</p>
           </div>
           <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-24 bg-emerald-500/20 blur-3xl rounded-full -mr-12 -mt-12"></div>
             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-300 relative z-10">
               <Zap size={32} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2 relative z-10">3-Second Scan</h3>
             <p className="text-emerald-100/60 relative z-10">Guards scan the QR. System validates expiry (24h) and details instantly.</p>
           </div>
           <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center">
             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-300">
               <Brain size={32} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">AI Logging</h3>
             <p className="text-emerald-100/60">Google Gemini AI generates professional audit logs automatically.</p>
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
           <div className="text-center mt-6 text-indigo-300/60 text-sm font-mono">
              Live System Simulation
           </div>
        </div>
        <div className="order-1 md:order-2">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
             <span className="text-lg font-bold text-indigo-200 tracking-widest uppercase">System Walkthrough</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">Simple, Fast, Contactless</h2>
          <div className="space-y-6">
             <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                   <h3 className="text-white font-bold text-lg">Visitor Registers</h3>
                   <p className="text-indigo-200/60">Completes simple web form with required details.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                   <h3 className="text-white font-bold text-lg">QR Generated</h3>
                   <p className="text-indigo-200/60">Instant digital pass, valid for 24 hours.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                   <h3 className="text-white font-bold text-lg">Guard Scans</h3>
                   <p className="text-indigo-200/60">Instant validation and AI-powered audit logging.</p>
                </div>
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
       <div className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-12">Why Choose Belimbing?</h2>
          
          <div className="grid md:grid-cols-2 gap-8 text-left w-full">
             <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-colors">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                   <span className="text-2xl">🇲🇾</span> Malaysian Context
                </h3>
                <p className="text-slate-400">
                   Specifically designed fields for IC Numbers, Block/Lot addressing formats, and local enforcement standards.
                </p>
             </div>
             <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-colors">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                   <Zap className="text-emerald-400" /> Speed & Cost
                </h3>
                <p className="text-slate-400">
                   Zero hardware investment. Runs on any standard smartphone or tablet. Reduces visitor processing time by 80%.
                </p>
             </div>
             <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-colors">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                   <Lock className="text-emerald-400" /> Digital Trail
                </h3>
                <p className="text-slate-400">
                   Eliminates paper logs. Creates a searchable, exportable digital CSV database for management audits.
                </p>
             </div>
             <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-colors">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                   <Layout className="text-emerald-400" /> User Experience
                </h3>
                <p className="text-slate-400">
                   Clean, professional interface for both visitors and non-technical security guards.
                </p>
             </div>
          </div>
       </div>
    )
  },
  {
    id: 6,
    bg: "bg-gradient-to-br from-slate-900 to-emerald-900",
    content: (
       <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-5xl font-bold text-white mb-8">Ready to modernize?</h2>
          <div className="text-2xl text-emerald-300 font-light mb-12">
             Belimbing: Secure. Smart. Simple.
          </div>
          <button className="bg-white text-emerald-900 px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl">
             Launch Demo
          </button>
          <p className="mt-12 text-slate-400 text-sm">
             Proposal Generated by Belimbing System • {new Date().getFullYear()}
          </p>
       </div>
    )
  }
];

const ProposalDeck: React.FC<ProposalDeckProps> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(c => c + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(c => c - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
         <div className="font-bold text-slate-500 text-sm tracking-widest uppercase">
            Project Proposal • Slide {currentSlide + 1}/{slides.length}
         </div>
         <button 
           onClick={onClose}
           className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
         >
           <X size={24} />
         </button>
      </div>

      {/* Main Slide Content */}
      <div className={`flex-1 relative overflow-hidden transition-colors duration-500 ${slides[currentSlide].bg}`}>
         <div className="absolute inset-0 flex items-center justify-center p-8 md:p-20 overflow-y-auto">
            {slides[currentSlide].content}
         </div>
      </div>

      {/* Controls */}
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
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
         <div 
           className="h-full bg-emerald-500 transition-all duration-300"
           style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
         ></div>
      </div>
    </div>
  );
};

export default ProposalDeck;
