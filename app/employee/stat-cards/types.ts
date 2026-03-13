import type { ReactNode } from "react";

export interface EmployeeStatCardProps {
    title: string;
    icon?: ReactNode;
    value: string | number;
    description?: string;
}