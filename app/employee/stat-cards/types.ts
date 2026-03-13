import type { ReactNode } from "react";

export interface EmployeeStatCardProps {
    title: string;
    icon?: ReactNode;
    value: string | number;
    description?: string;
}

export interface HoursByDay {
    hours: number;
}

export interface HoursByDayProps {
    hours_by_day: HoursByDay[];
}