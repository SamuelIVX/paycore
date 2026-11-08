/**
 * Employee-facing UI: constants.
 */
import { BENEFIT_ICONS } from "@/lib/constants/benefits"

/**
 * Benefit type/interface.
 */
export type Benefit = {
  title: string
  description: string
  provider: string
  coverage: string
  type: string
  tag: "Company Provided" | "Optional"
  monthlyCost?: number
}

export { BENEFIT_ICONS }
