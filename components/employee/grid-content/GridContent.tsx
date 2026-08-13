/**
 * Employee-facing UI: GridContent.
 */
import WeeklyHoursCardBreakdown from "./grid-cards/weekly-hours-card"
import YTDEarningsCard from "./grid-cards/ytd-earnings-card"
import RecentTimesheetsCard from "./grid-cards/recent-timesheets-card"
import type { GridContentProps } from "./grid-cards/types"
import QuickStatsCard from "./grid-cards/quick-stats-card"

/**
 * Grid Content presentational component.
 * @param timesheets - See component props.
 * @param setTimesheets - See component props.
 * @param hoursByDay - See component props.
 * @param setHoursByDay - See component props.
 * @param chartConfig - See component props.
 * @returns The rendered GridContent UI.
 * @example
 * // <GridContent timesheets={...}, setTimesheets={...}, hoursByDay={...}, setHoursByDay={...} />
 */
export default function GridContent({ timesheets, setTimesheets, hoursByDay, setHoursByDay, chartConfig }: GridContentProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <WeeklyHoursCardBreakdown chartConfig={chartConfig} hoursByDay={hoursByDay} />

            <YTDEarningsCard />

            <RecentTimesheetsCard
                timeEntries={timesheets}
                setTimesheets={setTimesheets}
                setHoursByDay={setHoursByDay}
            />

            <QuickStatsCard />
        </div>

    )
}