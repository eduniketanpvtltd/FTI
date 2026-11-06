'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate } from '@/lib/utils';
import { generateInvoicePDF } from '@/lib/pdf-generator';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import {
  Search,
  Receipt,
  Edit,
  CheckCircle2,
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
    setTrackingNo(
      order.trackingNumber || `VTR-MH-${Math.floor(100000 + Math.random() * 900000)}`
    );
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Purchase Orders & <span className="text-[#E8732A]">Dispatch Fulfillment</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Manage material weighment, loading, truck dispatch details, and customer invoicing.
          </p>
        </div>
      </div>

      {successFeedback && (
        <div className="p-3.5 bg-[#122D21] border border-[#22C55E]/40 text-[#4ADE80] text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#22C55E]" />
          <span className="font-bold">{successFeedback}</span>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Order ID, Client, Quotation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#191F28] border border-[#2A3342] rounded-xl text-white placeholder-[#64748B]"
          />
        </div>

        <div className="flex items-center space-x-1.5 text-xs overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {['all', 'order_confirmed', 'processing', 'dispatched', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/40'
                  : 'bg-[#191F28] text-[#CBD5E1] hover:bg-[#222936] border border-[#2A3342]'
              }`}
            >
              {st === 'all' ? 'All Orders' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Container */}
      <div className="space-y-3">
        {/* Mobile Orders Cards (< md screens) */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-8 text-center text-xs text-[#94A3B8]">
              No orders found matching filter.
            </div>
          ) : (
            filtered.map((order) => {
              const invoice = invoices.find((inv) => inv.orderId === order.id);
              return (
                <div
                  key={order.id}
                  className="bg-[#14181F] border border-[#28303E] rounded-2xl p-4 space-y-3 text-xs shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-extrabold text-white text-sm block">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">
                        {formatIndianDate(order.createdAt)} • Ref: {order.quotationNumber}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="bg-[#251811] text-[#E8732A] border border-[#E06924]/40 text-[10px] font-bold px-2 py-0.5 rounded-md capitalize">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                          order.paymentStatus === 'paid'
                            ? 'bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40'
                            : 'bg-[#332114] text-[#E58A3C] border border-[#C86D28]/50'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#191F28] rounded-xl p-3 border border-[#2A3342]">
                    <p className="font-bold text-white">{order.customerSnapshot.companyName}</p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      {order.customerSnapshot.fullName} ({order.shippingAddress.city})
                    </p>
                    {order.trackingNumber ? (
                      <div className="mt-2 pt-2 border-t border-[#28303E] flex items-center justify-between text-[11px]">
                        <span className="text-[#94A3B8] truncate mr-2">
                          {order.trackingCarrier}
                        </span>
                        <span className="font-mono font-bold text-[#E8732A] shrink-0">
                          LR: {order.trackingNumber}
                        </span>
                      </div>
                    ) : (
                      <p className="text-[10px] text-[#E58A3C] mt-1 italic">
                        Pending Dispatch Details
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[#94A3B8] text-[10px] block">Grand Total:</span>
                      <span className="font-mono font-extrabold text-[#E8732A] text-base">
                        {formatINR(order.grandTotal)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {invoice && (
                        <button
                          onClick={() => generateInvoicePDF(invoice)}
                          className="p-2 rounded-xl bg-[#191F28] hover:bg-[#222936] text-white border border-[#2A3342] touch-manipulation cursor-pointer"
                          title="Download Tax Invoice PDF"
                        >
                          <Receipt className="w-4 h-4 text-[#E8732A]" />
                        </button>
                      )}

                      <button
                        onClick={() => openOrderModal(order)}
                        className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white px-3.5 py-2 rounded-xl border border-[#F59352]/40 text-xs font-bold inline-flex items-center space-x-1.5 touch-manipulation shadow-sm cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Dispatch / Status</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop / Tablet Table (md and up) */}
        <div className="hidden md:block bg-[#14181F] border border-[#28303E] rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#191F28] text-[#CBD5E1] font-bold uppercase text-[10px] border-b border-[#28303E]">
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Client Company</th>
                  <th className="py-3.5 px-4">Fulfillment Status</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Carrier & Tracking</th>
                  <th className="py-3.5 px-4 text-right">Grand Total (₹)</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222934]">
                {filtered.map((order) => {
                  const invoice = invoices.find((inv) => inv.orderId === order.id);
                  return (
                    <tr key={order.id} className="hover:bg-[#191F28]/60 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-extrabold text-white block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-[#94A3B8]">
                          {formatIndianDate(order.createdAt)} • Ref: {order.quotationNumber}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white">
                          {order.customerSnapshot.companyName}
                        </p>
                        <p className="text-[10px] text-[#94A3B8]">
                          {order.customerSnapshot.fullName} ({order.shippingAddress.city})
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="bg-[#251811] text-[#E8732A] border border-[#E06924]/40 text-[10px] font-bold px-2.5 py-0.5 rounded-md capitalize">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md capitalize ${
                            order.paymentStatus === 'paid'
                              ? 'bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40'
                              : 'bg-[#332114] text-[#E58A3C] border border-[#C86D28]/50'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[11px]">
                        {order.trackingNumber ? (
                          <div>
                            <span className="font-mono font-bold text-[#E8732A] block">
                              {order.trackingNumber}
                            </span>
                            <span className="text-[10px] text-[#94A3B8]">
                              {order.trackingCarrier}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#64748B] italic">Pending Dispatch</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-white text-sm">
                        {formatINR(order.grandTotal)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {invoice && (
                            <button
                              onClick={() => generateInvoicePDF(invoice)}
                              className="p-2 rounded-xl bg-[#191F28] hover:bg-[#222936] border border-[#2A3342] text-white touch-manipulation cursor-pointer"
                              title="Download Tax Invoice PDF"
                            >
                              <Receipt className="w-3.5 h-3.5 text-[#E8732A]" />
                            </button>
                          )}

                          <button
                            onClick={() => openOrderModal(order)}
                            className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white px-3 py-1.5 rounded-xl border border-[#F59352]/40 text-xs font-bold inline-flex items-center space-x-1 touch-manipulation cursor-pointer"
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
      </div>

      {/* Order Dispatch & Status Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#0B0E11]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#14181F] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#28303E] max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-base text-white mb-1">
              Update Order #{selectedOrder.orderNumber}
            </h3>
            <p className="text-xs text-[#94A3B8] mb-4">
              Client:{' '}
              <span className="font-bold text-[#E8732A]">
                {selectedOrder.customerSnapshot.companyName}
              </span>
            </p>

            <form onSubmit={handleSaveOrderUpdate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-white mb-1">Fulfillment Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-semibold"
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
                  <label className="block font-bold text-white mb-1">Payment Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-semibold"
                  >
                    <option value="pending">Pending Payment</option>
                    <option value="partial">Partially Paid</option>
                    <option value="paid">Paid in Full (Verified RTGS)</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-white mb-1">
                  Logistics / Freight Carrier
                </label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="e.g. V-Trans Express, TCI Freight, Dedicated Trailer"
                  className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-white mb-1">
                    Tracking / Docket Number (LR#)
                  </label>
                  <input
                    type="text"
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                    placeholder="e.g. VTR-MH-892147"
                    className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-[#E8732A] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">
                    Estimated Delivery Date
                  </label>
                  <input
                    type="date"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-white mb-1">
                  Dispatch / Activity Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Loaded on 10-wheel truck MH-04-GP-9142. Electronic weigh slip attached."
                  className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white placeholder-[#64748B]"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-full sm:w-auto bg-[#191F28] hover:bg-[#222936] text-[#CBD5E1] border border-[#2A3342] font-bold px-4 py-2.5 rounded-xl text-center touch-manipulation cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white font-extrabold px-5 py-2.5 rounded-xl border border-[#F59352]/50 shadow-md text-center touch-manipulation cursor-pointer"
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
