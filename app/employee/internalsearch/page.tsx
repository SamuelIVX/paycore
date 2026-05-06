'use client'

import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { getEmployeeDirectory } from "@/lib/supabase/employee";
import { DirectoryEntry } from "@/lib/supabase/types";

export default function EmployeeDirectory() {
  const [rows, setRows] = useState<DirectoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEmployeeDirectory()
      .then((data) => setRows(data))
      .catch(() => setError("Failed to load employees."))
      .finally(() => setIsLoading(false));
  }, []);

  const columns = useMemo<ColumnDef<DirectoryEntry, unknown>[]>(() => [
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
      accessorKey: "email",
      header: ({ column }) => <SortableHeader column={column} label="Email" />,
      cell: ({ row }) => row.original.email ?? "—",
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <SortableHeader column={column} label="Phone" />,
      cell: ({ row }) => row.original.phone ?? "—",
    },
    {
      accessorKey: "department",
      header: ({ column }) => <SortableHeader column={column} label="Department" />,
      cell: ({ row }) => row.original.department ?? "—",
    },
    {
      accessorKey: "position",
      header: ({ column }) => <SortableHeader column={column} label="Position" />,
      cell: ({ row }) => row.original.position ?? "—",
    },
  ], []);

  return (
    <Card className="m-6">
      <CardHeader>
        <CardTitle>Employee Directory</CardTitle>
        <CardDescription>Search coworkers by name, department, or position</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={rows}
          searchPlaceholder="Search employees..."
          isLoading={isLoading}
          error={error}
          onRowClick={(row) => {
            if (row.email) {
              window.location.href = `mailto:${row.email}`;
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
