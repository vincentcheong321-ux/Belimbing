import React, { useEffect } from 'react';
import { Download, Loader2 } from 'lucide-react';

export const VinAppDownload: React.FC = () => {
  useEffect(() => {
    // Change the document title
    document.title = "Vin App";
    
    // Automatically trigger the download after a short delay
    const timer = setTimeout(() => {
      const link = document.createElement('a');
      link.href = "https://github.com/Archmage83/tvapk/raw/refs/heads/master/%E9%87%91%E8%B0%83KTV.apk";
      link.download = "金调KTV.apk";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Vin App</h1>
        <p className="text-slate-500 mb-10 text-lg">Your download will begin shortly.</p>

        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Preparing file...</p>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-4">If the download doesn't start automatically:</p>
          <a 
            href="https://github.com/Archmage83/tvapk/raw/refs/heads/master/%E9%87%91%E8%B0%83KTV.apk"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-colors"
          >
            <Download size={16} />
            Download Manually
          </a>
        </div>
      </div>
    </div>
  );
};
