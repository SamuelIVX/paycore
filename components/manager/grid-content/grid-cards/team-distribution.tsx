"use client"

import { Pie, PieChart, Cell } from "recharts"
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
} from "@/components/ui/chart"
import { getEmployeeByDepartment } from "@/lib/supabase/employee"
import { useEffect, useState } from "react"
import { ChartData, chartConfig } from "./types"

export default function TeamDistributionPieChart() {

    const [chartData, setChartData] = useState<ChartData[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getEmployeeByDepartment()

                const chartFormattedData = Object.entries(data).map(([name, value]) => ({
                    name,
                    value: value as number,
                }))
                setChartData(chartFormattedData)
            }
            catch (error) {
                console.error("Error fetching employee distribution: ", error)
            }
        }
        fetchData()
    }, [])


    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Team Distribution</CardTitle>
                <CardDescription>Employees by Department</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-50 pb-0"
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="value" label nameKey="name">
                            {chartData.map((entry) => {
                                const configKey = entry.name.replace(/ /g, "_") as keyof typeof chartConfig
                                const config = chartConfig[configKey]
                                const color = ("color" in config ? config.color : null) ?? "var(--chart-1)"
                                return <Cell key={entry.name} fill={color} />
                            })}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}