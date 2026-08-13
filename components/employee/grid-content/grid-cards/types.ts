/**
 * Employee-facing UI: types.
 */
import type { Dispatch, SetStateAction } from "react"
import type { ChartConfig } from "@/components/ui/chart"

/**
 * HoursByDay type/interface.
 */
export interface HoursByDay {
    day: string;
    hours: number;
}

/**
 * TimeEntry type/interface.
 */
export interface TimeEntry {
    id: string;
    date: string;
    hoursWorked: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
}

/**
 * QuickActionsCardProps type/interface.
 */
export interface QuickActionsCardProps {
    setTimesheets: Dispatch<SetStateAction<TimeEntry[]>>
    setHoursByDay: Dispatch<SetStateAction<HoursByDay[]>>
}

/**
 * RecentTimesheetsCardProps type/interface.
 */
export interface RecentTimesheetsCardProps {
    timeEntries?: TimeEntry[]
    setTimesheets: Dispatch<SetStateAction<TimeEntry[]>>
    setHoursByDay: Dispatch<SetStateAction<HoursByDay[]>>
}
/**
 * GridContentProps type/interface.
 */
export interface GridContentProps {
    timesheets: TimeEntry[]
    setTimesheets: Dispatch<SetStateAction<TimeEntry[]>>
    hoursByDay: HoursByDay[]
    setHoursByDay: Dispatch<SetStateAction<HoursByDay[]>>
    chartConfig: ChartConfig
}