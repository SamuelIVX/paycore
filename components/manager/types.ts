import type React from "react";

export interface BenefitDetailsProps {
    title: string
    value: string
}

export interface BenefitSummaryCardProps {
    title: string
    icon: React.ReactNode
    count: number | string
    description: string
}