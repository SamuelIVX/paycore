import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { getCurrentEmployee } from "./employee";

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