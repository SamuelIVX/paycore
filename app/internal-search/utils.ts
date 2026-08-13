/**
 * Display helpers for directory search results (location, role, initials, field presence).
 */
import type { EmployeeWithProfile } from "@/lib/supabase/employee";

/**
 * Format Location.
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
 * Has Pay Info.
 */
export function hasPayInfo(
    employee: EmployeeWithProfile,
): employee is EmployeeWithProfile & { pay_rate: number } {
    return 'pay_rate' in employee;
}

/**
 * Has Address Info.
 */
export function hasAddressInfo(
    employee: EmployeeWithProfile,
): employee is EmployeeWithProfile & { address_line: string } {
    return 'address_line' in employee;
}

/**
 * Has Pay Frequency.
 */
export function hasPayFrequency(
    employee: EmployeeWithProfile,
): employee is EmployeeWithProfile & { pay_frequency: string | null } {
    return 'pay_frequency' in employee;
}

/**
 * Capitalize Role.
 */
export function capitalizeRole(role: string | null): string {
    const normalized = role?.toLowerCase() ?? 'visitor';
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

/**
 * Get Initials.
 */
export function getInitials(firstName: string | null, lastName: string | null): string {
    const first = firstName?.trim().charAt(0) ?? '';
    const last = lastName?.trim().charAt(0) ?? '';
    const initials = `${first}${last}`.toUpperCase();
    return initials || '?';
}
