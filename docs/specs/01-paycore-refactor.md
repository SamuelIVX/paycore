# Spec: PayCore Refactor (Pilot)

## Objective

Refactor PayCore to make its payroll money boundary authoritative, its bi-weekly period
constant single-sourced, its two role domains explicitly typed but independent, its Supabase
clients lazy, and its lint tooling honest. No runtime behavior change is intended except where
this spec explicitly corrects a type inconsistency (R1.3) or that the plan flags.

## Scope

- Package: `paycore` / `lib/supabase`, `lib/utils`, `app/page.tsx`, `app/internal-search`, configs.
- Modifies:
  - `lib/supabase/payroll.tsx` (money boundary, `26` const, lazy client)
  - `lib/supabase/payroll-actions.ts` (number stores for totals)
  - `lib/supabase/employee.tsx` (magic `26` → const, lazy client)
  - `lib/supabase/payroll-actions.ts` (importer of const)
  - `lib/auth/roles.ts` (new: per-domain role types + normalizers)
  - `app/page.tsx` (consume `AuthRole` typing/normalization)
  - `app/internal-search/actions.ts` (consume `SearchTier` typing/normalization)
  - `lib/__tests__/payroll-actions.test.ts`, `lib/__tests__/supabase/employee.test.ts`,
    `lib/__tests__/payroll.test.ts`, new `lib/__tests__/roles.test.ts`
- Off-limits:
  - `lib/interfaces/database.types.ts` (generated; do not hand-edit)
  - `database schema` / `payroll formulas` / `auth sign-in flow` semantics
  - `eligibility.ts` logic
  - RLS policies / Supabase migrations

## Non-Goals

- Do NOT merge `profiles.role` and `employees.role` into one abstraction.
- Do NOT change DB schema or PostgREST configuration.
- Do NOT change payroll calculation formulas or benefits math.
- Do NOT change auth/login routing behavior.
- Do NOT change column exposure for any role.
- Do NOT fix pre-existing `tsc --noEmit` failures in test files (documented in §8 of the plan);
  fix only errors caused by this spec's changes.
- Do NOT attempt to fix the local ESLint-10 display-name crash. `eslint.config.mjs` is the
  authoritative local config; CI Super-Linter is the authoritative gate. Reconcile config
  *files* only: remove the dead legacy `.eslintrc.json` (nothing references it; ESLint 10 uses
  flat config only) — verify no tooling consumes it before deleting.
- Do NOT rename `lib/utils.ts` (26 importers); the file↔dir collision is documented as a
  follow-up, not fixed here.

## Invariants

- All `payroll_runs` totals (`total_gross`, `total_net`, `total_taxes`,
  `total_benefit_deductions`) are stored as `number`s through exactly one authoritative
  monetary boundary (`roundMoney`), and all read paths round-trip without string coercion.
- The 26 bi-weekly pay periods per year is defined exactly once and consumed by every
  site that encodes the rule (salary per-period, benefits per-period, annual-salary ×26).
- `profiles.role` and `employees.role` remain independent typed domains; they are never
  compared, merged, or canonicalized through a shared abstraction.
- Auth login routing (`MANAGER`/`EMPLOYEE`) and search column-tiering
  (`manager`/`employee`/`visitor`) behave exactly as today.
- Module-scope `createClient()` must not be called at import time (lazy getter only).

## Requirements

1. WHEN a payroll run is finalized, THE SYSTEM SHALL write all four `payroll_runs` totals as
   `number`s via the single `roundMoney` boundary (`Number(...).toFixed(2)` string-writes are
   removed).
2. WHEN `runPayroll` returns totals, THE SYSTEM SHALL return `number`s for
   `total_gross`/`total_net`/`total_taxes` (consumers already coerce via `Number()`; this makes
   the type contract honest).
3. WHEN reading totals, THE SYSTEM SHALL NOT stringify or re-format them inside the money
   module boundary (round-trip guarantee: number → store → number).
4. WHEN any code needs the bi-weekly pay-period count, THE SYSTEM SHALL consume the single
   exported constant `BI_WEEKLY_PAY_PERIODS` (no magic `26` literals).
5. WHEN the app determines login routing, THE SYSTEM SHALL classify `profiles.role` through
   `AuthRole` typing + `canonicalizeAuthRole()` with the SAME accepted values and routing
   outcomes as today (`MANAGER` → manager dashboard, `EMPLOYEE` → employee dashboard, anything
   else → sign out + "Unauthorized role.").
6. WHEN the app tiers search results, THE SYSTEM SHALL classify `employees.role` through
   `SearchTier` typing + `canonicalizeSearchRole()` with the SAME column sets and behavior as
   today (`manager` → `*`, `employee` → full contact fields, `visitor`/unknown/`null` → reduced
   fields, and `visitor` on no-authenticated-record).
7. WHEN a data module is imported with no env vars configured, THE SYSTEM SHALL NOT call
   `createClient()` at module scope; it SHALL create the browser/anon client lazily on first
   use (`getSupabaseClient()`).
8. WHEN lint config files are present, THE SYSTEM SHALL keep `eslint.config.mjs` as the sole
   authoritative local ESLint config (verified: `eslint` uses flat config; ESLint 10 ignores
   legacy `eslintrc`). Deleting the legacy `.eslintrc.json` is DEFERRED: its inertness under
   flat config is verified, but whether Super-Linter reads it is only checkable on CI, and local
   lint is pre-existing-broken — deletion is a CI-adjacent change better done with a working
   local lint. Documented in Deferred work, not done here.

## Current State

- `payroll.tsx:4` `const supabase = createClient()` at module scope; `getAverageBenefitDeductions`
  already creates one locally (line 124). `payroll.tsx:5` `const BI_WEEKLY_PAY_PERIODS = 26`;
  `roundMoney` at line 6. Uses: salary `:91`, benefits `:103`. Also `getWeekStartKey` (private,
  :34) duplicates `lib/utils/date-helpers.ts` — [verified]
- `employee.tsx:5` module-scope `createClient()`; magic `* 26` at `:79` and `:225`
  (annual-salary for BI_WEEKLY) — [verified]
- `payroll-actions.ts:90-122` `updatePayrollRun` writes `total_gross`/`total_net` as
  `.toFixed(2)` STRINGS, taxes/deductions as numbers; returns gross/net as strings — [verified]
- `database.types.ts:284-287` all four totals typed `number | null` — [verified]
- `app/page.tsx:55-66` routes on `profiles.role` (UPPERCASE `MANAGER`/`EMPLOYEE`) — [verified]
- `app/internal-search/actions.ts:6-34` `getColumnsForRole` + `resolveAuthenticatedRole`
  read lowercase `employees.role`, default `'visitor'` — no tests exist for this file — [verified]
- `.eslintrc.json` (no REFERENCES anywhere), `eslint.config.mjs` (active, used by `eslint`),
  `biome.json` (CSS-parser-only)... [verified]
- No `4000/util.ts`, `HASHTAG_EXPENSE_CATEGORIES`, or `checkSlug` in tree or git history —
  earlier-plan claims rejected — [verified]
- `tsc --noEmit` pre-existing failures: test files only + `app/page.tsx(16,25)` logo.png module
  declaration. Next `build` typecheck clean (baseline 2026-08-13, Node 25) — [verified]

## Required change notes / Implementation

- Money boundary: `roundMoney` moves to `lib/money.ts` (pure); `payroll.tsx` imports and
  re-exports it; `payroll-actions.ts` imports it. Produce numbers, remove string-writes.
- `26` const: move to `lib/payroll-constants.ts`; `payroll.tsx`, `employee.tsx`,
  `payroll-actions.ts` consume it; replace magic literals at `employee.tsx:79,225` and
  the two payroll.tsx sites, and the case in `getAnnualPayrollExpenditure`/`salaryByPosition`.
- Roles: `lib/auth/roles.ts` exports `AuthRole`, `canonicalizeAuthRole`, `SearchTier`,
  `canonicalizeSearchRole`, and `getColumnsForRole` (moved from internal-search, unchanged
  mapping). Keep no shared parent type.
- Lazy clients: add `getSupabaseClient()` in `lib/supabase/payroll.tsx` / `employee.tsx`
  (preserve the browser `createClient()` import + options).
- `getWeekStartKey` duplication in `payroll.tsx` is out of scope (leaving as-is; documented).

## Design

- `lib/money.ts` (NEW, pure, no side effects): single `roundMoney` implementation.
  Both `payroll.tsx` (calc) and `payroll-actions.ts` (DB write) consume it. Rationale: defining
  it in `payroll.tsx` and importing from payroll-actions would pull in `payroll.tsx`'s
  module-scope `createClient()` into a server action — the money boundary must stay
  side-effect-free and importable by both sides without triggering client creation.
- `lib/payroll-constants.ts` (NEW, pure): `BI_WEEKLY_PAY_PERIODS = 26`, consumed by
  `payroll.tsx`, `employee.tsx`, and `payroll-actions.ts`. Same side-effect-free rationale.
- `payroll.tsx` re-exports `roundMoney` (for existing/other consumers) and imports
  `BI_WEEKLY_PAY_PERIODS`; removes its local definitions.
- `lib/auth/roles.ts`:
  ```ts
  export type AuthRole = "MANAGER" | "EMPLOYEE";
  export function canonicalizeAuthRole(role: string | null | undefined): AuthRole | "UNKNOWN";
  export type SearchTier = "manager" | "employee" | "visitor";
  export function canonicalizeSearchRole(role: string | null | undefined): SearchTier;
  export function getColumnsForRole(role: SearchTier): string; // moved mapping, unchanged output
  ```
- `getSupabaseClient()` per data module — lazy, memoized, browser client.

## Tests

- `updatePayrollRunWritesNumbers (R1)` — assert update payload totals are numbers, not strings.
- `runPayrollReturnsNumbers (R1,R2)` — result totals are typeof number (+ existing toBeCloseTo).
- `roundTripPreservesNumber (R3)` — number → money boundary → number, no stringification.
- `biWeeklyPeriodsSingleSource (R4)` — all salary/benefit/annual calcs equal
  `BI_WEEKLY_PAY_PERIODS` (guard on the 4 sites).
- `canonicalizeAuthRole_routing (R5)` — MANAGER/EMPLOYEE/unknown → routing outcomes unchanged.
- `roles.test.ts: getColumnsForRole per tier (R6)` — column strings unchanged per tier.
- `lazyClientNotCreatedAtImport (R7)` — importing a data module without env does not call
  `createClient()` (mock assertion / lazy-guard test).

## Constraints

- Dependencies: none (pilot — one PR).
- Backward compatibility: runPayroll return shape change string→number is intentional and
  consumer-safe (verified `Number()` coercion at `app/manager/payroll-status/page.tsx:77-80`
  and test coercion at `payroll-actions.test.ts:176`).
- Tooling note: Node 25 used locally; CI uses Node 24 — will not drift gates.

## Acceptance Criteria

- AC1: `npm run test:run` passes with new tests (no deletions).
- AC2: `npm run build` clean.
- AC3: `npx tsc --noEmit` shows no NEW errors vs baseline (documented pre-existing stay).
- AC4: `grep` confirms zero `toFixed(2)` string-writes into `payroll_runs` totals.
- AC5: `grep` confirms zero magic `26` literals in payroll/employee/annual-salary math.
- AC6: `eslint.config.mjs` remains the authoritative local config; `.eslintrc.json` deletion
  DEFERRED (documented, not performed — CI-checkable only).

## Context

- Plan: `~/context/plans/master-refactor-v3.md` (Tier A). Decisions D1/D2 for roles+money.
- Verified baseline run 2026-08-13: tests 206 pass / 39 skip, build clean, local lint crashes
  (pre-existing, documented), tsc pre-existing test-file errors.