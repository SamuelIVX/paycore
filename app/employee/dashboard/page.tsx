"use client"

import * as React from "react"

import { type ChartConfig } from "@/components/ui/chart"
import EmployeeStatCards from "@/components/employee/stat_cards/StatCards"
import GridContent from "@/components/employee/grid-content/GridContent"
import type { HoursByDay, TimeEntry } from "@/components/employee/grid-content/grid-cards/types"

const chartConfig = {
  hours: {
    label: "Hours",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const initialHoursByDay = [
  { day: "Mon", hours: 8.0 },
  { day: "Tue", hours: 8.0 },
  { day: "Wed", hours: 7.5 },
  { day: "Thu", hours: 8.0 },
  { day: "Fri", hours: 0.0 },
]

const initialTimesheets = [
  { id: "1", date: "2026-01-31", hoursWorked: 8, status: "PENDING" as const },
  { id: "2", date: "2026-01-30", hoursWorked: 8, status: "APPROVED" as const },
  { id: "3", date: "2026-01-29", hoursWorked: 7.5, status: "APPROVED" as const },
]

const weeklyTarget = 40

export default function EmployeeDashboardPage() {

  const [hoursByDay, setHoursByDay] = React.useState<HoursByDay[]>(initialHoursByDay)
  const [timesheets, setTimesheets] = React.useState<TimeEntry[]>(initialTimesheets)
  const hoursThisWeek = hoursByDay.reduce((total, day) => total + day.hours, 0)

  return (

    <div className="container mx-auto py-4">

      <EmployeeStatCards
        hoursThisWeek={hoursThisWeek}
        weeklyTarget={weeklyTarget}
      />

      <GridContent
        timesheets={timesheets}
        setTimesheets={setTimesheets}
        hoursByDay={hoursByDay}
        setHoursByDay={setHoursByDay}
        chartConfig={chartConfig}
      />
    </div>
  )
}