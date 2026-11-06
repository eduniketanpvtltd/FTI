'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { formatIndianDate } from '@/lib/utils';
import { Search, ShieldCheck, Mail, Phone } from 'lucide-react';

export default function AdminCustomersPage() {
  const { users } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Dynamic customer registry combining store users + seed customers
  const seedCustomers = [
    {
      id: 'usr-customer-02',
      fullName: 'Vikramaditya Mehta',
      email: 'v.mehta@gujarat-tubes.com',
      mobile: '+91 98791 22334',
      designation: 'Owner / Managing Director',
      companyName: 'Gujarat Precision Tubes & Forgings Ltd',
      gstin: '24AAACG8812J1Z2',
      businessType: 'Manufacturer',
      monthlyVolume: '50 – 200 MT / Month',
      isActive: true,
      createdAt: '2026-09-01',
    },
    {
      id: 'usr-customer-03',
      fullName: 'Gurpreet Singh',
      email: 'gsingh@punjab-fasteners.com',
      mobile: '+91 98140 55667',
      designation: 'Purchase / Procurement Head',
      companyName: 'Punjab Heavy Bolts & Industrial Fasteners',
      gstin: '03AABCP9912K1Z9',
      businessType: 'Wholesaler',
      monthlyVolume: '10 – 50 MT / Month',
      isActive: true,
      createdAt: '2026-09-20',
    },
  ];

  const storeCustomers = users
    .filter((u) => u.role === 'customer' && u.id !== 'usr-guest')
    .map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      mobile: u.mobile || 'Pending',
      designation: u.designation || 'Authorized Buyer',
      companyName: u.companyName || 'Pending B2B Profile',
      gstin: u.gstin || 'UNREGISTERED',
      businessType: u.businessType || 'Other',
      monthlyVolume: u.monthlyVolume || '10 – 50 MT / Month',
      isActive: u.isActive,
      createdAt: u.createdAt,
    }));

  const customers = [
    ...storeCustomers,
    ...seedCustomers.filter((sc) => !storeCustomers.some((u) => u.id === sc.id)),
  ];

  const filtered = customers.filter((c) => {
    return (
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.gstin || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Customer Registry & <span className="text-[#E8732A]">B2B Accounts</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Registered industrial buyers, verified GSTIN certificates, and procurement volumes.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-4 shadow-lg">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Company, Contact, GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#191F28] border border-[#2A3342] rounded-xl text-white placeholder-[#64748B]"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="space-y-3">
        {/* Mobile Customer Cards (< md screens) */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-8 text-center text-xs text-[#94A3B8]">
              No customer accounts found matching search.
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className="bg-[#14181F] border border-[#28303E] rounded-2xl p-4 space-y-3 text-xs shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="font-extrabold text-white text-sm">{c.companyName}</p>
                    <span className="text-[10px] text-[#94A3B8] font-mono">ID: {c.id}</span>
                  </div>
                  <span className="bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40 font-bold text-[10px] px-2.5 py-0.5 rounded-md shrink-0">
                    Active
                  </span>
                </div>

                <div className="bg-[#191F28] rounded-xl p-3 border border-[#2A3342] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{c.fullName}</span>
                      <span className="text-[10px] text-[#94A3B8]">{c.designation}</span>
                    </div>
                    <span className="inline-flex items-center space-x-1 text-[#4ADE80] bg-[#122D21] px-2 py-0.5 rounded-md border border-[#22C55E]/40 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1.5 border-t border-[#28303E]">
                    <a
                      href={`tel:${c.mobile}`}
                      className="inline-flex items-center space-x-1 text-[#E8732A] hover:underline bg-[#14181F] px-2.5 py-1 rounded-lg border border-[#28303E] text-[11px] touch-manipulation font-medium"
                    >
                      <Phone className="w-3 h-3 text-[#E8732A]" />
                      <span>{c.mobile}</span>
                    </a>
                    <a
                      href={`mailto:${c.email}`}
                      className="inline-flex items-center space-x-1 text-[#CBD5E1] hover:underline bg-[#14181F] px-2.5 py-1 rounded-lg border border-[#28303E] text-[11px] touch-manipulation truncate max-w-[200px]"
                    >
                      <Mail className="w-3 h-3 text-[#94A3B8]" />
                      <span className="truncate">{c.email}</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-[#94A3B8] text-[10px] block">GSTIN:</span>
                    <span className="font-mono font-bold text-[#E8732A]">{c.gstin}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] text-[10px] block">Business Type:</span>
                    <span className="font-medium text-white">{c.businessType}</span>
                  </div>
                </div>

                <div className="text-[10px] text-[#94A3B8] pt-1.5 border-t border-[#222934] flex items-center justify-between">
                  <span>Registered:</span>
                  <span>{formatIndianDate(c.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop / Tablet Customers Table (md and up) */}
        <div className="hidden md:block bg-[#14181F] border border-[#28303E] rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#191F28] text-[#CBD5E1] font-bold uppercase text-[10px] border-b border-[#28303E]">
                  <th className="py-3.5 px-4">Company Name</th>
                  <th className="py-3.5 px-4">Authorized Contact</th>
                  <th className="py-3.5 px-4">GSTIN</th>
                  <th className="py-3.5 px-4">Business Type</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4 text-center">Verification</th>
                  <th className="py-3.5 px-4 text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222934]">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#191F28]/60 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-white">{c.companyName}</p>
                      <span className="text-[10px] text-[#94A3B8] font-mono">
                        ID: {c.id} • {c.monthlyVolume}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">
                        {c.fullName}{' '}
                        <span className="text-[10px] font-normal text-[#94A3B8]">
                          ({c.designation})
                        </span>
                      </p>
                      <p className="text-[10px] text-[#94A3B8]">
                        {c.mobile} • {c.email}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#E8732A]">
                      {c.gstin}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-[#191F28] text-[#CBD5E1] border border-[#2A3342] px-2.5 py-0.5 rounded-md font-medium text-[11px]">
                        {c.businessType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#94A3B8]">
                      {formatIndianDate(c.createdAt)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center space-x-1 text-[#4ADE80] bg-[#122D21] px-2.5 py-0.5 rounded-md border border-[#22C55E]/40 text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40 font-bold text-[10px] px-2.5 py-0.5 rounded-md">
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
