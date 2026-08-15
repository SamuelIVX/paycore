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
 * @param company_benefit - Insert payload for the benefits table.
 * @returns Inserted row data from Supabase.
 * @throws On Supabase error.
 * @example
 * await addBenefit({ name: "Dental", type: "OPTIONAL", monthly_cost: 40 });
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
 * @returns COMPANY benefit rows.
 * @throws On Supabase error.
 * @example
 * const company = await getCompanyBenefits();
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
 * @returns OPTIONAL benefit rows.
 * @throws On Supabase error.
 * @example
 * const optional = await getOptionalBenefits();
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
 * @param employee_id - Target employee UUID.
 * @param supabaseClient - Optional server client (payroll path); else browser client.
 * @returns Active optional enrollments with nested benefit.
 * @throws On Supabase error.
 * @example
 * const rows = await getActiveOptionalEmployeeBenefits(employeeId, serverClient);
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
 * @param args.benefit_id - Catalog benefit UUID.
 * @param args.status - ACTIVE or NOT_ENROLLED.
 * @returns Upsert result from Supabase.
 * @throws If unauthenticated or Supabase fails.
 * @example
 * await upsertEmployeeBenefit({ benefit_id, status: "ACTIVE" });
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
 * @param id - Benefits table UUID.
 * @throws On Supabase error.
 * @example
 * await deleteBenefit(benefitId);
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
 * @param id - Benefits table UUID.
 * @param updates - Partial benefit fields to patch.
 * @returns Updated row data.
 * @throws On Supabase error.
 * @example
 * await updateBenefit(id, { monthly_cost: 55 });
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
 * @param supabase - Optional Supabase client; falls back to module-scope browser client.
 * @returns Count integer (head-only query).
 * @throws On Supabase error.
 * @example
 * const n = await getCompanyBenefitsCount();
 * const n = await getCompanyBenefitsCount(serverClient);
 */
export const getCompanyBenefitsCount = async (supabase?: SupabaseClient) => {
    const client = supabase || createClient();

    const { count, error } = await client
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
 * @param supabase - Optional Supabase client; falls back to module-scope browser client.
 * @returns Count integer (head-only query).
 * @throws On Supabase error.
 * @example
 * const n = await getOptionalBenefitsCount();
 * const n = await getOptionalBenefitsCount(serverClient);
 */
export const getOptionalBenefitsCount = async (supabase?: SupabaseClient) => {
    const client = supabase || createClient();

    const { count, error } = await client
        .from('benefits')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'OPTIONAL');

    if (error) {
        console.error('Error fetching optional benefits count:', error);
        throw error;
    }

    return count || 0;
};