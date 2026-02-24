import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

/* TODO (Backend): Remove all hardcoded from the payroll data table and replace with data fetched from Supabase  */

const payrollRecords = ([
    { id: "1", employeeName: "John Smith", grossPay: 7083.33, taxes: 1770.83, benefitDeductions: 32.00, netPay: 5280.50, status: "pending", date: "2026-02-01" },
    { id: "2", employeeName: "Sarah Johnson", grossPay: 7916.67, taxes: 1979.17, benefitDeductions: 45.00, netPay: 5892.50, status: "pending", date: "2026-02-01" },
    { id: "3", employeeName: "Mike Chen", grossPay: 6250.00, taxes: 1562.50, benefitDeductions: 0.00, netPay: 4687.50, status: "approved", date: "2026-01-15" },
    { id: "4", employeeName: "John Smith", grossPay: 7083.33, taxes: 1770.83, benefitDeductions: 32.00, netPay: 5280.50, status: "pending", date: "2026-02-01" },
    { id: "5", employeeName: "Sarah Johnson", grossPay: 7916.67, taxes: 1979.17, benefitDeductions: 45.00, netPay: 5892.50, status: "pending", date: "2026-02-01" },
    { id: "6", employeeName: "Mike Chen", grossPay: 6250.00, taxes: 1562.50, benefitDeductions: 0.00, netPay: 4687.50, status: "approved", date: "2026-01-15" },
    { id: "7", employeeName: "John Smith", grossPay: 7083.33, taxes: 1770.83, benefitDeductions: 32.00, netPay: 5280.50, status: "pending", date: "2026-02-01" },
    { id: "8", employeeName: "Sarah Johnson", grossPay: 7916.67, taxes: 1979.17, benefitDeductions: 45.00, netPay: 5892.50, status: "pending", date: "2026-02-01" },
    { id: "9", employeeName: "Mike Chen", grossPay: 6250.00, taxes: 1562.50, benefitDeductions: 0.00, netPay: 4687.50, status: "approved", date: "2026-01-15" },
    { id: "10", employeeName: "John Smith", grossPay: 7083.33, taxes: 1770.83, benefitDeductions: 32.00, netPay: 5280.50, status: "pending", date: "2026-02-01" },
    { id: "11", employeeName: "Sarah Johnson", grossPay: 7916.67, taxes: 1979.17, benefitDeductions: 45.00, netPay: 5892.50, status: "pending", date: "2026-02-01" },
    { id: "12", employeeName: "Mike Chen", grossPay: 6250.00, taxes: 1562.50, benefitDeductions: 0.00, netPay: 4687.50, status: "approved", date: "2026-01-15" },
]);

/* TODO (Backend): Add functionalities to the table (e.g., run payroll, approve or decline payroll, etc) */
export default function PayrollTable() {

    return (
        <Card className="m-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Payroll Records</CardTitle>
                        <CardDescription>Review and approve payroll records</CardDescription>
                    </div>
                    <Dialog >

                        <DialogTrigger asChild>
                            <Button>
                                <DollarSign className="w-4 h-4 mr-2" />
                                Run Payroll
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Run Payroll</DialogTitle>
                                <DialogDescription>Process payroll for selected period</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label >Pay Period</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="current">Current Period (Feb 1-15, 2026)</SelectItem>
                                            <SelectItem value="previous">Previous Period (Jan 16-31, 2026)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button asChild>
                                    <Link href="/manager/payroll-status">
                                        Run Payroll
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </DialogFooter>
                        </DialogContent>

                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Gross Pay</TableHead>
                            <TableHead>Taxes</TableHead>
                            <TableHead>Benefits</TableHead>
                            <TableHead>Net Pay</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payrollRecords.map(record => (
                            <TableRow key={record.id}>
                                <TableCell className="font-medium">{record.employeeName}</TableCell>
                                <TableCell>${record.grossPay.toFixed(2)}</TableCell>
                                <TableCell className="text-red-600">-${record.taxes.toFixed(2)}</TableCell>
                                <TableCell className="text-red-600">-${record.benefitDeductions.toFixed(2)}</TableCell>
                                <TableCell className="font-semibold text-green-600">${record.netPay.toFixed(2)}</TableCell>
                                <TableCell>{new Date(record.date + "T00:00:00").toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            record.status === "pending" ? "destructive"
                                                : record.status === "approved" ? "default"
                                                    : "secondary"
                                        }
                                    >
                                        {record.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {record.status === "pending" ? (
                                        <Button variant="ghost" size="sm">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Approve?
                                        </Button>
                                    ) : record.status === "approved" ? (
                                        <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-200">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Approved
                                        </Button>
                                    ) : null}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}