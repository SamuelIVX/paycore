/**
 * Display helpers for directory search results (location, role, initials, field presence).
 */
import type { EmployeeWithProfile } from "@/lib/supabase/employee";

/**
 * Joins address fields for directory cards; falls back when none present.
 * @param employee - Directory row (visitor-safe or elevated columns).
 * @returns Comma-joined location, or "Location not available".
 * @example
 * formatLocation({ city: "Austin", state: "TX" } as EmployeeWithProfile)
 * // => "Austin, TX"
 */
export function formatLocation(employee: EmployeeWithProfile) {
    const pieces = [
        ('address_line' in employee ? employee.address_line : null),
        ('city' in employee ? employee.city : null),
        ('state' in employee ? employee.state : null),
        ('zip_code' in employee ? employee.zip_code : null),
    ].filter(Boolean);

    return pieces.length > 0 ? pieces.join(", ") : "Location not available";
}

/**
 * Type guard: employee payload includes pay_rate (elevated roles).
 * @param employee - Directory search result row.
 * @returns Whether pay_rate is present on the object.
 * @example
 * if (hasPayInfo(row)) console.log(row.pay_rate);
 */
export function hasPayInfo(
    employee: EmployeeWithProfile,
): employee is EmployeeWithProfile & { pay_rate: number } {
    return 'pay_rate' in employee;
}

/**
 * Type guard: employee payload includes address_line.
 * @param employee - Directory search result row.
 * @returns Whether address_line is present on the object.
 * @example
 * if (hasAddressInfo(row)) console.log(row.address_line);
 */
export function hasAddressInfo(
    employee: EmployeeWithProfile,
): employee is EmployeeWithProfile & { address_line: string } {
    return 'address_line' in employee;
}

/**
 * Type guard: employee payload includes pay_frequency.
 * @param employee - Directory search result row.
 * @returns Whether pay_frequency is present on the object.
 * @example
 * if (hasPayFrequency(row)) console.log(row.pay_frequency);
 */
export function hasPayFrequency(
    employee: EmployeeWithProfile,
): employee is EmployeeWithProfile & { pay_frequency: string | null } {
    return 'pay_frequency' in employee;
}

/**
 * Title-cases a profiles.role string for display; defaults to Visitor.
 * @param role - Raw role from auth/profile (any casing), or null.
 * @returns Capitalized role label.
 * @example
 * capitalizeRole("MANAGER") // => "Manager"
 * capitalizeRole(null) // => "Visitor"
 */
export function capitalizeRole(role: string | null): string {
    const normalized = role?.toLowerCase() ?? 'visitor';
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

/**
 * Two-letter initials for avatar fallbacks.
 * @param firstName - Given name (may be null/blank).
 * @param lastName - Family name (may be null/blank).
 * @returns Uppercase initials, or "?" when both missing.
 * @example
 * getInitials("Ada", "Lovelace") // => "AL"
 */
export function getInitials(firstName: string | null, lastName: string | null): string {
    const first = firstName?.trim().charAt(0) ?? '';
    const last = lastName?.trim().charAt(0) ?? '';
    const initials = `${first}${last}`.toUpperCase();
    return initials || '?';
}
