"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PaystubInfoProps } from "./types"
import { FileText, TrendingDown, TrendingUp } from "lucide-react"

const payStubsData = [
  { id: "1", period: "Jan 16-31, 2026", grossPay: 4166.67, date: "2026-02-01" },
  { id: "2", period: "Jan 1-15, 2026", grossPay: 9482.23, date: "2026-01-16" },
  { id: "3", period: "Dec 16-31, 2025", grossPay: 2230.23, date: "2026-01-01" },
]

const TAX_RATE = 0.25
const benefitDeductions = 32

const payStubs = payStubsData.map(stub => ({
  ...stub,
  netPay: stub.grossPay - (stub.grossPay * TAX_RATE) - benefitDeductions
}))

export function PaystubInfo({ title, value, valueClassName }: PaystubInfoProps) {
  return (
    <div className="flex justify-between items-center text-sm py-1">
      <span className="text-muted-foreground">{title}</span>
      <span className={`font-semibold tabular-nums ${valueClassName ?? ""}`}>{value}</span>
    </div>
  )
}

export default function PayStubsPage() {
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
          {payStubs.map((stub, index) => {
            const taxes = stub.grossPay * 0.25
            const totalDeductions = taxes + benefitDeductions

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
                      <p className="text-xs text-muted-foreground">
                        Paid {new Date(`${stub.date}T00:00:00Z`).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "UTC",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {index === 0 && (
                      <Badge variant="secondary" className="text-xs">Most Recent</Badge>
                    )}
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Net Pay</p>
                      <p className="text-lg font-bold text-green-600">${stub.netPay.toFixed(2)}</p>
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
                        value={`$${stub.grossPay.toFixed(2)}`}
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
                        title="Federal Taxes (25%)"
                        value={`-$${taxes.toFixed(2)}`}
                        valueClassName="text-red-500"
                      />
                      <PaystubInfo
                        title="Benefits"
                        value={`-$${benefitDeductions.toFixed(2)}`}
                        valueClassName="text-red-500"
                      />
                      <Separator className="my-2" />
                      <PaystubInfo
                        title="Total Deductions"
                        value={`-$${totalDeductions.toFixed(2)}`}
                        valueClassName="text-red-600"
                      />
                    </div>

                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-100 px-4 py-2.5">
                    <span className="text-sm font-semibold text-green-900">Take-Home Pay</span>
                    <span className="text-base font-bold text-green-600">${stub.netPay.toFixed(2)}</span>
                  </div>
                </CardContent>

              </Card>
            )
          })}
        </CardContent>
      </Card>

    </div>
  )
}
