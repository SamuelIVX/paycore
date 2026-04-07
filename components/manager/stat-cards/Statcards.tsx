import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ManagerStatCardProps } from "./types";
import { Users, Clock, DollarSign } from "lucide-react";

export function ManagerStatCard({ title, icon, value, description }: ManagerStatCardProps) {
    return (
        <Card>

            <CardHeader className="flex flex-row items-center justify-between pb-2 rounded-lg">
                <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
                {icon}
            </CardHeader>

            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
                <p className="text-xs text-gray-600 mt-1">{description}</p>
            </CardContent>

        </Card>
    )
}

export default function ManagerStatCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 mt-4">

            <ManagerStatCard
                title="Total Employees"
                icon={<Users className="text-blue-500 h-5 w-5" />}
                value="5"
                description="Active in system"
            />

            <ManagerStatCard
                title="Pending Approvals"
                icon={<Clock className="text-orange-500 h-5 w-5" />}
                value="2"
                description="Payroll Records"
            />

            <ManagerStatCard
                title="Total Payroll"
                icon={<DollarSign className="text-green-500 h-5 w-5" />}
                value="$325,000"
                description="Annual Salary"
            />

        </div>
    )
}