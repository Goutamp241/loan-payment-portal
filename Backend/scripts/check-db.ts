import 'dotenv/config';
import { getSupabase } from '../src/services/supabase.js';

async function main() {
  const sb = getSupabase();
  const { data: customers, error } = await sb
    .from('customers')
    .select('customer_id,mobile,card_last4,full_name');
  console.log('customers:', customers);
  if (error) console.error('error:', error.message);

  const { data: loans, error: loanErr } = await sb
    .from('loan_accounts')
    .select('total_due,minimum_due,customer_id');
  console.log('loans:', loans);
  if (loanErr) console.error('loan error:', loanErr.message);
}

main().catch(console.error);
