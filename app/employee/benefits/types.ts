export interface BenefitOption {
    id: string;
    benefit: string;
    monthly_cost?: number | null;
    type: string;
    [key: string]: unknown;
}

export interface EmployeeBenefit {
    benefit_id: string;
    status: 'ACTIVE' | 'NOT_ENROLLED';
    benefit?: {
        id: string;
        [key: string]: unknown;
    } | null;
    [key: string]: unknown;
}