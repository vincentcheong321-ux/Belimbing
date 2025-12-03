import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Trash2, Search, FileText, CheckCircle, Clock, Download, Filter, Calendar, ShieldAlert, MapPin, CreditCard, Car, Loader2 } from 'lucide-react';
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
    if (window.confirm('Are you sure you want to clear all visitor history? This action cannot be undone.')) {
      await clearLogs();
      setLogs([]);
    }
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;

    // Removed AI Note from headers
    const headers = ['ID', 'Visitor Name', 'IC Number', 'Car Plate', 'Destination', 'Check-In Time', 'Status'];
    const rows = logs.map(log => [
      log.id,
      `"${log.visitorName}"`, 
      `"${log.icNumber}"`,
      `"${log.carPlate || 'N/A'}"`,
      `"${log.destination}"`,
      new Date(log.checkInTime).toLocaleString(),
      log.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `visitor_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Filter Logic
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Search Text
      const matchesSearch = 
        log.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.icNumber.includes(searchTerm) ||
        (log.carPlate && log.carPlate.toLowerCase().includes(searchTerm.toLowerCase())) ||
        log.destination.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status Filter
      const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;

      // Date Filter
      let matchesDate = true;
      if (dateFilter === 'TODAY') {
        const logDate = new Date(log.checkInTime).setHours(0,0,0,0);
        const today = new Date().setHours(0,0,0,0);
        matchesDate = logDate === today;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [logs, searchTerm, statusFilter, dateFilter]);

  // Group by Date
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
      {/* Header & Controls */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-20 shadow-xl">
        <div className="max-w-5xl mx-auto space-y-4">
          
          {/* Top Row: Title & Back */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={onBack}
                className="p-2 mr-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
                  <FileText className="text-emerald-400" />
                  Visitor Logs
                </h1>
                <p className="text-xs text-slate-400">
                  {filteredLogs.length} record{filteredLogs.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                disabled={logs.length === 0}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              {logs.length > 0 && (
                <button 
                  onClick={handleClear}
                  className="p-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors"
                  title="Clear All History"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
             {/* Search */}
             <div className="md:col-span-5 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Search name, IC, plate, unit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-200 placeholder-slate-500"
                />
             </div>

             {/* Status Filter */}
             <div className="md:col-span-4 flex items-center gap-2 bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-1.5">
                <Filter size={16} className="text-slate-400" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-transparent border-none text-sm text-slate-200 focus:ring-0 w-full outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="GRANTED">Granted</option>
                  <option value="DENIED">Denied</option>
                  <option value="EXPIRED">Expired</option>
                </select>
             </div>

             {/* Date Filter */}
             <div className="md:col-span-3 flex bg-slate-900/50 rounded-lg border border-slate-600 p-1">
               <button
                 onClick={() => setDateFilter('ALL')}
                 className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${dateFilter === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
               >
                 All Time
               </button>
               <button
                 onClick={() => setDateFilter('TODAY')}
                 className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${dateFilter === 'TODAY' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
               >
                 Today
               </button>
             </div>
          </div>

        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
        <div className="max-w-5xl mx-auto">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-500">
               <Loader2 className="animate-spin mb-4" size={48} />
               <p>Loading records from database...</p>
             </div>
          ) : Object.keys(groupedLogs).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <Search size={64} className="mb-4 text-slate-600" />
              <p className="text-xl font-medium text-slate-400">No logs found matching criteria</p>
            </div>
          ) : (
            (Object.entries(groupedLogs) as [string, SecurityLog[]][]).map(([date, dateLogs]) => (
              <div key={date} className="mb-8 animate-fade-in">
                <h3 className="sticky top-0 bg-slate-900/95 backdrop-blur-sm py-2 text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 z-10 border-b border-slate-800 flex items-center gap-2">
                  <Calendar size={14} />
                  {date}
                </h3>
                
                <div className="grid gap-4">
                  {dateLogs.map((log) => {
                    const statusColor = 
                        log.status === 'GRANTED' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                        log.status === 'EXPIRED' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                        'text-red-400 border-red-500/30 bg-red-500/10';
                    
                    return (
                      <div 
                        key={log.id} 
                        className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg hover:border-slate-600 transition-all"
                      >
                         {/* Card Header */}
                         <div className="bg-slate-900/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/50">
                            <div className="flex items-center gap-4">
                               <div className={`p-2 rounded-full ${statusColor.split(' ')[2]}`}>
                                  {log.status === 'GRANTED' ? <CheckCircle size={20} className="text-emerald-500" /> : 
                                   log.status === 'EXPIRED' ? <Clock size={20} className="text-amber-500" /> : 
                                   <ShieldAlert size={20} className="text-red-500" />}
                               </div>
                               <div>
                                  <h4 className="text-lg font-bold text-white leading-tight">{log.visitorName}</h4>
                                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                     <span className="font-mono bg-slate-800 px-1 rounded">{log.id.slice(-6)}</span>
                                     <span>•</span>
                                     <span>{new Date(log.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                  </div>
                               </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border w-fit ${statusColor}`}>
                               {log.status}
                            </span>
                         </div>

                         {/* Card Body - Updated layout without AI column */}
                         <div className="p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                             <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                  <CreditCard size={12} /> IC / Passport
                                </div>
                                <div className="font-mono text-slate-200 text-sm bg-slate-900/50 p-2 rounded border border-slate-700/50">
                                  {log.icNumber}
                                </div>
                             </div>
                             <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                  <Car size={12} /> Car Plate
                                </div>
                                <div className="font-mono text-slate-200 text-sm bg-slate-900/50 p-2 rounded border border-slate-700/50">
                                  {log.carPlate || 'N/A'}
                                </div>
                             </div>
                             <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                  <MapPin size={12} /> Destination
                                </div>
                                <div className="text-slate-200 text-sm font-medium bg-slate-900/50 p-2 rounded border border-slate-700/50">
                                  {log.destination}
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

export default VisitorLogs;