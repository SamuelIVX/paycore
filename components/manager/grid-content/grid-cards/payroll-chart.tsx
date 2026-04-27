"use client"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
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

export const description = "A line chart"

const chartData = [
    { month: "January", payroll: 186 },
    { month: "February", payroll: 305 },
    { month: "March", payroll: 237 },
    { month: "April", payroll: 73 },
    { month: "May", payroll: 209 },
]

const chartConfig = {
    payroll: {
        label: "Payroll Amount",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export default function PayrollTrendChart() {
    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Payroll Trend</CardTitle>
                <CardDescription className="text-xs">Monthly payroll over 6 months</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
                <ChartContainer config={chartConfig} className="h-50 w-full">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="payroll"
                            type="natural"
                            stroke="var(--color-payroll)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}