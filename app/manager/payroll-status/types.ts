import type React from "react";

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

export interface PayrollSectionProps {
    title: string
    value: string | number
    icon: React.ReactNode
    color?: string
}