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
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading profile...</div>}>
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
    switchUserRole,
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
      <div className="bg-slate-900 text-white py-6 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-200">Home</Link>
            <span>/</span>
            <span className="text-blue-400 font-semibold">Account & Profile</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-blue-700 border-2 border-slate-700 flex items-center justify-center text-lg font-bold text-white shadow-inner">
                {currentUser.fullName.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {currentUser.companyName}
                </h1>
                <p className="text-xs text-slate-400">
                  {currentUser.fullName} • {currentUser.email} • {currentUser.mobile}
                </p>
              </div>
            </div>

            {/* Role switch toggle */}
            <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
              <span className="text-xs text-slate-400">Current Role:</span>
              <span className="text-xs font-bold font-mono text-emerald-400 capitalize">
                {currentUser.role.replace('_', ' ')}
              </span>
              <button
                onClick={() => switchUserRole(currentUser.role === 'customer' ? 'admin' : 'customer')}
                className="ml-2 text-[11px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded transition"
              >
                {currentUser.role === 'customer' ? 'Switch to Admin' : 'Switch to Customer'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Account Navigation Tabs (4 Cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-xs font-semibold text-left transition ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Industrial Buyer Badge Card */}
            <div className="bg-slate-900 text-slate-300 p-4 rounded-lg text-xs space-y-2">
              <div className="flex items-center space-x-2 text-blue-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified B2B Buyer</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                GSTIN verified. Eligible for direct mill lot allocations and commercial credit terms upon 3 successful shipments.
              </p>
            </div>
          </div>

          {/* Right Column: Tab Content (8 Cols) */}
          <div className="lg:col-span-8">
            {/* TAB 1: Company Profile Info */}
            {activeTab === 'info' && (
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
                <div className="border-b border-slate-200 pb-3 mb-5">
                  <h2 className="text-base font-bold text-slate-900">
                    Company Information & Tax Details
                  </h2>
                  <p className="text-xs text-slate-500">
                    Used for invoicing, dispatch delivery slips, and GST tax credit verification.
                  </p>
                </div>

                {profileSaved && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Company profile updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Company Legal Name</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Company GSTIN</label>
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold"
                        placeholder="27AABCS1429B1Z8"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Authorized Contact Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Business Type</label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                        className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-medium"
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
                      <label className="block font-bold text-slate-800 mb-1">Official Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Verified Mobile Number</label>
                      <input
                        type="text"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded shadow transition"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Saved Delivery & Billing Addresses
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage warehouses, factory works gates, and project sites for freight calculations.
                    </p>
                  </div>

                  <button
                    onClick={openAddAddressModal}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center space-x-1 transition"
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
                          ? 'border-blue-500 bg-blue-50/30'
                          : 'border-slate-200 bg-slate-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-900">{addr.recipientName}</span>
                          {addr.isDefault && (
                            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 leading-tight">
                          {addr.streetAddress}
                        </p>
                        <p className="text-slate-600 mt-1">
                          {addr.city}, {addr.district}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-slate-500 font-mono mt-2">Phone: {addr.phone}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 capitalize">
                          Type: {addr.addressType}
                        </span>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="text-rose-600 hover:text-rose-800 p-1"
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
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">My Quotations History</h2>
                    <p className="text-xs text-slate-500">Track all issued quotations and requests.</p>
                  </div>
                  <Link
                    href="/quotations"
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    View All Quotations
                  </Link>
                </div>

                <div className="space-y-3">
                  {quotations.map((q) => (
                    <div
                      key={q.id}
                      className="border border-slate-200 rounded-lg p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-slate-900">{q.quotationNumber}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded capitalize">
                            {q.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-1">
                          {q.items.length} item(s) • Submitted {formatIndianDate(q.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        {q.grandTotal && (
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {formatINR(q.grandTotal)}
                          </span>
                        )}
                        <Link
                          href={`/quotations/${q.id}`}
                          className="bg-slate-900 text-white px-3 py-1.5 rounded font-semibold text-xs"
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
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Purchase Orders</h2>
                    <p className="text-xs text-slate-500">Confirmed orders and active shipments.</p>
                  </div>
                  <Link href="/orders" className="text-xs text-blue-600 font-semibold hover:underline">
                    View All Orders
                  </Link>
                </div>

                <div className="space-y-3">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="border border-slate-200 rounded-lg p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-slate-900">{o.orderNumber}</span>
                          <span className="text-[10px] bg-purple-100 text-purple-900 px-1.5 py-0.2 rounded font-bold capitalize">
                            {o.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-1">
                          Placed {formatIndianDate(o.createdAt)} • Ref: {o.quotationNumber}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {formatINR(o.grandTotal)}
                        </span>
                        <Link
                          href={`/orders/${o.id}`}
                          className="bg-slate-900 text-white px-3 py-1.5 rounded font-semibold text-xs"
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
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-base font-bold text-slate-900">Official GST Tax Invoices</h2>
                  <p className="text-xs text-slate-500">Download compliant PDF invoices for input tax credit.</p>
                </div>

                <div className="space-y-3">
                  {invoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="border border-slate-200 rounded-lg p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <Receipt className="w-4 h-4 text-blue-600" />
                          <span className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                            {inv.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-1">
                          Date: {formatIndianDate(inv.invoiceDate)} • PO Ref: {inv.orderNumber}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {formatINR(inv.grandTotal)}
                        </span>
                        <button
                          onClick={() => generateInvoicePDF(inv)}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1.5 rounded text-xs flex items-center space-x-1"
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
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-base font-bold text-slate-900">Trading Desk Notifications</h2>
                  <p className="text-xs text-slate-500">Real-time alerts for quotation pricing, order dispatches, and market movements.</p>
                </div>

                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3.5 rounded-lg border text-xs cursor-pointer transition ${
                        !n.isRead
                          ? 'bg-blue-50/50 border-blue-200 font-medium'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 text-xs">{n.title}</span>
                        <span className="text-[10px] text-slate-400">
                          {formatIndianDateTime(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{n.message}</p>
                      {n.link && (
                        <Link
                          href={n.link}
                          className="mt-2 inline-flex items-center space-x-1 text-blue-600 font-semibold text-[11px] hover:underline"
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
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl border border-slate-300">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              {editingAddressId ? 'Edit Address' : 'Add New Delivery / Billing Address'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter exact location and consignee phone number for delivery freight logistics.
            </p>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Recipient / Warehouse Name</label>
                <input
                  type="text"
                  value={newAddrRecipient}
                  onChange={(e) => setNewAddrRecipient(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Street Address / Works Gate</label>
                <textarea
                  rows={2}
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">City</label>
                  <input
                    type="text"
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">District</label>
                  <input
                    type="text"
                    value={newAddrDistrict}
                    onChange={(e) => setNewAddrDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">State</label>
                  <input
                    type="text"
                    value={newAddrState}
                    onChange={(e) => setNewAddrState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={newAddrPincode}
                    onChange={(e) => setNewAddrPincode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newAddrPhone}
                    onChange={(e) => setNewAddrPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Address Type</label>
                  <select
                    value={newAddrType}
                    onChange={(e) => setNewAddrType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
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
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-700">Set as default delivery address</span>
              </label>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded shadow"
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
