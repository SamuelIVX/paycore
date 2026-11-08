"use client"

/**
 * Manager-facing UI: payroll-chart.
 */
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

export const description = "A line chart showing monthly payroll trends"

const chartData = [
  { month: "January", payroll: 186 },
  { month: "February", payroll: 305 },
  { month: "March", payroll: 237 },
  { month: "April", payroll: 195 },
  { month: "May", payroll: 209 },
  { month: "June", payroll: 245 },
]

const chartConfig = {
  payroll: {
    label: "Payroll ($k)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

/**
 * Payroll Trend Chart presentational component.
 * @returns The rendered PayrollTrendChart UI.
 */
export default function PayrollTrendChart() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Payroll Trend</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">Monthly payroll expenditures over 6 months (in $k)</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => [`$${value}k`, "Total Payroll"]}
                />
              }
            />
            <Line
              dataKey="payroll"
              type="natural"
              stroke="var(--color-payroll)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-payroll)" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
