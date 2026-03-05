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