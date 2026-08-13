/**
 * Browser-client benefit catalog CRUD and employee_benefits enrollment upserts.
 * SECURITY: enrollment ties to the authenticated employee via getCurrentEmployee.
 */
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { getCurrentEmployee } from "./employee";
import { TablesInsert, TablesUpdate } from "../interfaces/database.types";

/**
 * BenefitInsert type/interface.
 */
export type BenefitInsert = TablesInsert<"benefits">;
/**
 * BenefitUpdate type/interface.
 */
export type BenefitUpdate = TablesUpdate<"benefits">;

/**
 * Inserts a benefits catalog row (COMPANY or OPTIONAL).
 */
export const addBenefit = async (company_benefit: BenefitInsert) => {
    const supabase = createClient();
    const { error } = await supabase
        .from("benefits")
        .insert(company_benefit)

    if (error) {
        console.error("Error inserting a new company benefit", error)
        throw error;
    }
}

/**
 * Lists benefits where type=COMPANY.
 */
export const getCompanyBenefits = async () => {
    const supabase = createClient();

    const { data: company_benefits, error } = await supabase
        .from("benefits")
        .select("*")
        .eq('type', 'COMPANY')

    if (error) {
        console.error("Error fetching company benefits:", error);
        throw error;
    }

    return company_benefits
}

/**
 * Lists benefits where type=OPTIONAL.
 */
export const getOptionalBenefits = async () => {
    const supabase = createClient();

    const { data: optional_benefits, error } = await supabase
        .from("benefits")
        .select("*")
        .eq('type', 'OPTIONAL')

    if (error) {
        console.error("Error fetching optional benefits:", error);
        throw error;
    }

    return optional_benefits
}

/**
 * ACTIVE employee_benefits joined to OPTIONAL benefit rows for one employee.
 * @param supabaseClient - Optional server client (payroll path); else browser client.
 */
export const getActiveOptionalEmployeeBenefits = async (employee_id: string, supabaseClient?: SupabaseClient) => {
    const supabase = supabaseClient || createClient();

    const { data, error } = await supabase
        .from('employee_benefits')
        .select(`
            *,
            benefit:benefits!employee_benefits_benefit_id_fkey(*)
        `)
        .eq('employee_id', employee_id)
        .eq('status', 'ACTIVE');

    if (error) {
        console.error('Error fetching active optional employee benefits:', error);
        throw error;
    }

    const optionalBenefits = (data || []).filter((row: { benefit?: { type: string } | null }) => row.benefit?.type === 'OPTIONAL');

    return optionalBenefits;
}

/**
 * Upserts enrollment for the current employee on (employee_id, benefit_id).
 * SECURITY: derives employee_id from the auth session.
 */
export const upsertEmployeeBenefit = async ({
    benefit_id,
    status
}: {
    benefit_id: string;
    status: 'ACTIVE' | 'NOT_ENROLLED';
}) => {
    const supabase = createClient();

    const { employee } = await getCurrentEmployee();

    const { data, error } = await supabase
        .from('employee_benefits')
        .upsert({
            employee_id: employee.id,
            benefit_id,
            status,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'employee_id,benefit_id' });

    if (error) {
        console.error('Error upserting employee benefit:', error);
        throw error;
    }

    return data;
};

/**
 * Deletes a benefits catalog row by id.
 */
export const deleteBenefit = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
        .from("benefits")
        .delete()
        .eq("id", id)

    if (error) {
        console.error("Error deleting benefit", error)
        throw error;
    }
}

/**
 * Updates a benefits catalog row by id.
 */
export const updateBenefit = async (id: string, updates: BenefitUpdate) => {
    const supabase = createClient();
    const { error } = await supabase
        .from("benefits")
        .update(updates)
        .eq("id", id)

    if (error) {
        console.error("Error updating benefit", error)
        throw error;
    }
}

/**
 * Exact count of COMPANY benefits.
 */
export const getCompanyBenefitsCount = async () => {
    const supabase = createClient();

    const { count, error } = await supabase
        .from('benefits')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'COMPANY');

    if (error) {
        console.error('Error fetching company benefits count:', error);
        throw error;
    }

    return count || 0;
};

/**
 * Exact count of OPTIONAL benefits.
 */
export const getOptionalBenefitsCount = async () => {
    const supabase = createClient();

    const { count, error } = await supabase
        .from('benefits')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'OPTIONAL');

    if (error) {
        console.error('Error fetching optional benefits count:', error);
        throw error;
    }

    return count || 0;
};