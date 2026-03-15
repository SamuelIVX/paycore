import type { Dispatch, SetStateAction } from "react"
import type { ChartConfig } from "@/components/ui/chart"

export interface HoursByDay {
    day: string;
    hours: number;
}

export interface TimeEntry {
    id: string;
    date: string;
    hoursWorked: number;
    status: "draft" | "submitted" | "approved";
}

export interface QuickActionsCardProps {
    setTimesheets: Dispatch<SetStateAction<TimeEntry[]>>
    setHoursByDay: Dispatch<SetStateAction<HoursByDay[]>>
}

export interface GridContentProps {
    timesheets: TimeEntry[]
    setTimesheets: Dispatch<SetStateAction<TimeEntry[]>>
    hoursByDay: HoursByDay[]
    setHoursByDay: Dispatch<SetStateAction<HoursByDay[]>>
    chartConfig: ChartConfig
}