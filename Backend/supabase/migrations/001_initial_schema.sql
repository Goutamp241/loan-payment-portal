# Supabase schema for Loan Repayment Portal
# Run in Supabase Dashboard → SQL Editor → New query → Paste → Run

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Customers (identity verified via mobile + card last 4)
-- ---------------------------------------------------------------------------
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_id text not null unique,
  full_name text not null,
  mobile text not null unique,
  card_last4 text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint card_last4_format check (card_last4 ~ '^\d{4}$'),
  constraint mobile_format check (mobile ~ '^[6-9]\d{9}$')
);

-- ---------------------------------------------------------------------------
-- Loan / credit card outstanding balances
-- ---------------------------------------------------------------------------
create table if not exists public.loan_accounts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  total_due numeric(12, 2) not null default 0,
  minimum_due numeric(12, 2) not null default 0,
  due_date date not null,
  processing_fee numeric(12, 2) not null default 0,
  convenience_fee numeric(12, 2) not null default 0,
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'none')),
  last_updated timestamptz not null default now(),
  unique (customer_id)
);

-- ---------------------------------------------------------------------------
-- Payment sessions (created after verification)
-- ---------------------------------------------------------------------------
create table if not exists public.payment_sessions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  reference_number text not null unique,
  status text not null default 'active'
    check (status in ('active', 'completed', 'expired', 'failed')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Payment transactions (1Pay gateway — populated in Step 6)
-- ---------------------------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.payment_sessions(id) on delete set null,
  customer_id uuid not null references public.customers(id) on delete cascade,
  amount numeric(12, 2) not null,
  payment_option text not null,
  external_txn_id text,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'success', 'failed')),
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_customers_mobile on public.customers(mobile);
create index if not exists idx_loan_accounts_customer on public.loan_accounts(customer_id);
create index if not exists idx_payment_sessions_customer on public.payment_sessions(customer_id);
create index if not exists idx_transactions_customer on public.transactions(customer_id);

-- ---------------------------------------------------------------------------
-- Updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists customers_updated_at on public.customers;
create trigger customers_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

drop trigger if exists transactions_updated_at on public.transactions;
create trigger transactions_updated_at
  before update on public.transactions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security (backend uses service role; RLS blocks direct client access)
-- ---------------------------------------------------------------------------
alter table public.customers enable row level security;
alter table public.loan_accounts enable row level security;
alter table public.payment_sessions enable row level security;
alter table public.transactions enable row level security;

-- No public policies — all access via Express API with service role key
