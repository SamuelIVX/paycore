-- F-003-B: Append-only audit trail for employees.tax_rate_* changes.
--
-- Path B: keep the flat tax-rate columns, add an audit history and protect the
-- new history from anonymous reads. Employee UPDATE stays manager-gated by the
-- existing hosted policy ("Only managers can update employees"); no new UPDATE
-- policy is created here.
--
-- changed_by is nullable: under the service_role key there is no JWT, so
-- auth.uid() is NULL. A NOT NULL column would reject those legitimate writes.

-- 1. Append-only tax rate history table
create table if not exists public.tax_rate_history (
    id uuid primary key default gen_random_uuid(),
    employee_id uuid not null references public.employees(id) on delete cascade,
    changed_by uuid references auth.users(id) on delete set null,
    old_federal_tax_rate numeric,
    old_state_tax_rate numeric,
    old_social_security_tax_rate numeric,
    new_federal_tax_rate numeric,
    new_state_tax_rate numeric,
    new_social_security_tax_rate numeric,
    changed_at timestamptz not null default now()
);

comment on table public.tax_rate_history is 'Audit trail for employees.tax_rate_* changes (F-003-B).';
comment on column public.tax_rate_history.employee_id is 'Employee whose tax rates changed.';
comment on column public.tax_rate_history.changed_by is 'Auth user who made the change; NULL under the service_role key.';
comment on column public.tax_rate_history.changed_at is 'When the change occurred.';

-- 2. Trigger function to capture tax rate changes
-- SECURITY DEFINER so the insert into tax_rate_history is not blocked by RLS.
create or replace function public.log_tax_rate_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if TG_OP = 'UPDATE' and (
        NEW.federal_tax_rate is distinct from OLD.federal_tax_rate or
        NEW.state_tax_rate is distinct from OLD.state_tax_rate or
        NEW.social_security_tax_rate is distinct from OLD.social_security_tax_rate
    ) then
        insert into public.tax_rate_history (
            employee_id,
            changed_by,
            old_federal_tax_rate,
            old_state_tax_rate,
            old_social_security_tax_rate,
            new_federal_tax_rate,
            new_state_tax_rate,
            new_social_security_tax_rate
        ) values (
            NEW.id,
            auth.uid(),
            OLD.federal_tax_rate,
            OLD.state_tax_rate,
            OLD.social_security_tax_rate,
            NEW.federal_tax_rate,
            NEW.state_tax_rate,
            NEW.social_security_tax_rate
        );
    end if;
    return NEW;
end;
$$;

comment on function public.log_tax_rate_changes() is 'Writes to tax_rate_history when employees.tax_rate_* columns change (F-003-B).';

-- 3. Trigger on employees table
drop trigger if exists employees_tax_rate_audit on public.employees;
create trigger employees_tax_rate_audit
    after update of federal_tax_rate, state_tax_rate, social_security_tax_rate
    on public.employees
    for each row
    execute function public.log_tax_rate_changes();

-- 4. RLS on the audit history: managers and the affected employee may read it;
-- writes are only via the SECURITY DEFINER trigger (no blanket INSERT/UPDATE/
-- DELETE policies for anon or authenticated).
alter table public.tax_rate_history enable row level security;

drop policy if exists "tax_rate_history_select_manager_or_own" on public.tax_rate_history;
create policy "tax_rate_history_select_manager_or_own"
    on public.tax_rate_history
    for select
    to authenticated
    using (
        EXISTS (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'MANAGER'
        )
        or employee_id = (
            select e.id from public.employees e
            where e.profile_id = auth.uid()
        )
    );

comment on policy "tax_rate_history_select_manager_or_own" on public.tax_rate_history is 'F-003-B: audit history readable by managers or the employee it concerns.';