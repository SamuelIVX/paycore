"use client"

import * as React from "react"
import { Clock3, DollarSign, FileText, Heart } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type Stub = {
  period: string
  paidOn: string
  netPay: number
  grossPay: number
  taxes: number
  benefits: number
}

const paystubs: Stub[] = [
  {
    period: "Jan 16–31, 2026",
    paidOn: "1/31/2026",
    netPay: 3125,
    grossPay: 4166.67,
    taxes: 1041.67,
    benefits: 32,
  },
  {
    period: "Jan 1–15, 2026",
    paidOn: "1/15/2026",
    netPay: 3125,
    grossPay: 4166.67,
    taxes: 1041.67,
    benefits: 32,
  },
  {
    period: "Dec 16–31, 2025",
    paidOn: "12/31/2025",
    netPay: 3125,
    grossPay: 4166.67,
    taxes: 1041.67,
    benefits: 32,
  },
]

const money = (n: number) => `$${n.toFixed(2)}`

export default function PayStubsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Top summary cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Hours This Week</CardDescription>
                <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center">
                  <Clock3 className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <div className="text-xs text-muted-foreground mt-1">Target: 40 hours</div>
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

        {/* Main pay stubs section */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Pay Stubs</CardTitle>
            <CardDescription>View payment history and deductions</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {paystubs.map((stub) => (
              <div key={stub.period} className="rounded-xl bg-muted/20 p-4">
                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
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

                {/* Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Gross Pay:</span>
                    <span className="font-medium">{money(stub.grossPay)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Taxes (25%):</span>
                    <span className="font-medium text-red-600">-{money(stub.taxes)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Benefits:</span>
                    <span className="font-medium text-red-600">-{money(stub.benefits)}</span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Net Pay:</span>
                    <span className="font-semibold text-green-600">{money(stub.netPay)}</span>
                  </div>
                </div>
              </div>
            ))}

            {paystubs.length === 0 && (
              <div className="text-sm text-muted-foreground">No pay stubs found.</div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}