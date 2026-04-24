import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BenefitSummaryCardProps } from "../types";
import {
    Heart,
    TrendingUp,
    DollarSign,
} from "lucide-react"
import { SummaryCardsProps } from "./types";
import { formatCurrency } from "@/utils/formatCurrency";

export function BenefitSummaryCard({ title, icon, count, description }: BenefitSummaryCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">
                    {count}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{description}</p>
            </CardContent>
        </Card>
    )
}

export default function SummaryCards({
    companyBenefitsCount,
    optionalBenefitsCount,
    avgDeductions
}: SummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 mt-4">

            <BenefitSummaryCard
                title="Company Benefits"
                icon={<Heart className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                count={companyBenefitsCount ?? "—"}
                description="Provided to all employees"
            />

            <BenefitSummaryCard
                title="Optional Benefits"
                icon={<TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                count={optionalBenefitsCount ?? "—"}
                description="Available for purchase"
            />

            <BenefitSummaryCard
                title="Avg. Deductions"
                icon={<DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
                count={avgDeductions !== undefined ? formatCurrency(avgDeductions) : "—"}
                description="Per pay period (bi-weekly)"
            />

        </div>
    )
}