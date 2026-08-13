/**
 * Employee-facing UI: types.
 */
import React from "react"
import type { EligibilityResult } from "@/lib/benefits/eligibility"

/**
 * SummaryCardProps type/interface.
 */
export interface SummaryCardProps {
    title: string;
    value: string | number;
    color: string;
    description: string;
}

/**
 * SummaryCardsProps type/interface.
 */
export interface SummaryCardsProps {
    company_count: number;
    optional_count: number;
    monthly_deduction?: number;
}

/**
 * OptionalBenefitsCardProps type/interface.
 */
export interface OptionalBenefitsCardProps {
    selected_benefits: Record<string, boolean>;
    set_selected_benefits: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    eligibility?: EligibilityResult;
}