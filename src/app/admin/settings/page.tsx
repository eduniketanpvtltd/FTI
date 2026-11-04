'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { Settings, ShieldCheck, CheckCircle2, History, Building2, CreditCard } from 'lucide-react';
import { formatIndianDateTime } from '@/lib/utils';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useStore();

  const [companyName, setCompanyName] = useState(settings.companyName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [gstin, setGstin] = useState(settings.gstin);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [bankName, setBankName] = useState(settings.bankName);
  const [accountNumber, setAccountNumber] = useState(settings.accountNumber);
  const [ifscCode, setIfscCode] = useState(settings.ifscCode);
  const [branch, setBranch] = useState(settings.branch);
  const [defaultTaxRate, setDefaultTaxRate] = useState(settings.defaultTaxRate);
  const [quotationValidityDays, setQuotationValidityDays] = useState(settings.quotationValidityDays);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      companyName,
      tagline,
      gstin,
      address,
      phone,
      email,
      bankName,
      accountNumber,
      ifscCode,
      branch,
      defaultTaxRate: Number(defaultTaxRate),
      quotationValidityDays: Number(quotationValidityDays),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Sample Audit Trail Logs
  const auditLogs = [
    {
      action: 'QUOTATION_ISSUED',
      details: 'Assigned pricing and issued Quotation #FTI-QT-2026-0001 (Total ₹6,97,971)',
      user: 'Anil Singhania (Super Admin)',
      timestamp: '2026-11-03T10:10:00.000Z',
    },
    {
      action: 'MARKET_PRICE_UPDATED',
      details: 'Updated Mild Steel Billet spot benchmark to ₹48,500/MT (+2.11%)',
      user: 'Anil Singhania (Super Admin)',
      timestamp: '2026-11-03T09:30:00.000Z',
    },
    {
      action: 'DISPATCH_CONFIRMED',
      details: 'Order #FTI-ORD-2026-0001 dispatched with V-Trans Express (LR# VTR-MH-892147)',
      user: 'Anil Singhania (Super Admin)',
      timestamp: '2026-11-03T08:30:00.000Z',
    },
    {
      action: 'PAYMENT_VERIFIED',
      details: 'RTGS remittance ₹6,40,300 verified for Order #FTI-ORD-2026-0001',
      user: 'Anil Singhania (Super Admin)',
      timestamp: '2026-11-01T15:20:00.000Z',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Platform Settings & Audit Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure company legal credentials, bank transfer accounts, default GST rates, and inspect system audit trails.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-md flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Platform settings updated successfully! Invoices will now reflect these details.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Settings Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>FTI Company Details & Invoicing Credentials</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Official GSTIN</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Registered Yard & Head Office Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Official Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Billing Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                  required
                />
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pt-2 border-t border-slate-200 flex items-center space-x-1.5">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Remittance Bank Account (For Invoice Header)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Current Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Branch Location</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Standard GST Rate (%)</label>
                <input
                  type="number"
                  value={defaultTaxRate}
                  onChange={(e) => setDefaultTaxRate(parseFloat(e.target.value) || 18)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Default Quotation Validity (Days)</label>
                <input
                  type="number"
                  value={quotationValidityDays}
                  onChange={(e) => setQuotationValidityDays(parseInt(e.target.value, 10) || 3)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono"
                  required
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded shadow transition touch-manipulation text-center"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Audit Logs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5 border-b border-slate-200 pb-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>Administrative Audit Trail</span>
            </h3>

            <div className="space-y-3">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-blue-700 bg-blue-100/60 px-1.5 py-0.2 rounded text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatIndianDateTime(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-800 font-medium mt-1 leading-snug">{log.details}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Logged by: {log.user}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
