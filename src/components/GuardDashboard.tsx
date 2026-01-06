
import React, { useState, useEffect } from 'react';
import { Scan, ShieldCheck, ShieldAlert, Clock, ArrowLeft, Loader2, CheckSquare, FileText, UserMinus, BellRing } from 'lucide-react';
import QRScanner from './QRScanner';
import VisitorLogs from './VisitorLogs';
import { VisitorData, SecurityLog } from '../types';
import { saveLog, getLogs, getBlacklist, addToBlacklist } from '../services/storage';

interface GuardDashboardProps {
  onBack: () => void;
}

type DashboardView = 'HOME' | 'SCANNER' | 'LOGS';

const GuardDashboard: React.FC<GuardDashboardProps> = ({ onBack }) => {
  const [view, setView] = useState<DashboardView>('HOME');
  const [scannedData, setScannedData] = useState<VisitorData | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'VALID' | 'EXPIRED' | 'INVALID' | 'BLACKLISTED'>('IDLE');
  const [isLogging, setIsLogging] = useState(false);
  const [entrySuccess, setEntrySuccess] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      if (view === 'HOME') {
        const logs = await getLogs();
        const today = new Date().setHours(0,0,0,0);
        const count = logs.filter(l => new Date(l.checkInTime).setHours(0,0,0,0) === today).length;
        setTodayCount(count);
      }
    };
    fetchCount();
  }, [view]);

  const handleScan = (data: string) => {
    setView('HOME');
    try {
      const visitor: VisitorData = JSON.parse(data);
      setScannedData(visitor);
      
      const blacklist = getBlacklist();
      if (blacklist.includes(visitor.icNumber)) {
        setStatus('BLACKLISTED');
        return;
      }

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
    
    const newLogEntry: SecurityLog = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      visitorName: scannedData.fullName,
      icNumber: scannedData.icNumber,
      carPlate: scannedData.carPlate,
      purpose: scannedData.purpose || 'General',
      destination: `Blk ${scannedData.blockNumber} - ${scannedData.lotNumber} - ${scannedData.unitNumber}`,
      checkInTime: new Date().toISOString(),
      status: status === 'VALID' ? 'GRANTED' : (status === 'EXPIRED' ? 'EXPIRED' : 'DENIED'),
      aiAnalysis: "Standard Entry Logged"
    };
    
    await saveLog(newLogEntry);
    
    // Simulate Notification
    setNotificationSent(true);
    setTimeout(() => {
      setIsLogging(false);
      setEntrySuccess(true);
      setTodayCount(prev => prev + 1);
    }, 1500);
  };

  const handleBlacklist = () => {
    if (!scannedData) return;
    if (window.confirm(`Are you sure you want to BLACKLIST ${scannedData.fullName}? They will be denied access permanently.`)) {
      addToBlacklist(scannedData.icNumber);
      setStatus('BLACKLISTED');
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setStatus('IDLE');
    setEntrySuccess(false);
    setNotificationSent(false);
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
            <ShieldCheck size={20} /> <span>Security Terminal</span>
          </div>
        </div>

        {!scannedData ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center justify-center h-[50vh] border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/30 p-8 text-center">
              <Scan size={64} className="text-slate-500 mb-6" />
              <h2 className="text-2xl font-bold mb-2">Visitor Quick Check-in</h2>
              <p className="text-slate-400 max-w-xs mb-8">Scan QR codes for instant verification and automatic resident notification.</p>
              <button onClick={() => setView('SCANNER')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-3 text-lg w-full sm:w-auto justify-center">
                <Scan /> Launch Scanner
              </button>
            </div>
            <button onClick={() => setView('LOGS')} className="group bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-4 rounded-xl font-semibold border border-slate-700 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3"><FileText size={20} className="text-emerald-500" /> <span>Access History</span></div>
              <div className="bg-slate-900 px-3 py-1 rounded-full text-xs font-mono text-emerald-400 border border-slate-700">{todayCount} Today</div>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`p-6 rounded-xl border-l-4 shadow-lg ${
              status === 'VALID' ? 'bg-emerald-900/20 border-emerald-500' : 
              status === 'BLACKLISTED' ? 'bg-red-900/40 border-red-600' : 'bg-amber-900/20 border-amber-500'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`text-xl font-bold ${
                    status === 'VALID' ? 'text-emerald-400' : 
                    status === 'BLACKLISTED' ? 'text-red-500 animate-pulse' : 'text-amber-400'
                  }`}>
                    {status === 'VALID' ? 'Verification Success' : status === 'BLACKLISTED' ? 'ACCESS DENIED: BLACKLISTED' : 'Issue Detected'}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">Status Checked: {new Date().toLocaleTimeString()}</p>
                </div>
                {status === 'VALID' ? <CheckSquare className="text-emerald-500" size={32} /> : <ShieldAlert className="text-red-500" size={32} />}
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 relative overflow-hidden">
              {status === 'BLACKLISTED' && <div className="absolute inset-0 bg-red-900/20 pointer-events-none" />}
              <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                <h3 className="text-lg font-semibold text-white">Guest Information</h3>
                {status !== 'BLACKLISTED' && (
                  <button onClick={handleBlacklist} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors uppercase font-bold">
                    <UserMinus size={14} /> Blacklist Guest
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="text-xs text-slate-400 uppercase">Name</label><p className="text-lg font-medium text-white">{scannedData.fullName}</p></div>
                <div><label className="text-xs text-slate-400 uppercase">Purpose</label><p className="text-lg font-medium text-emerald-400">{scannedData.purpose}</p></div>
                <div><label className="text-xs text-slate-400 uppercase">Unit Details</label><p className="text-lg font-medium text-white">Blk {scannedData.blockNumber} - {scannedData.lotNumber} - Unit {scannedData.unitNumber}</p></div>
                <div><label className="text-xs text-slate-400 uppercase">Vehicle</label><p className="text-lg font-medium text-white font-mono">{scannedData.carPlate || 'N/A'}</p></div>
              </div>
            </div>

            {entrySuccess ? (
               <div className="bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-slate-700 animate-fade-in">
                  <div className="p-4 bg-slate-900 border-b border-slate-700 flex items-center gap-2">
                     <ShieldCheck size={20} className="text-emerald-400" />
                     <h3 className="font-semibold text-white">Entry Processed</h3>
                  </div>
                  <div className="p-6 text-center">
                     <div className="flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-full mx-auto mb-4">
                       <CheckSquare size={32} className="text-emerald-500" />
                     </div>
                     <p className="text-slate-300 mb-6">Access granted and logged. Resident of unit {scannedData.unitNumber} has been notified.</p>
                     <div className="flex gap-4">
                        <button onClick={() => setView('LOGS')} className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-medium">History</button>
                        <button onClick={resetScanner} className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium">Scan Next</button>
                     </div>
                  </div>
               </div>
            ) : (
              <div className="flex flex-col gap-4">
                {notificationSent && (
                   <div className="bg-indigo-900/30 border border-indigo-500/50 rounded-xl p-4 flex items-center gap-3 animate-pulse">
                      <BellRing className="text-indigo-400" size={20} />
                      <span className="text-indigo-200 text-sm font-medium">Sending notification to Resident...</span>
                   </div>
                )}
                <div className="flex gap-4">
                  <button onClick={() => setScannedData(null)} className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-medium border border-slate-700">Cancel</button>
                  <button onClick={handleCheckIn} disabled={status !== 'VALID' || isLogging} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${status === 'VALID' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
                    {isLogging ? <Loader2 className="animate-spin" /> : <CheckSquare />} {isLogging ? 'Processing...' : 'Confirm Entry'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuardDashboard;
