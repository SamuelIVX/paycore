/**
 * Shared StatCard presentational primitive for manager & employee dashboard views.
 */
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  value: React.ReactNode
  icon?: React.ReactNode
  description?: React.ReactNode
}

/**
 * Standardized KPI / Stat card with accessible semantic text and tabular numbers.
 */
export function StatCard({
  title,
  value,
  icon,
  description,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card className={cn("transition-all hover:shadow-xs", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="shrink-0">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight tabular-nums text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
