'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate } from '@/lib/utils';
import { Users, Search, Building2, CheckCircle2, ShieldCheck, Mail, Phone } from 'lucide-react';

export default function AdminCustomersPage() {
  const { currentUser, quotations, orders } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Demonstration customer registry with aggregated metrics
  const customers = [
    {
      id: 'usr-customer-01',
      fullName: 'Rajesh K. Sharma',
      email: 'rajesh@sharma-fabricators.in',
      mobile: '+91 98201 12345',
      companyName: 'Sharma Precision & Heavy Fabricators Pvt Ltd',
      gstin: '27AABCS1429B1Z8',
      businessType: 'Fabricator',
      isActive: true,
      createdAt: '2026-08-15',
    },
    {
      id: 'usr-customer-02',
      fullName: 'Vikramaditya Mehta',
      email: 'v.mehta@gujarat-tubes.com',
      mobile: '+91 98791 22334',
      companyName: 'Gujarat Precision Tubes & Forgings Ltd',
      gstin: '24AAACG8812J1Z2',
      businessType: 'Manufacturer',
      isActive: true,
      createdAt: '2026-09-01',
    },
    {
      id: 'usr-customer-03',
      fullName: 'Gurpreet Singh',
      email: 'gsingh@punjab-fasteners.com',
      mobile: '+91 98140 55667',
      companyName: 'Punjab Heavy Bolts & Industrial Fasteners',
      gstin: '03AABCP9912K1Z9',
      businessType: 'Wholesaler',
      isActive: true,
      createdAt: '2026-09-20',
    },
  ];

  const filtered = customers.filter((c) => {
    return (
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.gstin.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Registry & Accounts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered industrial buyers, verified GSTIN certificates, and procurement volumes.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Company, Contact, GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="space-y-3">
        {/* Mobile Customer Cards (< md screens) */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-xs text-slate-500">
              No customer accounts found matching search.
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-3 text-xs shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-900 text-sm">{c.companyName}</p>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {c.id}</span>
                  </div>
                  <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shrink-0">
                    Active
                  </span>
                </div>

                <div className="bg-slate-50 rounded p-2.5 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{c.fullName}</span>
                    <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200/80">
                    <a
                      href={`tel:${c.mobile}`}
                      className="inline-flex items-center space-x-1 text-blue-600 hover:underline bg-white px-2 py-1 rounded border border-slate-200 text-[11px] touch-manipulation font-medium"
                    >
                      <Phone className="w-3 h-3 text-blue-500" />
                      <span>{c.mobile}</span>
                    </a>
                    <a
                      href={`mailto:${c.email}`}
                      className="inline-flex items-center space-x-1 text-slate-600 hover:underline bg-white px-2 py-1 rounded border border-slate-200 text-[11px] touch-manipulation truncate max-w-[200px]"
                    >
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{c.email}</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px] block">GSTIN:</span>
                    <span className="font-mono font-bold text-slate-800">{c.gstin}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Business Type:</span>
                    <span className="font-medium text-slate-700">{c.businessType}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span>Registered:</span>
                  <span>{formatIndianDate(c.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop / Tablet Customers Table (md and up) */}
        <div className="hidden md:block bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Authorized Contact</th>
                  <th className="py-3 px-4">GSTIN</th>
                  <th className="py-3 px-4">Business Type</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-center">Verification</th>
                  <th className="py-3 px-4 text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{c.companyName}</p>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {c.id}</span>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{c.fullName}</p>
                      <p className="text-[10px] text-slate-500">{c.mobile} • {c.email}</p>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {c.gstin}
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                        {c.businessType}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      {formatIndianDate(c.createdAt)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                        Active
                      </span>
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
