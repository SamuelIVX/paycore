import WeeklyHoursCardBreakdown from "./grid-cards/weekly-hours-card"
import YTDEarningsCard from "./grid-cards/ytd-earnings-card"
import RecentTimesheetsCard from "./grid-cards/recent-timesheets-card"
import QuickActionsCard from "./grid-cards/quick-actions-card"
import { type ChartConfig } from "@/components/ui/chart"
import type { HoursByDay, TimeEntry } from "./grid-cards/types"

export default function GridContent({ time_entries, hours_by_day, chart_config }: { time_entries: TimeEntry[]; hours_by_day: HoursByDay[]; chart_config: ChartConfig }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <WeeklyHoursCardBreakdown chart_config={chart_config} hours_by_day={hours_by_day} />

            <YTDEarningsCard />

            <RecentTimesheetsCard time_entries={time_entries} />

            <QuickActionsCard />
        </div>
    )
}