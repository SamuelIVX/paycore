"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Area,
  AreaChart,
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
  CalendarDays,
  Clock,
  DollarSign,
  Heart,
  LogOut,
  Plus,
  Shield,
  TrendingUp,
  User,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const hoursThisWeek = 0
const weeklyTarget = 40

const hoursByDay = [
  { day: "Mon", hours: 8.0 },
  { day: "Tue", hours: 8.0 },
  { day: "Wed", hours: 7.5 },
  { day: "Thu", hours: 8.0 },
  { day: "Fri", hours: 0.0 },
]

const earningsTrend = [
  { month: "Sep", net: 3125 },
  { month: "Oct", net: 3125 },
  { month: "Nov", net: 3125 },
  { month: "Dec", net: 3125 },
  { month: "Jan", net: 3125 },
  { month: "Feb", net: 3125 },
]

const timesheets = [
  { date: "Sat, Jan 31", hours: 8, status: "submitted" as const },
  { date: "Fri, Jan 30", hours: 8, status: "approved" as const },
  { date: "Thu, Jan 29", hours: 7.5, status: "approved" as const },
]

function StatusBadge({ status }: { status: "submitted" | "approved" }) {
  if (status === "approved") {
    return (
      <Badge className="bg-black text-white hover:bg-black/90 rounded-full px-3 py-1">
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

export default function EmployeeDashboardPage() {
  const router = useRouter()
  const pathname = usePathname()
  const navLinks = [
    { href: "/employee/dashboard", label: "Dashboard" },
    { href: "/employee/dashboard/benefits", label: "Benefits" },
    { href: "/employee/paystubs", label: "Pay Stubs" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-green-600 text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>

            <div className="leading-tight">
              <div className="font-semibold">Employee Dashboard</div>
              <div className="text-xs text-muted-foreground">John Smith</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </nav>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => router.push("/")}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Hours This Week</CardDescription>
                <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{hoursThisWeek}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Target: {weeklyTarget} hours
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Benefit Deductions</CardDescription>
                <div className="h-9 w-9 rounded-full bg-red-50 flex items-center justify-center">
                  <Heart className="h-4 w-4 text-red-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$32.00</div>
              <div className="text-xs text-muted-foreground mt-1">Per month</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Last Payment</CardDescription>
                <div className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3125.00</div>
              <div className="text-xs text-muted-foreground mt-1">Jan 16–31, 2026</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Uniform Grid */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Row 1 */}
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
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--background))",
                    }}
                  />
                  <Bar dataKey="hours" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Year-to-Date Earnings</CardTitle>
                <CardDescription>Total earnings in 2026</CardDescription>
              </div>
              <div className="h-11 w-11 rounded-full bg-green-100 flex items-center justify-center">
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

          {/* Row 2 */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Recent Timesheets</CardTitle>
                <CardDescription>Latest time entries</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Hours
              </Button>
            </CardHeader>

            <CardContent className="space-y-3">
              {timesheets.map((t, idx) => (
                <div key={t.date}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <CalendarDays className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="leading-tight">
                        <div className="text-sm font-medium">{t.date}</div>
                        <div className="text-xs text-muted-foreground">{t.hours} hours</div>
                      </div>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                  {idx !== timesheets.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Earnings Trend</CardTitle>
              <CardDescription>Net pay over last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsTrend}>
                  <defs>
                    <linearGradient id="fillNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopOpacity={0.25} />
                      <stop offset="100%" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={40} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--background))",
                    }}
                  />
                  <Area type="monotone" dataKey="net" strokeWidth={2} fill="url(#fillNet)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Row 3 */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
              <CardDescription>Employment overview</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-blue-50/70 p-3">
                <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-700" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs text-muted-foreground">Position</div>
                  <div className="text-sm font-semibold">Software Engineer</div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-purple-50/70 p-3">
                <div className="h-9 w-9 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-purple-700" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs text-muted-foreground">Tenure</div>
                  <div className="text-sm font-semibold">2 years, 1 month</div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-pink-50/70 p-3">
                <div className="h-9 w-9 rounded-lg bg-pink-100 flex items-center justify-center">
                  <Heart className="h-4 w-4 text-pink-700" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs text-muted-foreground">Benefits Enrolled</div>
                  <div className="text-sm font-semibold">2 optional plans</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-green-200 bg-green-50/40">
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-background"
                onClick={() => router.push("/employee/timesheets/new")}
              >
                <Clock className="h-4 w-4" />
                Submit Hours
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-background"
                onClick={() => router.push("/employee/dashboard/benefits")}
              >
                <Heart className="h-4 w-4" />
                Manage Benefits
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-background"
                onClick={() => router.push("/employee/paystubs")}
              >
                <ArrowUpRight className="h-4 w-4" />
                View Pay Stubs
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
