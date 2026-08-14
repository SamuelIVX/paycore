/**
 * Browser-client employee CRUD, directory, dashboard aggregates, and current-user lookup.
 * SECURITY: returns full employee rows (address, pay_rate, tax rates) — do not log or expose to unauthorized roles.
 */
import { createClient } from "@/utils/supabase/client";
import { Tables, TablesInsert } from "../interfaces/database.types";
import { DirectoryEntry } from "@/lib/supabase/types";
import { BI_WEEKLY_PAY_PERIODS } from "@/lib/payroll-constants";

let supabase: ReturnType<typeof createClient> | null = null;
const getSupabaseClient = () => {
    if (!supabase) supabase = createClient();
    return supabase;
};

type EmployeeInsert = TablesInsert<"employees">;

// Role-based employee types for different access levels
/**
 * Manager-facing employee row shape used by table/forms.
 */
export type ManagerEmployee = Tables<"employees">;

/**
 * Elevated directory search hit including pay/address fields.
 */
export type EmployeeSearch = Omit<Tables<"employees">, 'address_line' | 'zip_code' | 'city' | 'state' | 'pay_rate' | 'pay_frequency'>;

/**
 * Visitor-safe directory search hit (no pay/address).
 */
export type VisitorSearch = Pick<Tables<"employees">, 'id' | 'first_name' | 'last_name' | 'position' | 'phone' | 'email'>;

/**
 * EmployeeWithProfile type/interface.
 */
export type EmployeeWithProfile = ManagerEmployee | EmployeeSearch | VisitorSearch;

/**
 * Inserts an employees row.
 * SECURITY: accepts full PII + pay fields.
 * @param employee - Insert payload including pay/tax/address fields.
 * @returns Inserted employee row.
 * @throws On Supabase error.
 * @example
 * await addEmployee({ first_name: "Ada", pay_rate: 50, pay_frequency: "HOURLY" });
 */
export const addEmployee = async (employee: EmployeeInsert) => {
    const { error } = await getSupabaseClient()
        .from("employees")
        .insert(employee);

    if (error) {
        console.error("Error adding employee:", error);
        throw error;
    }
}

/**
 * Selects all employees.
 * SECURITY: full rows — manager-only surfaces.
 * @returns Every employees row (includes pay/PII).
 * @throws On Supabase error.
 * @example
 * const all = await getEmployees();
 */
export const getEmployees = async () => {
    const { data: employees, error } = await getSupabaseClient()
        .from("employees")
        .select("*");

    if (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }

    return employees;
}

/**
 * Exact count of ACTIVE employees (head-only query).
 * @returns Active headcount.
 * @throws On Supabase error.
 * @example
 * const active = await getActiveEmployeesCount();
 */
export const getActiveEmployeesCount = async () => {
    const { count, error } = await getSupabaseClient()
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("employment_status", "ACTIVE");

    if (error) {
        console.error("Error fetching active employees count:", error);
        throw error;
    }

    return count ?? 0;
}

/**
 * Sums estimated annual pay for ACTIVE employees (salary / biweekly×26 / hourly×40×52).
 * SECURITY: aggregates compensation.
 * @returns Estimated annual payroll total.
 * @throws On Supabase error.
 * @example
 * const annual = await getTotalAnnualPayroll();
 */
export const getTotalAnnualPayroll = async () => {
    const { data: employees, error } = await getSupabaseClient()
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
            totalAnnual += pay_rate * BI_WEEKLY_PAY_PERIODS;
        } else if (pay_frequency === "HOURLY") {
            totalAnnual += (pay_rate * 40) * 52;
        }
    }

    return totalAnnual;
}

/**
 * Partial update of an employee by id.
 * SECURITY: may change pay/PII fields.
 * @param id - Employee UUID.
 * @param updates - Partial employee fields.
 * @returns Updated row.
 * @throws On Supabase error.
 * @example
 * await updateEmployee(id, { pay_rate: 55 });
 */
export const updateEmployee = async (id: string, updates: Partial<EmployeeInsert>) => {
    const { error } = await getSupabaseClient()
        .from("employees")
        .update(updates)
        .eq("id", id);

    if (error) {
        console.error("Error updating employee:", error);
        throw error;
    }
}

/**
 * Deletes an employee by id.
 * @param id - Employee UUID.
 * @throws On Supabase error.
 * @example
 * await deleteEmployee(id);
 */
export const deleteEmployee = async (id: string) => {
    const { error } = await getSupabaseClient()
        .from("employees")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting employee:", error);
        throw error;
    }
}

/**
 * Resolves auth user → profiles → employees for the signed-in session.
 * SECURITY: returns user, profile, and full employee row.
 * @returns `{ user, profile, employee }` for the current session.
 * @throws If unauthenticated or profile/employee missing.
 * @example
 * const { employee } = await getCurrentEmployee();
 */
export async function getCurrentEmployee() {
    const {
        data: { user },
        error: userError,
    } = await getSupabaseClient().auth.getUser()

    if (userError || !user) {
        throw new Error("User not authenticated")
    }

    const { data: profile, error: profileError } = await getSupabaseClient()
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    if (profileError || !profile) {
        throw profileError ?? new Error("Profile not found")
    }

    const { data: employee, error: employeeError } = await getSupabaseClient()
        .from("employees")
        .select("*")
        .eq('profile_id', profile.id)
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

/**
 * Maps employees + departments into DirectoryEntry rows (no pay fields).
 * @returns Directory entries safe for coworker browse UIs.
 * @throws On Supabase error.
 * @example
 * const directory = await getEmployeeDirectory();
 */
export const getEmployeeDirectory = async (): Promise<DirectoryEntry[]> => {
    const { data: employees, error: employeesError } = await getSupabaseClient()
        .from("employees")
        .select("*");

    if (employeesError) {
        console.error("Error fetching employee directory:", employeesError);
        throw employeesError;
    }

    const { data: departments, error: departmentsError } = await getSupabaseClient()
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

/**
 * Counts employees grouped by department name.
 * @returns `{ name, count }` rows for charting.
 * @throws On Supabase error.
 * @example
 * const byDept = await getEmployeeByDepartment();
 */
export const getEmployeeByDepartment = async () => {
    const { data, error } = await getSupabaseClient()
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

/**
 * Aggregates annualized pay by position for charts.
 * SECURITY: compensation aggregates.
 * @returns `{ position, total }` annualized aggregates.
 * @throws On Supabase error.
 * @example
 * const byPos = await getEmployeeSalaryByPosition();
 */
export const getEmployeeSalaryByPosition = async () => {
    const { data, error } = await getSupabaseClient()
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
            annualSalary = pay_rate * BI_WEEKLY_PAY_PERIODS;
        } else if (pay_frequency === "HOURLY") {
            annualSalary = (pay_rate * 40) * 52;
        }

        salaryByPosition[position] = (salaryByPosition[position] || 0) + annualSalary;
    });

    return salaryByPosition;
}
