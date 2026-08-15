// Role domains, intentionally kept separate.
//
// `profiles.role` is the AUTH role read during login routing (UPPERCASE
// MANAGER/EMPLOYEE). `employees.role` is the SEARCH-TIERING role read by the
// internal-search directory to choose which columns are exposed (lowercase
// manager/employee/visitor). These live in different tables, carry different
// semantics, and are never compared or merged — do not unify them.

// --- Auth domain (profiles.role) ---

export type AuthRole = "MANAGER" | "EMPLOYEE";

const AUTH_ROLES: readonly AuthRole[] = ["MANAGER", "EMPLOYEE"];

/**
 * Normalizes a `profiles.role` value to the canonical auth role.
 * Returns `null` for unknown/missing roles so login routing keeps its
 * existing fail-closed behavior (sign out + "Unauthorized role.").
 */
export function canonicalizeAuthRole(role: string | null | undefined): AuthRole | null {
    if (AUTH_ROLES.includes(role as AuthRole)) return role as AuthRole;
    return null;
}

// --- Search-tiering domain (employees.role) ---

export type SearchTier = "manager" | "employee" | "visitor";

const SEARCH_TIERS: readonly SearchTier[] = ["manager", "employee", "visitor"];

/**
 * Normalizes an `employees.role` value to the canonical search tier.
 * Matching is case-insensitive (mirrors the original `role?.toLowerCase()`
 * behavior); unknown, missing, or unauthenticated cases resolve to `visitor`
 * (reduced column exposure), matching current behavior.
 */
export function canonicalizeSearchRole(role: string | null | undefined): SearchTier {
    const normalized = role?.toLowerCase();
    if (normalized && SEARCH_TIERS.includes(normalized as SearchTier)) return normalized as SearchTier;
    return "visitor";
}

/** Column set exposed to a search tier. Mapping unchanged from the original. */
export function getColumnsForRole(role: SearchTier): string {
    switch (role) {
        case "manager":
            return "*";
        case "employee":
            return "id, first_name, last_name, position, phone, email, hire_date, employment_status, department_id";
        case "visitor":
        default:
            return "id, first_name, last_name, position, phone, email";
    }
}
