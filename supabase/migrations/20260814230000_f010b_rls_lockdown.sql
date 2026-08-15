-- F-010-B: RLS lockdown. Kill anonymous reads/writes on data tables and
-- add a restricted-column directory view.
--
-- Live audit (2026-08-14, pg_policies dump on cvnxvewfglkidyjkfynr) showed
-- public/qual=true SELECT on every data table and public INSERT/UPDATE on
-- employee_benefits. Employees must not be readable by anonymous callers.
--
-- Idempotent: every create policy is preceded by a drop if exists.

begin;

-- 1. employees: full reads only for managers or the row owner; others use
--    the employee_directory view below (RLS cannot scope columns).
alter table public.employees enable row level security;

drop policy if exists "Anyone can view employees" on public.employees;
drop policy if exists "employees_select_manager_or_own" on public.employees;
create policy "employees_select_manager_or_own"
    on public.employees
    for select
    to authenticated
    using (
        profile_id = auth.uid()
        or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'MANAGER')
    );

comment on policy "employees_select_manager_or_own" on public.employees is
    'F-010-B: full employee reads limited to managers and the employee''s own row.';

-- 2. employee_directory: directory-safe columns for all authenticated users.
--    A security-definer view (default) intentionally bypasses the RLS row
--    lock so the coworker directory still returns everyone — but only the
--    columns listed here. Managers read full rows from `employees` directly.
create or replace view public.employee_directory (id, first_name, last_name, position, phone, email) as
select
    e.id,
    e.first_name,
    e.last_name,
    e.position,
    e.phone,
    e.email
from public.employees e;

grant select on public.employee_directory to authenticated;

-- Supabase's DEFAULT PRIVILEGES grant all on new public views to anon;
-- strip that so the directory is authenticated-only like every other read here.
revoke all on public.employee_directory from anon;

comment on view public.employee_directory is
    'F-010-B: restricted directory columns (no pay/tax/address) readable by any authenticated user.';

-- 3. profiles: select limited to own row or managers; drop the duplicate policy.
alter table public.profiles enable row level security;

drop policy if exists "Anyone can view profiles" on public.profiles;
drop policy if exists "Enable read access for all users" on public.profiles;
drop policy if exists "profiles_select_manager_or_own" on public.profiles;
create policy "profiles_select_manager_or_own"
    on public.profiles
    for select
    to authenticated
    using (
        id = auth.uid()
        or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'MANAGER')
    );

comment on policy "profiles_select_manager_or_own" on public.profiles is
    'F-010-B: profile reads limited to managers and the profile''s own row.';

-- 4. payroll_records: own-employee or manager (self-service paystubs + manager views).
alter table public.payroll_records enable row level security;

drop policy if exists "Enable read access for all users" on public.payroll_records;
drop policy if exists "payroll_records_select_own_or_manager" on public.payroll_records;
create policy "payroll_records_select_own_or_manager"
    on public.payroll_records
    for select
    to authenticated
    using (
        employee_id in (select e.id from public.employees e where e.profile_id = auth.uid())
        or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'MANAGER')
    );

comment on policy "payroll_records_select_own_or_manager" on public.payroll_records is
    'F-010-B: payroll record reads limited to the owning employee or managers.';

-- 5. Payroll runs, benefits, departments, time_entries: any authenticated read.
alter table public.payroll_runs enable row level security;
drop policy if exists "Anyone can view payroll runs" on public.payroll_runs;
drop policy if exists "payroll_runs_select_authenticated" on public.payroll_runs;
create policy "payroll_runs_select_authenticated"
    on public.payroll_runs for select to authenticated using (true);

alter table public.benefits enable row level security;
drop policy if exists "Enable read access for all users" on public.benefits;
drop policy if exists "benefits_select_authenticated" on public.benefits;
create policy "benefits_select_authenticated"
    on public.benefits for select to authenticated using (true);

alter table public.departments enable row level security;
drop policy if exists "Anyone can view departments" on public.departments;
drop policy if exists "departments_select_authenticated" on public.departments;
create policy "departments_select_authenticated"
    on public.departments for select to authenticated using (true);

alter table public.time_entries enable row level security;
drop policy if exists "Everyone can view time_entries" on public.time_entries;
drop policy if exists "time_entries_select_authenticated" on public.time_entries;
create policy "time_entries_select_authenticated"
    on public.time_entries for select to authenticated using (true);

-- 6. employee_benefits: anonymous INSERT/UPDATE was a live hole. Writes are
--    scoped to the acting employee's own enrollment row or managers; reads
--    stay authenticated-only.
alter table public.employee_benefits enable row level security;

drop policy if exists "Allow all users to insert" on public.employee_benefits;
drop policy if exists "Enable update access for all users" on public.employee_benefits;
drop policy if exists "Enable read access for all users" on public.employee_benefits;
drop policy if exists "employee_benefits_select_authenticated" on public.employee_benefits;
drop policy if exists "employee_benefits_insert_own_or_manager" on public.employee_benefits;
drop policy if exists "employee_benefits_update_own_or_manager" on public.employee_benefits;

create policy "employee_benefits_select_authenticated"
    on public.employee_benefits for select to authenticated using (true);

create policy "employee_benefits_insert_own_or_manager"
    on public.employee_benefits
    for insert
    to authenticated
    with check (
        employee_id in (select e.id from public.employees e where e.profile_id = auth.uid())
        or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'MANAGER')
    );

create policy "employee_benefits_update_own_or_manager"
    on public.employee_benefits
    for update
    to authenticated
    using (
        employee_id in (select e.id from public.employees e where e.profile_id = auth.uid())
        or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'MANAGER')
    )
    with check (
        employee_id in (select e.id from public.employees e where e.profile_id = auth.uid())
        or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'MANAGER')
    );

commit;