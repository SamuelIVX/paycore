import type { LucideIcon } from "lucide-react";
import {
    BadgeCheck,
    Heart,
    Info,
    Shield,
    Smile,
    Stethoscope,
} from "lucide-react"

export type Benefit = {
    title: string
    description: string
    provider: string
    coverage: string
    type: string
    tag: "Company Provided" | "Optional"
    monthlyCost?: number
}

export const BENEFIT_ICONS: Record<string, LucideIcon> = {
    Health: Heart,
    Dental: Smile,
    Retirement: BadgeCheck,
    Life: Shield,
    Disability: Stethoscope,
    Vision: Stethoscope,
    Wellness: Heart,
    Other: Info,
};