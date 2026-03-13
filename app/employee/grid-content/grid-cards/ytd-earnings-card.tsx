import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export default function YTDEarningsCard() {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-base">Year-to-Date Earnings</CardTitle>
                <CardDescription>Total earnings in 2026</CardDescription>
            </CardHeader>

            <CardContent>

                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-4xl font-bold text-green-600">
                            $9,375
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Net earnings</p>
                    </div>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                        <p className="text-sm text-gray-600">Paychecks</p>
                        <p className="text-2xl font-bold">3</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Avg. Per Check</p>
                        <p className="text-2xl font-bold">
                            $3125
                        </p>
                    </div>
                </div>

            </CardContent>

        </Card >
    )
}