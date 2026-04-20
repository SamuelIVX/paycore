import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react"

const payrollRecords = ([
    { id: "1", employeeName: "John Smith", grossPay: 7083.33, taxes: 1770.83, benefitDeductions: 32.00, netPay: 5280.50, status: "pending", date: "2026-02-01" },
    { id: "2", employeeName: "Sarah Johnson", grossPay: 7916.67, taxes: 1979.17, benefitDeductions: 45.00, netPay: 5892.50, status: "pending", date: "2026-02-01" },
    { id: "3", employeeName: "Mike Chen", grossPay: 6250.00, taxes: 1562.50, benefitDeductions: 0.00, netPay: 4687.50, status: "approved", date: "2026-01-15" },
]);

export default function RecentActivityCard() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest payroll records</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                        View All
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {payrollRecords.slice(0, 4).map(record => (
                        <div
                            key={record.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${record.status === "pending"
                                ? "bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800 hover:border-orange-500 dark:hover:border-orange-500"
                                : "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800 hover:border-green-500 dark:hover:border-green-500"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.status === "pending"
                                    ? "bg-orange-100 dark:bg-orange-900/50"
                                    : "bg-green-100 dark:bg-green-900/50"
                                    }`}>
                                    {record.status === "approved" ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    )}
                                </div>
                                <div>
                                    <p className={`font-medium ${record.status === "pending" ? "text-orange-900 dark:text-orange-200" : "text-green-900 dark:text-green-200"}`}>
                                        {record.employeeName}
                                    </p>
                                    <p className={`text-sm ${record.status === "pending" ? "text-orange-700 dark:text-orange-300" : "text-green-700 dark:text-green-300"}`}>
                                        Net Pay: ${record.netPay.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <Badge variant={record.status === "pending" ? "outline" : "default"}>
                                {record.status}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}