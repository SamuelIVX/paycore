import React from "react"

export interface SummaryCardProps {
    title: string;
    value: string | number;
    description: string;
}

export interface SummaryCardsProps {
    company_count: number;
    monthly_deduction: number;
    annual_cost: number;
}

export interface OptionalBenefitsCardProps {
    selected_benefits: Record<string, boolean>;
    set_selected_benefits: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}