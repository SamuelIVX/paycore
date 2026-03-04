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
    type: "health" | "dental" | "vision" | "retirement" | "life" | "disability" | "wellness" | "other";
    provider: string;
    monthlyPrice: number;
    isCompanyProvided: boolean;
    coverage?: string;
}

export const BENEFIT_ICONS: Record<Benefit["type"], LucideIcon> = {
    health: Heart,
    dental: Sparkles,
    vision: Eye,
    retirement: Wallet,
    life: Shield,
    disability: Umbrella,
    wellness: Heart,
    other: Info
};