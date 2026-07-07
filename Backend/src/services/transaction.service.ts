/**
 * Payment transaction CRUD via Supabase (simulated 1Pay sandbox).
 */

import { getSupabase } from './supabase.js';
import type { Transaction } from '../types/database.js';
import { generateTransactionId, formatTransactionTime } from '../utils/format.js';

export async function countSessionTransactions(sessionId: string): Promise<number> {
  const supabase = getSupabase();
  const { count, error } = await supabase
    .from('transactions')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', sessionId);

  if (error) throw error;
  return count ?? 0;
}

export async function createTransaction(params: {
  sessionId: string;
  customerId: string;
  amount: number;
  paymentOption: string;
}): Promise<Transaction> {
  const supabase = getSupabase();
  const externalTxnId = generateTransactionId();

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      session_id: params.sessionId,
      customer_id: params.customerId,
      amount: params.amount,
      payment_option: params.paymentOption,
      external_txn_id: externalTxnId,
      status: 'pending',
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as Transaction;
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Transaction | null;
}

export async function getTransactionForCustomer(
  transactionId: string,
  customerId: string,
): Promise<Transaction | null> {
  const txn = await getTransactionById(transactionId);
  if (!txn || txn.customer_id !== customerId) return null;
  return txn;
}

export async function listTransactionsForCustomer(customerId: string): Promise<Transaction[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Transaction[];
}

export async function markTransactionProcessing(transactionId: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('transactions')
    .update({ status: 'processing' })
    .eq('id', transactionId)
    .eq('status', 'pending');

  if (error) throw error;
}

export async function completeTransaction(params: {
  transactionId: string;
  status: 'success' | 'failed';
  failureReason?: string;
}): Promise<Transaction> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('transactions')
    .update({
      status: params.status,
      failure_reason: params.failureReason ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.transactionId)
    .in('status', ['pending', 'processing'])
    .select('*')
    .single();

  if (error) throw error;
  return data as Transaction;
}

export async function markSessionCompleted(sessionId: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('payment_sessions')
    .update({ status: 'completed' })
    .eq('id', sessionId);

  if (error) throw error;
}

export async function markSessionFailed(sessionId: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('payment_sessions')
    .update({ status: 'failed' })
    .eq('id', sessionId);

  if (error) throw error;
}

/** ~11% of outstanding (matches seed ratio 2000/18250), floor ₹500, capped at total. */
export function recalculateMinimumDue(totalDue: number): number {
  if (totalDue <= 0) return 0;
  return Math.min(totalDue, Math.max(500, Math.round(totalDue * 0.11)));
}

export async function applySuccessfulPayment(customerId: string, amount: number): Promise<void> {
  const supabase = getSupabase();
  const { data: loan, error: fetchError } = await supabase
    .from('loan_accounts')
    .select('total_due, minimum_due')
    .eq('customer_id', customerId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!loan) return;

  const newTotal = Math.max(0, Number(loan.total_due) - amount);
  const newMinimum = recalculateMinimumDue(newTotal);

  const { error: updateError } = await supabase
    .from('loan_accounts')
    .update({
      total_due: newTotal,
      minimum_due: newMinimum,
      payment_status: newTotal === 0 ? 'paid' : 'pending',
      last_updated: new Date().toISOString(),
    })
    .eq('customer_id', customerId);

  if (updateError) throw updateError;
}

export function toTransactionDto(txn: Transaction, extras?: { paymentMethod?: string }) {
  return {
    id: txn.id,
    transactionId: txn.external_txn_id ?? txn.id,
    transactionTime: formatTransactionTime(new Date(txn.updated_at)),
    status: txn.status === 'success' ? 'success' as const : txn.status === 'failed' ? 'failed' as const : 'pending' as const,
    failureReason: txn.failure_reason ?? undefined,
    amount: Number(txn.amount),
    paymentMethod: extras?.paymentMethod,
  };
}

export function toHistoryItemDto(txn: Transaction) {
  return {
    id: txn.id,
    transactionId: txn.external_txn_id ?? txn.id,
    amount: Number(txn.amount),
    status: txn.status,
    paymentOption: txn.payment_option,
    transactionTime: formatTransactionTime(new Date(txn.updated_at)),
    failureReason: txn.failure_reason ?? undefined,
  };
}
