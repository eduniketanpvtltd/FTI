'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
import { generateInvoicePDF } from '@/lib/pdf-generator';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import {
  PackageCheck,
  Search,
  Truck,
  Receipt,
  Download,
  Edit,
  CheckCircle2,
  AlertCircle,
  Building2,
  DollarSign,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders, invoices, updateOrderStatus, updatePaymentStatus } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Order Update Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('processing');
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>('pending');
  const [carrier, setCarrier] = useState('');
  const [trackingNo, setTrackingNo] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [notes, setNotes] = useState('');
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setNewPaymentStatus(order.paymentStatus);
    setCarrier(order.trackingCarrier || 'V-Trans Express Freight Logistics');
    setTrackingNo(order.trackingNumber || `VTR-MH-${Math.floor(100000 + Math.random() * 900000)}`);
    setEstimatedDelivery(
      order.estimatedDelivery ||
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    setNotes('');
    setModalOpen(true);
  };

  const handleSaveOrderUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    updateOrderStatus(selectedOrder.id, newStatus, {
      trackingCarrier: carrier,
      trackingNumber: trackingNo,
      estimatedDelivery,
      notes,
    });

    if (newPaymentStatus !== selectedOrder.paymentStatus) {
      updatePaymentStatus(selectedOrder.id, newPaymentStatus);
    }

    setSuccessFeedback(`Order #${selectedOrder.orderNumber} successfully updated.`);
    setModalOpen(false);

    setTimeout(() => {
      setSuccessFeedback(null);
    }, 4000);
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerSnapshot.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Purchase Orders & Dispatch Fulfillment
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage material weighment, loading, truck dispatch details, and customer invoicing.
          </p>
        </div>
      </div>

      {successFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-md flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successFeedback}</span>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Order ID, Client, Quotation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
          />
        </div>

        <div className="flex items-center space-x-1.5 text-xs overflow-x-auto pb-1 sm:pb-0">
          {['all', 'order_confirmed', 'processing', 'dispatched', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded font-semibold whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All Orders' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Client Company</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Carrier & Tracking</th>
                <th className="py-3 px-4 text-right">Grand Total (₹)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((order) => {
                const invoice = invoices.find((inv) => inv.orderId === order.id);
                return (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatIndianDate(order.createdAt)} • Ref: {order.quotationNumber}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{order.customerSnapshot.companyName}</p>
                      <p className="text-[10px] text-slate-500">
                        {order.customerSnapshot.fullName} ({order.shippingAddress.city})
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-purple-100 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px]">
                      {order.trackingNumber ? (
                        <div>
                          <span className="font-mono font-bold text-blue-700 block">
                            {order.trackingNumber}
                          </span>
                          <span className="text-[10px] text-slate-500">{order.trackingCarrier}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending Dispatch</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                      {formatINR(order.grandTotal)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {invoice && (
                          <button
                            onClick={() => generateInvoicePDF(invoice)}
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Download Tax Invoice PDF"
                          >
                            <Receipt className="w-3.5 h-3.5 text-blue-600" />
                          </button>
                        )}

                        <button
                          onClick={() => openOrderModal(order)}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded text-xs font-semibold inline-flex items-center space-x-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Dispatch</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Dispatch & Status Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl border border-slate-300">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              Update Order #{selectedOrder.orderNumber}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Client: <span className="font-semibold text-slate-800">{selectedOrder.customerSnapshot.companyName}</span>
            </p>

            <form onSubmit={handleSaveOrderUpdate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Fulfillment Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-semibold"
                  >
                    <option value="order_confirmed">Order Confirmed</option>
                    <option value="payment_received">Payment Received</option>
                    <option value="processing">Processing & Bundling</option>
                    <option value="dispatched">Dispatched (Loaded on Truck)</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered to Site</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Payment Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-semibold"
                  >
                    <option value="pending">Pending Payment</option>
                    <option value="partial">Partially Paid</option>
                    <option value="paid">Paid in Full (Verified RTGS)</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Logistics / Freight Carrier</label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="e.g. V-Trans Express, TCI Freight, Dedicated Trailer"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Tracking / Docket Number (LR#)</label>
                  <input
                    type="text"
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                    placeholder="e.g. VTR-MH-892147"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Estimated Delivery Date</label>
                  <input
                    type="date"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Dispatch / Activity Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Loaded on 10-wheel truck MH-04-GP-9142. Electronic weigh slip attached."
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded shadow"
                >
                  Save Order Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
