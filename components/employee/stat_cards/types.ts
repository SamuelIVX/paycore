/**
 * Employee-facing UI: types.
 */
import type { ReactNode } from "react";

/**
 * EmployeeStatCardProps type/interface.
 */
export interface EmployeeStatCardProps {
    title: string;
    icon?: ReactNode;
    value: string | number;
    description?: string;
}

/**
 * HoursByDayProps type/interface.
 */
export interface HoursByDayProps {
    hoursThisWeek: string | number;
    weeklyTarget: string | number;
}