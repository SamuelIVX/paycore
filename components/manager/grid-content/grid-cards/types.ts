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
    total: {
        label: "Total Employees",
    },
    Human_Resources: {
        label: "Human Resources",
        color: "var(--chart-1)",
    },
    Operations: {
        label: "Operations",
        color: "var(--chart-2)",
    },
    Information_Technology: {
        label: "Information Technology",
        color: "var(--chart-3)",
    },
    Sales: {
        label: "Sales",
        color: "var(--chart-4)",
    },
    Engineering: {
        label: "Engineering",
        color: "var(--chart-5)",
    },
    Finance: {
        label: "Finance",
        color: "var(--chart-1)",
    },
    Legal: {
        label: "Legal",
        color: "var(--chart-2)",
    },
    Marketing: {
        label: "Marketing",
        color: "var(--chart-3)",
    },
    Accounting: {
        label: "Accounting",
        color: "var(--chart-4)",
    },

} satisfies ChartConfig