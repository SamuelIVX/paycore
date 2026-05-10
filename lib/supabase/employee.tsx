import { createClient } from "@/utils/supabase/client";
import { TablesInsert } from "../interfaces/database.types";
import { DirectoryEntry } from "@/lib/supabase/types";

const supabase = createClient();
type EmployeeInsert = TablesInsert<"employees">;

// Role-based employee types for different access levels
export type ManagerEmployee = Tables<"employees"> & {
    profiles: { email: string } | null
};

export type EmployeeSearch = Omit<Tables<"employees">, 'address_line' | 'zip_code' | 'city' | 'state' | 'pay_rate' | 'pay_frequency'> & {
    profiles: { email: string } | null
};

export type VisitorSearch = Pick<Tables<"employees">, 'id' | 'first_name' | 'last_name' | 'position' | 'phone'> & {
    profiles: { email: string } | null
};

export type EmployeeWithProfile = ManagerEmployee | EmployeeSearch | VisitorSearch;

/**
 * Get the current user's role for access control
 */
export const getCurrentUserRole = async (userId?: string): Promise<string | null> => {
    try {
        let currentUserId = userId;

        if (!currentUserId) {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                return null;
            }

            currentUserId = user.id;
        }

        const { data: employee, error: empError } = await supabase
            .from("employees")
            .select("role")
            .eq("\"profile.id\"", currentUserId)
            .single();

        if (empError) {
            return null;
        }

        return employee?.role ?? null;
    } catch (err) {
        console.error("Unexpected error getting user role:", err);
        return null;
    }
};

/**
 * Get column selection string based on user role
 * - manager: full access to all fields
 * - employee: limited access (no address, pay info)
 * - visitor: public contact info only
 */
function getColumnsForRole(role: string | null): string {
    const normalizedRole = role?.toLowerCase();
    switch (normalizedRole) {
        case 'manager':
            return "*, profiles(email)";
        case 'employee':
            return "id, first_name, last_name, position, phone, hire_date, employment_status, department_id, profiles(email)";
        case 'visitor':
        default:
            return "id, first_name, last_name, position, phone, profiles(email)";
    }
}

export const addEmployee = async (employee: EmployeeInsert) => {
    const { error } = await supabase
        .from("employees")
        .insert(employee);

    if (error) {
        console.error("Error adding employee:", error);
        throw error;
    }
}

export const getEmployees = async () => {
    const { data: employees, error } = await supabase
        .from("employees")
        .select("*");

    if (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }

    return employees;
}

/**
 * Search for employees by name with role-based column filtering
 * @param name - The name to search for
 * @param userRole - The role of the user performing the search (manager/employee/visitor)
 */
export const searchEmployeesByName = async (name: string, userRole: string | null) => {
    const trimmed = name.trim();
    if (!trimmed) {
        return [] as EmployeeWithProfile[];
    }

    // Use PostgREST pattern with proper escaping to prevent injection
    const escapedPattern = `%${trimmed.replace(/"/g, '\\"')}%`;
    const columns = getColumnsForRole(userRole);
    
    const { data: employees, error } = await supabase
        .from("employees")
        .select(columns)
        .or(`first_name.ilike."${escapedPattern}",last_name.ilike."${escapedPattern}"`)
        .limit(50);

    if (error) {
        console.error("Error searching employees:", error);
        throw error;
    }

    return (employees ?? []) as unknown as EmployeeWithProfile[];
}

export const getActiveEmployeesCount = async () => {
    const { count, error } = await supabase
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("employment_status", "ACTIVE");

    if (error) {
        console.error("Error fetching active employees count:", error);
        throw error;
    }

    return count ?? 0;
}

export const getTotalAnnualPayroll = async () => {
    const { data: employees, error } = await supabase
        .from("employees")
        .select("id, pay_rate, pay_frequency")
        .eq("employment_status", "ACTIVE");

    if (error) {
        console.error("Error fetching active employees for annual payroll:", error);
        throw error;
    }

    if (!employees || employees.length === 0) {
        return 0;
    }

    let totalAnnual = 0;

    for (const employee of employees) {
        const { pay_rate, pay_frequency } = employee;

        if (pay_rate == null) continue;
        if (pay_frequency === "SALARY") {
            totalAnnual += pay_rate;
        } else if (pay_frequency === "BI_WEEKLY") {
            totalAnnual += pay_rate * 26;
        } else if (pay_frequency === "HOURLY") {
            totalAnnual += (pay_rate * 40) * 52;
        }
    }

    return totalAnnual;
}

export const updateEmployee = async (id: string, updates: Partial<EmployeeInsert>) => {
    const { error } = await supabase
        .from("employees")
        .update(updates)
        .eq("id", id);

    if (error) {
        console.error("Error updating employee:", error);
        throw error;
    }
}

export const deleteEmployee = async (id: string) => {
    const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting employee:", error);
        throw error;
    }
}

export async function getCurrentEmployee() {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error("User not authenticated")
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    if (profileError || !profile) {
        throw profileError ?? new Error("Profile not found")
    }

    const { data: employee, error: employeeError } = await supabase
        .from("employees")
        .select("*")
        .eq('"profile.id"', profile.id)
        .single()

    if (employeeError || !employee) {
        throw employeeError ?? new Error("Employee record not found")
    }

    return {
        user,
        profile,
        employee,
    }
}

export const getEmployeeDirectory = async (): Promise<DirectoryEntry[]> => {
    const { data: employees, error: employeesError } = await supabase
        .from("employees")
        .select("*");

    if (employeesError) {
        console.error("Error fetching employee directory:", employeesError);
        throw employeesError;
    }

    const { data: departments, error: departmentsError } = await supabase
        .from("departments")
        .select("id, name");

    if (departmentsError) {
        console.error("Error fetching departments:", departmentsError);
        throw departmentsError;
    }

    const nameByDepartmentId = new Map(
        (departments ?? []).map((d) => [d.id, d.name] as const),
    );

    return (employees ?? []).map((emp) => {
        const empWithEmail = emp as typeof emp & { email: string | null };

        return {
            id: emp.id,
            first_name: emp.first_name,
            last_name: emp.last_name,
            phone: emp.phone,
            position: emp.position,
            department: emp.department_id ? nameByDepartmentId.get(emp.department_id) ?? null : null,
            email: empWithEmail.email ?? null,
        };
    });
}

export const getEmployeeByDepartment = async () => {
    const { data, error } = await supabase
        .from("employees")
        .select("*, departments(name)")
        .not("departments", "is", null);

    if (error) {
        throw error;
    }

    const grouped = (data ?? []).reduce((acc, emp) => {
        const deptName = emp.departments?.name || "Unknown";
        acc[deptName] = (acc[deptName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return grouped;
}

export const getEmployeeSalaryByPosition = async () => {
    const { data, error } = await supabase
        .from("employees")
        .select("pay_rate, pay_frequency, position");

    if (error) {
        throw error;
    }

    const salaryByPosition: Record<string, number> = {};

    (data ?? []).forEach(emp => {
        const { pay_rate, pay_frequency, position } = emp;
        if (pay_rate == null || position == null) return;

        let annualSalary = 0;
        if (pay_frequency === "SALARY") {
            annualSalary = pay_rate;
        } else if (pay_frequency === "BI_WEEKLY") {
            annualSalary = pay_rate * 26;
        } else if (pay_frequency === "HOURLY") {
            annualSalary = (pay_rate * 40) * 52;
        }

        salaryByPosition[position] = (salaryByPosition[position] || 0) + annualSalary;
    });

    return salaryByPosition;
}
