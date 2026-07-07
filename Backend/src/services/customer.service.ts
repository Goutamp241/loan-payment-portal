/**
 * Customer lookup and session creation via Supabase.
 */

import { getSupabase } from './supabase.js';
import type { Customer, LoanAccount, PaymentSession } from '../types/database.js';
import { generateReferenceNumber } from '../utils/format.js';

const SESSION_TTL_HOURS = 1;

export async function findCustomerByCredentials(
  mobile: string,
  cardLast4: string,
): Promise<Customer | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('mobile', mobile)
    .eq('card_last4', cardLast4)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data as Customer | null;
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Customer | null;
}

export async function getLoanAccountByCustomerId(customerId: string): Promise<LoanAccount | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('loan_accounts')
    .select('*')
    .eq('customer_id', customerId)
    .maybeSingle();

  if (error) throw error;
  return data as LoanAccount | null;
}

export async function createPaymentSession(customerId: string): Promise<PaymentSession> {
  const supabase = getSupabase();
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('payment_sessions')
    .insert({
      customer_id: customerId,
      reference_number: generateReferenceNumber(),
      status: 'active',
      expires_at: expiresAt.toISOString(),
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as PaymentSession;
}

export async function getPaymentSession(sessionId: string): Promise<PaymentSession | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('payment_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();

  if (error) throw error;
  return data as PaymentSession | null;
}
