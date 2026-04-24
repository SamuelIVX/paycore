import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ManagerStatCardProps, ManagerStatCardsProps } from "./types";
import { Users, Clock, DollarSign } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

export function ManagerStatCard({ title, icon, value, description }: ManagerStatCardProps) {
    return (
        <Card>

            <CardHeader className="flex flex-row items-center justify-between pb-2 rounded-lg">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</CardTitle>
                {icon}
            </CardHeader>

            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{description}</p>
            </CardContent>

        </Card>
    )
}

export default function ManagerStatCards({ totalEmployees, totalAnnualPayroll }: ManagerStatCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 mt-4">

            <ManagerStatCard
                title="Total Employees"
                icon={<Users className="text-blue-500 dark:text-blue-400 h-5 w-5" />}
                value={totalEmployees ?? "—"}
                description="Active in system"
            />

            <ManagerStatCard
                title="Pending Approvals"
                icon={<Clock className="text-orange-500 dark:text-orange-400 h-5 w-5" />}
                value="2"
                description="Payroll Records"
            />

            <ManagerStatCard
                title="Total Payroll"
                icon={<DollarSign className="text-green-500 dark:text-green-400 h-5 w-5" />}
                value={totalAnnualPayroll !== undefined ? formatCurrency(totalAnnualPayroll) : "—"}
                description="Annual Salary"
            />

        </div>
    )
}