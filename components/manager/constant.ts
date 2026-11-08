/**
 * Manager-facing UI: constant.
 */
import { BENEFIT_ICONS, BenefitType } from "@/lib/constants/benefits"

/**
 * Benefit type/interface.
 */
export interface Benefit {
  id: string
  name: string
  description: string
  type: BenefitType
  provider: string
  monthlyPrice: number
  isCompanyProvided: boolean
  coverage?: string
}

export { BENEFIT_ICONS }
