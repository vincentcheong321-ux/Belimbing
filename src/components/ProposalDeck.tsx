
import React, { useState, useEffect } from 'react';
/* Added Share2 to the lucide-react imports */
import { ChevronLeft, ChevronRight, X, Shield, Smartphone, Zap, Database, Lock, Layout, CheckCircle, User, CreditCard, Scan, FileText, Activity, Code, Cloud, Cpu, ShieldCheck, Tablet, Car, UserMinus, BellRing, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ProposalDeckProps {
  onClose: () => void;
}

const DemoScreen1Visitor = () => (
  <div className="p-5 h-full flex flex-col bg-white text-slate-800">
    <div className="mb-3">
       <h3 className="font-bold text-lg leading-tight">Pre-Registration</h3>
       <p className="text-[10px] text-slate-400">Step 1: Visitor fills details & Purpose</p>
    </div>
    <div className="space-y-2 opacity-80 flex-1">
       <div className="bg-slate-100 p-2 rounded-lg flex gap-2 items-center border border-slate-200">
          <User size={12} className="text-slate-400" />
          <div className="h-1.5 w-20 bg-slate-300 rounded"></div>
       </div>
       <div className="bg-emerald-50 p-2 rounded-lg flex gap-2 items-center border border-emerald-100">
          <FileText size={12} className="text-emerald-400" />
          <div className="h-1.5 w-24 bg-emerald-200 rounded"></div>
       </div>
       <div className="bg-slate-100 p-2 rounded-lg flex gap-2 items-center border border-slate-200">
          <Smartphone size={12} className="text-slate-400" />
          <div className="h-1.5 w-16 bg-slate-300 rounded"></div>
       </div>
       <div className="grid grid-cols-3 gap-1.5">
          {[1,2,3].map(i => <div key={i} className="bg-slate-100 h-5 rounded border border-slate-200"></div>)}
       </div>
       <div className="mt-auto bg-emerald-500 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-emerald-200">
          Get Invite Pass
       </div>
    </div>
  </div>
);

const DemoScreen2QR = () => (
  <div className="h-full flex flex-col items-center justify-center bg-indigo-600 text-white p-6">
    <div className="bg-white p-4 rounded-xl shadow-2xl mb-6">
       <QRCodeSVG value="DEMO" size={120} />
    </div>
    <div className="bg-white/20 p-2 rounded-lg flex items-center gap-2 mb-4">
       <Smartphone size={14} />
       <span className="text-[10px] font-bold">Invitation Shared!</span>
    </div>
    <h3 className="font-bold text-xl mb-1">Pass Issued</h3>
  </div>
);

const DemoScreen3Scan = () => (
  <div className="h-full bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
    <div className="w-40 h-40 border-2 border-emerald-400 rounded-lg relative overflow-hidden bg-black/20">
       <div className="w-full h-0.5 bg-emerald-400 absolute top-0 animate-scan"></div>
    </div>
    <div className="mt-6 flex flex-col items-center gap-2">
       <div className="flex gap-2">
          <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded text-[10px] font-bold border border-red-500/30 flex items-center gap-1">
             <UserMinus size={10} /> Blacklist Check
          </div>
       </div>
       <p className="text-white text-[10px]">Scanning & Notifying...</p>
    </div>
  </div>
);

const DemoScreen4Success = () => (
  <div className="h-full bg-slate-50 flex flex-col p-6 items-center justify-center">
    <div className="bg-emerald-500 rounded-full p-4 text-white mb-4 shadow-xl shadow-emerald-200">
       <BellRing size={32} className="animate-bounce" />
    </div>
    <h3 className="font-bold text-slate-800 text-center">Resident Notified!</h3>
    <p className="text-slate-400 text-xs text-center mt-2">Instant app notification sent to resident upon arrival.</p>
  </div>
);

const DemoSimulation = () => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setStep(s => (s + 1) % 4), 3000);
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
               {[0,1,2,3].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === step ? 'bg-emerald-500' : 'bg-slate-300'}`} />)}
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
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
          <div className="p-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4"><Shield className="w-24 h-24 text-emerald-400" /></div>
          <div><h1 className="text-6xl font-extrabold text-white mb-4 uppercase">Belim<span className="text-emerald-400">bing</span></h1><p className="text-2xl text-slate-300">Advanced Visitor Management Ecosystem</p></div>
          <div className="mt-12 flex gap-4 text-sm text-slate-500 uppercase tracking-widest font-semibold">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Pre-Registration</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Instant Alerts</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      bg: "bg-emerald-900",
      content: (
        <div className="flex flex-col h-full px-12 justify-center">
          <div className="mb-12"><h2 className="text-4xl font-bold text-white mb-6">Enhanced Security Features</h2></div>
          <div className="grid md:grid-cols-2 gap-8">
             {[
               { icon: UserMinus, title: "Intelligent Blacklist", desc: "Instantly block suspicious visitors or persistent rule-breakers via IC tracking." },
               { icon: BellRing, title: "Instant Notifications", desc: "Residents receive real-time push alerts the moment their guest is scanned." },
               { icon: FileText, title: "Purpose Selection", desc: "Categorize visitors (Delivery, Contractor, Family) for granular data analysis." },
               { icon: Share2, title: "Invitation System", desc: "Residents can send digital passes directly to guest's smartphones before arrival." }
             ].map((item, i) => (
               <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex gap-4">
                  <div className="bg-emerald-500/20 p-3 rounded-xl text-emerald-300 h-fit"><item.icon size={24}/></div>
                  <div><h3 className="text-xl font-bold text-white mb-2">{item.title}</h3><p className="text-emerald-100/60 text-sm leading-relaxed">{item.desc}</p></div>
               </div>
             ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      bg: "bg-indigo-950",
      content: (
        <div className="grid md:grid-cols-2 gap-16 items-center h-full px-12">
          <div className="order-2 md:order-1"><DemoSimulation /></div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-bold text-white mb-6">Frictionless Experience</h2>
            <div className="space-y-6">
               <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">1</div><p className="text-indigo-100">Visitor/Resident pre-registers with purpose of visit.</p></div>
               <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">2</div><p className="text-indigo-100">QR Invitation sent to guest via WhatsApp/iMessage.</p></div>
               <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">3</div><p className="text-indigo-100">Security scans QR, system checks blacklist, and notifies resident.</p></div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => { if (currentSlide < slides.length - 1) setCurrentSlide(c => c + 1); };
  const prevSlide = () => { if (currentSlide > 0) setCurrentSlide(c => c - 1); };

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
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
         <div className="flex-1"></div>
         <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md"><X size={24} /></button>
      </div>
      <div className={`flex-1 relative transition-colors duration-500 ${slides[currentSlide].bg}`}>
         <div className="absolute inset-0 flex items-center justify-center p-8 overflow-y-auto">{slides[currentSlide].content}</div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center gap-6 z-50 pointer-events-none">
         <button onClick={prevSlide} disabled={currentSlide === 0} className={`pointer-events-auto p-4 rounded-full ${currentSlide === 0 ? 'opacity-20' : 'bg-white/10 hover:scale-110'}`}><ChevronLeft size={32} /></button>
         <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className={`pointer-events-auto p-4 rounded-full ${currentSlide === slides.length - 1 ? 'opacity-20' : 'bg-white/10 hover:scale-110'}`}><ChevronRight size={32} /></button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10"><div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}></div></div>
    </div>
  );
};

export default ProposalDeck;
