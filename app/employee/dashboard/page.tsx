"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Heart,
  Plus,
  TrendingUp,
  FileText
} from "lucide-react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/animate-ui/components/buttons/button"
import { Button as BaseButton } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { EmployeeStatCardProps } from "./types"
import Link from "next/link"

const weeklyTarget = 40

const chartConfig = {
  hours: {
    label: "Hours",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const hoursByDay = [
  { day: "Mon", hours: 8.0 },
  { day: "Tue", hours: 8.0 },
  { day: "Wed", hours: 7.5 },
  { day: "Thu", hours: 8.0 },
  { day: "Fri", hours: 0.0 },
]

const hoursThisWeek = hoursByDay.reduce((total, day) => total + day.hours, 0)

const timeEntries = [
  { id: "1", date: "2026-02-01", hoursWorked: 8, status: "submitted" },
  { id: "2", date: "2026-01-31", hoursWorked: 8, status: "approved" },
  { id: "3", date: "2026-01-30", hoursWorked: 7.5, status: "approved" },
];

export function EmployeeStatCard({ title, icon, value, description }: EmployeeStatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-white">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function EmployeeDashboardPage() {
  return (
    <div className="container mx-auto py-4">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 mt-4">
        <EmployeeStatCard
          title="Hours This Week"
          icon={<Clock className="h-4 w-4 text-blue-600" />}
          value={hoursThisWeek}
          description={`Target ${weeklyTarget} hours`}
        />

        <EmployeeStatCard
          title="Benefit Deductions"
          icon={<Heart className="h-4 w-4 text-red-600" />}
          value="$32.00"
          description="Per month"
        />

        <EmployeeStatCard
          title="Last Payment"
          icon={<DollarSign className="h-4 w-4 text-green-600" />}
          value="$3125.00"
          description="Han 16-31, 2026"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">This Week&apos;s Hours</CardTitle>
            <CardDescription>Daily breakdown of hours worked</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <BarChart data={hoursByDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={28}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="hours" fill="var(--color-hours)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>

            <div className="sr-only" aria-label="Daily hours worked this week">
              <ul>
                {hoursByDay.map((entry) => (
                  <li key={entry.day}>
                    {entry.day}: {entry.hours} hours
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Year-to-Date Earnings</CardTitle>
            <CardDescription>Total earnings in 2026</CardDescription>
          </CardHeader>

          <CardContent>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-4xl font-bold text-green-600">
                  $9,375
                </p>
                <p className="text-sm text-gray-600 mt-1">Net earnings</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">Paychecks</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Per Check</p>
                <p className="text-2xl font-bold">
                  $3125
                </p>
              </div>
            </div>

          </CardContent>

        </Card >

        <Card className="shadow-sm">

          <CardHeader className="flex flex-row items-start justify-between space-y-0">

            <div>
              <CardTitle className="text-base">Recent Timesheets</CardTitle>
              <CardDescription>Latest time entries</CardDescription>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Hours
            </Button>

          </CardHeader>

          <CardContent className="space-y-3">
            {timeEntries.slice(0, 4).map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${entry.status === "draft" ? "bg-orange-100" :
                    entry.status === "submitted" ? "bg-blue-100" : "bg-green-100"
                    }`}>
                    {entry.status === "draft" ? (
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                    ) : entry.status === "submitted" ? (
                      <Clock className="w-5 h-5 text-blue-600" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium dark:text-black">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {entry.hoursWorked} hours
                    </p>
                  </div>
                </div>
                <Badge variant={
                  entry.status === "draft" ? "outline" :
                    entry.status === "submitted" ? "secondary" :
                      "default"
                }>
                  {entry.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">

          <CardHeader>
            <CardTitle className="text-green-900">Quick Actions</CardTitle>
            <CardDescription>Common employee operations</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full justify-start bg-white hover:bg-gray-50 h-10 text-sm dark:text-black"
                  variant="outline">
                  <Clock className="w-5 h-5 mr-3" />
                  Submit Hours
                </Button>
              </DialogTrigger>
            </Dialog>

            <BaseButton
              variant="outline"
              className="w-full justify-start bg-white hover:bg-gray-50 h-10 text-sm dark:text-black"
              asChild
            >
              <Link href="/employee/benefits">
                <Heart className="w-5 h-5 mr-3" />
                Manage Benefits
              </Link>
            </BaseButton>

            <BaseButton
              variant="outline"
              className="w-full justify-start bg-white hover:bg-gray-50 h-10 text-sm dark:text-black"
              asChild
            >
              <Link href="/employee/paystubs">
                <FileText className="w-5 h-5 mr-3" />
                View Pay Stubs
              </Link>
            </BaseButton>

          </CardContent>

        </Card>

      </div >

    </div >
  )
}