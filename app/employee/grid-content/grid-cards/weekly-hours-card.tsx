'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { HoursByDay } from "./types";

export default function WeeklyHoursCardBreakdown({ chartConfig, hoursByDay }: { chartConfig: ChartConfig; hoursByDay: HoursByDay[] }) {
    if (!chartConfig || !hoursByDay) {
        return (
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">This Week&apos;s Hours</CardTitle>
                    <CardDescription>Daily breakdown of hours worked</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">Loading...</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-base">This Week&apos;s Hours</CardTitle>
                <CardDescription>Daily breakdown of hours worked</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[220px] w-full">
                    <BarChart data={hoursByDay || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            width={28}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="hours" fill="var(--color-hours)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ChartContainer>

                <section className="sr-only" aria-label="Daily hours worked this week">
                    <ul>
                        {(hoursByDay || []).map((entry) => (
                            <li key={entry.day}>
                                {entry.day}: {entry.hours} hours
                            </li>
                        ))}
                    </ul>
                </section>
            </CardContent>
        </Card>
    )
}