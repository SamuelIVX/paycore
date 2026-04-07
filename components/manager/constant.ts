import type { LucideIcon } from "lucide-react";
import {
    Heart,
    Sparkles,
    Eye,
    Wallet,
    Shield,
    Umbrella,
    Info
} from "lucide-react"

export interface Benefit {
    id: string;
    name: string;
    description: string;
    type: "Health" | "Dental" | "Vision" | "Retirement" | "Life" | "Disability" | "Wellness" | "Other";
    provider: string;
    monthlyPrice: number;
    isCompanyProvided: boolean;
    coverage?: string;
}

export const BENEFIT_ICONS: Record<Benefit["type"], LucideIcon> = {
    Health: Heart,
    Dental: Sparkles,
    Vision: Eye,
    Retirement: Wallet,
    Life: Shield,
    Disability: Umbrella,
    Wellness: Heart,
    Other: Info
};