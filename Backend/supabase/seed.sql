-- Primary seed — run seed-demo-customers.sql for full demo roster
-- Or: npm run db:seed-demo

-- Goutam Patel (original test account)
-- Login: mobile 9876543210 + card 4821

insert into public.customers (customer_id, full_name, mobile, card_last4)
values ('CUST-20451983', 'Goutam Patel', '9876543210', '4821')
on conflict (mobile) do nothing;

insert into public.loan_accounts (
  customer_id, total_due, minimum_due, due_date,
  processing_fee, convenience_fee, payment_status, last_updated
)
select c.id, 18250.00, 2000.00, '2026-07-10', 0, 0, 'pending', now()
from public.customers c
where c.mobile = '9876543210'
on conflict (customer_id) do update set
  total_due = excluded.total_due,
  minimum_due = excluded.minimum_due,
  due_date = excluded.due_date,
  payment_status = excluded.payment_status,
  last_updated = now();

-- Additional demo customers: see seed-demo-customers.sql
