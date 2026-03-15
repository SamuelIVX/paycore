import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SummaryCardProps, SummaryCardsProps } from "../types"
import { DollarSign } from "lucide-react"


export function SummaryCard({ title, value, color, description }: SummaryCardProps) {
    return (
        <div className="rounded-md border bg-background dark:bg-blue-200 border-none p-4 text-center">
            <div className="text-md text-muted-foreground mb-1">{title}</div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{description}</div>
        </div>
    )
}

export default function SummaryCards({ company_count, optional_count, monthly_deduction }: SummaryCardsProps) {
    return (
        <div className="mb-8 mt-4">

            <Card className="border-blue-300 bg-blue-100">

                <CardHeader>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 dark:text-black" />
                        <CardTitle className="text-gray-600 dark:text-black">Benefits Cost Summary</CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="grid gap-3 md:grid-cols-3">
                    <SummaryCard
                        title="Company Benefits"
                        value={company_count}
                        color="text-blue-600"
                        description="Provided to all employees"
                    />

                    <SummaryCard
                        title="Optional Benefits"
                        value={optional_count}
                        color="text-violet-600"
                        description="Available for purchase"
                    />

                    <SummaryCard
                        title="Total Deductions"
                        value={`$${monthly_deduction.toFixed(2)}`}
                        color="text-orange-600"
                        description="Per month"
                    />
                </CardContent>

            </Card>
        </div>
    )
}