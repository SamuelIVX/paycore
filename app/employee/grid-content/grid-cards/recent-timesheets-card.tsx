import { Button } from "@/components/animate-ui/components/buttons/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import type { TimeEntry } from "./types"

export default function RecentTimesheetsCard({ time_entries }: { time_entries: TimeEntry[] }) {
    return (
        <Card className="shadow-sm">

            <CardHeader className="flex flex-row items-start justify-between space-y-0">

                <div>
                    <CardTitle className="text-base">Recent Timesheets</CardTitle>
                    <CardDescription>Latest time entries</CardDescription>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Hours
                </Button>

            </CardHeader>

            <CardContent className="space-y-3">
                {time_entries.slice(0, 4).map(entry => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${entry.status === "draft" ? "bg-orange-100" :
                                entry.status === "submitted" ? "bg-blue-100" : "bg-green-100"
                                }`}>
                                {entry.status === "draft" ? (
                                    <AlertCircle className="w-5 h-5 text-orange-600" />
                                ) : entry.status === "submitted" ? (
                                    <Clock className="w-5 h-5 text-blue-600" />
                                ) : (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium dark:text-black">
                                    {(() => {
                                        const [year, month, day] = entry.date.split("-").map(Number)
                                        return new Date(year, month - 1, day).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric'
                                        })
                                    })()}

                                </p>
                                <p className="text-sm text-gray-600">
                                    {entry.hoursWorked} hours
                                </p>
                            </div>
                        </div>
                        <Badge variant={
                            entry.status === "draft" ? "outline" :
                                entry.status === "submitted" ? "secondary" :
                                    "default"
                        }>
                            {entry.status}
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}