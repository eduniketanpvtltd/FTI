'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate } from '@/lib/utils';
import { generateInvoicePDF } from '@/lib/pdf-generator';
import { Search, Download } from 'lucide-react';

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
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            GST Tax <span className="text-[#E8732A]">Invoices & Records</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Compliant Indian B2B tax invoices with CGST/SGST/IGST breakdown and direct PDF downloads.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-4 shadow-lg">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Invoice #, Order #, Company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#191F28] border border-[#2A3342] rounded-xl text-white placeholder-[#64748B]"
          />
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        {/* Mobile Invoices Cards (< md screens) */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-8 text-center text-xs text-[#94A3B8]">
              No tax invoices found matching search.
            </div>
          ) : (
            filtered.map((inv) => (
              <div
                key={inv.id}
                className="bg-[#14181F] border border-[#28303E] rounded-2xl p-4 space-y-3 text-xs shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-extrabold text-white text-sm block">
                      {inv.invoiceNumber}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">
                      {formatIndianDate(inv.invoiceDate)} • Ref: {inv.orderNumber}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase ${
                      inv.status === 'paid'
                        ? 'bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40'
                        : 'bg-[#332114] text-[#E58A3C] border border-[#C86D28]/50'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                <div className="bg-[#191F28] rounded-xl p-3 border border-[#2A3342] space-y-1">
                  <p className="font-bold text-white">{inv.customerDetails.companyName}</p>
                  <p className="text-[11px] text-[#94A3B8]">{inv.customerDetails.name}</p>
                  <p className="text-[10px] font-mono text-[#E8732A] pt-1 border-t border-[#28303E]">
                    GSTIN: {inv.customerDetails.gstin || 'Commercial'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                  <span>Tax (CGST+SGST):</span>
                  <span className="font-mono font-bold text-white">
                    {formatINR(inv.cgstAmount + inv.sgstAmount + inv.igstAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#222934]">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Invoice Total:</span>
                    <span className="font-mono font-extrabold text-[#E8732A] text-base">
                      {formatINR(inv.grandTotal)}
                    </span>
                  </div>

                  <button
                    onClick={() => generateInvoicePDF(inv)}
                    className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white px-4 py-2 rounded-xl border border-[#F59352]/40 text-xs font-bold inline-flex items-center space-x-1.5 shadow-sm transition touch-manipulation cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop / Tablet Invoices Table (md and up) */}
        <div className="hidden md:block bg-[#14181F] border border-[#28303E] rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#191F28] text-[#CBD5E1] font-bold uppercase text-[10px] border-b border-[#28303E]">
                  <th className="py-3.5 px-4">Invoice # & Date</th>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Client Company</th>
                  <th className="py-3.5 px-4">GSTIN</th>
                  <th className="py-3.5 px-4 text-right">Tax (CGST+SGST)</th>
                  <th className="py-3.5 px-4 text-right">Grand Total (₹)</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222934]">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#191F28]/60 transition">
                    <td className="py-3.5 px-4 font-mono font-extrabold text-white">
                      {inv.invoiceNumber}
                      <span className="block text-[10px] font-normal text-[#94A3B8]">
                        {formatIndianDate(inv.invoiceDate)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#E8732A]">
                      {inv.orderNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{inv.customerDetails.companyName}</p>
                      <p className="text-[10px] text-[#94A3B8]">{inv.customerDetails.name}</p>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#CBD5E1]">
                      {inv.customerDetails.gstin || 'Commercial'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[#CBD5E1]">
                      {formatINR(inv.cgstAmount + inv.sgstAmount + inv.igstAmount)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-white text-sm">
                      {formatINR(inv.grandTotal)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase ${
                          inv.status === 'paid'
                            ? 'bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40'
                            : 'bg-[#332114] text-[#E58A3C] border border-[#C86D28]/50'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => generateInvoicePDF(inv)}
                        className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white px-3.5 py-1.5 rounded-xl border border-[#F59352]/40 text-xs font-bold inline-flex items-center space-x-1 shadow-sm transition touch-manipulation cursor-pointer"
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
    </div>
  );
}
