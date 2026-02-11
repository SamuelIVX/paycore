import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Calendar, FileCheck, Heart } from "lucide-react"

export default function UpcomingTasksCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Important dates and tasks</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-medium text-blue-900">Payroll Submission</p>
                            <p className="text-sm text-blue-700">Due: February 15, 2026</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <FileCheck className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-medium text-purple-900">Tax Filing Deadline</p>
                            <p className="text-sm text-purple-700">Due: February 28, 2026</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Heart className="w-5 h-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-medium text-green-900">Benefits Open Enrollment</p>
                            <p className="text-sm text-green-700">Starts: March 1, 2026</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}