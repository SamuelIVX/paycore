import WeeklyHoursCardBreakdown from "./grid-cards/weekly-hours-card"
import YTDEarningsCard from "./grid-cards/ytd-earnings-card"
import RecentTimesheetsCard from "./grid-cards/recent-timesheets-card"
import QuickActionsCard from "./grid-cards/quick-actions-card"
import type { GridContentProps } from "./grid-cards/types"
import QuickStatsCard from "./grid-cards/quick-stats-card"

export default function GridContent({ timesheets, setTimesheets, hoursByDay, setHoursByDay, chartConfig }: GridContentProps) {
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <WeeklyHoursCardBreakdown chartConfig={chartConfig} hoursByDay={hoursByDay} />

                <YTDEarningsCard />

                <RecentTimesheetsCard timeEntries={timesheets} />

                <QuickStatsCard />
            </div>

            <QuickActionsCard setTimesheets={setTimesheets} setHoursByDay={setHoursByDay} />
        </>
    )
}