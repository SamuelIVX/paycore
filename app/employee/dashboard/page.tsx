"use client"

import EmployeeStatCards from "../stat-cards/page"
import GridContent from "../grid-content/page"
import { type ChartConfig } from "@/components/ui/chart"
import type { TimeEntry } from "../grid-content/grid-cards/types"

const chartConfig = {
  hours: {
    label: "Hours",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const timeEntries: TimeEntry[] = [
  { id: "1", date: "2026-02-01", hoursWorked: 8, status: "submitted" },
  { id: "2", date: "2026-01-31", hoursWorked: 8, status: "approved" },
  { id: "3", date: "2026-01-30", hoursWorked: 7.5, status: "approved" },
];

const hoursByDay = [
  { day: "Mon", hours: 8.0 },
  { day: "Tue", hours: 8.0 },
  { day: "Wed", hours: 7.5 },
  { day: "Thu", hours: 8.0 },
  { day: "Fri", hours: 0.0 },
]

export default function EmployeeDashboardPage() {
  return (
    <div className="container mx-auto py-4">

      <EmployeeStatCards hours_by_day={hoursByDay} />

      <GridContent chart_config={chartConfig} hours_by_day={hoursByDay} time_entries={timeEntries} />

    </div>
  )
}