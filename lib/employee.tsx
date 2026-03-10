import { createClient } from "@/utils/supabase/client";
import { TablesInsert } from "./interfaces/database.types";

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