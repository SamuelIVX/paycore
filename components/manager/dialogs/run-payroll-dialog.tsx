"use client"

/**
 * Reusable Run Payroll Dialog component with period selection and date validation.
 */
import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowRight, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface RunPayrollDialogProps {
  trigger?: React.ReactNode
}

export interface PayPeriodOption {
  value: string
  label: string
}

/**
 * Generates sequential bi-weekly pay periods starting from a base date.
 * @param count - Number of 14-day periods to generate (defaults to 26).
 * @param startDateStr - ISO start date string (defaults to "2026-01-01").
 * @returns Array of PayPeriodOption with value and formatted display label.
 */
export function generatePayPeriods(count = 26, startDateStr = "2026-01-01"): PayPeriodOption[] {
  const periods: PayPeriodOption[] = []
  const [yearStr, monthStr, dayStr] = startDateStr.split("-")
  const startYear = parseInt(yearStr, 10)
  const startMonth = parseInt(monthStr, 10) - 1
  const startDay = parseInt(dayStr, 10)

  for (let i = 0; i < count; i++) {
    const periodStart = new Date(Date.UTC(startYear, startMonth, startDay + i * 14))
    const periodEnd = new Date(Date.UTC(startYear, startMonth, startDay + i * 14 + 13))

    const startISO = periodStart.toISOString().slice(0, 10)
    const endISO = periodEnd.toISOString().slice(0, 10)

    const startFormatted = periodStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    })
    const endFormatted = periodEnd.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })

    periods.push({
      value: `${startISO}_${endISO}`,
      label: `${startFormatted} - ${endFormatted}`,
    })
  }

  return periods
}

const DEFAULT_PAY_PERIODS = generatePayPeriods(26, "2026-01-01")

/**
 * Run Payroll Dialog modal with period selection and link navigation.
 * @param props - Custom trigger node or default Run Payroll button.
 * @returns Dialog modal component for selecting payroll periods.
 * @example
 * <RunPayrollDialog trigger={<Button>Run</Button>} />
 */
export function RunPayrollDialog({ trigger }: RunPayrollDialogProps) {
  const [open, setOpen] = useState(false)
  const [period, setPeriod] = useState("")

  const [startDate, endDate] = period ? period.split("_") : ["", ""]
  const isValidPeriod = Boolean(startDate && endDate)

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setPeriod("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="cursor-pointer">
            <DollarSign className="w-4 h-4 mr-2" />
            Run Payroll
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Run Payroll</DialogTitle>
          <DialogDescription>
            Process payroll for selected period
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="payPeriod">Pay Period</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger id="payPeriod">
                <SelectValue placeholder="Select pay period..." />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_PAY_PERIODS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          {!isValidPeriod ? (
            <Button disabled aria-disabled="true">
              Select Period to Run
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button asChild className="cursor-pointer">
              <Link href={`/manager/payroll-status?startDate=${startDate}&endDate=${endDate}`}>
                Run Payroll
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
