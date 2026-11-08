'use client'

/**
 * Manager-facing UI: quick-actions-card.
 */
import { DollarSign, FileCheck, Heart, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { AddEmployeeDialog } from "@/components/manager/dialogs/add-employee-dialog"
import { RunPayrollDialog } from "@/components/manager/dialogs/run-payroll-dialog"

/**
 * Quick Action Card presentational component.
 * @returns The rendered QuickActionCard UI.
 */
export default function QuickActionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common payroll management tasks</CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4">
        <AddEmployeeDialog
          trigger={
            <Button className="h-24 flex flex-col gap-2 cursor-pointer" variant="outline">
              <UserPlus className="w-8 h-8 text-primary" />
              <span>Add Employee</span>
            </Button>
          }
        />

        <RunPayrollDialog
          trigger={
            <Button className="h-24 flex flex-col gap-2 cursor-pointer" variant="outline">
              <DollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              <span>Run Payroll</span>
            </Button>
          }
        />

        <Button className="h-24 flex flex-col gap-2 cursor-pointer" variant="outline" asChild>
          <Link href="/manager/payroll-records-table">
            <FileCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span>Approve Payroll</span>
          </Link>
        </Button>

        <Button className="h-24 flex flex-col gap-2 cursor-pointer" variant="outline" asChild>
          <Link href="/manager/benefits">
            <Heart className="w-8 h-8 text-rose-500 dark:text-rose-400" />
            <span>View Benefits</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
