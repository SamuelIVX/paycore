'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Calendar as DateCalendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { createTimeEntry } from "@/lib/supabase/time-entries"
import { getShortDay } from "@/lib/utils"
import type { RecentTimesheetsCardProps } from "./types"

export default function RecentTimesheetsCard({ timeEntries, setTimesheets, setHoursByDay }: RecentTimesheetsCardProps) {
    const recentEntries = [...(timeEntries || [])]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 4)

    const [submitHoursOpen, setSubmitHoursOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [hoursWorked, setHoursWorked] = useState("8.0")
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleRecordHours() {
        if (!selectedDate) return
        if (isSubmitting) return

        const parsedHours = Number(hoursWorked)
        if (Number.isNaN(parsedHours) || parsedHours < 0) {
            setSubmitError("Please enter a valid number of hours (0 or greater).")
            return
        }
        const dayOfWeek = selectedDate.getDay()
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            setSubmitError("Hours can only be recorded Monday through Friday.")
            return
        }
        const workDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`

        try {
            setIsSubmitting(true)
            setSubmitError(null)
            const entry = await createTimeEntry(workDate, parsedHours)
            const newEntry = {
                id: entry.id,
                date: entry.work_date ?? workDate,
                hoursWorked: entry.hours_worked,
                status: entry.status as "PENDING" | "APPROVED" | "REJECTED",
            }
            const shortDay = getShortDay(selectedDate)
            setTimesheets((prev) => [newEntry, ...prev])
            setHoursByDay((prev) =>
                prev.map((e) =>
                    e.day === shortDay ? { ...e, hours: e.hours + parsedHours } : e
                )
            )
            setSubmitHoursOpen(false)
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Failed to save time entry. Please try again.")
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <Card className="shadow-sm">

                <CardHeader className="flex flex-row items-start justify-between space-y-0">

                    <div>
                        <CardTitle className="text-base">Recent Timesheets</CardTitle>
                        <CardDescription>Latest time entries</CardDescription>
                    </div>
                    <Button
                        className="gap-2"
                        onClick={() => setSubmitHoursOpen(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Add Hours
                    </Button>

                </CardHeader>

                <CardContent className="space-y-3">
                    {recentEntries.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent timesheets</p>
                    ) : (
                        <>
                            {recentEntries.map(entry => (
                                <div key={entry.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                    entry.status === "REJECTED"
                                        ? "bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600"
                                        : entry.status === "PENDING"
                                        ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600"
                                        : "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600"
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${entry.status === "REJECTED" ? "bg-orange-100 dark:bg-orange-900/30" :
                                            entry.status === "PENDING" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-green-100 dark:bg-green-900/30"
                                            }`}>
                                            {entry.status === "REJECTED" ? (
                                                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                            ) : entry.status === "PENDING" ? (
                                                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            ) : (
                                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {(() => {
                                                    const [year, month, day] = entry.date.split("-").map(Number)
                                                    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })
                                                })()}

                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {entry.hoursWorked} hours
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={
                                        entry.status === "REJECTED" ? "outline" :
                                            entry.status === "PENDING" ? "secondary" :
                                                "default"
                                    }>
                                        {entry.status.toUpperCase()}
                                    </Badge>
                                </div>
                            ))}
                        </>
                    )}
                </CardContent>
            </Card>

            <Dialog
                open={submitHoursOpen}
                onOpenChange={(open) => { setSubmitHoursOpen(open); setSubmitError(null) }}
            >
                <DialogContent className="sm:max-w-[440px]">
                    <DialogHeader>
                        <DialogTitle>Submit Hours Worked</DialogTitle>
                        <DialogDescription>
                            Record your hours for a specific date
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p id="work-date-label" className="text-sm font-medium">Date</p>
                            <fieldset aria-labelledby="work-date-label" className="rounded-md border p-3">
                                <DateCalendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="w-full"
                                />
                            </fieldset>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="hours-worked" className="text-sm font-medium">
                                Hours Worked
                            </label>
                            <Input
                                id="hours-worked"
                                type="number"
                                step="0.5"
                                min="0"
                                value={hoursWorked}
                                onChange={(e) => setHoursWorked(e.target.value)}
                                placeholder="8.0"
                            />
                        </div>

                        {submitError && (
                            <p className="text-sm text-destructive">{submitError}</p>
                        )}

                        <div className="flex justify-end">
                            <Button onClick={handleRecordHours} disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Record Hours"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog >
        </>
    )
}