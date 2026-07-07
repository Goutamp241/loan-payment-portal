/**
 * Receipt generation — PDF download, print, email, and share.
 */

import { jsPDF } from 'jspdf';

export interface ReceiptData {
  type: 'success' | 'failure';
  customerName: string;
  customerId: string;
  referenceNumber: string;
  transactionId: string;
  amount: number;
  paymentMethod: string;
  dateTime: string;
  failureReason?: string;
  merchant?: string;
}

function buildReceiptText(data: ReceiptData): string {
  const lines = [
    'ABC BANK — OFFICIAL PAYMENT RECEIPT',
    '=====================================',
    `Status: ${data.type === 'success' ? 'SUCCESS' : 'FAILED'}`,
    `Customer: ${data.customerName}`,
    `Customer ID: ${data.customerId}`,
    `Reference: ${data.referenceNumber}`,
    `Transaction ID: ${data.transactionId}`,
    `Amount: ₹${data.amount.toLocaleString('en-IN')}`,
    `Payment Method: ${data.paymentMethod}`,
    `Date & Time: ${data.dateTime}`,
  ];
  if (data.failureReason) lines.push(`Failure Reason: ${data.failureReason}`);
  lines.push('', 'Digitally secured receipt · Powered by 1Pay');
  return lines.join('\n');
}

function buildReceiptHtml(data: ReceiptData): string {
  const title = data.type === 'success' ? 'Payment Successful' : 'Payment Failed';
  const statusColor = data.type === 'success' ? '#059669' : '#dc2626';

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><title>ABC Bank Receipt</title>
<style>
body{font-family:system-ui,sans-serif;max-width:520px;margin:40px auto;padding:24px;color:#0f172a}
.header{background:linear-gradient(135deg,#0F4C81,#2563EB);color:#fff;padding:20px;border-radius:12px 12px 0 0}
.body{border:2px dashed #d1fae5;border-top:none;padding:24px;border-radius:0 0 12px 12px}
.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:14px}
.label{color:#64748b;font-size:11px;text-transform:uppercase}
.status{color:${statusColor};font-weight:bold}
.footer{margin-top:20px;font-size:11px;color:#94a3b8;text-align:center}
</style></head><body>
<div class="header"><h1 style="margin:0;font-size:18px">ABC Bank</h1><p style="margin:4px 0 0;opacity:.85;font-size:12px">Official Payment Receipt</p></div>
<div class="body"><p class="status">${title.toUpperCase()}</p>
${[
  ['Customer', data.customerName],
  ['Customer ID', data.customerId],
  ['Reference', data.referenceNumber],
  ['Transaction ID', data.transactionId],
  ['Amount', `₹${data.amount.toLocaleString('en-IN')}`],
  ['Payment Method', data.paymentMethod],
  ['Date & Time', data.dateTime],
  ...(data.failureReason ? [['Failure Reason', data.failureReason] as const] : []),
  ['Merchant', data.merchant ?? 'ABC Bank Credit Cards'],
].map(([l, v]) => `<div class="row"><span class="label">${l}</span><strong>${v}</strong></div>`).join('')}
<div class="footer">Digitally secured receipt · Powered by 1Pay</div></div></body></html>`;
}

export function downloadReceipt(data: ReceiptData): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const status = data.type === 'success' ? 'SUCCESS' : 'FAILED';
  const margin = 20;
  let y = margin;

  doc.setFillColor(15, 76, 129);
  doc.rect(0, 0, 210, 36, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('ABC Bank', margin, 16);
  doc.setFontSize(10);
  doc.text('Official Payment Receipt', margin, 24);

  y = 48;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Payment ${status}`, margin, y);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const rows: [string, string][] = [
    ['Customer', data.customerName],
    ['Customer ID', data.customerId],
    ['Reference Number', data.referenceNumber],
    ['Transaction ID', data.transactionId],
    ['Amount', `INR ${data.amount.toLocaleString('en-IN')}`],
    ['Payment Method', data.paymentMethod],
    ['Date & Time', data.dateTime],
    ...(data.failureReason ? [['Failure Reason', data.failureReason] as [string, string]] : []),
    ['Merchant', data.merchant ?? 'ABC Bank Credit Cards'],
  ];

  for (const [label, value] of rows) {
    doc.setTextColor(100, 116, 139);
    doc.text(label, margin, y);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(value, margin + 52, y);
    doc.setFont('helvetica', 'normal');
    y += 8;
  }

  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Digitally secured receipt · Powered by 1Pay', margin, y);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, margin, y + 5);

  doc.save(`ABC-Bank-Receipt-${data.transactionId}.pdf`);
}

export function printReceipt(data: ReceiptData): void {
  const win = window.open('', '_blank', 'width=640,height=720');
  if (!win) {
    window.alert('Please allow pop-ups to print your receipt.');
    return;
  }
  win.document.write(buildReceiptHtml(data));
  win.document.close();
  win.focus();
  win.onload = () => {
    win.print();
    win.close();
  };
}

export function emailReceipt(data: ReceiptData): void {
  const subject = encodeURIComponent(`ABC Bank Payment Receipt — ${data.transactionId}`);
  const body = encodeURIComponent(buildReceiptText(data));
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

export async function shareReceipt(data: ReceiptData): Promise<void> {
  const text = buildReceiptText(data);
  if (navigator.share) {
    await navigator.share({
      title: `ABC Bank Receipt — ${data.transactionId}`,
      text,
    });
    return;
  }
  await navigator.clipboard.writeText(text);
  window.alert('Receipt details copied to clipboard.');
}

export function buildReceiptFromContext(params: {
  type: 'success' | 'failure';
  customerName?: string;
  customerId?: string;
  referenceNumber?: string;
  transactionId?: string;
  amount: number;
  paymentMethod?: string;
  sessionDate?: string;
  transactionTime?: string;
  failureReason?: string;
}): ReceiptData {
  const dateTime = [params.sessionDate, params.transactionTime].filter(Boolean).join(', ') || '—';
  return {
    type: params.type,
    customerName: params.customerName ?? 'Customer',
    customerId: params.customerId ?? '—',
    referenceNumber: params.referenceNumber ?? '—',
    transactionId: params.transactionId ?? '—',
    amount: params.amount,
    paymentMethod: params.paymentMethod ?? '—',
    dateTime,
    failureReason: params.failureReason,
  };
}
