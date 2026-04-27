"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { getEmployeeSalaryByPosition } from "@/lib/supabase/employee"
import { useEffect, useState } from "react"
import { ChartData } from "./types"

const chartConfig = {
    salary: {
        label: "Annual Salary",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export default function SalaryDistributionBarChart() {

    const [chartData, setChartData] = useState<ChartData[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getEmployeeSalaryByPosition()

                const chartFormattedData = Object.entries(data).map(([position, salary]) => ({
                    name: position,
                    value: salary as number,
                }))
                setChartData(chartFormattedData)
            } catch (error) {
                console.error("Error fetching salary distribution: ", error)
            }
        }
        fetchData()
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Salary Distribution</CardTitle>
                <CardDescription>Annual Salary by Position</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ bottom: 80 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                            formatter={(value) => [`$${Number(value).toLocaleString()}`, "Annual Salary"]}
                        />
                        <Bar dataKey="value" fill="var(--color-salary)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}