-- F-011: RLS hardening for payroll_runs, payroll_records, and time_entries.
-- Restrict payroll run visibility and mutation to managers.
-- Restrict time entries visibility and mutations to row owners and managers.
--
-- Idempotent: every create policy is preceded by a drop if exists.

begin;

-- Ensure public.is_manager() exists
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

-- 1. payroll_runs: only managers can view, insert, or update company payroll runs.
alter table public.payroll_runs enable row level security;

drop policy if exists "Anyone can view payroll runs" on public.payroll_runs;
drop policy if exists "payroll_runs_select_authenticated" on public.payroll_runs;
drop policy if exists "payroll_runs_select_manager" on public.payroll_runs;
create policy "payroll_runs_select_manager"
    on public.payroll_runs
    for select
    to authenticated
    using (
        public.is_manager()
    );

drop policy if exists "payroll_runs_insert_manager" on public.payroll_runs;
create policy "payroll_runs_insert_manager"
    on public.payroll_runs
    for insert
    to authenticated
    with check (
        public.is_manager()
    );

drop policy if exists "payroll_runs_update_manager" on public.payroll_runs;
create policy "payroll_runs_update_manager"
    on public.payroll_runs
    for update
    to authenticated
    using (
        public.is_manager()
    )
    with check (
        public.is_manager()
    );

comment on policy "payroll_runs_select_manager" on public.payroll_runs is
    'F-011: company-wide payroll runs viewable only by managers.';

-- 2. payroll_records: mutations restricted to managers. (Reads already scoped by F-010-B).
alter table public.payroll_records enable row level security;

drop policy if exists "payroll_records_insert_manager" on public.payroll_records;
create policy "payroll_records_insert_manager"
    on public.payroll_records
    for insert
    to authenticated
    with check (
        public.is_manager()
    );

drop policy if exists "payroll_records_update_manager" on public.payroll_records;
create policy "payroll_records_update_manager"
    on public.payroll_records
    for update
    to authenticated
    using (
        public.is_manager()
    )
    with check (
        public.is_manager()
    );

-- 3. time_entries: employees see only their own entries; managers see all entries.
alter table public.time_entries enable row level security;

drop policy if exists "Everyone can view time_entries" on public.time_entries;
drop policy if exists "time_entries_select_authenticated" on public.time_entries;
drop policy if exists "time_entries_select_own_or_manager" on public.time_entries;
create policy "time_entries_select_own_or_manager"
    on public.time_entries
    for select
    to authenticated
    using (
        employee_id in (select e.id from public.employees e where e.profile_id = (select auth.uid()))
        or public.is_manager()
    );

drop policy if exists "time_entries_insert_own_or_manager" on public.time_entries;
create policy "time_entries_insert_own_or_manager"
    on public.time_entries
    for insert
    to authenticated
    with check (
        employee_id in (select e.id from public.employees e where e.profile_id = (select auth.uid()))
        or public.is_manager()
    );

drop policy if exists "time_entries_update_own_or_manager" on public.time_entries;
create policy "time_entries_update_own_or_manager"
    on public.time_entries
    for update
    to authenticated
    using (
        employee_id in (select e.id from public.employees e where e.profile_id = (select auth.uid()))
        or public.is_manager()
    )
    with check (
        employee_id in (select e.id from public.employees e where e.profile_id = (select auth.uid()))
        or public.is_manager()
    );

comment on policy "time_entries_select_own_or_manager" on public.time_entries is
    'F-011: time entries viewable only by row owner or managers.';

commit;
