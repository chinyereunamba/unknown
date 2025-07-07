-- Users table for Supabase
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique not null,
  image text,
  created_at timestamp with time zone default now()
);

create index if not exists idx_users_email on users(email); 