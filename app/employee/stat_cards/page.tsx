import {
    Clock,
    DollarSign,
    Heart,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmployeeStatCardProps, HoursByDayProps } from "./types"

export function EmployeeStatCard({ title, icon, value, description }: EmployeeStatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-white">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{description}</p>
            </CardContent>
        </Card>
    )
}

export default function EmployeeStatCards({ hoursThisWeek, weeklyTarget }: HoursByDayProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 mt-4">

            <EmployeeStatCard
                title="Hours This Week"
                icon={<Clock className="h-4 w-4 text-blue-600" />}
                value={hoursThisWeek}
                description={`Target ${weeklyTarget} hours`}
            />

            <EmployeeStatCard
                title="Benefit Deductions"
                icon={<Heart className="h-4 w-4 text-red-600" />}
                value="$32.00"
                description="Per month"
            />

            <EmployeeStatCard
                title="Last Payment"
                icon={<DollarSign className="h-4 w-4 text-green-600" />}
                value="$3125.00"
                description="Jan 16-31, 2026"
            />
        </div>

    );
}