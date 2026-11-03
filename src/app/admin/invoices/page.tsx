'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate } from '@/lib/utils';
import { generateInvoicePDF } from '@/lib/pdf-generator';
import { Receipt, Search, Download, CheckCircle2, Building2 } from 'lucide-react';

export default function AdminInvoicesPage() {
  const { invoices } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = invoices.filter((inv) => {
    return (
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerDetails.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerDetails.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            GST Tax Invoices & Records
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compliant Indian B2B tax invoices with CGST/SGST/IGST breakdown and direct PDF downloads.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Invoice #, Order #, Company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                <th className="py-3 px-4">Invoice # & Date</th>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Client Company</th>
                <th className="py-3 px-4">GSTIN</th>
                <th className="py-3 px-4 text-right">Tax (CGST+SGST)</th>
                <th className="py-3 px-4 text-right">Grand Total (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {inv.invoiceNumber}
                    <span className="block text-[10px] font-normal text-slate-400">
                      {formatIndianDate(inv.invoiceDate)}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-semibold text-blue-700">
                    {inv.orderNumber}
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{inv.customerDetails.companyName}</p>
                    <p className="text-[10px] text-slate-500">{inv.customerDetails.name}</p>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600">
                    {inv.customerDetails.gstin || 'Commercial'}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-slate-700">
                    {formatINR(inv.cgstAmount + inv.sgstAmount + inv.igstAmount)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                    {formatINR(inv.grandTotal)}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => generateInvoicePDF(inv)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center space-x-1 shadow transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
