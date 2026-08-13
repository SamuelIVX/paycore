/**
 * Manager-facing UI: types.
 */
import type { ReactNode } from "react";

/**
 * ManagerStatCardProps type/interface.
 */
export interface ManagerStatCardProps {
    title: string;
    icon?: ReactNode;
    value: string | number;
    description?: string;
}

/**
 * ManagerStatCardsProps type/interface.
 */
export interface ManagerStatCardsProps {
    totalEmployees?: number;
    totalAnnualPayroll?: number;
}
