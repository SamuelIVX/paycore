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
import { ChartData, chartConfig, DEPARTMENT_COLORS } from "./types"

export default function TeamDistributionPieChart() {

    const [chartData, setChartData] = useState<ChartData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true

        const fetchData = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const data = await getEmployeeByDepartment()

                if (!isMounted) return

                const chartFormattedData = Object.entries(data).map(([name, value]) => ({
                    name,
                    value: value as number,
                }))
                setChartData(chartFormattedData)
            }
            catch (error) {
                if (!isMounted) return
                console.error("Error fetching employee distribution: ", error)
                setError("Failed to load department distribution")
            }
            finally {
                if (isMounted) setIsLoading(false)
            }
        }
        fetchData()

        return () => {
            isMounted = false
        }
    }, [])


    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Team Distribution</CardTitle>
                <CardDescription>Employees by Department</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {isLoading ? (
                    <div className="flex items-center justify-center aspect-square">
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center aspect-square">
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex items-center justify-center aspect-square">
                        <p className="text-sm text-muted-foreground">No department data available</p>
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-50 pb-0"
                    >
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie data={chartData} dataKey="value" label nameKey="name">
                                {chartData.map((entry, index) => {
                                    const color = DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]
                                    return <Cell key={entry.name} fill={color} />
                                })}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}