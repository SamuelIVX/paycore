'use client'

/**
 * Manager employee table: list/add/edit/delete with dialogs.
 * SECURITY: exposes pay rates and employee PII to managers.
 */
import { useMemo, useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { AddEmployeeDialog } from "@/components/manager/dialogs/add-employee-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEmployees, updateEmployee, deleteEmployee } from "@/lib/supabase/employee";
import { Tables } from "@/lib/interfaces/database.types";
import { DataTable, SortableHeader } from "@/components/ui/data-table";

type Employee = Tables<"employees">;

function getStatusBadgeClass(status: string | null) {
  switch (status) {
    case "ACTIVE": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    case "TERMINATED": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    case "RETIRED": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    case "QUIT": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
    case "DISABLED": return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
    default: return "bg-secondary text-secondary-foreground";
  }
}

const PAY_FREQUENCY_LABELS: Record<string, string> = {
  HOURLY: "Hourly",
  BI_WEEKLY: "Bi-Weekly",
  SALARY: "Salary",
};

function ActionsCell({ employee, onUpdate, onDelete, onError }: {
  employee: Employee;
  onUpdate: (updates: Partial<Employee>) => Promise<void>;
  onDelete: () => Promise<void>;
  onError: (msg: string) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editValues, setEditValues] = useState({
    first_name: employee.first_name ?? "",
    last_name: employee.last_name ?? "",
    position: employee.position ?? "",
    pay_frequency: employee.pay_frequency ?? "",
    pay_rate: employee.pay_rate ?? 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const employeeName = `${employee.first_name ?? ""} ${employee.last_name ?? ""}`.trim();

  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            aria-label={employeeName ? `Actions for ${employeeName}` : "Employee actions"}
            className="min-h-[44px] min-w-[44px]"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Dialog open={editOpen} onOpenChange={(open) => {
            if (open) setEditValues({
              first_name: employee.first_name ?? "",
              last_name: employee.last_name ?? "",
              position: employee.position ?? "",
              pay_frequency: employee.pay_frequency ?? "",
              pay_rate: employee.pay_rate ?? 0,
            });
            setEditOpen(open);
          }}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Employee</DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Employee</DialogTitle>
                <DialogDescription>Update employee details in the system</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstName">First Name</Label>
                  <Input id="edit-firstName" value={editValues.first_name} onChange={(e) => setEditValues((v) => ({ ...v, first_name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lastName">Last Name</Label>
                  <Input id="edit-lastName" value={editValues.last_name} onChange={(e) => setEditValues((v) => ({ ...v, last_name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position</Label>
                  <Input id="edit-position" value={editValues.position} onChange={(e) => setEditValues((v) => ({ ...v, position: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-payFrequency">Pay Frequency</Label>
                  <Select value={editValues.pay_frequency} onValueChange={(value) => setEditValues((v) => ({ ...v, pay_frequency: value }))}>
                    <SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOURLY">Hourly</SelectItem>
                      <SelectItem value="BI_WEEKLY">Bi-Weekly</SelectItem>
                      <SelectItem value="SALARY">Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-payRate">Pay</Label>
                  <Input id="edit-payRate" type="number" value={editValues.pay_rate} onChange={(e) => setEditValues((v) => ({ ...v, pay_rate: Number(e.target.value) }))} />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={isSubmitting}
                  onClick={async () => {
                    setIsSubmitting(true);
                    try {
                      await onUpdate(editValues);
                      setEditOpen(false);
                    } catch {
                      onError("Failed to update employee.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete Employee</DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Employee</DialogTitle>
                <DialogDescription>Confirm deletion of employee from the system</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="default" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                <Button
                  variant="destructive"
                  disabled={isSubmitting}
                  onClick={async () => {
                    setIsSubmitting(true);
                    try {
                      await onDelete();
                      setDeleteOpen(false);
                    } catch {
                      onError("Failed to delete employee.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/**
 * Employee Table presentational component.
 * @returns The rendered EmployeeTable UI.
 * @example
 * // Routed page component (EmployeeTable)
 */
export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEmployees()
      .then((employees) => setEmployees(employees ?? []))
      .catch(() => setError("Failed to load employees."))
      .finally(() => setIsLoading(false));
  }, []);

  const columns = useMemo<ColumnDef<Employee, unknown>[]>(() => [
    {
      id: "name",
      accessorFn: (row) => `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
      header: ({ column }) => <SortableHeader column={column} label="Name" />,
      cell: ({ row }) => (
        <span className="font-medium">
          {`${row.original.first_name ?? ""} ${row.original.last_name ?? ""}`.trim() || "—"}
        </span>
      ),
    },
    {
      accessorKey: "position",
      header: ({ column }) => <SortableHeader column={column} label="Position" />,
      cell: ({ row }) => row.original.position ?? "—",
    },
    {
      accessorKey: "hire_date",
      header: ({ column }) => <SortableHeader column={column} label="Hire Date" />,
      cell: ({ row }) =>
        row.original.hire_date
          ? <span className="tabular-nums">{row.original.hire_date}</span>
          : "—",
    },
    {
      accessorKey: "pay_frequency",
      header: ({ column }) => <SortableHeader column={column} label="Pay Type" />,
      cell: ({ row }) => {
        const pf = row.original.pay_frequency;
        return pf ? (PAY_FREQUENCY_LABELS[pf] ?? pf) : "—";
      },
    },
    {
      accessorKey: "pay_rate",
      header: ({ column }) => <SortableHeader column={column} label="Pay" />,
      cell: ({ row }) =>
        row.original.pay_rate == null
          ? "—"
          : <span className="tabular-nums">${row.original.pay_rate.toLocaleString()}</span>,
    },
    {
      accessorKey: "employment_status",
      header: ({ column }) => <SortableHeader column={column} label="Status" />,
      cell: ({ row }) => (
        <Badge className={getStatusBadgeClass(row.original.employment_status)}>
          {row.original.employment_status ?? "unknown"}
        </Badge>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <ActionsCell
          employee={row.original}
          onUpdate={async (updates) => {
            await updateEmployee(row.original.id, updates);
            setEmployees((prev) => prev.map((e) => e.id === row.original.id ? { ...e, ...updates } : e));
            setError(null);
          }}
          onDelete={async () => {
            await deleteEmployee(row.original.id);
            setEmployees((prev) => prev.filter((e) => e.id !== row.original.id));
            setError(null);
          }}
          onError={setError}
        />
      ),
    },
  ], []);

  const addEmployeeButton = (
    <AddEmployeeDialog
      onSuccess={async () => {
        try {
          const updated = await getEmployees();
          setEmployees(updated ?? []);
          setError(null);
        } catch {
          setError("Employee was added, but failed to refresh table.");
        }
      }}
    />
  );

  return (
    <Card className="m-6">
      <CardHeader>
        <CardTitle>Employee Management</CardTitle>
        <CardDescription>Add, edit, or remove employees</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={employees}
          searchPlaceholder="Search employees..."
          headerAction={addEmployeeButton}
          isLoading={isLoading}
          error={error}
        />
      </CardContent>
    </Card>
  );
}
