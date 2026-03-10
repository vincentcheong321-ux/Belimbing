import React, { useState } from 'react';
import { Link, Copy, Check, Clock, ShieldAlert, ArrowLeft } from 'lucide-react';

interface AdminShareProps {
  onBack: () => void;
}

export default function AdminShare({ onBack }: AdminShareProps) {
  const [expiryHours, setExpiryHours] = useState<number>(24);
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    const expiresAt = Date.now() + expiryHours * 60 * 60 * 1000;
    
    // Create a simple payload. In a real app, this would be signed by a backend.
    const payload = btoa(JSON.stringify({
      expires: expiresAt,
      role: 'visitor',
      // Add a random salt so links look different
      salt: Math.random().toString(36).substring(2, 15)
    }));

    // Generate the full URL
    const url = new URL(window.location.origin);
    url.searchParams.set('token', payload);
    
    setGeneratedLink(url.toString());
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-md w-full">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-800 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-indigo-600 p-6 text-white text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <Link size={32} />
            </div>
            <h2 className="text-2xl font-bold">Generate Invite Link</h2>
            <p className="text-indigo-100 mt-2">Create a temporary access link for visitors</p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Link Expiration Time
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '1 Hour', value: 1 },
                  { label: '24 Hours', value: 24 },
                  { label: '7 Days', value: 168 }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setExpiryHours(option.value)}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      expiryHours === option.value
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateLink}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Clock size={18} />
              Generate Expiring Link
            </button>

            {generatedLink && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Your Shareable Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="flex-1 bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`p-2 rounded-lg border transition-colors ${
                      copied 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-3 flex items-start gap-1.5">
                  <ShieldAlert size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>
                    Anyone with this link can access the Visitor Check-in page until it expires in {expiryHours} hour{expiryHours > 1 ? 's' : ''}.
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
