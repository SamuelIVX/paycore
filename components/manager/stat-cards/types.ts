import type { ReactNode } from "react";

export interface ManagerStatCardProps {
    title: string;
    icon?: ReactNode;
    value: string | number;
    description?: string;
}