import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AVAILABLE_BENEFITS,
    BenefitSummaryCardProps
} from "./types";
import {
    Heart,
    TrendingUp,
    DollarSign,
} from "lucide-react"

// TODO (Backend): Remove all hardcoded and fetch/display data from Supabase
const payrollRecords = ([
    { id: "1", employeeName: "John Smith", grossPay: 7083.33, taxes: 1770.83, benefitDeductions: 32.00, netPay: 5280.50, status: "pending", date: "2026-02-01" },
    { id: "2", employeeName: "Sarah Johnson", grossPay: 7916.67, taxes: 1979.17, benefitDeductions: 45.00, netPay: 5892.50, status: "pending", date: "2026-02-01" },
    { id: "3", employeeName: "Mike Chen", grossPay: 6250.00, taxes: 1562.50, benefitDeductions: 0.00, netPay: 4687.50, status: "approved", date: "2026-01-15" },
]);

export function BenefitSummaryCard({ title, icon, count, description }: BenefitSummaryCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">
                    {count}
                </div>
                <p className="text-xs text-gray-600 mt-1">{description}</p>
            </CardContent>
        </Card>
    )
}

export default function SummaryCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 mt-4">

            <BenefitSummaryCard
                title="Company Benefits"
                icon={<Heart className="h-5 w-5 text-blue-600" />}
                count={AVAILABLE_BENEFITS.filter(b => b.isCompanyProvided).length}
                description="Provided to all employees"
            />

            <BenefitSummaryCard
                title="Optional Benefits"
                icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
                count={AVAILABLE_BENEFITS.filter(b => !b.isCompanyProvided).length}
                description="Available for purchase"
            />

            <BenefitSummaryCard
                title="Avg. Deductions"
                icon={<DollarSign className="h-5 w-5 text-orange-600" />}
                count={`$${payrollRecords.length > 0 ? (payrollRecords.reduce((sum, r) => sum + r.benefitDeductions, 0) / payrollRecords.length).toFixed(2) : "0.00"}`}
                description="Per employee/month"
            />

        </div>
    )
}