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
import { Textarea } from "@/components/ui/textarea"

export interface RunPayrollDialogProps {
  trigger?: React.ReactNode
}

export function RunPayrollDialog({ trigger }: RunPayrollDialogProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const isValidPeriod = Boolean(startDate && endDate)

  return (
    <Dialog>
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
            <Select
              onValueChange={(value) => {
                const [start, end] = value.split("_")
                setStartDate(start || "")
                setEndDate(end || "")
              }}
            >
              <SelectTrigger id="payPeriod">
                <SelectValue placeholder="Select pay period..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026-01-01_2026-01-14">Jan 1 - Jan 14, 2026</SelectItem>
                <SelectItem value="2026-01-15_2026-01-28">Jan 15 - Jan 28, 2026</SelectItem>
                <SelectItem value="2026-01-29_2026-02-11">Jan 29 - Feb 11, 2026</SelectItem>
                <SelectItem value="2026-02-12_2026-02-25">Feb 12 - Feb 25, 2026</SelectItem>
                <SelectItem value="2026-02-26_2026-03-11">Feb 26 - Mar 11, 2026</SelectItem>
                <SelectItem value="2026-03-12_2026-03-25">Mar 12 - Mar 25, 2026</SelectItem>
                <SelectItem value="2026-03-26_2026-04-08">Mar 26 - Apr 8, 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payrollNotes">Notes (Optional)</Label>
            <Textarea id="payrollNotes" placeholder="Add any payroll processing notes..." />
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
