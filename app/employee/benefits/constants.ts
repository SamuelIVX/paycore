import type { LucideIcon } from "lucide-react";
import { Stethoscope, Smile, Shield, BadgeCheck } from "lucide-react"

export type Benefit = {
    title: string
    description: string
    provider: string
    coverage: string
    tag: "Company Provided" | "Optional"
    type: "health" | "dental" | "retirement" | "life" | "disability" | "wellness" | "other";
    monthlyCost?: number
}

export const BENEFIT_ICONS: Record<Benefit["type"], LucideIcon> = {
    health: Stethoscope,
    dental: Smile,
    retirement: BadgeCheck,
    life: Shield,
    disability: Shield,
    wellness: Smile,
    other: Shield,
};