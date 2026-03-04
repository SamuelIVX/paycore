"use client"

import Link from "next/link"
import { Heart, Shield, ArrowLeft, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmployeeBenefitsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">Benefits</h1>
            <p className="text-xs text-muted-foreground">Employee benefits overview</p>
          </div>

          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/employee/dashboard">Dashboard</Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link href="/employee/dashboard/benefits">Benefits</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
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

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Health Plan
              </CardTitle>
              <CardDescription>Coverage status and monthly deduction</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Status: Active</p>
              <p className="text-sm text-muted-foreground">$32.00 deducted monthly</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Retirement
              </CardTitle>
              <CardDescription>Current contribution elections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">401(k): 6% contribution</p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Employer match enabled
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
