"use client"

import * as React from "react"
import { Clock3, DollarSign, FileText, Heart } from "lucide-react"

import { getEmployeePaystubs } from "@/lib/supabase/payroll"
import { getWeeklyHours } from "@/lib/supabase/time-entries"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type PayStub = {
  id: string
  period: string
  paidOn: string
  netPay: number
  grossPay: number
  taxes: number
  benefits: number
}

const weeklyTarget = 40
const monthlyBenefits = 32

const money = (n: number) => `$${n.toFixed(2)}`

function formatPayPeriod(start?: string | null, end?: string | null) {
  if (!start || !end) return "Unknown period"

  const startDate = new Date(`${start}T12:00:00`)
  const endDate = new Date(`${end}T12:00:00`)

  const startText = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(startDate)

  const endText = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(endDate)

  return `${startText}–${endText}`
}

function formatPaidOn(date?: string | null) {
  if (!date) return "Unknown"

  const parsed = new Date(date)
  return new Intl.DateTimeFormat("en-US").format(parsed)
}

export default function PayStubsPage() {
  const [paystubs, setPaystubs] = React.useState<PayStub[]>([])
  const [hoursThisWeek, setHoursThisWeek] = React.useState(0)
  const [lastPaymentAmount, setLastPaymentAmount] = React.useState(0)
  const [lastPaymentPeriod, setLastPaymentPeriod] = React.useState("No payroll yet")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadPaystubs() {
      try {
        setLoading(true)

        const [paystubRows, weeklyEntries] = await Promise.all([
          getEmployeePaystubs(),
          getWeeklyHours(),
        ])

        const formattedPaystubs: PayStub[] = paystubRows.map((row) => {
          const payrollRun = Array.isArray(row.payroll_runs)
            ? row.payroll_runs[0]
            : row.payroll_runs

          const federalTax = Number(row.federal_tax ?? 0)
          const stateTax = Number(row.state_tax ?? 0)
          const socialSecurity = Number(row.social_security ?? 0)
          const taxes = federalTax + stateTax + socialSecurity

          return {
            id: row.id,
            period: formatPayPeriod(
              payrollRun?.pay_period_start ?? null,
              payrollRun?.pay_period_end ?? null
            ),
            paidOn: formatPaidOn(row.created_at ?? null),
            netPay: Number(row.net_pay ?? 0),
            grossPay: Number(row.gross_pay ?? 0),
            taxes,
            benefits: monthlyBenefits,
          }
        })

        setPaystubs(formattedPaystubs)

        if (formattedPaystubs.length > 0) {
          setLastPaymentAmount(formattedPaystubs[0].netPay)
          setLastPaymentPeriod(formattedPaystubs[0].period)
        } else {
          setLastPaymentAmount(0)
          setLastPaymentPeriod("No payroll yet")
        }

        const weeklyHoursTotal = weeklyEntries.reduce(
          (sum, entry) => sum + Number(entry.hours_worked ?? 0),
          0
        )

        setHoursThisWeek(weeklyHoursTotal)
      } catch (error) {
        console.error("Failed to load pay stubs:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPaystubs()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {loading && (
          <div className="text-sm text-muted-foreground">Loading pay stubs...</div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Hours This Week</CardDescription>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
                  <Clock3 className="h-4 w-4 text-blue-600" />
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
              <div className="text-2xl font-bold">{money(monthlyBenefits)}</div>
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
              <div className="text-2xl font-bold">{money(lastPaymentAmount)}</div>
              <div className="mt-1 text-xs text-muted-foreground">{lastPaymentPeriod}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Pay Stubs</CardTitle>
            <CardDescription>View payment history and deductions</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {paystubs.map((stub) => (
              <div key={stub.id} className="rounded-xl bg-muted/20 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                      <FileText className="h-4 w-4 text-green-700" />
                    </div>

                    <div className="leading-tight">
                      <div className="font-semibold">{stub.period}</div>
                      <div className="text-sm text-muted-foreground">
                        Paid on {stub.paidOn}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-semibold text-green-600">
                      {money(stub.netPay)}
                    </div>
                    <div className="text-xs text-muted-foreground">Net Pay</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Gross Pay:</span>
                    <span className="font-medium">{money(stub.grossPay)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Taxes:</span>
                    <span className="font-medium text-red-600">
                      -{money(stub.taxes)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Benefits:</span>
                    <span className="font-medium text-red-600">
                      -{money(stub.benefits)}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Net Pay:</span>
                    <span className="font-semibold text-green-600">
                      {money(stub.netPay)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {!loading && paystubs.length === 0 && (
              <div className="text-sm text-muted-foreground">No pay stubs found.</div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}