"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Heart,
  Plus,
  TimerReset,
  TrendingUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar as DateCalendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const weeklyTarget = 40

const initialHoursByDay = [
  { day: "Mon", hours: 8.0 },
  { day: "Tue", hours: 8.0 },
  { day: "Wed", hours: 7.5 },
  { day: "Thu", hours: 8.0 },
  { day: "Fri", hours: 0.0 },
]

const initialTimesheets = [
  { date: "Sat, Jan 31", hours: 8, status: "submitted" as const },
  { date: "Fri, Jan 30", hours: 8, status: "approved" as const },
  { date: "Thu, Jan 29", hours: 7.5, status: "approved" as const },
]

function StatusBadge({ status }: { status: "submitted" | "approved" }) {
  if (status === "approved") {
    return (
      <Badge className="rounded-full bg-black px-3 py-1 text-white hover:bg-black/90">
        approved
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="rounded-full px-3 py-1">
      submitted
    </Badge>
  )
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date)
}

function getShortDay(date: Date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
}

export default function EmployeeDashboardPage() {
  const router = useRouter()

  const [hoursByDay, setHoursByDay] = React.useState(initialHoursByDay)
  const [timesheets, setTimesheets] = React.useState(initialTimesheets)
  const [submitHoursOpen, setSubmitHoursOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date(2026, 2, 11))
  const [hoursWorked, setHoursWorked] = React.useState("8.0")

  const hoursThisWeek = hoursByDay.reduce((total, day) => total + day.hours, 0)

  function handleRecordHours() {
    if (!selectedDate) return

    const parsedHours = Number(hoursWorked)

    if (Number.isNaN(parsedHours) || parsedHours < 0) return

    const formattedDate = formatDisplayDate(selectedDate)
    const shortDay = getShortDay(selectedDate)

    setTimesheets((prev) => [
      {
        date: formattedDate,
        hours: parsedHours,
        status: "submitted",
      },
      ...prev,
    ])

    setHoursByDay((prev) =>
      prev.map((entry) =>
        entry.day === shortDay ? { ...entry, hours: parsedHours } : entry
      )
    )

    setSubmitHoursOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Hours This Week</CardDescription>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{hoursThisWeek}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Target: {weeklyTarget} hours
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Benefit Deductions</CardDescription>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
                  <Heart className="h-4 w-4 text-red-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$32.00</div>
              <div className="mt-1 text-xs text-muted-foreground">Per month</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Last Payment</CardDescription>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3125.00</div>
              <div className="mt-1 text-xs text-muted-foreground">Jan 16–31, 2026</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">This Week&apos;s Hours</CardTitle>
              <CardDescription>Daily breakdown of hours worked</CardDescription>
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hoursByDay}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={28} />
                  <Tooltip />
                  <Bar dataKey="hours" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

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
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Year-to-Date Earnings</CardTitle>
                <CardDescription>Total earnings in 2026</CardDescription>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-700" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-green-700">$9,375</div>
                <div className="text-xs text-muted-foreground">Net earnings</div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Paychecks</div>
                  <div className="text-lg font-semibold">3</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Avg. Per Check</div>
                  <div className="text-lg font-semibold">$3125</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Recent Timesheets</CardTitle>
                <CardDescription>Your latest time entries</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setSubmitHoursOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Hours
              </Button>
            </CardHeader>

            <CardContent className="space-y-3">
              {timesheets.map((t, idx) => (
                <div key={`${t.date}-${idx}`}>
                  <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          t.status === "approved" ? "bg-green-100" : "bg-blue-50"
                        }`}
                      >
                        {t.status === "approved" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="leading-tight">
                        <div className="text-sm font-medium">{t.date}</div>
                        <div className="text-xs text-muted-foreground">{t.hours} hours</div>
                      </div>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                  {idx !== timesheets.length - 1 && <div className="h-2" />}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Quick Stats</CardTitle>
                <CardDescription>Your employment overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 rounded-xl bg-blue-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Position</div>
                    <div className="text-lg font-semibold">Software Engineer</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-purple-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Tenure</div>
                    <div className="text-lg font-semibold">2 years, 1 month</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-pink-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
                    <Heart className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Benefits Enrolled</div>
                    <div className="text-lg font-semibold">2 optional plans</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-background"
                  onClick={() => setSubmitHoursOpen(true)}
                >
                  <TimerReset className="h-4 w-4" />
                  Submit Hours
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-background"
                  onClick={() => router.push("/employee/benefits")}
                >
                  <Heart className="h-4 w-4" />
                  Manage Benefits
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-background"
                  onClick={() => router.push("/employee/paystubs")}
                >
                  <FileText className="h-4 w-4" />
                  View Pay Stubs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={submitHoursOpen} onOpenChange={setSubmitHoursOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Submit Hours Worked</DialogTitle>
            <DialogDescription>
              Record your hours for a specific date
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <div className="rounded-md border p-3">
                <DateCalendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="hours-worked" className="text-sm font-medium">
                Hours Worked
              </label>
              <Input
                id="hours-worked"
                type="number"
                step="0.5"
                min="0"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                placeholder="8.0"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleRecordHours}>Record Hours</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}