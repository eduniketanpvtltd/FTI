'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
import { generateInvoicePDF } from '@/lib/pdf-generator';
import { BusinessType } from '@/types';
import {
  Building2,
  MapPin,
  FileSpreadsheet,
  PackageCheck,
  Receipt,
  Bell,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Download,
  ChevronRight,
  LogOut,
  Lock,
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <React.Suspense
      fallback={<div className="p-8 text-center text-xs text-[#94A3B8]">Loading profile...</div>}
    >
      <ProfileContent />
    </React.Suspense>
  );
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get('tab') || 'info';

  const {
    isAuthenticated,
    isProfileComplete,
    currentUser,
    updateProfile,
    logout,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    quotations: allQuotations,
    orders: allOrders,
    invoices: allInvoices,
    notifications: allNotifications,
    markNotificationRead,
  } = useStore();

  const isAdmin = currentUser.role !== 'customer';
  const quotations = isAdmin
    ? allQuotations
    : allQuotations.filter((q) => q.userId === currentUser.id);
  const orders = isAdmin
    ? allOrders
    : allOrders.filter((o) => o.userId === currentUser.id);
  const invoices = isAdmin
    ? allInvoices
    : allInvoices.filter((inv) => inv.userId === currentUser.id);
  const notifications = allNotifications.filter(
    (n) => !n.userId || n.userId === currentUser.id
  );

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [mobile, setMobile] = useState(currentUser.mobile);
  const [designation, setDesignation] = useState(currentUser.designation || 'Purchase / Procurement Head');
  const [companyName, setCompanyName] = useState(currentUser.companyName);
  const [gstin, setGstin] = useState(currentUser.gstin || '');
  const [businessType, setBusinessType] = useState<BusinessType>(currentUser.businessType);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    setFullName(currentUser.fullName);
    setEmail(currentUser.email);
    setMobile(currentUser.mobile);
    setDesignation(currentUser.designation || 'Purchase / Procurement Head');
    setCompanyName(currentUser.companyName);
    setGstin(currentUser.gstin || '');
    setBusinessType(currentUser.businessType);
  }, [currentUser]);

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [newAddrRecipient, setNewAddrRecipient] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrDistrict, setNewAddrDistrict] = useState('');
  const [newAddrState, setNewAddrState] = useState('Maharashtra');
  const [newAddrPincode, setNewAddrPincode] = useState('');
  const [newAddrType, setNewAddrType] = useState<'billing' | 'shipping' | 'both'>('shipping');
  const [newAddrDefault, setNewAddrDefault] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      email,
      mobile,
      designation,
      companyName,
      gstin,
      businessType,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  if (!isAuthenticated) {
    return (
      <CustomerLayout>
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-8 shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#251811] border border-[#E06924]/40 text-[#E8732A] flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-extrabold text-white">Sign In to Access Your B2B Profile</h1>
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-md mx-auto">
              Sign in with Google to manage your company GST details, delivery addresses, official quotation requests, and tax invoices.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login?redirect=/profile"
                className="w-full sm:w-auto bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-extrabold px-6 py-3 rounded-xl border border-[#F59352]/50 shadow-lg"
              >
                Sign In / Sign Up with Google
              </Link>
              <Link
                href="/raw-materials"
                className="w-full sm:w-auto bg-[#191F28] text-[#CBD5E1] hover:text-white text-xs font-bold px-5 py-3 rounded-xl border border-[#2A3342]"
              >
                Continue Exploring Catalog
              </Link>
            </div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  if (!isProfileComplete) {
    return (
      <CustomerLayout>
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="bg-[#14181F] border-2 border-[#E06924] rounded-2xl p-8 shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#251811] border border-[#E06924]/40 text-[#E8732A] flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-extrabold text-white">Complete Your B2B Buyer Profile</h1>
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-md mx-auto">
              You are signed in as <strong className="text-white">{currentUser.email}</strong>. Please complete your company details and primary delivery address to activate your buyer account.
            </p>
            <div className="pt-2">
              <Link
                href="/login?redirect=/profile&mode=signup"
                className="inline-flex items-center space-x-2 bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-extrabold px-6 py-3 rounded-xl border border-[#F59352]/50 shadow-lg"
              >
                <span>Complete Profile Setup</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const openAddAddressModal = () => {
    setEditingAddressId(null);
    setNewAddrRecipient(currentUser.companyName);
    setNewAddrPhone(currentUser.mobile);
    setNewAddrStreet('');
    setNewAddrCity('Navi Mumbai');
    setNewAddrDistrict('Thane');
    setNewAddrState('Maharashtra');
    setNewAddrPincode('400705');
    setNewAddrType('shipping');
    setNewAddrDefault(false);
    setAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      updateAddress(editingAddressId, {
        recipientName: newAddrRecipient,
        phone: newAddrPhone,
        streetAddress: newAddrStreet,
        city: newAddrCity,
        district: newAddrDistrict,
        state: newAddrState,
        pincode: newAddrPincode,
        addressType: newAddrType,
        isDefault: newAddrDefault,
      });
    } else {
      addAddress({
        userId: currentUser.id,
        recipientName: newAddrRecipient,
        phone: newAddrPhone,
        streetAddress: newAddrStreet,
        city: newAddrCity,
        district: newAddrDistrict,
        state: newAddrState,
        pincode: newAddrPincode,
        country: 'India',
        addressType: newAddrType,
        isDefault: newAddrDefault,
      });
    }
    setAddressModalOpen(false);
  };

  const tabs = [
    { key: 'info', label: 'Company Profile', icon: Building2 },
    { key: 'addresses', label: `Saved Addresses (${addresses.length})`, icon: MapPin },
    { key: 'quotations', label: `Quotations (${quotations.length})`, icon: FileSpreadsheet },
    { key: 'orders', label: `Orders (${orders.length})`, icon: PackageCheck },
    { key: 'invoices', label: `Tax Invoices (${invoices.length})`, icon: Receipt },
    { key: 'notifications', label: `Notifications (${notifications.length})`, icon: Bell },
  ];

  return (
    <CustomerLayout>
      {/* Top Hero Banner with AI Foundry Background */}
      <div className="relative overflow-hidden border-b border-[#1E242D]">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/foundry-hero-bg.jpg"
            alt="Industrial Steel Foundry"
            className="w-full h-52 sm:h-60 object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E11]/35 via-[#0B0E11]/85 to-[#0B0E11]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E11]/90 via-[#0B0E11]/45 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto pt-16 sm:pt-20 pb-5 px-3.5 sm:px-6">
          <div className="flex items-center space-x-1.5 text-xs text-[#CBD5E1] mb-2 font-medium">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-[#E8732A] font-bold">Account & Profile</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-12 h-12 rounded-2xl border-2 border-[#E8732A] object-cover shadow-lg"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#E8732A] to-[#C45316] border border-[#F59352]/50 flex items-center justify-center text-lg font-black text-white shadow-lg">
                  {currentUser.fullName.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                  {currentUser.companyName}
                </h1>
                <p className="text-xs text-[#E8732A] font-medium">
                  {currentUser.fullName}
                  {currentUser.designation ? ` (${currentUser.designation})` : ''} • {currentUser.email} • {currentUser.mobile}
                </p>
              </div>
            </div>

            <button
              onClick={async () => {
                await logout();
                router.push('/');
              }}
              className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#191F28] hover:bg-[#2F1619] border border-[#2A3342] hover:border-[#EF4444]/50 text-[#CBD5E1] hover:text-[#F87171] text-xs font-bold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left Column: Account Navigation Tabs */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-2.5 shadow-lg space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#E8732A] to-[#C45316] text-white shadow-md'
                        : 'text-[#CBD5E1] hover:bg-[#191F28] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#E8732A]'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#14181F] border border-[#28303E] text-white p-4 rounded-2xl text-xs space-y-2">
              <div className="flex items-center space-x-2 text-[#E8732A] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                <span>Verified B2B Buyer</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                GSTIN verified. Eligible for direct mill lot allocations and commercial credit terms upon 3 successful shipments.
              </p>
            </div>
          </div>

          {/* Right Column: Tab Content */}
          <div className="lg:col-span-8">
            {activeTab === 'info' && (
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-6 shadow-lg">
                <div className="border-b border-[#222934] pb-3.5 mb-5">
                  <h2 className="text-base font-extrabold text-white">
                    Company Information & Tax Details
                  </h2>
                  <p className="text-xs text-[#94A3B8]">
                    Used for invoicing, dispatch delivery slips, and GST tax credit verification.
                  </p>
                </div>

                {profileSaved && (
                  <div className="mb-4 p-3 bg-[#122D21] border border-[#22C55E]/40 text-[#4ADE80] text-xs rounded-xl flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-bold">Company profile updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-white mb-1.5">Company Legal Name</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-white mb-1.5">Company GSTIN</label>
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-[#E8732A] font-mono font-bold"
                        placeholder="27AABCS1429B1Z8"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-white mb-1.5">Authorized Contact Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-white mb-1.5">Designation / Role</label>
                      <select
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                      >
                        <option value="Owner / Managing Director">Owner / Managing Director</option>
                        <option value="Purchase / Procurement Head">Purchase / Procurement Head</option>
                        <option value="Project / Site Engineer">Project / Site Engineer</option>
                        <option value="Supply Chain Manager">Supply Chain Manager</option>
                        <option value="Plant / Works Manager">Plant / Works Manager</option>
                        <option value="Finance / Accounts">Finance / Accounts</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-white mb-1.5">Business Type</label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                      >
                        <option value="Manufacturer">Manufacturer / EPC</option>
                        <option value="Fabricator">Precision Fabricator</option>
                        <option value="Wholesaler">Wholesaler / Stockist</option>
                        <option value="Contractor">Infrastructure Contractor</option>
                        <option value="Trader">Metal Trader / Broker</option>
                        <option value="Other">Other Business</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-white mb-1.5">Monthly Procurement Volume</label>
                      <div className="w-full bg-[#191F28]/60 border border-[#2A3342] rounded-xl p-2.5 text-[#CBD5E1] font-medium">
                        {currentUser.monthlyVolume || '10 – 50 MT / Month'}
                      </div>
                    </div>
                  </div>

                  {currentUser.primaryMaterials && currentUser.primaryMaterials.length > 0 && (
                    <div>
                      <label className="block font-bold text-white mb-1.5">
                        Primary Materials of Interest (Buyer Profiling)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.primaryMaterials.map((mat) => (
                          <span
                            key={mat}
                            className="bg-[#251811] text-[#E8732A] border border-[#E06924]/40 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-white mb-1.5">Official Email Address (Google Verified)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-white mb-1.5">Verified Mobile Number</label>
                      <input
                        type="text"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white font-bold py-2.5 px-6 rounded-xl shadow-md border border-[#F59352]/50 transition cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-6 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-[#222934] pb-3.5">
                  <div>
                    <h2 className="text-base font-extrabold text-white">
                      Saved Delivery & Billing Addresses
                    </h2>
                    <p className="text-xs text-[#94A3B8]">
                      Manage warehouses, factory works gates, and project sites for freight calculations.
                    </p>
                  </div>

                  <button
                    onClick={openAddAddressModal}
                    className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`border rounded-xl p-4 relative text-xs flex flex-col justify-between ${
                        addr.isDefault
                          ? 'border-[#E8732A] bg-[#251811]/60'
                          : 'border-[#2A3342] bg-[#191F28]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white">{addr.recipientName}</span>
                          {addr.isDefault && (
                            <span className="bg-[#123123] text-[#4ADE80] border border-[#22C55E]/40 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-[#E2E8F0] leading-tight font-medium">
                          {addr.streetAddress}
                        </p>
                        <p className="text-[#94A3B8] mt-1">
                          {addr.city}, {addr.district}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-[#E8732A] font-mono font-semibold mt-2">
                          Phone: {addr.phone}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#2A3342] flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-[#94A3B8]">
                          Type: {addr.addressType}
                        </span>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="text-[#F87171] hover:text-[#EF4444] p-1 cursor-pointer"
                            title="Delete Address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'quotations' && (
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-6 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-[#222934] pb-3.5">
                  <div>
                    <h2 className="text-base font-extrabold text-white">My Quotations History</h2>
                    <p className="text-xs text-[#94A3B8]">Track all issued quotations and requests.</p>
                  </div>
                  <Link
                    href="/quotations"
                    className="text-xs text-[#E8732A] font-bold hover:underline"
                  >
                    View All Quotations
                  </Link>
                </div>

                <div className="space-y-3">
                  {quotations.map((q) => (
                    <div
                      key={q.id}
                      className="border border-[#2A3342] rounded-xl p-4 flex items-center justify-between text-xs bg-[#191F28] hover:border-[#E06924] transition"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-white">{q.quotationNumber}</span>
                          <span className="text-[10px] bg-[#251811] text-[#E8732A] border border-[#E06924]/40 px-2 py-0.5 rounded-md capitalize font-bold">
                            {q.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-[#94A3B8] mt-1">
                          {q.items.length} item(s) • Submitted {formatIndianDate(q.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        {q.grandTotal && (
                          <span className="font-mono font-bold text-[#E8732A] text-sm">
                            {formatINR(q.grandTotal)}
                          </span>
                        )}
                        <Link
                          href={`/quotations/${q.id}`}
                          className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 px-3.5 py-1.5 rounded-xl font-bold text-xs"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-6 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-[#222934] pb-3.5">
                  <div>
                    <h2 className="text-base font-extrabold text-white">Purchase Orders</h2>
                    <p className="text-xs text-[#94A3B8]">Confirmed orders and active shipments.</p>
                  </div>
                  <Link href="/orders" className="text-xs text-[#E8732A] font-bold hover:underline">
                    View All Orders
                  </Link>
                </div>

                <div className="space-y-3">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="border border-[#2A3342] rounded-xl p-4 flex items-center justify-between text-xs bg-[#191F28] hover:border-[#E06924] transition"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-white">{o.orderNumber}</span>
                          <span className="text-[10px] bg-[#251811] text-[#E8732A] border border-[#E06924]/40 px-2 py-0.5 rounded-md font-bold capitalize">
                            {o.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-[#94A3B8] mt-1">
                          Placed {formatIndianDate(o.createdAt)} • Ref: {o.quotationNumber}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-[#E8732A] text-sm">
                          {formatINR(o.grandTotal)}
                        </span>
                        <Link
                          href={`/orders/${o.id}`}
                          className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 px-3.5 py-1.5 rounded-xl font-bold text-xs"
                        >
                          Track
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-6 shadow-lg space-y-4">
                <div className="border-b border-[#222934] pb-3.5">
                  <h2 className="text-base font-extrabold text-white">Official GST Tax Invoices</h2>
                  <p className="text-xs text-[#94A3B8]">
                    Download compliant PDF invoices for input tax credit.
                  </p>
                </div>

                <div className="space-y-3">
                  {invoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="border border-[#2A3342] rounded-xl p-4 flex items-center justify-between text-xs bg-[#191F28] hover:border-[#E06924] transition"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <Receipt className="w-4 h-4 text-[#E8732A]" />
                          <span className="font-mono font-bold text-white">{inv.invoiceNumber}</span>
                          <span className="bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {inv.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[#94A3B8] mt-1">
                          Date: {formatIndianDate(inv.invoiceDate)} • PO Ref: {inv.orderNumber}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-[#E8732A] text-sm">
                          {formatINR(inv.grandTotal)}
                        </span>
                        <button
                          onClick={() => generateInvoicePDF(inv)}
                          className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-6 shadow-lg space-y-4">
                <div className="border-b border-[#222934] pb-3.5">
                  <h2 className="text-base font-extrabold text-white">Trading Desk Notifications</h2>
                  <p className="text-xs text-[#94A3B8]">
                    Real-time alerts for quotation pricing, order dispatches, and market movements.
                  </p>
                </div>

                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-4 rounded-xl border text-xs cursor-pointer transition ${
                        !n.isRead
                          ? 'bg-[#251811]/60 border-[#E8732A] font-medium'
                          : 'bg-[#191F28] border-[#2A3342] text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-xs">{n.title}</span>
                        <span className="text-[10px] text-[#94A3B8] font-mono">
                          {formatIndianDateTime(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-[#CBD5E1] leading-relaxed">{n.message}</p>
                      {n.link && (
                        <Link
                          href={n.link}
                          className="mt-2 inline-flex items-center space-x-1 text-[#E8732A] font-bold text-[11px] hover:underline"
                        >
                          <span>Open Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14181F] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#2C3545]">
            <h3 className="font-extrabold text-base text-white mb-1">
              {editingAddressId ? 'Edit Address' : 'Add New Delivery / Billing Address'}
            </h3>
            <p className="text-xs text-[#94A3B8] mb-4">
              Enter exact location and consignee phone number for delivery freight logistics.
            </p>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-white mb-1">Recipient / Warehouse Name</label>
                <input
                  type="text"
                  value={newAddrRecipient}
                  onChange={(e) => setNewAddrRecipient(e.target.value)}
                  className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-white mb-1">Street Address / Works Gate</label>
                <textarea
                  rows={2}
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-white mb-1">City</label>
                  <input
                    type="text"
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-white mb-1">District</label>
                  <input
                    type="text"
                    value={newAddrDistrict}
                    onChange={(e) => setNewAddrDistrict(e.target.value)}
                    className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-white mb-1">State</label>
                  <input
                    type="text"
                    value={newAddrState}
                    onChange={(e) => setNewAddrState(e.target.value)}
                    className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-white mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={newAddrPincode}
                    onChange={(e) => setNewAddrPincode(e.target.value)}
                    className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-mono font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-white mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newAddrPhone}
                    onChange={(e) => setNewAddrPhone(e.target.value)}
                    className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-mono font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-white mb-1">Address Type</label>
                  <select
                    value={newAddrType}
                    onChange={(e) => setNewAddrType(e.target.value as any)}
                    className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                  >
                    <option value="shipping">Delivery / Shipping</option>
                    <option value="billing">Billing Only</option>
                    <option value="both">Both Billing & Shipping</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center space-x-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAddrDefault}
                  onChange={(e) => setNewAddrDefault(e.target.checked)}
                  className="rounded accent-[#E8732A]"
                />
                <span className="text-xs text-[#CBD5E1] font-medium">
                  Set as default delivery address
                </span>
              </label>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="bg-[#191F28] hover:bg-[#222936] text-[#CBD5E1] border border-[#2A3342] font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 font-bold px-5 py-2 rounded-xl shadow transition cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}
