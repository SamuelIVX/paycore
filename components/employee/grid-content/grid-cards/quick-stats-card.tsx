/**
 * Employee-facing UI: quick-stats-card.
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Calendar, Heart, Building2 } from "lucide-react"

/**
 * Quick Stats Card presentational component.
 * @returns The rendered QuickStatsCard UI.
 */
export default function QuickStatsCard() {
  const stats = [
    {
      label: "Position",
      value: "Software Engineer",
      icon: Briefcase,
    },
    {
      label: "Department",
      value: "Engineering",
      icon: Building2,
    },
    {
      label: "Tenure",
      value: "2 years, 1 month",
      icon: Calendar,
    },
    {
      label: "Benefits Enrolled",
      value: "2 optional plans",
      icon: Heart,
    },
  ]

  return (
    <Card className="shadow-xs">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
        <CardDescription>Your employment overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-lg border border-border bg-card/60 p-3 transition-colors hover:bg-accent/40"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className="text-sm font-medium text-foreground truncate">{stat.value}</div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
