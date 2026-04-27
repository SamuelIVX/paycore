import { type ChartConfig } from "@/components/ui/chart"

export interface TaskCardProps {
    title: string
    description: string
    icon: React.ReactNode
    color: {
        bg: string
        border: string
        text: string
    }
}
export interface ChartData {
    name: string;
    value: number;
}

export const chartConfig = {
    department: {
        label: "Employees by Department",
    },
} satisfies ChartConfig

export const DEPARTMENT_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
] as const