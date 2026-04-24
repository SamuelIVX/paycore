import { createClient } from "@/utils/supabase/client";
import { TablesInsert } from "../interfaces/database.types";

const supabase = createClient();
type EmployeeInsert = TablesInsert<"employees">;

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

export const getActiveEmployeesCount = async () => {
    const { count, error } = await supabase
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("employment_status", "ACTIVE");

    if (error) {
        console.error("Error fetching active employees count:", error);
        throw error;
    }

    return count || 0;
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

        if (pay_frequency === "SALARY") {
            totalAnnual += pay_rate * 26;
        } else if (pay_frequency === "BI_WEEKLY") {
            totalAnnual += pay_rate * 26;
        } else if (pay_frequency === "HOURLY") {
            totalAnnual += pay_rate * 40 * 26;
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