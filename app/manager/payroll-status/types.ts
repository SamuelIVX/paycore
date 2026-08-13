/**
 * Prop types for payroll status section/status cards.
 */
import type React from "react";

/**
 * StatusCardProps type/interface.
 */
export interface StatusCardProps {
    text: {
        title: string
        description: string
    }
    color: {
        border?: string
        bg?: string
    }
    icon: React.ReactNode
    children?: React.ReactNode
}

/**
 * PayrollSectionProps type/interface.
 */
export interface PayrollSectionProps {
    title: string
    value: string | number
    icon: React.ReactNode
    color?: string
}