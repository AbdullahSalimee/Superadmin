-- Run this once in Supabase SQL editor. Adds a hashing counterpart to
-- the existing verify_role_password RPC, so the superadmin console can
-- create academies and reset admin/teacher passwords using the exact
-- same pgcrypto hashing your AMS login already verifies against.
-- Safe to re-run (CREATE OR REPLACE).

create or replace function hash_role_password(plain_password text)
returns text
language sql
security definer
set search_path = public, extensions
as $$
  select crypt(plain_password, gen_salt('bf'));
$$;
