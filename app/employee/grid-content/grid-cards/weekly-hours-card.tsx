import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { HoursByDay } from "./types"

export default function WeeklyHoursCardBreakdown({ chart_config, hours_by_day }: { chart_config: ChartConfig; hours_by_day: HoursByDay[] }) {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-base">This Week&apos;s Hours</CardTitle>
                <CardDescription>Daily breakdown of hours worked</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chart_config} className="h-[220px] w-full">
                    <BarChart data={hours_by_day}>
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
                        {hours_by_day.map((entry) => (
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