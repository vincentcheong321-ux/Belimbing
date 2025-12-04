
import React, { useState } from 'react';
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
    
    if (name === 'icNumber') {
      // Restrict to digits only
      const numericValue = value.replace(/\D/g, '');
      setFormData((prev: Partial<VisitorData>) => ({ ...prev, [name]: numericValue }));
    } else if (name === 'phoneNumber') {
      // Restrict to digits only
      const numericValue = value.replace(/\D/g, '');
      setFormData((prev: Partial<VisitorData>) => ({ ...prev, [name]: numericValue }));
    } else if (name === 'carPlate') {
      // Auto-uppercase
      setFormData((prev: Partial<VisitorData>) => ({ ...prev, [name]: value.toUpperCase() }));
    } else if (name === 'blockNumber') {
      // Alphabets only
      const alphaValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase();
      setFormData((prev: Partial<VisitorData>) => ({ ...prev, [name]: alphaValue }));
    } else {
      setFormData((prev: Partial<VisitorData>) => ({ ...prev, [name]: value }));
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
               <button 
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-900 py-3 rounded-xl font-semibold hover:bg-white transition-colors"
              >
                <Download size={18} />
                Save / Print
              </button>
              <button 
                onClick={() => setGeneratedQR(null)}
                className="w-full py-3 text-slate-400 hover:text-white font-medium"
              >
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
        <button 
          onClick={onBack} 
          className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Home
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-slate-500" size={18} />
                </div>
                <input
                  required
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 outline-none transition-all"
                  placeholder="Ali Bin Abu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">IC Number (Digits Only)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="text-slate-500" size={18} />
                </div>
                <input
                  required
                  name="icNumber"
                  type="text"
                  inputMode="numeric"
                  value={formData.icNumber}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 outline-none transition-all"
                  placeholder="e.g. 901020105555"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Vehicle No.</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Car className="text-slate-500" size={18} />
                </div>
                <input
                  name="carPlate"
                  type="text"
                  value={formData.carPlate}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 outline-none transition-all"
                  placeholder="ABC 1234"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="text-slate-500" size={18} />
                </div>
                <input
                  required
                  name="phoneNumber"
                  type="tel"
                  inputMode="numeric"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 outline-none transition-all"
                  placeholder="0123456789"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Block</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="text-slate-500" size={18} />
                  </div>
                  <input
                    required
                    name="blockNumber"
                    type="text"
                    value={formData.blockNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 outline-none transition-all"
                    placeholder="A"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Lot No.</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="text-slate-500" size={18} />
                  </div>
                  <input
                    required
                    name="lotNumber"
                    type="text"
                    value={formData.lotNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 outline-none transition-all"
                    placeholder="10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Unit No.</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="text-slate-500" size={18} />
                  </div>
                  <input
                    required
                    name="unitNumber"
                    type="text"
                    value={formData.unitNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 outline-none transition-all"
                    placeholder="05"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-lg shadow-emerald-600/20 mt-4"
            >
              Generate Pass
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VisitorForm;
