/**
 * Manager-facing UI: upcoming-tasks.
 */
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Calendar, FileCheck, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TaskCardProps } from "./types"

/**
 * Task Card presentational component.
 */
export function TaskCard({ title, description, icon }: TaskCardProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/60 transition-colors hover:bg-accent/40">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Badge variant="outline" className="text-xs shrink-0 ml-2">
        Upcoming
      </Badge>
    </div>
  )
}

/**
 * Upcoming Tasks Card presentational component.
 */
export default function UpcomingTasksCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
        <CardDescription>Important dates and compliance tasks</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <TaskCard
            title="Payroll Submission"
            description="Due: February 15, 2026"
            icon={<Calendar className="w-4 h-4 text-primary" />}
            color={{
              bg: "",
              border: "",
              text: "",
            }}
          />
          <TaskCard
            title="Tax Filing Deadline"
            description="Due: February 28, 2026"
            icon={<FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            color={{
              bg: "",
              border: "",
              text: "",
            }}
          />
          <TaskCard
            title="Benefits Open Enrollment"
            description="Starts: March 1, 2026"
            icon={<Heart className="w-4 h-4 text-rose-500 dark:text-rose-400" />}
            color={{
              bg: "",
              border: "",
              text: "",
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
