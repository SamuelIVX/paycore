import type { LucideIcon } from "lucide-react";
import type { Benefit } from "./data";
import {
    Heart,
    Sparkles,
    Eye,
    Wallet,
    Shield,
    Umbrella,
    Info
} from "lucide-react"

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