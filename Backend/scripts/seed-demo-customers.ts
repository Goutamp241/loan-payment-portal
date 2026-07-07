/**
 * Seeds demo customers + loan accounts into Supabase.
 * Run: npm run db:seed-demo
 */
import 'dotenv/config';
import { getSupabase } from '../src/services/supabase.js';

const DEMO_CUSTOMERS = [
  { customerId: 'CUST-20451983', fullName: 'Goutam Patel', mobile: '9876543210', cardLast4: '4821', totalDue: 18250, minimumDue: 2000, dueDate: '2026-07-10', paymentStatus: 'pending' as const },
  { customerId: 'CUST-7296851901', fullName: 'Goutam Kumar', mobile: '7296851901', cardLast4: '1526', totalDue: 24500, minimumDue: 2700, dueDate: '2026-07-12', paymentStatus: 'pending' as const },
  { customerId: 'CUST-7296851902', fullName: 'Sweety Patel', mobile: '7296851902', cardLast4: '1527', totalDue: 12300, minimumDue: 1350, dueDate: '2026-07-15', paymentStatus: 'pending' as const },
  { customerId: 'CUST-9660683388', fullName: 'Ramesh Patel', mobile: '9660683388', cardLast4: '1568', totalDue: 32100, minimumDue: 3500, dueDate: '2026-07-18', paymentStatus: 'pending' as const },
  { customerId: 'CUST-9666833890', fullName: 'Sita Devi', mobile: '9666833890', cardLast4: '1569', totalDue: 8900, minimumDue: 980, dueDate: '2026-07-20', paymentStatus: 'pending' as const },
  { customerId: 'CUST-9660683381', fullName: 'Rajesh Ghanchi', mobile: '9660683381', cardLast4: '1567', totalDue: 0, minimumDue: 0, dueDate: '2026-08-10', paymentStatus: 'none' as const },
] as const;

async function main() {
  const sb = getSupabase();

  for (const row of DEMO_CUSTOMERS) {
    const { data: customer, error: custErr } = await sb
      .from('customers')
      .upsert(
        {
          customer_id: row.customerId,
          full_name: row.fullName,
          mobile: row.mobile,
          card_last4: row.cardLast4,
          is_active: true,
        },
        { onConflict: 'mobile' },
      )
      .select('id, full_name, mobile')
      .single();

    if (custErr) throw custErr;

    const { error: loanErr } = await sb.from('loan_accounts').upsert(
      {
        customer_id: customer.id,
        total_due: row.totalDue,
        minimum_due: row.minimumDue,
        due_date: row.dueDate,
        processing_fee: 0,
        convenience_fee: 0,
        payment_status: row.paymentStatus,
        last_updated: new Date().toISOString(),
      },
      { onConflict: 'customer_id' },
    );

    if (loanErr) throw loanErr;
    const dueLabel = row.totalDue === 0 ? 'no payment due' : `due Rs ${row.totalDue.toLocaleString('en-IN')}`;
    console.log(`OK ${row.fullName} — ${row.mobile} / card ${row.cardLast4} — ${dueLabel}`);
  }

  console.log('\nDone. Demo logins ready.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
