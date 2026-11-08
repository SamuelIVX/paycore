/**
 * Manager-facing UI: Statcards.
 */
import { StatCard } from "@/components/ui/stat-card"
import { ManagerStatCardProps, ManagerStatCardsProps } from "./types"
import { Users, Clock, DollarSign } from "lucide-react"
import { formatCurrency } from "@/utils/formatCurrency"

/**
 * Manager Stat Card presentational component.
 */
export function ManagerStatCard({ title, icon, value, description }: ManagerStatCardProps) {
  return (
    <StatCard
      title={title}
      icon={icon}
      value={value}
      description={description}
    />
  )
}

/**
 * Manager Stat Cards presentational component.
 */
export default function ManagerStatCards({ totalEmployees, totalAnnualPayroll }: ManagerStatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
      <ManagerStatCard
        title="Total Employees"
        icon={<Users className="text-blue-500 dark:text-blue-400 h-5 w-5" />}
        value={totalEmployees ?? "—"}
        description="Active in system"
      />

      <ManagerStatCard
        title="Pending Approvals"
        icon={<Clock className="text-amber-500 dark:text-amber-400 h-5 w-5" />}
        value="2"
        description="Payroll Records"
      />

      <ManagerStatCard
        title="Total Payroll"
        icon={<DollarSign className="text-emerald-500 dark:text-emerald-400 h-5 w-5" />}
        value={totalAnnualPayroll != null ? formatCurrency(totalAnnualPayroll) : "—"}
        description="Annual Salary"
      />
    </div>
  )
}
