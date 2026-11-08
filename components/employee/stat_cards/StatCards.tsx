/**
 * Employee-facing UI: StatCards.
 */
import {
  Clock,
  DollarSign,
  Heart,
} from "lucide-react"
import { StatCard } from "@/components/ui/stat-card"
import { EmployeeStatCardProps, HoursByDayProps } from "./types"

/**
 * Employee Stat Card presentational component.
 */
export function EmployeeStatCard({ title, icon, value, description }: EmployeeStatCardProps) {
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
 * Employee Stat Cards presentational component.
 */
export default function EmployeeStatCards({ hoursThisWeek, weeklyTarget }: HoursByDayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 mt-4">
      <EmployeeStatCard
        title="Hours This Week"
        icon={<Clock className="h-5 w-5 text-blue-500 dark:text-blue-400" />}
        value={hoursThisWeek}
        description={`Target ${weeklyTarget} hours`}
      />

      <EmployeeStatCard
        title="Benefit Deductions"
        icon={<Heart className="h-5 w-5 text-rose-500 dark:text-rose-400" />}
        value="$32.00"
        description="Per month"
      />

      <EmployeeStatCard
        title="Last Payment"
        icon={<DollarSign className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />}
        value="$3,125.00"
        description="Jan 16-31, 2026"
      />
    </div>
  )
}
