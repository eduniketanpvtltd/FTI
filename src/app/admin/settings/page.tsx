'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { CheckCircle2, History, Building2, CreditCard } from 'lucide-react';
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
  const [quotationValidityDays, setQuotationValidityDays] = useState(
    settings.quotationValidityDays
  );
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
      details:
        'Order #FTI-ORD-2026-0001 dispatched with V-Trans Express (LR# VTR-MH-892147)',
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Platform Settings & <span className="text-[#E8732A]">Audit Logs</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Configure company legal credentials, bank transfer accounts, default GST rates, and inspect system audit trails.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-[#122D21] border border-[#22C55E]/40 text-[#4ADE80] text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#22C55E]" />
          <span className="font-bold">
            Platform settings updated successfully! Invoices will now reflect these details.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Settings Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <form
            onSubmit={handleSaveSettings}
            className="bg-[#14181F] border border-[#28303E] rounded-2xl p-5 sm:p-6 shadow-lg space-y-4 text-xs"
          >
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-[#222934] pb-3 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-[#E8732A]" />
              <span>FTI Company Details & Invoicing Credentials</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-white mb-1.5">Company Legal Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-white mb-1.5">Official GSTIN</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-[#E8732A] font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-white mb-1.5">
                Registered Yard & Head Office Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-white mb-1.5">Official Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-white mb-1.5">Billing Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white"
                  required
                />
              </div>
            </div>

            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider pt-3 border-t border-[#222934] flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-[#E8732A]" />
              <span>Remittance Bank Account (For Invoice Header)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-white mb-1.5">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-white mb-1.5">
                  Current Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-white mb-1.5">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-[#E8732A] font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-white mb-1.5">Branch Location</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3 border-t border-[#222934]">
              <div>
                <label className="block font-bold text-white mb-1.5">Standard GST Rate (%)</label>
                <input
                  type="number"
                  value={defaultTaxRate}
                  onChange={(e) => setDefaultTaxRate(parseFloat(e.target.value) || 18)}
                  className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-white mb-1.5">
                  Default Quotation Validity (Days)
                </label>
                <input
                  type="number"
                  value={quotationValidityDays}
                  onChange={(e) => setQuotationValidityDays(parseInt(e.target.value, 10) || 3)}
                  className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-mono"
                  required
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white font-extrabold py-2.5 px-6 rounded-xl border border-[#F59352]/50 shadow-md transition touch-manipulation text-center cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Audit Logs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-5 shadow-lg">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3.5 flex items-center space-x-2 border-b border-[#222934] pb-3">
              <History className="w-4 h-4 text-[#E8732A]" />
              <span>Administrative Audit Trail</span>
            </h3>

            <div className="space-y-3">
              {auditLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#191F28] border border-[#2A3342] rounded-xl text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-[#E8732A] bg-[#251811] border border-[#E06924]/40 px-2 py-0.5 rounded-md text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">
                      {formatIndianDateTime(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-white font-medium mt-1.5 leading-snug">{log.details}</p>
                  <p className="text-[10px] text-[#64748B] mt-1">Logged by: {log.user}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
