/**
 * Manager-facing UI: recent-activity.
 */
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react"

const payrollRecords = [
  { id: "1", employeeName: "John Smith", grossPay: 7083.33, taxes: 1770.83, benefitDeductions: 32.00, netPay: 5280.50, status: "pending", date: "2026-02-01" },
  { id: "2", employeeName: "Sarah Johnson", grossPay: 7916.67, taxes: 1979.17, benefitDeductions: 45.00, netPay: 5892.50, status: "pending", date: "2026-02-01" },
  { id: "3", employeeName: "Mike Chen", grossPay: 6250.00, taxes: 1562.50, benefitDeductions: 0.00, netPay: 4687.50, status: "approved", date: "2026-01-15" },
]

/**
 * Recent Activity Card presentational component.
 * @returns The rendered RecentActivityCard UI.
 */
export default function RecentActivityCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest payroll records</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="cursor-pointer">
            <Link href="/manager/payroll-records-table" className="flex items-center gap-1.5 no-underline">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payrollRecords.slice(0, 4).map((record) => {
            const isApproved = record.status === "approved"
            return (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/60 transition-colors hover:bg-accent/40"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      isApproved
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {isApproved ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {record.employeeName}
                    </p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      Net Pay: ${record.netPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={isApproved ? "default" : "secondary"}
                  className="capitalize font-medium text-xs"
                >
                  {record.status}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
