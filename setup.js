import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// 1. CONFIGURATION FILES
// ==========================================
const configFiles = {
  'package.json': JSON.stringify({
    "name": "belimbing-visitor-system",
    "private": true,
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "tsc && vite build",
      "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
      "preview": "vite preview"
    },
    "dependencies": {
      "@google/genai": "*",
      "jsqr": "^1.4.0",
      "lucide-react": "^0.344.0",
      "qrcode.react": "^3.1.0",
      "react": "^18.3.1",
      "react-dom": "^18.3.1"
    },
    "devDependencies": {
      "@types/react": "^18.3.3",
      "@types/react-dom": "^18.3.0",
      "@vitejs/plugin-react": "^4.3.1",
      "autoprefixer": "^10.4.19",
      "postcss": "^8.4.38",
      "tailwindcss": "^3.4.4",
      "typescript": "^5.5.3",
      "vite": "^5.3.1"
    }
  }, null, 2),

  'vite.config.ts': `import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'process.env': {}
    }
  };
});`,

  'tsconfig.json': JSON.stringify({
    "compilerOptions": {
      "target": "ES2020",
      "useDefineForClassFields": true,
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "skipLibCheck": true,
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "jsx": "react-jsx",
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true
    },
    "include": ["src"],
    "references": [{ "path": "./tsconfig.node.json" }]
  }, null, 2),

  'tsconfig.node.json': JSON.stringify({
    "compilerOptions": {
      "composite": true,
      "skipLibCheck": true,
      "module": "ESNext",
      "moduleResolution": "bundler",
      "allowSyntheticDefaultImports": true
    },
    "include": ["vite.config.ts"]
  }, null, 2),

  'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#1e293b',
          900: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}`,

  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
    <title>Belimbing</title>
  </head>
  <body class="bg-slate-900 text-slate-100 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>`,

  'metadata.json': JSON.stringify({
    "name": "Belimbing - Visitor Management",
    "description": "Secure visitor check-in system with QR code generation and AI-powered guard logging.",
    "requestFramePermissions": ["camera"]
  }, null, 2)
};

// ==========================================
// 2. SOURCE FILES (src/)
// ==========================================
const srcFiles = {
  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0f172a;
  color: #f1f5f9;
}`,

  'src/index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

  'src/types.ts': `export interface VisitorData {
  fullName: string;
  phoneNumber: string;
  icNumber: string;
  carPlate?: string;
  blockNumber: string;
  lotNumber: string;
  unitNumber: string;
  timestamp: number;
}

export interface SecurityLog {
  id: string;
  visitorName: string;
  icNumber: string;
  carPlate?: string;
  destination: string;
  checkInTime: string;
  status: 'GRANTED' | 'DENIED' | 'EXPIRED';
  aiAnalysis: string;
}

export enum AppMode {
  HOME = 'HOME',
  VISITOR = 'VISITOR',
  GUARD = 'GUARD',
  PRESENTATION = 'PRESENTATION'
}`,

  'src/App.tsx': `import React, { useState } from 'react';
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
}`,

  'src/services/gemini.ts': `import { GoogleGenAI } from "@google/genai";
import { VisitorData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const logVisitorEntry = async (visitor: VisitorData, status: string): Promise<string> => {
  try {
    const prompt = \`
      Create a formal, brief security log entry for a condominium visitor check-in.
      
      Visitor Details:
      - Name: \${visitor.fullName}
      - IC: \${visitor.icNumber} (Mask the middle digits for privacy in the log)
      - Car Plate: \${visitor.carPlate || 'N/A'}
      - Destination: Block \${visitor.blockNumber}, Lot \${visitor.lotNumber}, Unit \${visitor.unitNumber}
      - Check-in Status: \${status}
      - Time: \${new Date().toLocaleString()}

      The log should be professional and suitable for a property management audit trail. 
      Mention if the check-in is standard or if there are any noted regularities based on standard Malaysian condo protocols (just imply standard procedure was followed).
      Keep it under 50 words.
    \`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Log entry generated successfully.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Manual Override: System offline, entry logged locally.";
  }
};`,

  'src/services/storage.ts': `import { SecurityLog } from '../types';

const STORAGE_KEY = 'belimbing_logs_v1';

export const getLogs = (): SecurityLog[] => {
  try {
    const logs = localStorage.getItem(STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (e) {
    console.error("Failed to parse logs", e);
    return [];
  }
};

export const saveLog = (log: SecurityLog): void => {
  try {
    const logs = getLogs();
    const newLogs = [log, ...logs];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
  } catch (e) {
    console.error("Failed to save log", e);
  }
};

export const clearLogs = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};`,

  // Components
  'src/components/QRScanner.tsx': `import React, { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import { XCircle } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const requestRef = useRef<number>(0);

  const scan = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      setLoading(false);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          onScan(code.data);
          return;
        }
      }
    }
    requestRef.current = requestAnimationFrame(scan);
  }, [onScan]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true"); 
          videoRef.current.play();
          requestRef.current = requestAnimationFrame(scan);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Unable to access camera. Please check permissions.");
        setLoading(false);
      }
    };
    startCamera();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [scan]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4 z-50">
        <button onClick={onClose} className="p-2 bg-white/20 rounded-full text-white backdrop-blur-sm">
          <XCircle size={32} />
        </button>
      </div>
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {loading && <div className="absolute text-white animate-pulse">Initializing Camera...</div>}
        {error && <div className="absolute text-red-400 px-6 text-center">{error}</div>}
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute border-2 border-emerald-500 w-64 h-64 rounded-lg bg-transparent shadow-[0_0_0_999px_rgba(0,0,0,0.7)] pointer-events-none flex items-center justify-center">
             <div className="w-60 h-0.5 bg-emerald-500 opacity-50 animate-[ping_1.5s_ease-in-out_infinite]"></div>
        </div>
        <div className="absolute bottom-10 text-white bg-black/50 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
            Align QR code within frame
        </div>
      </div>
    </div>
  );
};
export default QRScanner;`,

  'src/components/VisitorForm.tsx': `import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { VisitorData } from '../types';
import { User, Phone, MapPin, Building, CreditCard, ArrowLeft, Download, CheckCircle, Car, Home } from 'lucide-react';

interface VisitorFormProps {
  onBack: () => void;
}

const VisitorForm: React.FC<VisitorFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState<Partial<VisitorData>>({
    fullName: '',
    phoneNumber: '',
    icNumber: '',
    carPlate: '',
    blockNumber: '',
    lotNumber: '',
    unitNumber: ''
  });
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'icNumber' || name === 'phoneNumber') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/\\D/g, '') }));
    } else if (name === 'carPlate') {
      setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else if (name === 'blockNumber') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/[^a-zA-Z]/g, '').toUpperCase() }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: VisitorData = {
      fullName: formData.fullName!,
      phoneNumber: formData.phoneNumber!,
      icNumber: formData.icNumber!,
      carPlate: formData.carPlate || 'N/A',
      blockNumber: formData.blockNumber!,
      lotNumber: formData.lotNumber!,
      unitNumber: formData.unitNumber!,
      timestamp: Date.now()
    };
    setGeneratedQR(JSON.stringify(payload));
  };

  if (generatedQR) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 flex flex-col items-center justify-center animate-fade-in">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
          <div className="bg-emerald-600 p-6 text-white text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-2" />
            <h2 className="text-2xl font-bold">Access Pass Generated</h2>
            <p className="opacity-90 text-sm mt-1">Valid for 24 Hours</p>
          </div>
          <div className="p-8 flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl border-2 border-slate-600 shadow-inner">
              <QRCodeSVG value={generatedQR} size={220} level="H" includeMargin={true} />
            </div>
            <p className="mt-6 text-slate-400 text-center text-sm px-4">
              Please present this QR code to the security guard at the main entrance.
            </p>
            <div className="mt-8 w-full space-y-3">
               <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-900 py-3 rounded-xl font-semibold hover:bg-white transition-colors">
                <Download size={18} /> Save / Print
              </button>
              <button onClick={() => setGeneratedQR(null)} className="w-full py-3 text-slate-400 hover:text-white font-medium">
                Generate New Pass
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="mr-2" size={20} /> Back to Home
        </button>
        <div className="bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-700">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Visitor Registration</h1>
            <p className="text-slate-400 mt-2">Please fill in your details to generate an entry pass.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name (as per IC)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="text-slate-500" size={18} /></div>
                <input required name="fullName" type="text" value={formData.fullName} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 outline-none transition-all" placeholder="Ali Bin Abu" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">IC Number (Digits Only)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><CreditCard className="text-slate-500" size={18} /></div>
                <input required name="icNumber" type="text" inputMode="numeric" value={formData.icNumber} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 outline-none transition-all" placeholder="e.g. 901020105555" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Car Plate Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Car className="text-slate-500" size={18} /></div>
                <input name="carPlate" type="text" value={formData.carPlate} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 outline-none transition-all" placeholder="ABC 1234" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="text-slate-500" size={18} /></div>
                <input required name="phoneNumber" type="tel" inputMode="numeric" value={formData.phoneNumber} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 outline-none transition-all" placeholder="0123456789" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Block</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Building className="text-slate-500" size={18} /></div>
                  <input required name="blockNumber" type="text" value={formData.blockNumber} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 outline-none transition-all" placeholder="A" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Lot No.</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="text-slate-500" size={18} /></div>
                  <input required name="lotNumber" type="text" value={formData.lotNumber} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 outline-none transition-all" placeholder="10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Unit No.</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Home className="text-slate-500" size={18} /></div>
                  <input required name="unitNumber" type="text" value={formData.unitNumber} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 outline-none transition-all" placeholder="05" />
                </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-lg shadow-emerald-600/20 mt-4">Generate Pass</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default VisitorForm;`,

  'src/components/GuardDashboard.tsx': `import React, { useState, useEffect } from 'react';
import { Scan, ShieldCheck, ShieldAlert, Clock, ArrowLeft, Loader2, CheckSquare, FileText, Sparkles } from 'lucide-react';
import QRScanner from './QRScanner';
import VisitorLogs from './VisitorLogs';
import { VisitorData, SecurityLog } from '../types';
import { logVisitorEntry } from '../services/gemini';
import { saveLog, getLogs } from '../services/storage';

interface GuardDashboardProps {
  onBack: () => void;
}

type DashboardView = 'HOME' | 'SCANNER' | 'LOGS';

const formatLogContent = (text: string) => {
  if (!text) return null;
  const cleanText = text.replace(/^"|"$/g, ''); 
  return cleanText.split(/(\\*\\*.*?\\*\\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <span key={index} className="font-semibold text-emerald-400">{part.slice(2, -2)}</span>;
    }
    return <span key={index} className="text-slate-300">{part}</span>;
  });
};

const GuardDashboard: React.FC<GuardDashboardProps> = ({ onBack }) => {
  const [view, setView] = useState<DashboardView>('HOME');
  const [scannedData, setScannedData] = useState<VisitorData | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'VALID' | 'EXPIRED' | 'INVALID'>('IDLE');
  const [isLogging, setIsLogging] = useState(false);
  const [aiLog, setAiLog] = useState<string | null>(null);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    if (view === 'HOME') {
      const logs = getLogs();
      const today = new Date().setHours(0,0,0,0);
      const count = logs.filter(l => new Date(l.checkInTime).setHours(0,0,0,0) === today).length;
      setTodayCount(count);
    }
  }, [view]);

  const handleScan = (data: string) => {
    setView('HOME');
    try {
      const visitor: VisitorData = JSON.parse(data);
      setScannedData(visitor);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (now - visitor.timestamp > twentyFourHours) {
        setStatus('EXPIRED');
      } else {
        setStatus('VALID');
      }
    } catch (e) {
      setStatus('INVALID');
    }
  };

  const handleCheckIn = async () => {
    if (!scannedData) return;
    setIsLogging(true);
    const logText = await logVisitorEntry(scannedData, status);
    setAiLog(logText);
    const newLogEntry: SecurityLog = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      visitorName: scannedData.fullName,
      icNumber: scannedData.icNumber,
      carPlate: scannedData.carPlate,
      destination: \`Blk \${scannedData.blockNumber} - \${scannedData.lotNumber} - \${scannedData.unitNumber}\`,
      checkInTime: new Date().toISOString(),
      status: status === 'VALID' ? 'GRANTED' : (status === 'EXPIRED' ? 'EXPIRED' : 'DENIED'),
      aiAnalysis: logText
    };
    saveLog(newLogEntry);
    setIsLogging(false);
    setTodayCount(prev => prev + 1);
  };

  const resetScanner = () => {
    setScannedData(null);
    setStatus('IDLE');
    setAiLog(null);
    setView('SCANNER');
  };

  if (view === 'LOGS') return <VisitorLogs onBack={() => setView('HOME')} />;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6">
      {view === 'SCANNER' && <QRScanner onScan={handleScan} onClose={() => setView('HOME')} />}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2" /> Back
          </button>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <ShieldCheck size={20} /> <span>Guard Terminal</span>
          </div>
        </div>

        {!scannedData ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center justify-center h-[50vh] border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/30 p-8 text-center">
              <Scan size={64} className="text-slate-500 mb-6" />
              <h2 className="text-2xl font-bold mb-2">Visitor Check-in</h2>
              <p className="text-slate-400 max-w-xs mb-8">Scan visitor QR codes to verify validity and log entry.</p>
              <button onClick={() => setView('SCANNER')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-3 text-lg w-full sm:w-auto justify-center">
                <Scan /> Launch Scanner
              </button>
            </div>
            <button onClick={() => setView('LOGS')} className="group bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-4 rounded-xl font-semibold border border-slate-700 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3"><FileText size={20} className="text-emerald-500" /> <span>View Access Logs</span></div>
              <div className="bg-slate-900 px-3 py-1 rounded-full text-xs font-mono text-emerald-400 border border-slate-700 group-hover:border-slate-600">{todayCount} Today</div>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={\`p-6 rounded-xl border-l-4 shadow-lg \${status === 'VALID' ? 'bg-emerald-900/20 border-emerald-500' : status === 'EXPIRED' ? 'bg-amber-900/20 border-amber-500' : 'bg-red-900/20 border-red-500'}\`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={\`text-xl font-bold \${status === 'VALID' ? 'text-emerald-400' : status === 'EXPIRED' ? 'text-amber-400' : 'text-red-400'}\`}>
                    {status === 'VALID' ? 'Access Granted' : status === 'EXPIRED' ? 'Pass Expired' : 'Invalid QR'}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">Scanned at {new Date().toLocaleTimeString()}</p>
                </div>
                {status === 'VALID' ? <CheckSquare className="text-emerald-500" size={32} /> : <ShieldAlert className="text-amber-500" size={32} />}
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">Visitor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="text-xs text-slate-400 uppercase tracking-wider">Full Name</label><p className="text-lg font-medium text-white">{scannedData.fullName}</p></div>
                <div><label className="text-xs text-slate-400 uppercase tracking-wider">IC Number</label><p className="text-lg font-medium text-white font-mono">{scannedData.icNumber}</p></div>
                <div><label className="text-xs text-slate-400 uppercase tracking-wider">Car Plate</label><p className="text-lg font-medium text-white font-mono">{scannedData.carPlate || 'N/A'}</p></div>
                <div><label className="text-xs text-slate-400 uppercase tracking-wider">Destination</label><p className="text-lg font-medium text-white">Block {scannedData.blockNumber} - {scannedData.lotNumber} - {scannedData.unitNumber}</p></div>
                <div className="md:col-span-2"><label className="text-xs text-slate-400 uppercase tracking-wider">Pass Generated</label><div className="flex items-center gap-2 text-slate-300"><Clock size={16} />{new Date(scannedData.timestamp).toLocaleString()}</div></div>
              </div>
            </div>

            {aiLog ? (
               <div className="bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-slate-700 animate-fade-in">
                  <div className="p-4 bg-slate-900 border-b border-slate-700 flex items-center gap-2">
                     <ShieldCheck size={20} className="text-emerald-400" />
                     <h3 className="font-semibold text-white">Entry Logged Successfully</h3>
                  </div>
                  <div className="p-6">
                     <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-6">
                       <div className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wide flex items-center gap-1.5"><Sparkles size={12} /> System Audit Trail</div>
                       <p className="text-slate-400 text-sm leading-relaxed">{formatLogContent(aiLog)}</p>
                     </div>
                     <div className="flex gap-4">
                        <button onClick={() => setView('LOGS')} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors">View All Logs</button>
                        <button onClick={resetScanner} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-medium transition-colors">Scan Next</button>
                     </div>
                  </div>
               </div>
            ) : (
              <div className="flex gap-4">
                <button onClick={() => setScannedData(null)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors border border-slate-700">Cancel</button>
                <button onClick={handleCheckIn} disabled={status !== 'VALID' || isLogging} className={\`flex-1 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 \${status === 'VALID' ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}\`}>
                  {isLogging ? <Loader2 className="animate-spin" /> : <CheckSquare />}
                  {isLogging ? 'Logging...' : 'Confirm Entry'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default GuardDashboard;`,

  'src/components/VisitorLogs.tsx': `import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Trash2, Search, FileText, CheckCircle, XCircle, Clock, Download, Filter, Calendar, ShieldAlert, MapPin, CreditCard, Sparkles, Car } from 'lucide-react';
import { SecurityLog } from '../types';
import { getLogs, clearLogs } from '../services/storage';

interface VisitorLogsProps {
  onBack: () => void;
}

const formatLogContent = (text: string) => {
  if (!text) return null;
  const cleanText = text.replace(/^"|"$/g, ''); 
  const parts = cleanText.split(/(\\*\\*.*?\\*\\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <span key={index} className="font-semibold text-emerald-400">{part.slice(2, -2)}</span>;
    }
    return <span key={index} className="text-slate-300">{part}</span>;
  });
};

const VisitorLogs: React.FC<VisitorLogsProps> = ({ onBack }) => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'GRANTED' | 'DENIED' | 'EXPIRED'>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY'>('ALL');

  useEffect(() => { setLogs(getLogs()); }, []);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all visitor history? This action cannot be undone.')) {
      clearLogs();
      setLogs([]);
    }
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['ID', 'Visitor Name', 'IC Number', 'Car Plate', 'Destination', 'Check-In Time', 'Status', 'AI Note'];
    const rows = logs.map(log => [
      log.id,
      \`"\${log.visitorName}"\`, 
      \`"\${log.icNumber}"\`,
      \`"\${log.carPlate || 'N/A'}"\`,
      \`"\${log.destination}"\`,
      new Date(log.checkInTime).toLocaleString(),
      log.status,
      \`"\${log.aiAnalysis.replace(/"/g, '""')}"\`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = \`visitor_logs_\${new Date().toISOString().split('T')[0]}.csv\`;
    link.click();
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.icNumber.includes(searchTerm) ||
        (log.carPlate && log.carPlate.toLowerCase().includes(searchTerm.toLowerCase())) ||
        log.destination.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
      let matchesDate = true;
      if (dateFilter === 'TODAY') {
        const logDate = new Date(log.checkInTime).setHours(0,0,0,0);
        const today = new Date().setHours(0,0,0,0);
        matchesDate = logDate === today;
      }
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [logs, searchTerm, statusFilter, dateFilter]);

  const groupedLogs = useMemo(() => {
    const groups: Record<string, SecurityLog[]> = {};
    filteredLogs.forEach(log => {
      const dateKey = new Date(log.checkInTime).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(log);
    });
    return groups;
  }, [filteredLogs]);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col">
      <div className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-20 shadow-xl">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={onBack} className="p-2 mr-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"><ArrowLeft size={20} /></button>
              <div><h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white"><FileText className="text-emerald-400" /> Visitor Logs</h1><p className="text-xs text-slate-400">{filteredLogs.length} record{filteredLogs.length !== 1 ? 's' : ''} found</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleExportCSV} disabled={logs.length === 0} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"><Download size={16} /> <span className="hidden sm:inline">Export CSV</span></button>
              {logs.length > 0 && (<button onClick={handleClear} className="p-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors" title="Clear All History"><Trash2 size={20} /></button>)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
             <div className="md:col-span-5 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} /><input type="text" placeholder="Search name, IC, plate, unit..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-200 placeholder-slate-500" /></div>
             <div className="md:col-span-4 flex items-center gap-2 bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-1.5"><Filter size={16} className="text-slate-400" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="bg-transparent border-none text-sm text-slate-200 focus:ring-0 w-full outline-none"><option value="ALL">All Statuses</option><option value="GRANTED">Granted</option><option value="DENIED">Denied</option><option value="EXPIRED">Expired</option></select></div>
             <div className="md:col-span-3 flex bg-slate-900/50 rounded-lg border border-slate-600 p-1">
               <button onClick={() => setDateFilter('ALL')} className={\`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors \${dateFilter === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}\`}>All Time</button>
               <button onClick={() => setDateFilter('TODAY')} className={\`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors \${dateFilter === 'TODAY' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}\`}>Today</button>
             </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
        <div className="max-w-5xl mx-auto">
          {Object.keys(groupedLogs).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50"><Search size={64} className="mb-4 text-slate-600" /><p className="text-xl font-medium text-slate-400">No logs found matching criteria</p></div>
          ) : (
            (Object.entries(groupedLogs) as [string, SecurityLog[]][]).map(([date, dateLogs]) => (
              <div key={date} className="mb-8 animate-fade-in">
                <h3 className="sticky top-0 bg-slate-900/95 backdrop-blur-sm py-2 text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 z-10 border-b border-slate-800 flex items-center gap-2"><Calendar size={14} />{date}</h3>
                <div className="grid gap-4">
                  {dateLogs.map((log) => {
                    const statusColor = log.status === 'GRANTED' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : log.status === 'EXPIRED' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10';
                    return (
                      <div key={log.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg hover:border-slate-600 transition-all">
                         <div className="bg-slate-900/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/50">
                            <div className="flex items-center gap-4">
                               <div className={\`p-2 rounded-full \${statusColor.split(' ')[2]}\`}>{log.status === 'GRANTED' ? <CheckCircle size={20} className="text-emerald-500" /> : log.status === 'EXPIRED' ? <Clock size={20} className="text-amber-500" /> : <ShieldAlert size={20} className="text-red-500" />}</div>
                               <div><h4 className="text-lg font-bold text-white leading-tight">{log.visitorName}</h4><div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5"><span className="font-mono bg-slate-800 px-1 rounded">{log.id.slice(-6)}</span><span>•</span><span>{new Date(log.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div></div>
                            </div>
                            <span className={\`px-3 py-1 rounded-full text-xs font-bold border w-fit \${statusColor}\`}>{log.status}</span>
                         </div>
                         <div className="p-4 grid lg:grid-cols-5 gap-6">
                            <div className="lg:col-span-2 space-y-4">
                               <div><div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><CreditCard size={12} /> IC / Passport</div><div className="font-mono text-slate-200 text-sm bg-slate-900/50 p-2 rounded border border-slate-700/50">{log.icNumber}</div></div>
                               <div><div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Car size={12} /> Car Plate</div><div className="font-mono text-slate-200 text-sm bg-slate-900/50 p-2 rounded border border-slate-700/50">{log.carPlate || 'N/A'}</div></div>
                               <div><div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin size={12} /> Destination</div><div className="text-slate-200 text-sm font-medium bg-slate-900/50 p-2 rounded border border-slate-700/50">{log.destination}</div></div>
                            </div>
                            <div className="lg:col-span-3">
                               <div className="h-full bg-slate-950 rounded-lg border border-slate-800 p-4 relative group">
                                  <div className="absolute top-0 right-0 p-2 opacity-50"><Sparkles size={16} className="text-indigo-500" /></div>
                                  <div className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wide flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> System Audit Trail</div>
                                  <div className="text-sm text-slate-400 leading-relaxed font-light">{formatLogContent(log.aiAnalysis)}</div>
                               </div>
                            </div>
                         </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default VisitorLogs;`,

  'src/components/ProposalDeck.tsx': `import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Shield, Smartphone, Zap, Brain, Lock, Layout, CheckCircle, User, CreditCard } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ProposalDeckProps {
  onClose: () => void;
}
const DemoSimulation = () => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => { setStep((s) => (s + 1) % 4); }, 3500);
    return () => clearInterval(timer);
  }, []);
  return (
     <div className="relative mx-auto border-slate-800 bg-slate-800 border-[12px] rounded-[2.5rem] h-[500px] w-[260px] shadow-2xl">
        <div className="w-[100px] h-[18px] bg-slate-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
        <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative flex items-center justify-center text-slate-800">
           {step === 0 && <div className="p-4 text-center"><User className="mx-auto mb-2" size={32}/>Visitor Form</div>}
           {step === 1 && <div className="p-4 text-center"><QRCodeSVG value="DEMO" size={100} /><div className="mt-2 text-xs font-bold">QR Ready</div></div>}
           {step === 2 && <div className="p-4 text-center bg-slate-900 text-white w-full h-full flex flex-col items-center justify-center"><div>Scanner Active</div><div className="border border-emerald-400 w-32 h-32 mt-4 animate-pulse"></div></div>}
           {step === 3 && <div className="p-4 text-center bg-emerald-50 w-full h-full flex flex-col items-center justify-center"><CheckCircle size={48} className="text-emerald-500 mb-2" /><div className="font-bold text-emerald-800">Access Granted</div></div>}
        </div>
     </div>
  )
}
const slides = [
  {
    id: 1, bg: "bg-slate-900", content: (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in">
        <div className="p-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4"><Shield className="w-24 h-24 text-emerald-400" /></div>
        <div><h1 className="text-6xl font-extrabold text-white tracking-tight mb-4">Belim<span className="text-emerald-400">bing</span></h1><p className="text-2xl text-slate-300 font-light tracking-wide">Next-Generation Visitor Management System</p></div>
      </div>
    )
  },
  {
    id: 2, bg: "bg-slate-800", content: (
      <div className="grid md:grid-cols-2 gap-12 items-center h-full px-12">
        <div className="space-y-6"><div className="inline-block px-4 py-2 rounded-lg bg-red-500/10 text-red-400 font-bold uppercase tracking-wider text-sm">The Problem</div><h2 className="text-4xl font-bold text-white leading-tight">Traditional Security is <span className="text-red-400">Obsolete</span></h2><p className="text-xl text-slate-400 leading-relaxed">Manual logbooks are the bottleneck of modern residential security.</p></div>
        <div className="grid grid-cols-1 gap-4">{[{ icon: Layout, title: "Inefficient Process", desc: "Long queues at guardhouses." }, { icon: Lock, title: "Data Privacy Risks", desc: "Visitor data exposed in open books." }, { icon: Zap, title: "No Real-time Validation", desc: "Guards cannot verify past history." }].map((item, idx) => (<div key={idx} className="bg-slate-700/50 p-6 rounded-xl border border-slate-600 flex items-start gap-4"><div className="p-3 bg-slate-800 rounded-lg text-red-400"><item.icon size={24} /></div><div><h3 className="text-lg font-bold text-white">{item.title}</h3><p className="text-slate-400 text-sm mt-1">{item.desc}</p></div></div>))}</div>
      </div>
    )
  },
  {
    id: 3, bg: "bg-emerald-900", content: (
      <div className="flex flex-col h-full px-12 justify-center"><div className="mb-12"><div className="inline-block px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider text-sm mb-4">The Solution</div><h2 className="text-4xl font-bold text-white mb-6">Seamless Digital Entry</h2></div><div className="grid md:grid-cols-3 gap-8"><div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center"><Smartphone size={32} className="mx-auto mb-4 text-emerald-300" /><h3 className="text-xl font-bold text-white mb-2">Pre-Reg</h3></div><div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center"><Zap size={32} className="mx-auto mb-4 text-emerald-300" /><h3 className="text-xl font-bold text-white mb-2">Fast Scan</h3></div><div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center"><Brain size={32} className="mx-auto mb-4 text-emerald-300" /><h3 className="text-xl font-bold text-white mb-2">AI Logging</h3></div></div></div>
    )
  },
  {
    id: 4, bg: "bg-indigo-950", content: (
      <div className="grid md:grid-cols-2 gap-16 items-center h-full px-12"><div className="order-2 md:order-1"><DemoSimulation /></div><div className="order-1 md:order-2"><h2 className="text-4xl font-bold text-white mb-6">Simple, Fast, Contactless</h2><div className="space-y-6"><div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">1</div><div><h3 className="text-white font-bold text-lg">Visitor Registers</h3></div></div><div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">2</div><div><h3 className="text-white font-bold text-lg">QR Generated</h3></div></div><div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">3</div><div><h3 className="text-white font-bold text-lg">Guard Scans</h3></div></div></div></div></div>
    )
  },
  {
    id: 5, bg: "bg-slate-900", content: (<div className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto px-6"><h2 className="text-4xl font-bold text-white mb-12">Why Choose Belimbing?</h2><div className="grid md:grid-cols-2 gap-8 text-left w-full"><div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-colors"><h3 className="text-2xl font-bold text-white mb-4">Malaysian Context</h3><p className="text-slate-400">IC, Block/Lot formats supported.</p></div><div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-colors"><h3 className="text-2xl font-bold text-white mb-4">Digital Trail</h3><p className="text-slate-400">Searchable CSV database.</p></div></div></div>)
  },
  {
    id: 6, bg: "bg-gradient-to-br from-slate-900 to-emerald-900", content: (<div className="flex flex-col items-center justify-center h-full text-center"><h2 className="text-5xl font-bold text-white mb-8">Ready to modernize?</h2><div className="text-2xl text-emerald-300 font-light mb-12">Belimbing: Secure. Smart. Simple.</div><button className="bg-white text-emerald-900 px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl">Launch Demo</button></div>)
  }
];

const ProposalDeck: React.FC<ProposalDeckProps> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = () => { if (currentSlide < slides.length - 1) setCurrentSlide(c => c + 1); };
  const prevSlide = () => { if (currentSlide > 0) setCurrentSlide(c => c - 1); };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') nextSlide(); if (e.key === 'ArrowLeft') prevSlide(); if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);
  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50"><div className="font-bold text-slate-500 text-sm tracking-widest uppercase">Project Proposal • Slide {currentSlide + 1}/{slides.length}</div><button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"><X size={24} /></button></div>
      <div className={\`flex-1 relative overflow-hidden transition-colors duration-500 \${slides[currentSlide].bg}\`}><div className="absolute inset-0 flex items-center justify-center p-8 md:p-20 overflow-y-auto">{slides[currentSlide].content}</div></div>
      <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center gap-6 z-50 pointer-events-none"><button onClick={prevSlide} disabled={currentSlide === 0} className="pointer-events-auto p-4 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20"><ChevronLeft size={32} /></button><button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className="pointer-events-auto p-4 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20"><ChevronRight size={32} /></button></div>
    </div>
  );
};
export default ProposalDeck;`
};

// ==========================================
// 3. EXECUTION
// ==========================================
console.log("🚀 Starting Belimbing Project Setup...");

const writeFile = (filePath, content) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, { encoding: 'utf8' });
  console.log(`✓ Created: ${filePath}`);
};

// Write all config files
Object.entries(configFiles).forEach(([name, content]) => writeFile(name, content));

// Write all source files
Object.entries(srcFiles).forEach(([name, content]) => writeFile(name, content));

console.log("\n✅ Setup complete!");
console.log("-------------------------------------");
console.log("Run the following commands to start:");
console.log("1. npm install");
console.log("2. npm run dev");
console.log("-------------------------------------");