/**
 * Resets the primary demo customer's loan balances to seed values.
 * Run: npm run db:reset-demo
 */
import 'dotenv/config';
import { getSupabase } from '../src/services/supabase.js';

const DEMO_MOBILE = '9876543210';

async function main() {
  const sb = getSupabase();

  const { data: customer, error: custErr } = await sb
    .from('customers')
    .select('id, full_name, mobile')
    .eq('mobile', DEMO_MOBILE)
    .maybeSingle();

  if (custErr) throw custErr;
  if (!customer) {
    console.log(`No customer with mobile ${DEMO_MOBILE}. Run supabase/seed.sql first.`);
    return;
  }

  const { error: updateErr } = await sb
    .from('loan_accounts')
    .update({
      total_due: 18250,
      minimum_due: 2000,
      due_date: '2026-07-10',
      processing_fee: 0,
      convenience_fee: 0,
      payment_status: 'pending',
      last_updated: new Date().toISOString(),
    })
    .eq('customer_id', customer.id);

  if (updateErr) throw updateErr;

  console.log(`Reset loan for ${customer.full_name} (${customer.mobile}): total ₹18,250, minimum ₹2,000`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
