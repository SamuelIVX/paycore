'use client';

/**
 * Manager payroll records table for completed run line items.
 * SECURITY: shows per-employee gross/net/tax figures.
 */
import { useMemo, useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getPayrollRecords } from "@/lib/supabase/payroll";
import { PayrollRecordType } from "./types";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { RunPayrollDialog } from "@/components/manager/dialogs/run-payroll-dialog";

function hoursValue(record: PayrollRecordType, field: "regular_hours" | "overtime_hours"): number | null {
  if (record.employees?.pay_frequency === "HOURLY" || record.employees == null) {
    return record[field] ?? null;
  }
  return null;
}

function formatHours(value: number | null): string {
  return value == null ? "—" : String(value);
}

/**
 * Payroll Table presentational component.
 * @returns The rendered PayrollTable UI.
 * @example
 * // Routed page component (PayrollTable)
 */
export default function PayrollTable() {
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
      id: "employee_name",
      accessorFn: (row) => {
        const firstName = row.employees?.first_name ?? "";
        const lastName = row.employees?.last_name ?? "";
        return `${firstName} ${lastName}`.trim();
      },
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

  const runPayrollButton = <RunPayrollDialog />;

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
