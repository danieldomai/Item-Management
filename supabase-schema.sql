-- =============================================================
-- Household Inventory Manager — Supabase Schema
-- =============================================================
-- Run this SQL in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New Query → paste & Run)

-- 1. Create the inventory table
create table if not exists inventory (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  category          text not null check (category in ('Pantry', 'Supplies')),
  current_quantity  float not null default 0,
  unit              text not null default 'whole',
  low_stock_threshold float not null default 1,
  created_at        timestamptz not null default now()
);

-- 2. Enable Row Level Security (required by Supabase)
alter table inventory enable row level security;

-- 3. Allow anonymous / authenticated reads and writes
--    (For a personal household app with the anon key, this is fine.
--     Tighten these policies if you add authentication later.)
create policy "Allow full access" on inventory
  for all
  using (true)
  with check (true);
