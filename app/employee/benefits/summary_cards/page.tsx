import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SummaryCardProps, SummaryCardsProps } from "../types"
import { DollarSign } from "lucide-react"


export function SummaryCard({ title, value, description }: SummaryCardProps) {
    return (
        <div className="rounded-md border bg-background dark:bg-blue-200 border-none p-4 text-center">
            <div className="text-md text-muted-foreground mb-1">{title}</div>
            <div className="text-2xl font-bold text-blue-600">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{description}</div>
        </div>
    )
}

export default function SummaryCards({ company_count, monthly_deduction, annual_cost }: SummaryCardsProps) {
    return (

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
                    description="No cost to employee"
                />

                <SummaryCard
                    title="Monthly Deduction"
                    value={`$${monthly_deduction.toFixed(2)}`}
                    description="Total per month"
                />

                <SummaryCard
                    title="Annual Cost"
                    value={`$${annual_cost.toFixed(2)}`}
                    description="Total per year"
                />
            </CardContent>

        </Card>
    )
}