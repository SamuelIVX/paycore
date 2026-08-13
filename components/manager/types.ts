/**
 * Manager-facing UI: types.
 */
import type React from "react";

/**
 * BenefitDetailsProps type/interface.
 */
export interface BenefitDetailsProps {
    title: string
    value: string
}

/**
 * BenefitSummaryCardProps type/interface.
 */
export interface BenefitSummaryCardProps {
    title: string
    icon: React.ReactNode
    count: number | string
    description: string
}