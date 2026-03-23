'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Button as BaseButton } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getPayrollRecords } from "@/lib/supabase/payroll";

type PayrollRecord = {
    id: string;
    employee_id: string | null;
    payroll_run_id: string | null;
    regular_hours: number | null;
    overtime_hours: number | null;
    gross_pay: number;
    federal_tax: number | null;
    state_tax: number | null;
    social_security: number | null;
    benefit_deductions: number | null;
    net_pay: number;
    employees: { pay_frequency: string } | null;
    created_at: string | null;
};

export default function PayrollTable() {

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getPayrollRecords()
            .then((records) => setPayrollRecords(records ?? []))
            .catch(() => setError("Failed to load payroll records."))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <Card className="m-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Payroll Records</CardTitle>
                        <CardDescription>Review payroll records</CardDescription>
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
                                    <Label htmlFor="payPeriod">Pay Period</Label>
                                    <Select onValueChange={(value) => { const [start, end] = value.split("_"); setStartDate(start); setEndDate(end); }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2026-01-01_2026-01-14">Jan 1 - Jan 14, 2026</SelectItem>
                                            <SelectItem value="2026-01-15_2026-01-28">Jan 15 - Jan 28, 2026</SelectItem>
                                            <SelectItem value="2026-01-29_2026-02-11">Jan 29 - Feb 11, 2026</SelectItem>
                                            <SelectItem value="2026-02-12_2026-02-25">Feb 12 - Feb 25, 2026</SelectItem>
                                            <SelectItem value="2026-02-26_2026-03-11">Feb 26 - Mar 11, 2026</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes (Optional)</Label>
                                    <Textarea id="notes" placeholder="Add any notes..." />
                                </div>
                            </div>
                            <DialogFooter>
                                <BaseButton asChild>
                                    <Link href={`/manager/payroll-status?startDate=${startDate}&endDate=${endDate}`}>
                                        Run Payroll
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </BaseButton>
                            </DialogFooter>
                        </DialogContent>

                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <p role="status" aria-live="polite" className="text-sm text-muted-foreground mb-4">
                        Loading payroll records...
                    </p>
                )}
                {!isLoading && payrollRecords.length === 0 && !error && (
                    <p role="status" aria-live="polite" className="text-sm text-muted-foreground mb-4">
                        No payroll records found.
                    </p>
                )}
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee ID</TableHead>
                            <TableHead>Hours Worked</TableHead>
                            <TableHead>Overtime Hours</TableHead>
                            <TableHead>Gross Pay</TableHead>
                            <TableHead>Federal Tax</TableHead>
                            <TableHead>State Tax</TableHead>
                            <TableHead>Social Security</TableHead>
                            <TableHead>Benefits</TableHead>
                            <TableHead>Net Pay</TableHead>
                            <TableHead>Created At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payrollRecords.map(record => (
                            <TableRow key={record.id}>
                                <TableCell className="font-medium">{record.employee_id ?? "—"}</TableCell>
                                <TableCell>
                                    {record.employees?.pay_frequency === "HOURLY"
                                        ? (record.regular_hours ?? "—")
                                        : (record.employees == null ? (record.regular_hours ?? "—") : "—")}
                                </TableCell>
                                <TableCell>
                                    {record.employees?.pay_frequency === "HOURLY"
                                        ? (record.overtime_hours ?? "—")
                                        : (record.employees == null ? (record.overtime_hours ?? "—") : "—")}
                                </TableCell>
                                <TableCell>${record.gross_pay.toFixed(2)}</TableCell>
                                <TableCell className="text-red-600">-${(record.federal_tax ?? 0).toFixed(2)}</TableCell>
                                <TableCell className="text-red-600">-${(record.state_tax ?? 0).toFixed(2)}</TableCell>
                                <TableCell className="text-red-600">-${(record.social_security ?? 0).toFixed(2)}</TableCell>
                                <TableCell className="text-red-600">
                                    {record.benefit_deductions == null ? "—" : `-$${record.benefit_deductions.toFixed(2)}`}
                                </TableCell>
                                <TableCell className={`font-semibold ${record.net_pay > 0 ? "text-green-600" : "text-muted-foreground"}`}>${record.net_pay.toFixed(2)}</TableCell>
                                <TableCell>{record.created_at ? new Date(record.created_at).toLocaleDateString() : "—"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};