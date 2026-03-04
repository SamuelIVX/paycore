"use client"

import Link from "next/link"
import { ArrowLeft, FileText, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const paystubRows = [
  { period: "Jan 16 - Jan 31, 2026", net: "$3,125.00" },
  { period: "Jan 1 - Jan 15, 2026", net: "$3,125.00" },
  { period: "Dec 16 - Dec 31, 2025", net: "$3,125.00" },
]

export default function EmployeePaystubsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">Pay Stubs</h1>
            <p className="text-xs text-muted-foreground">View and download previous pay stubs</p>
          </div>

          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/employee/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/employee/dashboard/benefits">Benefits</Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link href="/employee/paystubs">Pay Stubs</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/employee/dashboard" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Recent Pay History
            </CardTitle>
            <CardDescription>Most recent payroll periods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {paystubRows.map((row) => (
              <div
                key={row.period}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{row.period}</p>
                  <p className="text-xs text-muted-foreground">Net pay: {row.net}</p>
                </div>

                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
