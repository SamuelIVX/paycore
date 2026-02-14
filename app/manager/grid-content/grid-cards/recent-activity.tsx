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
                        <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.status === "pending" ? "bg-orange-100" :
                                    record.status === "approved" ? "bg-green-100" : "bg-blue-100"
                                    }`}>
                                    {record.status === "pending" ? (
                                        <Clock className="w-5 h-5 text-orange-600" />
                                    ) : record.status === "approved" ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    ) : (
                                        < Clock className="w-5 h-5 text-blue-600" />
                                    )}
                                </div>

                                <div>
                                    <p className="font-medium">{record.employeeName}</p>
                                    <p className="text-sm text-gray-600">
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