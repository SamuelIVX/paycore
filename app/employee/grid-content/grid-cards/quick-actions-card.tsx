import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/animate-ui/components/buttons/button"
import { Button as BaseButton } from "@/components/ui/button"
import { Calendar as DateCalendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { TimerReset, Heart, FileText } from "lucide-react"
import { createTimeEntry } from "@/lib/supabase/time-entries"
import Link from "next/link"
import type { QuickActionsCardProps } from "./types"

function getShortDay(date: Date) {
    return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
}

export default function QuickActionsCard({ setHoursByDay, setTimesheets }: QuickActionsCardProps) {

    const [submitHoursOpen, setSubmitHoursOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [hoursWorked, setHoursWorked] = useState("8.0")
    const [submitError, setSubmitError] = useState<string | null>(null)

    async function handleRecordHours() {
        if (!selectedDate) return

        const parsedHours = Number(hoursWorked)
        if (Number.isNaN(parsedHours) || parsedHours < 0) return

        const dayOfWeek = selectedDate.getDay()
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            setSubmitError("Hours can only be recorded Monday through Friday.")
            return
        }
        const workDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`

        try {
            setSubmitError(null)
            await createTimeEntry(workDate, parsedHours)
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Failed to save time entry. Please try again.")
            return
        }

        const shortDay = getShortDay(selectedDate)

        setTimesheets((prev) => [{ id: crypto.randomUUID(), date: workDate, hoursWorked: parsedHours, status: "submitted" }, ...prev])
        setHoursByDay((prev) =>
            prev.map((entry) =>
                entry.day === shortDay ? { ...entry, hours: parsedHours } : entry
            )
        )

        setSubmitHoursOpen(false)
    }

    return (
        <>
            <Card className="border-green-200 bg-green-50 mt-4">

                <CardHeader>
                    <CardTitle className="text-green-900">Quick Actions</CardTitle>
                    <CardDescription>Common employee operations</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">

                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2 bg-background"
                        onClick={() => setSubmitHoursOpen(true)}
                    >
                        <TimerReset className="h-4 w-4" />
                        Submit Hours
                    </Button>

                    <BaseButton
                        variant="outline"
                        className="w-full justify-start bg-white hover:bg-gray-50 h-10 text-sm dark:text-black"
                        asChild
                    >
                        <Link href="/employee/benefits">
                            <Heart className="w-5 h-5 mr-3" />
                            Manage Benefits
                        </Link>
                    </BaseButton>

                    <BaseButton
                        variant="outline"
                        className="w-full justify-start bg-white hover:bg-gray-50 h-10 text-sm dark:text-black"
                        asChild
                    >
                        <Link href="/employee/paystubs">
                            <FileText className="w-5 h-5 mr-3" />
                            View Pay Stubs
                        </Link>
                    </BaseButton>

                </CardContent>

            </Card>

            <Dialog open={submitHoursOpen} onOpenChange={(open) => { setSubmitHoursOpen(open); setSubmitError(null) }}>
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
                            <div role="group" aria-labelledby="work-date-label" className="rounded-md border p-3">
                                <DateCalendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="w-full"
                                />
                            </div>
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
                            <Button onClick={handleRecordHours}>Record Hours</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}