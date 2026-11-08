/**
 * Manager-facing UI: SummaryCards.
 */
import { StatCard } from "@/components/ui/stat-card"
import { BenefitSummaryCardProps } from "../types"
import {
  Heart,
  TrendingUp,
  DollarSign,
} from "lucide-react"
import { SummaryCardsProps } from "./types"
import { formatCurrency } from "@/utils/formatCurrency"

/**
 * Benefit Summary Card presentational component.
 */
export function BenefitSummaryCard({ title, icon, count, description }: BenefitSummaryCardProps) {
  return (
    <StatCard
      title={title}
      icon={icon}
      value={count}
      description={description}
    />
  )
}

/**
 * Summary Cards presentational component.
 */
export default function SummaryCards({
  companyBenefitsCount,
  optionalBenefitsCount,
  avgDeductions,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
      <BenefitSummaryCard
        title="Company Benefits"
        icon={<Heart className="h-5 w-5 text-blue-500 dark:text-blue-400" />}
        count={companyBenefitsCount ?? "—"}
        description="Provided to all employees"
      />

      <BenefitSummaryCard
        title="Optional Benefits"
        icon={<TrendingUp className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />}
        count={optionalBenefitsCount ?? "—"}
        description="Available for enrollment"
      />

      <BenefitSummaryCard
        title="Average Monthly Deductions"
        icon={<DollarSign className="h-5 w-5 text-purple-500 dark:text-purple-400" />}
        count={avgDeductions ? formatCurrency(avgDeductions) : "—"}
        description="Per enrolled employee"
      />
    </div>
  )
}
