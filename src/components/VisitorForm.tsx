
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { VisitorData } from '../types';
import { User, Phone, MapPin, Building, CreditCard, ArrowLeft, Download, CheckCircle, Car, Home, AlertCircle, Share2, ClipboardList } from 'lucide-react';

interface VisitorFormProps {
  onBack: () => void;
}

const PURPOSES = [
  "Friends & Family",
  "Delivery (Food/Parcel)",
  "Contractor / Renovation",
  "Service Provider (Cleaning/Repair)",
  "Commercial / Meeting",
  "Other"
];

const VisitorForm: React.FC<VisitorFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState<Partial<VisitorData>>({
    fullName: '',
    phoneNumber: '',
    icNumber: '',
    carPlate: '',
    blockNumber: '',
    lotNumber: '',
    unitNumber: '',
    purpose: PURPOSES[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'icNumber') {
      const val = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setFormData((prev: any) => ({ ...prev, [name]: val }));
    } else if (name === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, '');
      setFormData((prev: any) => ({ ...prev, [name]: numericValue }));
    } else if (name === 'carPlate') {
      setFormData((prev: any) => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    if (!formData.fullName || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters.';
      isValid = false;
    }
    if (!formData.icNumber || formData.icNumber.length < 6) {
      newErrors.icNumber = 'IC/Passport must be at least 6 characters.';
      isValid = false;
    }
    if (!formData.phoneNumber || formData.phoneNumber.length < 9) {
      newErrors.phoneNumber = 'Invalid phone number.';
      isValid = false;
    }
    if (!formData.blockNumber || !formData.lotNumber || !formData.unitNumber) {
      newErrors.unit = 'Full unit details required.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload: VisitorData = {
      fullName: formData.fullName!,
      phoneNumber: formData.phoneNumber!,
      icNumber: formData.icNumber!,
      carPlate: formData.carPlate || 'N/A',
      blockNumber: formData.blockNumber!,
      lotNumber: formData.lotNumber!,
      unitNumber: formData.unitNumber!,
      purpose: formData.purpose || PURPOSES[0],
      timestamp: Date.now()
    };
    setGeneratedQR(JSON.stringify(payload));
  };

  const handleShare = () => {
    if (!generatedQR) return;
    const data = JSON.parse(generatedQR);
    const text = `Belimbing Visitor Pass\nName: ${data.fullName}\nUnit: ${data.blockNumber}-${data.lotNumber}-${data.unitNumber}\nPurpose: ${data.purpose}\nValid: 24 Hours`;
    navigator.clipboard.writeText(text);
    alert("Invitation text copied to clipboard! You can now send it to your visitor.");
  };

  if (generatedQR) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 flex flex-col items-center justify-center animate-fade-in">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
          <div className="bg-emerald-600 p-6 text-white text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-2" />
            <h2 className="text-2xl font-bold">Pre-Registration Complete</h2>
            <p className="opacity-90 text-sm mt-1">Ready for Quick Check-in</p>
          </div>
          
          <div className="p-8 flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl border-2 border-slate-600 shadow-inner">
              <QRCodeSVG value={generatedQR} size={220} level="H" includeMargin={true} />
            </div>
            
            <p className="mt-6 text-slate-400 text-center text-sm px-4">
              Your registration is stored. Present this QR at the guardhouse for instant entry.
            </p>

            <div className="mt-8 w-full space-y-3">
               <button 
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-500 transition-colors"
              >
                <Share2 size={18} />
                Share Invitation
              </button>
              <button 
                onClick={() => setGeneratedQR(null)}
                className="w-full py-3 text-slate-400 hover:text-white font-medium"
              >
                New Pre-Registration
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
            <h1 className="text-2xl font-bold text-white">Pre-Register Visitor</h1>
            <p className="text-slate-400 mt-2">Generate a quick check-in pass for yourself or a guest.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-slate-500" size={18} />
                </div>
                <input name="fullName" type="text" value={formData.fullName} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="Name" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">IC/Passport</label>
                <input name="icNumber" type="text" value={formData.icNumber} onChange={handleChange} className="block w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono" placeholder="IC No." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Vehicle No.</label>
                <input name="carPlate" type="text" value={formData.carPlate} onChange={handleChange} className="block w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono" placeholder="ABC 1234" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Purpose of Visit</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ClipboardList className="text-slate-500" size={18} />
                </div>
                <select name="purpose" value={formData.purpose} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white appearance-none outline-none focus:ring-2 focus:ring-emerald-500">
                  {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
              <input name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} className="block w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="0123456789" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <input name="blockNumber" type="text" value={formData.blockNumber} onChange={handleChange} className="block w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="Block" />
              <input name="lotNumber" type="text" value={formData.lotNumber} onChange={handleChange} className="block w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="Lot" />
              <input name="unitNumber" type="text" value={formData.unitNumber} onChange={handleChange} className="block w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="Unit" />
            </div>

            <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-700 shadow-lg mt-4">
              Generate Quick Pass
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VisitorForm;
