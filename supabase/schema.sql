-- BillFlow Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ── Organizations ──
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_url text,
  phone text,
  email text,
  address text,
  invoice_prefix text not null default 'INV-',
  invoice_start_number integer not null default 1,
  bank_name text,
  bank_account text,
  bank_holder text,
  qris_url text,
  payment_instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Organization members ──
create table organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  unique(organization_id, user_id)
);

create index idx_org_members_user on organization_members(user_id);
create index idx_org_members_org on organization_members(organization_id);

-- ── Customers ──
create table customers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  whatsapp text,
  email text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_customers_org on customers(organization_id);

-- ── Invoices ──
create table invoices (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete restrict,
  invoice_number text not null,
  status text not null default 'draft' check (status in ('draft','sent','pending','paid','overdue','cancelled')),
  issue_date date not null default current_date,
  due_date date not null,
  subtotal bigint not null default 0,
  discount bigint not null default 0,
  tax_rate numeric(5,2) not null default 0,
  tax_amount bigint not null default 0,
  total bigint not null default 0,
  notes text,
  currency text not null default 'IDR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index idx_invoices_number on invoices(organization_id, invoice_number);
create index idx_invoices_org on invoices(organization_id);
create index idx_invoices_customer on invoices(customer_id);
create index idx_invoices_status on invoices(organization_id, status);
create index idx_invoices_due on invoices(organization_id, due_date);

-- ── Invoice items ──
create table invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10,2) not null default 1,
  unit_price bigint not null default 0,
  discount bigint not null default 0,
  amount bigint not null default 0,
  sort_order integer not null default 0
);

create index idx_invoice_items_invoice on invoice_items(invoice_id);

-- ── Payments ──
create table payments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  invoice_id uuid not null references invoices(id) on delete cascade,
  amount bigint not null,
  payment_date date not null default current_date,
  payment_method text not null default 'bank_transfer' check (payment_method in ('bank_transfer','cash','qris','e_wallet','other')),
  notes text,
  created_at timestamptz not null default now()
);

create index idx_payments_org on payments(organization_id);
create index idx_payments_invoice on payments(invoice_id);

-- ── Reminders ──
create table reminders (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  reminder_type text not null check (reminder_type in ('before_3_days','before_1_day','on_due_date','after_1_day','after_3_days','after_7_days')),
  scheduled_at timestamptz not null,
  sent_at timestamptz,
  message text,
  created_at timestamptz not null default now()
);

create index idx_reminders_invoice on reminders(invoice_id);
create index idx_reminders_scheduled on reminders(scheduled_at) where sent_at is null;

-- ── Message templates ──
create table message_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  type text not null check (type in ('invoice','reminder','overdue')),
  name text not null,
  template text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_message_templates_org on message_templates(organization_id);

-- ── Invoice events (audit log) ──
create table invoice_events (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  event_type text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index idx_invoice_events_invoice on invoice_events(invoice_id);

-- ── Row Level Security ──

alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table customers enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;
alter table payments enable row level security;
alter table reminders enable row level security;
alter table message_templates enable row level security;
alter table invoice_events enable row level security;

-- Policy: users can only access their own organization's data
create policy "Users can view own orgs"
  on organizations for select
  using (id in (select organization_id from organization_members where user_id = auth.uid()));

create policy "Users can update own orgs"
  on organizations for update
  using (id in (select organization_id from organization_members where user_id = auth.uid()));

create policy "Users can insert orgs"
  on organizations for insert
  with check (true);

create policy "Members can view own membership"
  on organization_members for select
  using (user_id = auth.uid());

create policy "Members can insert membership"
  on organization_members for insert
  with check (user_id = auth.uid());

-- Tenant-scoped policies for business tables
create policy "Tenant isolation" on customers for all
  using (organization_id in (select organization_id from organization_members where user_id = auth.uid()));

create policy "Tenant isolation" on invoices for all
  using (organization_id in (select organization_id from organization_members where user_id = auth.uid()));

create policy "Tenant isolation" on invoice_items for all
  using (invoice_id in (select id from invoices where organization_id in (select organization_id from organization_members where user_id = auth.uid())));

create policy "Tenant isolation" on payments for all
  using (organization_id in (select organization_id from organization_members where user_id = auth.uid()));

create policy "Tenant isolation" on reminders for all
  using (invoice_id in (select id from invoices where organization_id in (select organization_id from organization_members where user_id = auth.uid())));

create policy "Tenant isolation" on message_templates for all
  using (organization_id in (select organization_id from organization_members where user_id = auth.uid()));

create policy "Tenant isolation" on invoice_events for all
  using (invoice_id in (select id from invoices where organization_id in (select organization_id from organization_members where user_id = auth.uid())));

-- ── Updated_at trigger ──
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on organizations for each row execute function update_updated_at();
create trigger set_updated_at before update on customers for each row execute function update_updated_at();
create trigger set_updated_at before update on invoices for each row execute function update_updated_at();
create trigger set_updated_at before update on message_templates for each row execute function update_updated_at();
