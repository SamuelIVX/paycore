import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp } from "lucide-react"

const TOTAL_PAY_PERIODS = 26
const COMPLETED_PERIODS = 3
const GROSS_YTD = 12500
const NET_YTD = 9375
const DEDUCTIONS_YTD = GROSS_YTD - NET_YTD
const AVG_PER_CHECK = NET_YTD / COMPLETED_PERIODS
const progressPct = Math.round((COMPLETED_PERIODS / TOTAL_PAY_PERIODS) * 100)

export default function YTDEarningsCard() {
    return (
        <Card className="shadow-sm overflow-hidden">
            <div className="bg-green-50 dark:bg-green-950/40 border-b border-green-200 dark:border-green-800 px-6 py-5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wider mb-1">Year-to-Date Earnings</p>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">${NET_YTD.toLocaleString()}</p>
                        <p className="text-sm text-green-600 dark:text-green-500 mt-1">Net earnings in {new Date().getFullYear()}</p>
                    </div>
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </div>
                </div>
            </div>

            <CardContent className="p-0">
                <div className="grid grid-cols-2 divide-x divide-border border-b">
                    <div className="px-6 py-4">
                        <p className="text-xs text-muted-foreground mb-1">Paychecks</p>
                        <p className="text-2xl font-bold">{COMPLETED_PERIODS}</p>
                    </div>
                    <div className="px-6 py-4">
                        <p className="text-xs text-muted-foreground mb-1">Avg. Per Check</p>
                        <p className="text-2xl font-bold">${AVG_PER_CHECK.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-border border-b">
                    <div className="px-6 py-4">
                        <p className="text-xs text-muted-foreground mb-1">Gross Pay</p>
                        <p className="text-lg font-semibold">${GROSS_YTD.toLocaleString()}</p>
                    </div>
                    <div className="px-6 py-4">
                        <p className="text-xs text-muted-foreground mb-1">Total Deductions</p>
                        <p className="text-lg font-semibold text-red-500 dark:text-red-400">-${DEDUCTIONS_YTD.toLocaleString()}</p>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-muted-foreground">Pay Period Progress</p>
                        <p className="text-xs font-medium">{COMPLETED_PERIODS} of {TOTAL_PAY_PERIODS} periods ({progressPct}%)</p>
                    </div>
                    <Progress value={progressPct} className="h-2" />
                </div>
            </CardContent>
        </Card>
    )
}