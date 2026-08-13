'use server';

/**
 * Server actions for directory search and authenticated role lookup.
 * SECURITY: role gates which employee fields are returned (pay/address vs visitor-safe).
 */
import { createClient } from "@/utils/supabase/server";
import type { EmployeeWithProfile } from "@/lib/supabase/employee";

function getColumnsForRole(role: string | null): string {
    const normalizedRole = role?.toLowerCase();
    switch (normalizedRole) {
        case 'manager':
            return "*";
        case 'employee':
            return "id, first_name, last_name, position, phone, email, hire_date, employment_status, department_id";
        case 'visitor':
        default:
            return "id, first_name, last_name, position, phone, email";
    }
}

async function resolveAuthenticatedRole(
    supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<string> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return 'visitor';
    }

    const { data: employee } = await supabase
        .from("employees")
        .select("role")
        .eq('profile_id', user.id)
        .single();

    return employee?.role ?? 'visitor';
}

/**
 * Server-side name search returning role-appropriate employee fields.
 * SECURITY: pay/address only for elevated roles.
 * @param name - Substring matched against first/last name.
 * @returns Matching rows plus the caller's resolved role string.
 * @example
 * const { results, role } = await searchEmployeesByNameAction("hernandez");
 */
export async function searchEmployeesByNameAction(
    name: string,
): Promise<{ results: EmployeeWithProfile[]; role: string }> {
    const trimmed = name.trim();
    if (!trimmed) {
        return { results: [], role: 'visitor' };
    }

    const supabase = await createClient();
    const role = await resolveAuthenticatedRole(supabase);
    if (role === 'visitor') {
        return { results: [], role };
    }

    const columns = getColumnsForRole(role);

    // Escape PostgREST/ilike special chars: backslash, percent, underscore, quote.
    const escapedPattern = `%${trimmed.replace(/[\\%_"]/g, '\\$&')}%`;

    const { data: employees, error } = await supabase
        .from("employees")
        .select(columns)
        .or(`first_name.ilike."${escapedPattern}",last_name.ilike."${escapedPattern}"`)
        .limit(50);

    if (error) {
        console.error("Error searching employees:", error);
        throw error;
    }

    return {
        results: (employees ?? []) as unknown as EmployeeWithProfile[],
        role,
    };
}

/**
 * Returns the signed-in profiles.role string (or empty when unauthenticated).
 * @returns Role string from profiles, or "" when no session/profile.
 * @example
 * const role = await getAuthenticatedUserRoleAction(); // e.g. "MANAGER"
 */
export async function getAuthenticatedUserRoleAction(): Promise<string> {
    const supabase = await createClient();
    return resolveAuthenticatedRole(supabase);
}
