
import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, Presentation, BellRing, Download, Upload, Loader2 } from 'lucide-react';
import VisitorForm from './components/VisitorForm';
import GuardDashboard from './components/GuardDashboard';
import ProposalDeck from './components/ProposalDeck';
import { VinAppDownload } from './components/VinAppDownload';
import AdminShare from './components/AdminShare';
import { AppMode } from './types';
import { getLatestAPK, uploadAPK, setManualAPKUrl } from './services/storage';
import { Link } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [apkUrl, setApkUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchApk = async () => {
      const url = await getLatestAPK();
      setApkUrl(url);
    };
    fetchApk();

    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/download/ktv') {
        setMode(AppMode.KTV_DOWNLOAD);
        return;
      }
      if (path === '/guard' || path === '/guard/') setMode(AppMode.GUARD);
      else if (path === '/visitor' || path === '/visitor/') setMode(AppMode.VISITOR);
      else if (path === '/presentation') setMode(AppMode.PRESENTATION);
      else if (path === '/admin' || path === '/admin/') setMode(AppMode.ADMIN);
      else setMode(AppMode.HOME);
    };
    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (newMode: AppMode) => {
    let path = '/';
    if (newMode === AppMode.GUARD) path = '/guard';
    else if (newMode === AppMode.VISITOR) path = '/visitor';
    else if (newMode === AppMode.PRESENTATION) path = '/presentation';
    else if (newMode === AppMode.ADMIN) path = '/admin';
    window.history.pushState({}, '', path);
    setMode(newMode);
  };

  const handleApkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    const { url, error } = await uploadAPK(file);
    if (url) {
      setApkUrl(url);
      alert('APK uploaded successfully!');
    } else {
      alert(`Upload failed: ${error}\n\nCommon fixes:\n1. Ensure bucket "apks" exists.\n2. Ensure bucket is set to "Public".\n3. Ensure "Insert" policy is added for public.`);
    }
    setIsUploading(false);
  };

  const handleManualUrl = async () => {
    const url = prompt('Enter the direct download URL for the APK (e.g., Google Drive link):', apkUrl || '');
    if (url === null) return; // Cancelled
    
    const success = await setManualAPKUrl(url);
    if (success) {
      setApkUrl(url || null);
      alert('Download URL updated!');
    } else {
      alert('Failed to update URL. Please ensure the "app_settings" table exists.');
    }
  };

  const handleKtvDownload = () => {
    const expiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour for direct clicks
    const payload = btoa(JSON.stringify({
      expires: expiresAt,
      role: 'download',
      salt: Math.random().toString(36).substring(2, 15)
    }));
    window.location.href = `/download/ktv?token=${payload}`;
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.KTV_DOWNLOAD: return <VinAppDownload />;
      case AppMode.VISITOR: return <VisitorForm onBack={() => navigateTo(AppMode.HOME)} />;
      case AppMode.GUARD: return <GuardDashboard onBack={() => navigateTo(AppMode.HOME)} onAdmin={() => navigateTo(AppMode.ADMIN)} />;
      case AppMode.ADMIN: return <AdminShare onBack={() => navigateTo(AppMode.GUARD)} />;
      case AppMode.PRESENTATION: return <ProposalDeck onClose={() => navigateTo(AppMode.HOME)} />;
      default: return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <div className="inline-block p-4 rounded-full bg-emerald-500/10 mb-6 border border-emerald-500/20">
                 <Shield className="w-16 h-16 text-emerald-400" />
              </div>
              <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">
                Belim<span className="text-emerald-400">bing</span>
              </h1>
              <p className="text-slate-400">Secure. Smart. Seamless.</p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6 mb-16">
              <button 
                onClick={() => navigateTo(AppMode.VISITOR)}
                className="group relative overflow-hidden bg-white p-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-sm text-left"
              >
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 mb-6">
                    <UserPlus size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">Pre-Register</h2>
                  <p className="text-slate-500 text-lg mb-8">Register yourself or guests for instant check-in.</p>
                  <div className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-wide group-hover:bg-emerald-600 transition-colors shadow-lg flex items-center justify-center gap-2">
                    <BellRing size={16} /> Start Registration
                  </div>
                </div>
              </button>

              <div className="group relative overflow-hidden bg-slate-800/50 border border-slate-700 p-8 rounded-2xl shadow-2xl transition-all duration-300 w-full max-w-sm text-left">
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="bg-indigo-500/10 p-4 rounded-full text-indigo-400 mb-6 border border-indigo-500/20">
                    <Download size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">Mobile App</h2>
                  <p className="text-slate-400 text-lg mb-8">Download the Belimbing Android app for guards and residents.</p>
                  
                  <div className="w-full flex flex-col gap-2 mb-4">
                    <button 
                      onClick={handleKtvDownload}
                      className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-emerald-500 transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                      <Download size={16} /> Download 金调KTV APK
                    </button>
                  </div>

                  {apkUrl && (
                    <a 
                      href={apkUrl}
                      download
                      className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-indigo-500 transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                      <Download size={16} /> Download Belimbing APK
                    </a>
                  )}

                  <div className="mt-6 w-full flex flex-col gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                      {isUploading ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        <Upload size={14} />
                      )}
                      <span>{isUploading ? 'Uploading...' : 'Upload APK (Max 50MB)'}</span>
                      <input 
                        type="file" 
                        accept=".apk" 
                        className="hidden" 
                        onChange={handleApkUpload}
                        disabled={isUploading}
                      />
                    </label>

                    <button 
                      onClick={handleManualUrl}
                      className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <Link size={14} />
                      <span>Set External Link (For &gt;50MB)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
               <button onClick={() => navigateTo(AppMode.PRESENTATION)} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium border-b border-dashed border-slate-600 pb-0.5">
                 <Presentation size={16} /> View Advanced Features & Proposal
               </button>
               <footer className="mt-8 text-slate-600 text-sm"> &copy; {new Date().getFullYear()} Belimbing. Smart Residential Solutions.</footer>
            </div>
          </div>
        </div>
      );
    }
  };

  return renderContent();
}
