import type { ReactNode } from "react";
import type { HoursByDay } from "../grid-content/grid-cards/types";

export interface EmployeeStatCardProps {
    title: string;
    icon?: ReactNode;
    value: string | number;
    description?: string;
}

export interface HoursByDayProps {
    hours_by_day: HoursByDay[];
}