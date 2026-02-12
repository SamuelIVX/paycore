import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Calendar, FileCheck, Heart } from "lucide-react"
import { TaskCardProps } from "./types"

export function TaskCard({ title, description, icon, color }: TaskCardProps) {
    return (
        <div className={`flex items-start gap-3 p-3 rounded-lg border ${color.bg} ${color.border}`}>
            {icon}
            <div className="flex-1">
                <p className={`font-medium ${color.text}`}>{title}</p>
                <p className={`text-sm ${color.text}`}>{description}</p>
            </div>
        </div>
    )
}

export default function UpcomingTasksCard() {
    return (
        <Card>

            <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Important dates and tasks</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-3">
                    <TaskCard
                        title="Payroll Submission"
                        description="Due: February 15, 2026"
                        icon={<Calendar className="w-5 h-5 text-blue-600 mt-0.5" />}
                        color={{
                            bg: "bg-blue-50",
                            border: "border-blue-200",
                            text: "text-blue-900"
                        }}
                    />
                    <TaskCard
                        title="Tax Filing Deadline"
                        description="Due: February 28, 2026"
                        icon={<FileCheck className="w-5 h-5 text-purple-600 mt-0.5" />}
                        color={{
                            bg: "bg-purple-50",
                            border: "border-purple-200",
                            text: "text-purple-900"
                        }}
                    />
                    <TaskCard
                        title="Benefits Open Enrollment"
                        description="Starts: March 1, 2026"
                        icon={<Heart className="w-5 h-5 text-green-600 mt-0.5" />}
                        color={{
                            bg: "bg-green-50",
                            border: "border-green-200",
                            text: "text-green-900"
                        }}
                    />
                </div>
            </CardContent >

        </Card >
    )
}