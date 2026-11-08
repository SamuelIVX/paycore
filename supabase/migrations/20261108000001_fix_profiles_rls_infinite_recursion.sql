-- Fix: Break infinite recursion in RLS policies referencing public.profiles (Postgres error 42P17).
--
-- The policy "profiles_select_manager_or_own" created in 20260814230000_f010b_rls_lockdown.sql
-- queried public.profiles inside its own USING clause:
--   using (id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'MANAGER'))
-- This caused Postgres to recursively re-evaluate the RLS policy on each subquery evaluation,
-- failing with 42P17 (infinite recursion detected) and returning HTTP 500 on all authenticated logins.
--
-- Fix:
-- 1. Create a SECURITY DEFINER function public.is_manager() that bypasses RLS on public.profiles.
-- 2. Drop the recursive policy and split into:
--    a) "profiles_select_own": direct primary key equality id = (select auth.uid()) with zero subqueries.
--    b) "profiles_select_manager": uses public.is_manager() which executes without RLS recursion.

begin;

-- 1. Helper function running as SECURITY DEFINER to bypass RLS during role checks
create or replace function public.is_manager()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'MANAGER'
  );
$$;

comment on function public.is_manager() is
  'Evaluates whether the current authenticated user is a MANAGER without triggering RLS recursion.';

-- 2. Fix public.profiles RLS
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_manager_or_own" on public.profiles;
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_select_manager" on public.profiles;

create policy "profiles_select_own"
    on public.profiles
    for select
    to authenticated
    using (
        id = (select auth.uid())
    );

create policy "profiles_select_manager"
    on public.profiles
    for select
    to authenticated
    using (
        public.is_manager()
    );

comment on policy "profiles_select_own" on public.profiles is
    'Users can always read their own profile row without subqueries.';

comment on policy "profiles_select_manager" on public.profiles is
    'Managers can read all profiles via SECURITY DEFINER is_manager().';

commit;
