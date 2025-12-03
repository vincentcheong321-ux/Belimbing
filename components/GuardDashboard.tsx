
import React, { useState, useEffect } from 'react';
import { Scan, ShieldCheck, ShieldAlert, Clock, ArrowLeft, Loader2, CheckSquare, FileText, Sparkles, Car } from 'lucide-react';
import QRScanner from './QRScanner';
import VisitorLogs from './VisitorLogs';
import { VisitorData, SecurityLog } from '../types';
import { logVisitorEntry } from '../services/gemini';
import { saveLog, getLogs } from '../services/storage';

interface GuardDashboardProps {
  onBack: () => void;
}

type DashboardView = 'HOME' | 'SCANNER' | 'LOGS';

// Helper to format log text
const formatLogContent = (text: string) => {
  if (!text) return null;
  const cleanText = text.replace(/^"|"$/g, ''); 
  return cleanText.split(/(\*\*.*?\*\*)/g).map((part, index) => {
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
  
  // Stats for the dashboard button
  const [todayCount, setTodayCount] = useState(0);

  // Update stats whenever we are on the Home view
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
    
    // 1. Generate AI Log
    const logText = await logVisitorEntry(scannedData, status);
    setAiLog(logText);
    
    // 2. Save to Storage
    const newLogEntry: SecurityLog = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      visitorName: scannedData.fullName,
      icNumber: scannedData.icNumber,
      carPlate: scannedData.carPlate,
      // Updated destination format to include Unit
      destination: `Blk ${scannedData.blockNumber} - ${scannedData.lotNumber} - ${scannedData.unitNumber}`,
      checkInTime: new Date().toISOString(),
      status: status === 'VALID' ? 'GRANTED' : (status === 'EXPIRED' ? 'EXPIRED' : 'DENIED'),
      aiAnalysis: logText
    };
    
    saveLog(newLogEntry);
    setIsLogging(false);
    
    // Update count immediately after saving
    setTodayCount(prev => prev + 1);
  };

  const resetScanner = () => {
    setScannedData(null);
    setStatus('IDLE');
    setAiLog(null);
    setView('SCANNER');
  };

  // Render Sub-Views
  if (view === 'LOGS') {
    return <VisitorLogs onBack={() => setView('HOME')} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6">
      {view === 'SCANNER' && <QRScanner onScan={handleScan} onClose={() => setView('HOME')} />}

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2" /> Back
          </button>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <ShieldCheck size={20} />
            <span>Guard Terminal</span>
          </div>
        </div>

        {!scannedData ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center justify-center h-[50vh] border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/30 p-8 text-center">
              <Scan size={64} className="text-slate-500 mb-6" />
              <h2 className="text-2xl font-bold mb-2">Visitor Check-in</h2>
              <p className="text-slate-400 max-w-xs mb-8">
                Scan visitor QR codes to verify validity and log entry.
              </p>
              <button
                onClick={() => setView('SCANNER')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-3 text-lg w-full sm:w-auto justify-center"
              >
                <Scan /> Launch Scanner
              </button>
            </div>

            <button
              onClick={() => setView('LOGS')}
              className="group bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-4 rounded-xl font-semibold border border-slate-700 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                 <FileText size={20} className="text-emerald-500" /> 
                 <span>View Access Logs</span>
              </div>
              <div className="bg-slate-900 px-3 py-1 rounded-full text-xs font-mono text-emerald-400 border border-slate-700 group-hover:border-slate-600">
                {todayCount} Today
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Card */}
            <div className={`p-6 rounded-xl border-l-4 shadow-lg ${
              status === 'VALID' ? 'bg-emerald-900/20 border-emerald-500' : 
              status === 'EXPIRED' ? 'bg-amber-900/20 border-amber-500' : 'bg-red-900/20 border-red-500'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`text-xl font-bold ${
                    status === 'VALID' ? 'text-emerald-400' : 
                    status === 'EXPIRED' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {status === 'VALID' ? 'Access Granted' : status === 'EXPIRED' ? 'Pass Expired' : 'Invalid QR'}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Scanned at {new Date().toLocaleTimeString()}
                  </p>
                </div>
                {status === 'VALID' ? <CheckSquare className="text-emerald-500" size={32} /> : <ShieldAlert className="text-amber-500" size={32} />}
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">Visitor Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Full Name</label>
                  <p className="text-lg font-medium text-white">{scannedData.fullName}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">IC Number</label>
                  <p className="text-lg font-medium text-white font-mono">{scannedData.icNumber}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Car Plate</label>
                  <p className="text-lg font-medium text-white font-mono">{scannedData.carPlate || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Destination</label>
                  <p className="text-lg font-medium text-white">Block {scannedData.blockNumber} - {scannedData.lotNumber} - {scannedData.unitNumber}</p>
                </div>
                <div className="md:col-span-2">
                   <label className="text-xs text-slate-400 uppercase tracking-wider">Pass Generated</label>
                   <div className="flex items-center gap-2 text-slate-300">
                      <Clock size={16} />
                      {new Date(scannedData.timestamp).toLocaleString()}
                   </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {aiLog ? (
               <div className="bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-slate-700 animate-fade-in">
                  <div className="p-4 bg-slate-900 border-b border-slate-700 flex items-center gap-2">
                     <ShieldCheck size={20} className="text-emerald-400" />
                     <h3 className="font-semibold text-white">Entry Logged Successfully</h3>
                  </div>
                  
                  <div className="p-6">
                     <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-6">
                       <div className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                         <Sparkles size={12} /> System Audit Trail
                       </div>
                       <p className="text-slate-400 text-sm leading-relaxed">
                         {formatLogContent(aiLog)}
                       </p>
                     </div>

                     <div className="flex gap-4">
                        <button 
                         onClick={() => setView('LOGS')}
                         className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
                       >
                         View All Logs
                       </button>
                       <button 
                         onClick={resetScanner}
                         className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-medium transition-colors"
                       >
                         Scan Next
                       </button>
                     </div>
                  </div>
               </div>
            ) : (
              <div className="flex gap-4">
                <button 
                  onClick={() => setScannedData(null)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors border border-slate-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCheckIn}
                  disabled={status !== 'VALID' || isLogging}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                    status === 'VALID' 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20' 
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
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

export default GuardDashboard;
