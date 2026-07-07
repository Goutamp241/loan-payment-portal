-- Demo customers for BA assignment presentation
-- Run in Supabase SQL Editor after 001_initial_schema.sql
--
-- | Name          | Mobile       | Card last 4 |
-- |---------------|--------------|-------------|
-- | Goutam Patel  | 9876543210   | 4821        | (original)
-- | Goutam Kumar  | 7296851901   | 1526        |
-- | Sweety Patel  | 7296851902   | 1527        |
-- | Ramesh Patel  | 9660683388   | 1568        |
-- | Rajesh Ghanchi| 9660683381   | 1567        | (zero balance — No Payment Required)

insert into public.customers (customer_id, full_name, mobile, card_last4)
values
  ('CUST-20451983', 'Goutam Patel', '9876543210', '4821'),
  ('CUST-7296851901', 'Goutam Kumar', '7296851901', '1526'),
  ('CUST-7296851902', 'Sweety Patel', '7296851902', '1527'),
  ('CUST-9660683388', 'Ramesh Patel', '9660683388', '1568'),
  ('CUST-9666833890', 'Sita Devi', '9666833890', '1569'),
  ('CUST-9660683381', 'Rajesh Ghanchi', '9660683381', '1567')
on conflict (mobile) do update set
  full_name = excluded.full_name,
  card_last4 = excluded.card_last4,
  customer_id = excluded.customer_id;

-- Loan accounts (varied balances for demo)
insert into public.loan_accounts (
  customer_id, total_due, minimum_due, due_date,
  processing_fee, convenience_fee, payment_status, last_updated
)
select c.id, v.total_due, v.minimum_due, v.due_date, 0, 0, v.payment_status, now()
from public.customers c
join (values
  ('9876543210', 18250.00, 2000.00, '2026-07-10'::date, 'pending'),
  ('7296851901', 24500.00, 2700.00, '2026-07-12'::date, 'pending'),
  ('7296851902', 12300.00, 1350.00, '2026-07-15'::date, 'pending'),
  ('9660683388', 32100.00, 3500.00, '2026-07-18'::date, 'pending'),
  ('9666833890',  8900.00,  980.00, '2026-07-20'::date, 'pending'),
  ('9660683381',     0.00,    0.00, '2026-08-10'::date, 'none')
) as v(mobile, total_due, minimum_due, due_date, payment_status) on c.mobile = v.mobile
on conflict (customer_id) do update set
  total_due = excluded.total_due,
  minimum_due = excluded.minimum_due,
  due_date = excluded.due_date,
  payment_status = excluded.payment_status,
  last_updated = now();
