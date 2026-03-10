
import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Trash2, Search, FileText, CheckCircle, Clock, Download, Filter, Calendar, ShieldAlert, MapPin, CreditCard, Car, Loader2, Tag } from 'lucide-react';
import { SecurityLog } from '../types';
import { getLogs, clearLogs } from '../services/storage';

interface VisitorLogsProps {
  onBack: () => void;
}

const VisitorLogs: React.FC<VisitorLogsProps> = ({ onBack }) => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'GRANTED' | 'DENIED' | 'EXPIRED'>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY'>('ALL');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const data = await getLogs();
      setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  const handleClear = async () => {
    if (window.confirm('Clear all history?')) {
      await clearLogs();
      setLogs([]);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) || log.icNumber.includes(searchTerm) || log.destination.includes(searchTerm);
      const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
      let matchesDate = true;
      if (dateFilter === 'TODAY') {
        matchesDate = new Date(log.checkInTime).setHours(0,0,0,0) === new Date().setHours(0,0,0,0);
      }
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [logs, searchTerm, statusFilter, dateFilter]);

  const groupedLogs = useMemo(() => {
    const groups: Record<string, SecurityLog[]> = {};
    filteredLogs.forEach(log => {
      const dateKey = new Date(log.checkInTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(log);
    });
    return groups;
  }, [filteredLogs]);

  return (
    <div className="bg-slate-900 text-slate-100 flex flex-col h-full">
      <div className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-20 shadow-xl">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={onBack} className="p-2 mr-3 bg-slate-700/50 rounded-lg"><ArrowLeft size={20} /></button>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2 text-white"><FileText className="text-emerald-400" /> Visitor Logs</h1>
              </div>
            </div>
            <button onClick={handleClear} className="p-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50"><Trash2 size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
             <div className="md:col-span-8 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="text" placeholder="Search logs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-2 pl-10 text-sm" />
             </div>
             <div className="md:col-span-4 flex items-center gap-2 bg-slate-900/50 border border-slate-600 rounded-lg px-3">
                <Filter size={16} className="text-slate-400" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="bg-transparent border-none text-sm text-slate-200 focus:ring-0 w-full py-2">
                  <option value="ALL">All Status</option>
                  <option value="GRANTED">Granted</option>
                  <option value="DENIED">Denied</option>
                  <option value="EXPIRED">Expired</option>
                </select>
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
        <div className="max-w-5xl mx-auto">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-500"><Loader2 className="animate-spin mb-4" size={48} /><p>Retrieving database logs...</p></div>
          ) : Object.keys(groupedLogs).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50"><Search size={64} className="mb-4" /><p>No matching records</p></div>
          ) : (
            /* Added type assertion to Object.entries for groupedLogs to resolve TS error on line 99/100 */
            (Object.entries(groupedLogs) as [string, SecurityLog[]][]).map(([date, dateLogs]) => (
              <div key={date} className="mb-8">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">{date}</h3>
                <div className="grid gap-4">
                  {dateLogs.map((log) => (
                    <div key={log.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                       <div className="bg-slate-900/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-4">
                             <div className={`p-2 rounded-full ${log.status === 'GRANTED' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                {log.status === 'GRANTED' ? <CheckCircle size={20} className="text-emerald-500" /> : <ShieldAlert size={20} className="text-red-500" />}
                             </div>
                             <div>
                                <h4 className="text-lg font-bold text-white">{log.visitorName}</h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                   <span className="bg-emerald-500/10 text-emerald-400 px-2 rounded-full font-bold flex items-center gap-1"><Tag size={10} /> {log.purpose}</span>
                                   <span>•</span>
                                   <span>{new Date(log.checkInTime).toLocaleTimeString()}</span>
                                </div>
                             </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${log.status === 'GRANTED' ? 'text-emerald-400 border-emerald-500/30' : 'text-red-400 border-red-500/30'}`}>
                             {log.status}
                          </span>
                       </div>
                       <div className="p-4 grid md:grid-cols-3 gap-4 border-t border-slate-700/30">
                           <div className="flex flex-col gap-1"><span className="text-[10px] text-slate-500 uppercase">IC / Passport</span><span className="text-sm font-mono">{log.icNumber}</span></div>
                           <div className="flex flex-col gap-1"><span className="text-[10px] text-slate-500 uppercase">Vehicle</span><span className="text-sm font-mono">{log.carPlate || 'N/A'}</span></div>
                           <div className="flex flex-col gap-1"><span className="text-[10px] text-slate-500 uppercase">Destination</span><span className="text-sm">{log.destination}</span></div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorLogs;
