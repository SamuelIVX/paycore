"use client"

import { useEffect, useState } from "react"
import { FileText, TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getEmployeePaystubs } from "@/lib/supabase/paystubs"
import { formatPayPeriod, formatPaidOn } from "@/lib/utils"
import { PaystubInfoProps, PayStub } from "./types"

const money = (n: number) => `$${n.toFixed(2)}`

export function PaystubInfo({ title, value, valueClassName }: PaystubInfoProps) {
  return (
    <div className="flex justify-between items-center text-sm py-1">
      <span className="text-muted-foreground">{title}</span>
      <span className={`font-semibold tabular-nums ${valueClassName ?? ""}`}>{value}</span>
    </div>
  )
}

export default function PayStubsPage() {

  const [paystubs, setPaystubs] = useState<PayStub[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPaystubs() {
      try {
        setLoading(true)
        setLoadError(null)

        const paystubRows = await getEmployeePaystubs()

        const formattedPaystubs: PayStub[] = paystubRows.map((row) => {
          const payrollRun = Array.isArray(row.payroll_runs)
            ? row.payroll_runs[0]
            : row.payroll_runs

          const federalTax = Number(row.federal_tax ?? 0)
          const stateTax = Number(row.state_tax ?? 0)
          const socialSecurity = Number(row.social_security ?? 0)
          const taxes = federalTax + stateTax + socialSecurity
          const monthlyDeductions = Number(row.benefit_deductions ?? 0)

          return {
            id: row.id,
            period: formatPayPeriod(
              payrollRun?.pay_period_start ?? null,
              payrollRun?.pay_period_end ?? null
            ),
            paidOn: formatPaidOn(payrollRun?.run_date ?? row.created_at ?? null),
            netPay: Number(row.net_pay ?? 0),
            grossPay: Number(row.gross_pay ?? 0),
            taxes,
            benefits: monthlyDeductions,
          }
        })

        setPaystubs(formattedPaystubs)
      } catch (error) {
        console.error("Failed to load pay stubs:", error)
        setLoadError("Unable to load pay stubs. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadPaystubs()
  }, [])

  return (
    <div className="container mx-auto py-4">

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <CardTitle>Pay Stubs</CardTitle>
          </div>
          <CardDescription>View your payment history and deductions</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading && (
            <div aria-live="polite" className="text-sm text-muted-foreground">Loading pay stubs...</div>
          )}

          {paystubs.map((stub, index) => {
            const totalDeductions = stub.taxes + stub.benefits

            return (
              <Card key={stub.id} className="overflow-hidden shadow-none border transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:bg-primary/5">

                {/* Card header band */}
                <div className="flex items-center justify-between bg-muted/40 px-5 py-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{stub.period}</p>
                      <p className="text-xs text-muted-foreground">Paid {stub.paidOn}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {index === 0 && (
                      <Badge variant="secondary" className="text-xs">Most Recent</Badge>
                    )}
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Net Pay</p>
                      <p className="text-lg font-bold text-green-600">{money(stub.netPay)}</p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="flex gap-0 divide-x rounded-lg overflow-hidden border">

                    {/* Earnings */}
                    <div className="flex-1 bg-green-50/50 p-4">
                      <div className="flex items-center gap-1.5 mb-3">
                        <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-green-700">Earnings</span>
                      </div>
                      <PaystubInfo
                        title="Gross Pay"
                        value={money(stub.grossPay)}
                        valueClassName="text-green-600"
                      />
                    </div>

                    {/* Deductions */}
                    <div className="flex-1 bg-red-50/50 p-4">
                      <div className="flex items-center gap-1.5 mb-3">
                        <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-red-600">Deductions</span>
                      </div>
                      <PaystubInfo
                        title="Taxes"
                        value={`-${money(stub.taxes)}`}
                        valueClassName="text-red-500"
                      />
                      <PaystubInfo
                        title="Benefits"
                        value={`-${money(stub.benefits)}`}
                        valueClassName="text-red-500"
                      />
                      <Separator className="my-2" />
                      <PaystubInfo
                        title="Total Deductions"
                        value={`-${money(totalDeductions)}`}
                        valueClassName="text-red-600"
                      />
                    </div>

                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-100 px-4 py-2.5">
                    <span className="text-sm font-semibold text-green-900">Take-Home Pay</span>
                    <span className="text-base font-bold text-green-600">{money(stub.netPay)}</span>
                  </div>
                </CardContent>

              </Card>
            )
          })}

          {loadError && (
            <div role="alert" className="text-sm text-destructive">{loadError}</div>
          )}

          {!loading && !loadError && paystubs.length === 0 && (
            <div className="text-sm text-muted-foreground">No pay stubs found.</div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
