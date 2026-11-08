/**
 * Centralized benefit icon mapping and shared benefit definitions.
 */
import type { LucideIcon } from "lucide-react"
import {
  Eye,
  Heart,
  Info,
  Shield,
  Sparkles,
  Umbrella,
  Wallet,
} from "lucide-react"

export type BenefitType =
  | "Health"
  | "Dental"
  | "Vision"
  | "Retirement"
  | "Life"
  | "Disability"
  | "Wellness"
  | "Other"

export const BENEFIT_ICONS: Record<string, LucideIcon> = {
  Health: Heart,
  Dental: Sparkles,
  Vision: Eye,
  Retirement: Wallet,
  Life: Shield,
  Disability: Umbrella,
  Wellness: Heart,
  Other: Info,
}
