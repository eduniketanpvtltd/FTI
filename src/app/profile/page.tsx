'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
import { generateInvoicePDF } from '@/lib/pdf-generator';
import { UserAddress, BusinessType } from '@/types';
import {
  User,
  Building2,
  MapPin,
  FileSpreadsheet,
  PackageCheck,
  Receipt,
  Bell,
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Lock,
  ArrowRight,
  Download,
  Phone,
  Mail,
  HelpCircle,
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-[#252A2E]">Loading profile...</div>}>
      <ProfileContent />
    </React.Suspense>
  );
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get('tab') || 'info';

  const {
    currentUser,
    updateProfile,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    quotations,
    orders,
    invoices,
    notifications,
    markNotificationRead,
  } = useStore();

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Profile Edit Form State
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [mobile, setMobile] = useState(currentUser.mobile);
  const [companyName, setCompanyName] = useState(currentUser.companyName);
  const [gstin, setGstin] = useState(currentUser.gstin || '');
  const [businessType, setBusinessType] = useState<BusinessType>(currentUser.businessType);
  const [profileSaved, setProfileSaved] = useState(false);

  // Address Modal State
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
      companyName,
      gstin,
      businessType,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

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
      {/* Top Banner */}
      <div className="bg-[#49352D] text-[#F1EAE1] py-6 px-4 sm:px-6 border-b border-[#604333]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-[#B18A70] mb-2 font-mono">
            <Link href="/" className="hover:text-[#F1EAE1] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#F1EAE1] font-semibold">Account & Profile</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-[#76513F] border-2 border-[#B18A70] flex items-center justify-center text-lg font-bold text-[#F1EAE1] shadow-inner">
                {currentUser.fullName.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1EAE1]">
                  {currentUser.companyName}
                </h1>
                <p className="text-xs text-[#B18A70]">
                  {currentUser.fullName} • {currentUser.email} • {currentUser.mobile}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Account Navigation Tabs (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-2.5 shadow-sm space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-xs font-semibold text-left transition ${
                      isActive
                        ? 'bg-[#76513F] text-[#F1EAE1] shadow-xs'
                        : 'text-[#252A2E] hover:bg-[#A8ADB1]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F1EAE1]' : 'text-[#626B72]'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Industrial Buyer Badge Card */}
            <div className="bg-[#343A3F] border border-[#737A7F] text-[#F1EAE1] p-4 rounded-lg text-xs space-y-2">
              <div className="flex items-center space-x-2 text-[#B18A70] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified B2B Buyer</span>
              </div>
              <p className="text-[11px] text-[#A8ADB1] leading-relaxed">
                GSTIN verified. Eligible for direct mill lot allocations and commercial credit terms upon 3 successful shipments.
              </p>
            </div>
          </div>

          {/* Right Column: Tab Content (8 Cols) */}
          <div className="lg:col-span-8">
            {/* TAB 1: Company Profile Info */}
            {activeTab === 'info' && (
              <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-6 shadow-sm">
                <div className="border-b border-[#737A7F]/50 pb-3 mb-5">
                  <h2 className="text-base font-bold text-[#252A2E]">
                    Company Information & Tax Details
                  </h2>
                  <p className="text-xs text-[#626B72]">
                    Used for invoicing, dispatch delivery slips, and GST tax credit verification.
                  </p>
                </div>

                {profileSaved && (
                  <div className="mb-4 p-3 bg-[#10B981]/20 border border-[#10B981] text-[#252A2E] text-xs rounded flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span className="font-semibold">Company profile updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#252A2E] mb-1">Company Legal Name</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] focus:ring-1 focus:ring-[#76513F] focus:border-[#76513F] font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#252A2E] mb-1">Company GSTIN</label>
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        className="w-full bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-mono font-bold focus:ring-1 focus:ring-[#76513F] focus:border-[#76513F]"
                        placeholder="27AABCS1429B1Z8"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#252A2E] mb-1">Authorized Contact Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] focus:ring-1 focus:ring-[#76513F] focus:border-[#76513F] font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#252A2E] mb-1">Business Type</label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                        className="w-full bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-medium focus:ring-1 focus:ring-[#76513F]"
                      >
                        <option value="Manufacturer">Manufacturer / EPC</option>
                        <option value="Fabricator">Precision Fabricator</option>
                        <option value="Wholesaler">Wholesaler / Stockist</option>
                        <option value="Contractor">Infrastructure Contractor</option>
                        <option value="Trader">Metal Trader / Broker</option>
                        <option value="Other">Other Business</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#252A2E] mb-1">Official Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] focus:ring-1 focus:ring-[#76513F] focus:border-[#76513F]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#252A2E] mb-1">Verified Mobile Number</label>
                      <input
                        type="text"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-mono focus:ring-1 focus:ring-[#76513F] focus:border-[#76513F]"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] font-bold py-2.5 px-6 rounded shadow border border-[#B18A70] transition"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#737A7F]/50 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-[#252A2E]">
                      Saved Delivery & Billing Addresses
                    </h2>
                    <p className="text-xs text-[#626B72]">
                      Manage warehouses, factory works gates, and project sites for freight calculations.
                    </p>
                  </div>

                  <button
                    onClick={openAddAddressModal}
                    className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] border border-[#B18A70] text-xs font-semibold px-3 py-1.5 rounded flex items-center space-x-1 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`border rounded-lg p-4 relative text-xs flex flex-col justify-between ${
                        addr.isDefault
                          ? 'border-[#76513F] bg-[#C7CBD0] ring-1 ring-[#76513F]'
                          : 'border-[#737A7F] bg-[#A8ADB1]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-[#252A2E]">{addr.recipientName}</span>
                          {addr.isDefault && (
                            <span className="bg-[#76513F] text-[#F1EAE1] text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-[#252A2E] leading-tight font-medium">
                          {addr.streetAddress}
                        </p>
                        <p className="text-[#626B72] mt-1">
                          {addr.city}, {addr.district}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-[#252A2E] font-mono font-semibold mt-2">Phone: {addr.phone}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#737A7F]/40 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-[#626B72]">
                          Type: {addr.addressType}
                        </span>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="text-[#DC6262] hover:text-[#DC6262]/80 p-1"
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

            {/* TAB 3: My Quotations Quick List */}
            {activeTab === 'quotations' && (
              <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#737A7F]/50 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-[#252A2E]">My Quotations History</h2>
                    <p className="text-xs text-[#626B72]">Track all issued quotations and requests.</p>
                  </div>
                  <Link
                    href="/quotations"
                    className="text-xs text-[#76513F] font-bold hover:underline"
                  >
                    View All Quotations
                  </Link>
                </div>

                <div className="space-y-3">
                  {quotations.map((q) => (
                    <div
                      key={q.id}
                      className="border border-[#737A7F] rounded-lg p-4 flex items-center justify-between text-xs bg-[#A8ADB1] hover:bg-[#C7CBD0] transition"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[#252A2E]">{q.quotationNumber}</span>
                          <span className="text-[10px] bg-[#343A3F] text-[#F1EAE1] px-1.5 py-0.5 rounded capitalize font-medium">
                            {q.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-[#626B72] mt-1">
                          {q.items.length} item(s) • Submitted {formatIndianDate(q.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        {q.grandTotal && (
                          <span className="font-mono font-bold text-[#252A2E] text-sm">
                            {formatINR(q.grandTotal)}
                          </span>
                        )}
                        <Link
                          href={`/quotations/${q.id}`}
                          className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] border border-[#B18A70] px-3 py-1.5 rounded font-semibold text-xs"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: My Orders Quick List */}
            {activeTab === 'orders' && (
              <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#737A7F]/50 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-[#252A2E]">Purchase Orders</h2>
                    <p className="text-xs text-[#626B72]">Confirmed orders and active shipments.</p>
                  </div>
                  <Link href="/orders" className="text-xs text-[#76513F] font-bold hover:underline">
                    View All Orders
                  </Link>
                </div>

                <div className="space-y-3">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="border border-[#737A7F] rounded-lg p-4 flex items-center justify-between text-xs bg-[#A8ADB1] hover:bg-[#C7CBD0] transition"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[#252A2E]">{o.orderNumber}</span>
                          <span className="text-[10px] bg-[#343A3F] text-[#B18A70] border border-[#737A7F] px-1.5 py-0.5 rounded font-bold capitalize">
                            {o.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-[#626B72] mt-1">
                          Placed {formatIndianDate(o.createdAt)} • Ref: {o.quotationNumber}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-[#252A2E] text-sm">
                          {formatINR(o.grandTotal)}
                        </span>
                        <Link
                          href={`/orders/${o.id}`}
                          className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] border border-[#B18A70] px-3 py-1.5 rounded font-semibold text-xs"
                        >
                          Track
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: Tax Invoices */}
            {activeTab === 'invoices' && (
              <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-6 shadow-sm space-y-4">
                <div className="border-b border-[#737A7F]/50 pb-3">
                  <h2 className="text-base font-bold text-[#252A2E]">Official GST Tax Invoices</h2>
                  <p className="text-xs text-[#626B72]">Download compliant PDF invoices for input tax credit.</p>
                </div>

                <div className="space-y-3">
                  {invoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="border border-[#737A7F] rounded-lg p-4 flex items-center justify-between text-xs bg-[#A8ADB1] hover:bg-[#C7CBD0] transition"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <Receipt className="w-4 h-4 text-[#76513F]" />
                          <span className="font-mono font-bold text-[#252A2E]">{inv.invoiceNumber}</span>
                          <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981] text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {inv.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[#626B72] mt-1">
                          Date: {formatIndianDate(inv.invoiceDate)} • PO Ref: {inv.orderNumber}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-[#252A2E] text-sm">
                          {formatINR(inv.grandTotal)}
                        </span>
                        <button
                          onClick={() => generateInvoicePDF(inv)}
                          className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] border border-[#B18A70] font-semibold px-3 py-1.5 rounded text-xs flex items-center space-x-1"
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

            {/* TAB 6: Notifications Center */}
            {activeTab === 'notifications' && (
              <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-6 shadow-sm space-y-4">
                <div className="border-b border-[#737A7F]/50 pb-3">
                  <h2 className="text-base font-bold text-[#252A2E]">Trading Desk Notifications</h2>
                  <p className="text-xs text-[#626B72]">Real-time alerts for quotation pricing, order dispatches, and market movements.</p>
                </div>

                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3.5 rounded-lg border text-xs cursor-pointer transition ${
                        !n.isRead
                          ? 'bg-[#C7CBD0] border-[#76513F] font-medium'
                          : 'bg-[#A8ADB1] border-[#737A7F] text-[#252A2E]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#252A2E] text-xs">{n.title}</span>
                        <span className="text-[10px] text-[#626B72] font-mono">
                          {formatIndianDateTime(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-[#252A2E] leading-relaxed">{n.message}</p>
                      {n.link && (
                        <Link
                          href={n.link}
                          className="mt-2 inline-flex items-center space-x-1 text-[#76513F] font-bold text-[11px] hover:underline"
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
        <div className="fixed inset-0 z-50 bg-[#252A2E]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#BAC0C5] rounded-lg max-w-lg w-full p-6 shadow-2xl border border-[#737A7F]">
            <h3 className="font-bold text-base text-[#252A2E] mb-1">
              {editingAddressId ? 'Edit Address' : 'Add New Delivery / Billing Address'}
            </h3>
            <p className="text-xs text-[#626B72] mb-4">
              Enter exact location and consignee phone number for delivery freight logistics.
            </p>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#252A2E] mb-1">Recipient / Warehouse Name</label>
                <input
                  type="text"
                  value={newAddrRecipient}
                  onChange={(e) => setNewAddrRecipient(e.target.value)}
                  className="w-full bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-medium focus:ring-1 focus:ring-[#76513F]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#252A2E] mb-1">Street Address / Works Gate</label>
                <textarea
                  rows={2}
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  className="w-full bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-medium focus:ring-1 focus:ring-[#76513F]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#252A2E] mb-1">City</label>
                  <input
                    type="text"
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="w-full bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-medium focus:ring-1 focus:ring-[#76513F]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#252A2E] mb-1">District</label>
                  <input
                    type="text"
                    value={newAddrDistrict}
                    onChange={(e) => setNewAddrDistrict(e.target.value)}
                    className="w-full bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-medium focus:ring-1 focus:ring-[#76513F]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#252A2E] mb-1">State</label>
                  <input
                    type="text"
                    value={newAddrState}
                    onChange={(e) => setNewAddrState(e.target.value)}
                    className="w-full bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-medium focus:ring-1 focus:ring-[#76513F]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#252A2E] mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={newAddrPincode}
                    onChange={(e) => setNewAddrPincode(e.target.value)}
                    className="w-full bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-mono font-medium focus:ring-1 focus:ring-[#76513F]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#252A2E] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newAddrPhone}
                    onChange={(e) => setNewAddrPhone(e.target.value)}
                    className="w-full bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-mono font-medium focus:ring-1 focus:ring-[#76513F]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#252A2E] mb-1">Address Type</label>
                  <select
                    value={newAddrType}
                    onChange={(e) => setNewAddrType(e.target.value as any)}
                    className="w-full bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-medium focus:ring-1 focus:ring-[#76513F]"
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
                  className="rounded text-[#76513F] focus:ring-[#76513F]"
                />
                <span className="text-xs text-[#252A2E] font-medium">Set as default delivery address</span>
              </label>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="bg-[#858C92] hover:bg-[#737A7F] text-[#252A2E] font-semibold px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] border border-[#B18A70] font-bold px-5 py-2 rounded shadow transition"
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
