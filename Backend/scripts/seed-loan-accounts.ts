/**
 * Ensures every customer has a loan_accounts row (run once after Supabase setup).
 */
import 'dotenv/config';
import { getSupabase } from '../src/services/supabase.js';

async function main() {
  const sb = getSupabase();

  const { data: customers, error } = await sb.from('customers').select('id, mobile, full_name');
  if (error) throw error;

  if (!customers?.length) {
    console.log('No customers found. Run supabase/seed.sql first.');
    return;
  }

  for (const customer of customers) {
    const { data: existing } = await sb
      .from('loan_accounts')
      .select('id')
      .eq('customer_id', customer.id)
      .maybeSingle();

    if (existing) {
      console.log(`Loan account already exists for ${customer.full_name} (${customer.mobile})`);
      continue;
    }

    const { error: insertError } = await sb.from('loan_accounts').insert({
      customer_id: customer.id,
      total_due: 18250,
      minimum_due: 2000,
      due_date: '2026-07-10',
      processing_fee: 0,
      convenience_fee: 0,
      payment_status: 'pending',
    });

    if (insertError) throw insertError;
    console.log(`Created loan account for ${customer.full_name} (${customer.mobile})`);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
