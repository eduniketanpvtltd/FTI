import { jsPDF } from 'jspdf';
import { Invoice, Quotation } from '@/types';
import { formatINR, formatIndianDate } from './utils';

/**
 * Generate official Indian GST Tax Invoice PDF
 */
export function generateInvoicePDF(invoice: Invoice) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 14;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900 industrial charcoal
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('FTI INDUSTRIAL TRADING CORP.', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Direct Mill Sourced Raw Materials & Certified Scrap | ISO 9001:2015 Certified', 14, 18);
  doc.text(`GSTIN: ${invoice.companyDetails.gstin} | PAN: ${invoice.companyDetails.pan}`, 14, 23);

  // Right Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('TAX INVOICE', pageWidth - 14, 14, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice No: ${invoice.invoiceNumber}`, pageWidth - 14, 20, { align: 'right' });
  doc.text(`Date: ${formatIndianDate(invoice.invoiceDate)}`, pageWidth - 14, 25, { align: 'right' });

  y = 35;
  doc.setTextColor(15, 23, 42);

  // Invoice & Order Reference Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 16, 1.5, 1.5, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Purchase Order No:', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.orderNumber, 52, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Quotation Ref:', 18, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.quotationNumber, 52, y + 11);

  doc.setFont('helvetica', 'bold');
  doc.text('Payment Due Date:', pageWidth / 2 + 10, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(formatIndianDate(invoice.dueDate), pageWidth / 2 + 45, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Place of Supply:', pageWidth / 2 + 10, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.text('Maharashtra (State Code: 27)', pageWidth / 2 + 45, y + 11);

  y += 22;

  // Billing and Shipping Columns
  const colWidth = (pageWidth - 32) / 2;

  // Billed To Box
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, colWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BILLED TO (BUYER):', 18, y + 4.5);

  doc.setDrawColor(226, 232, 240);
  doc.rect(14, y + 6, colWidth, 24);
  doc.setFontSize(8.5);
  doc.text(invoice.customerDetails.companyName, 18, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Attn: ${invoice.customerDetails.name} (${invoice.customerDetails.phone})`, 18, y + 15);
  doc.text(`GSTIN: ${invoice.customerDetails.gstin || 'Unregistered / Commercial'}`, 18, y + 19);
  const billLines = doc.splitTextToSize(invoice.billingAddress, colWidth - 8);
  doc.text(billLines, 18, y + 23);

  // Shipped To Box
  doc.setFillColor(241, 245, 249);
  doc.rect(18 + colWidth, y, colWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DISPATCH / SHIPPED TO:', 22 + colWidth, y + 4.5);

  doc.rect(18 + colWidth, y + 6, colWidth, 24);
  doc.setFontSize(8.5);
  doc.text(invoice.customerDetails.companyName, 22 + colWidth, y + 11);
  doc.setFont('helvetica', 'normal');
  const shipLines = doc.splitTextToSize(invoice.shippingAddress, colWidth - 8);
  doc.text(shipLines, 22 + colWidth, y + 16);

  y += 36;

  // Items Table Header
  doc.setFillColor(30, 41, 59);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);

  doc.text('#', 17, y + 5);
  doc.text('Item Description & Specification', 24, y + 5);
  doc.text('HSN', 96, y + 5);
  doc.text('Qty / Unit', 114, y + 5);
  doc.text('Rate (₹)', 140, y + 5, { align: 'right' });
  doc.text('Tax', 156, y + 5, { align: 'right' });
  doc.text('Amount (₹)', pageWidth - 18, y + 5, { align: 'right' });

  y += 7;
  doc.setTextColor(15, 23, 42);

  // Items Table Rows
  invoice.items.forEach((item, index) => {
    const rowHeight = 11;
    doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 252);
    doc.rect(14, y, pageWidth - 28, rowHeight, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y + rowHeight, pageWidth - 14, y + rowHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(String(index + 1), 17, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.text(item.description, 24, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(item.specifications, 24, y + 8.5);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8);

    doc.text(item.hsnCode, 96, y + 6);
    doc.text(`${item.quantity} ${item.unit}`, 114, y + 6);
    doc.text(item.unitPrice.toLocaleString('en-IN'), 140, y + 6, { align: 'right' });
    doc.text(`${item.taxRate}%`, 156, y + 6, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(item.lineTotal.toLocaleString('en-IN'), pageWidth - 18, y + 6, { align: 'right' });

    y += rowHeight;
  });

  y += 4;

  // Calculation Breakdown
  const sumStartX = pageWidth - 80;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  doc.text('Subtotal:', sumStartX, y);
  doc.text(`₹ ${invoice.subtotal.toLocaleString('en-IN')}`, pageWidth - 18, y, { align: 'right' });
  y += 4.5;

  if (invoice.discountAmount > 0) {
    doc.text('Discount Applied:', sumStartX, y);
    doc.text(`- ₹ ${invoice.discountAmount.toLocaleString('en-IN')}`, pageWidth - 18, y, { align: 'right' });
    y += 4.5;
  }

  if (invoice.cgstAmount > 0 && invoice.sgstAmount > 0) {
    doc.text('CGST @ 9%:', sumStartX, y);
    doc.text(`₹ ${invoice.cgstAmount.toLocaleString('en-IN')}`, pageWidth - 18, y, { align: 'right' });
    y += 4.5;

    doc.text('SGST @ 9%:', sumStartX, y);
    doc.text(`₹ ${invoice.sgstAmount.toLocaleString('en-IN')}`, pageWidth - 18, y, { align: 'right' });
    y += 4.5;
  } else if (invoice.igstAmount > 0) {
    doc.text('IGST @ 18%:', sumStartX, y);
    doc.text(`₹ ${invoice.igstAmount.toLocaleString('en-IN')}`, pageWidth - 18, y, { align: 'right' });
    y += 4.5;
  }

  if (invoice.transportationCharges > 0) {
    doc.text('Transportation / Freight:', sumStartX, y);
    doc.text(`₹ ${invoice.transportationCharges.toLocaleString('en-IN')}`, pageWidth - 18, y, { align: 'right' });
    y += 4.5;
  }

  // Grand Total Line
  doc.setFillColor(15, 23, 42);
  doc.rect(sumStartX - 4, y, pageWidth - sumStartX - 10, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Grand Total:', sumStartX, y + 5.5);
  doc.text(`₹ ${invoice.grandTotal.toLocaleString('en-IN')}`, pageWidth - 18, y + 5.5, { align: 'right' });

  // Bank Account & Payment Details Box (Left side)
  doc.setTextColor(15, 23, 42);
  const bankBoxY = y - 22;
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, bankBoxY, 95, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('BANK TRANSFER & PAYMENT DETAILS:', 18, bankBoxY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`Bank Name: ${invoice.companyDetails.bankName}`, 18, bankBoxY + 10);
  doc.text(`Account No: ${invoice.companyDetails.accountNumber}`, 18, bankBoxY + 14);
  doc.text(`IFSC Code: ${invoice.companyDetails.ifscCode}`, 18, bankBoxY + 18);
  doc.text(`Branch: ${invoice.companyDetails.branch}`, 18, bankBoxY + 22);
  doc.text(`Terms: ${invoice.paymentTerms}`, 18, bankBoxY + 26);

  y += 14;

  // Amount in words
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Total Amount in Words:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.amountInWords, 52, y);

  y += 8;

  // Terms and Signature Box
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, pageWidth - 14, y);
  y += 5;

  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Declaration & Terms:', 14, y);
  doc.text('1. Goods once sold will not be taken back or exchanged.', 14, y + 4);
  doc.text('2. Interest @ 18% p.a. will be charged if payment is delayed beyond due date.', 14, y + 8);
  doc.text('3. Any dispute arising out of this transaction shall be subject to Navi Mumbai jurisdiction.', 14, y + 12);

  // Authorised Signatory Box
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('For FTI INDUSTRIAL TRADING CORP.', pageWidth - 18, y, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Authorised Signatory / Computer Generated Document', pageWidth - 18, y + 14, { align: 'right' });

  // Save the PDF
  doc.save(`${invoice.invoiceNumber}.pdf`);
}

/**
 * Generate official Quotation PDF
 */
export function generateQuotationPDF(quotation: Quotation) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 14;

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('FTI INDUSTRIAL TRADING CORP.', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Direct Mill Sourced Raw Materials & Certified Scrap | ISO 9001:2015', 14, 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL B2B QUOTATION', pageWidth - 14, 14, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Quotation No: ${quotation.quotationNumber}`, pageWidth - 14, 20, { align: 'right' });
  doc.text(`Date: ${formatIndianDate(quotation.createdAt)}`, pageWidth - 14, 25, { align: 'right' });

  y = 35;
  doc.setTextColor(15, 23, 42);

  // Client Details Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 20, 1.5, 1.5, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Quotation Prepared For:', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(`${quotation.customerSnapshot.companyName} (${quotation.customerSnapshot.fullName})`, 60, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Contact & Email:', 18, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.text(`${quotation.customerSnapshot.mobile} | ${quotation.customerSnapshot.email}`, 60, y + 11);

  doc.setFont('helvetica', 'bold');
  doc.text('Quotation Validity:', 18, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(quotation.validUntil ? formatIndianDate(quotation.validUntil) : 'Valid for 3 Days from Issue', 60, y + 16);

  y += 28;

  // Items Table Header
  doc.setFillColor(30, 41, 59);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);

  doc.text('#', 17, y + 5);
  doc.text('Material Category & Grade', 24, y + 5);
  doc.text('Specifications / Dimensions', 85, y + 5);
  doc.text('Quantity', 135, y + 5);
  doc.text('Unit Price', 160, y + 5, { align: 'right' });
  doc.text('Amount (₹)', pageWidth - 18, y + 5, { align: 'right' });

  y += 7;
  doc.setTextColor(15, 23, 42);

  // Items Rows
  quotation.items.forEach((item, index) => {
    const rowHeight = 11;
    doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 252);
    doc.rect(14, y, pageWidth - 28, rowHeight, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y + rowHeight, pageWidth - 14, y + rowHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(String(index + 1), 17, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.text(`${item.categoryName} (${item.grade})`, 24, y + 6);

    const specText = Object.entries(item.specifications)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(specText, 85, y + 6);

    doc.setFontSize(8);
    doc.text(`${item.quantity} ${item.unit}`, 135, y + 6);

    if (item.unitPrice) {
      doc.text(formatINR(item.unitPrice), 160, y + 6, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.text(formatINR(item.lineTotal || 0), pageWidth - 18, y + 6, { align: 'right' });
    } else {
      doc.setTextColor(100, 116, 139);
      doc.text('Under Review', pageWidth - 18, y + 6, { align: 'right' });
      doc.setTextColor(15, 23, 42);
    }

    y += rowHeight;
  });

  if (quotation.grandTotal) {
    y += 6;
    const sumStartX = pageWidth - 80;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');

    doc.text('Subtotal:', sumStartX, y);
    doc.text(formatINR(quotation.subtotal || 0), pageWidth - 18, y, { align: 'right' });
    y += 5;

    if (quotation.discountAmount) {
      doc.text('Discount:', sumStartX, y);
      doc.text(`- ${formatINR(quotation.discountAmount)}`, pageWidth - 18, y, { align: 'right' });
      y += 5;
    }

    doc.text(`GST @ ${quotation.taxRate}%:`, sumStartX, y);
    doc.text(formatINR(quotation.taxAmount || 0), pageWidth - 18, y, { align: 'right' });
    y += 5;

    if (quotation.transportationCharges) {
      doc.text('Transportation:', sumStartX, y);
      doc.text(formatINR(quotation.transportationCharges), pageWidth - 18, y, { align: 'right' });
      y += 5;
    }

    doc.setFillColor(15, 23, 42);
    doc.rect(sumStartX - 4, y, pageWidth - sumStartX - 10, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Quotation Total:', sumStartX, y + 5.5);
    doc.text(formatINR(quotation.grandTotal), pageWidth - 18, y + 5.5, { align: 'right' });
  }

  doc.save(`${quotation.quotationNumber}.pdf`);
}
