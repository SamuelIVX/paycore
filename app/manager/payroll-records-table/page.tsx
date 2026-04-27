'use client';

import { useMemo, useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button as BaseButton } from "@/components/ui/button";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { getPayrollRecords } from "@/lib/supabase/payroll";
import { PayrollRecordType } from "./types";
import { DataTable, SortableHeader } from "@/components/ui/data-table";

function hoursValue(record: PayrollRecordType, field: "regular_hours" | "overtime_hours"): number | null {
  if (record.employees?.pay_frequency === "HOURLY" || record.employees == null) {
    return record[field] ?? null;
  }
  return null;
}

function formatHours(value: number | null): string {
  return value == null ? "—" : String(value);
}

export default function PayrollTable() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecordType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPayrollRecords()
      .then((records) => setPayrollRecords(records ?? []))
      .catch(() => setError("Failed to load payroll records."))
      .finally(() => setIsLoading(false));
  }, []);

  const columns = useMemo<ColumnDef<PayrollRecordType, unknown>[]>(() => [
    {
      accessorKey: "employee_id",
      header: ({ column }) => <SortableHeader column={column} label="Employee Name" />,
      cell: ({ row }) => {
        const firstName = row.original.employees?.first_name ?? "";
        const lastName = row.original.employees?.last_name ?? "";
        const displayName = `${firstName} ${lastName}`.trim() || "—";
        return <span className="font-medium">{displayName}</span>;
      },
    },
    {
      id: "regular_hours",
      accessorFn: (row) => hoursValue(row, "regular_hours"),
      header: ({ column }) => <SortableHeader column={column} label="Hours Worked" />,
      cell: ({ row }) => formatHours(hoursValue(row.original, "regular_hours")),
    },
    {
      id: "overtime_hours",
      accessorFn: (row) => hoursValue(row, "overtime_hours"),
      header: ({ column }) => <SortableHeader column={column} label="Overtime Hours" />,
      cell: ({ row }) => formatHours(hoursValue(row.original, "overtime_hours")),
    },
    {
      accessorKey: "gross_pay",
      header: ({ column }) => <SortableHeader column={column} label="Gross Pay" />,
      cell: ({ row }) => `$${(row.original.gross_pay ?? 0).toFixed(2)}`,
    },
    {
      accessorKey: "federal_tax",
      header: ({ column }) => <SortableHeader column={column} label="Federal Tax" />,
      cell: ({ row }) => <span className="text-red-600 dark:text-red-400">-${(row.original.federal_tax ?? 0).toFixed(2)}</span>,
    },
    {
      accessorKey: "state_tax",
      header: ({ column }) => <SortableHeader column={column} label="State Tax" />,
      cell: ({ row }) => <span className="text-red-600 dark:text-red-400">-${(row.original.state_tax ?? 0).toFixed(2)}</span>,
    },
    {
      accessorKey: "social_security",
      header: ({ column }) => <SortableHeader column={column} label="Social Security" />,
      cell: ({ row }) => <span className="text-red-600 dark:text-red-400">-${(row.original.social_security ?? 0).toFixed(2)}</span>,
    },
    {
      accessorKey: "benefit_deductions",
      header: ({ column }) => <SortableHeader column={column} label="Benefits" />,
      cell: ({ row }) =>
        row.original.benefit_deductions == null
          ? "—"
          : <span className="text-red-600 dark:text-red-400">-${row.original.benefit_deductions.toFixed(2)}</span>,
    },
    {
      accessorKey: "net_pay",
      header: ({ column }) => <SortableHeader column={column} label="Net Pay" />,
      cell: ({ row }) => (
        <span className={`font-semibold ${(row.original.net_pay ?? 0) > 0 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
          ${(row.original.net_pay ?? 0).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => <SortableHeader column={column} label="Created At" />,
      cell: ({ row }) =>
        row.original.created_at
          ? new Date(row.original.created_at).toLocaleDateString()
          : "—",
    },
  ], []);

  const runPayrollButton = (
    <Dialog>
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
            <Select onValueChange={(value) => {
              const [start, end] = value.split("_");
              setStartDate(start);
              setEndDate(end);
            }}>
              <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2026-01-01_2026-01-14">Jan 1 - Jan 14, 2026</SelectItem>
                <SelectItem value="2026-01-15_2026-01-28">Jan 15 - Jan 28, 2026</SelectItem>
                <SelectItem value="2026-01-29_2026-02-11">Jan 29 - Feb 11, 2026</SelectItem>
                <SelectItem value="2026-02-12_2026-02-25">Feb 12 - Feb 25, 2026</SelectItem>
                <SelectItem value="2026-02-26_2026-03-11">Feb 26 - Mar 11, 2026</SelectItem>
                <SelectItem value="2026-03-12_2026-03-25">Mar 12 - Mar 25, 2026</SelectItem>
                <SelectItem value="2026-03-26_2026-04-08">Mar 26 - Apr 8, 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" placeholder="Add any notes..." />
          </div>
        </div>
        <DialogFooter>
          {(!startDate || !endDate) ? (
            <BaseButton disabled aria-disabled="true">
              Run Payroll
              <ArrowRight className="w-4 h-4 ml-2" />
            </BaseButton>
          ) : (
            <BaseButton asChild>
              <Link href={`/manager/payroll-status?startDate=${startDate}&endDate=${endDate}`}>
                Run Payroll
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </BaseButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card className="m-6">
      <CardHeader>
        <CardTitle>Payroll Records</CardTitle>
        <CardDescription>Review payroll records</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={payrollRecords}
          searchPlaceholder="Search records..."
          headerAction={runPayrollButton}
          isLoading={isLoading}
          error={error}
        />
      </CardContent>
    </Card>
  );
}
