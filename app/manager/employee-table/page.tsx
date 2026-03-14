'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Edit } from "lucide-react";
import { useAddEmployee } from "@/hooks/use-add-employee";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEmployees, updateEmployee, deleteEmployee } from "@/lib/employee";
import { Tables } from "@/lib/interfaces/database.types";
import { useEffect, useState } from "react";

type Employee = Tables<"employees">;

export default function EmployeeTable() {
    const {
        firstName, setFirstName,
        lastName, setLastName,
        position, setPosition,
        payFrequency, setPayFrequency,
        payRate, setPayRate,
        loading,
        open, setOpen,
        handleAddEmployee,
    } = useAddEmployee()

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [editOpenId, setEditOpenId] = useState<Employee["id"] | null>(null);
    const [editValues, setEditValues] = useState({ first_name: "", last_name: "", position: "", pay_frequency: "", pay_rate: 0 });
    const [deleteOpenId, setDeleteOpenId] = useState<Employee["id"] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getEmployees()
            .then((employees) => setEmployees(employees ?? []))
            .catch(() => setError("Failed to load employees."));
    }, []);

    return (
        <Card className="m-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Employee Management</CardTitle>
                        <CardDescription>Add, edit, or remove employees</CardDescription>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="w-4 h-4" />
                                Add Employee
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Employee</DialogTitle>
                                <DialogDescription>Enter employee details to add them to the system</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="addEmpFirstName">First Name</Label>
                                    <Input
                                        id="addEmpFirstName"
                                        placeholder="John"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="addEmpLastName">Last Name</Label>
                                    <Input
                                        id="addEmpLastName"
                                        placeholder="Smith"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="addEmpPosition">Position</Label>
                                    <Input
                                        id="addEmpPosition"
                                        placeholder="Software Engineer"
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="addEmpPayFrequency">Pay Frequency</Label>
                                    <Select value={payFrequency} onValueChange={setPayFrequency}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="HOURLY">Hourly</SelectItem>
                                            <SelectItem value="BI_WEEKLY">Bi-Weekly</SelectItem>
                                            <SelectItem value="SALARY">Salary</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label >Pay Rate</Label>
                                    <Input
                                        type="number"
                                        placeholder="75000"
                                        value={payRate}
                                        onChange={(e) => setPayRate(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={async () => {
                                        const success = await handleAddEmployee();
                                        if (!success) return;

                                        try {
                                            const updated = await getEmployees();
                                            setEmployees(updated ?? []);
                                            setError(null);
                                        } catch {
                                            setError("Employee was added, but failed to refresh table.");
                                        }
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? "Adding..." : "Add Employee"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Hire Date</TableHead>
                            <TableHead>Pay Type</TableHead>
                            <TableHead>Pay</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map(employee => (
                            <TableRow key={employee.id}>
                                <TableCell className="font-medium">{employee.first_name} {employee.last_name}</TableCell>
                                <TableCell>{employee.position ?? "—"}</TableCell>
                                <TableCell>{employee.hire_date ?? "—"}</TableCell>
                                <TableCell>{employee.pay_frequency ?? "—"}</TableCell>
                                <TableCell>${employee.pay_rate.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={employee.employment_status === "ACTIVE" ? "default" : "destructive"}>
                                        {employee.employment_status ?? "unknown"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <Dialog
                                                open={editOpenId === employee.id}
                                                onOpenChange={(open) => {
                                                    if (open) {
                                                        setEditValues({
                                                            first_name: employee.first_name ?? "",
                                                            last_name: employee.last_name ?? "",
                                                            position: employee.position ?? "",
                                                            pay_frequency: employee.pay_frequency ?? "",
                                                            pay_rate: employee.pay_rate,
                                                        });
                                                        setEditOpenId(employee.id);
                                                    } else {
                                                        setEditOpenId(null);
                                                    }
                                                }}
                                            >
                                                <DialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        Edit Employee
                                                    </DropdownMenuItem>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Employee</DialogTitle>
                                                        <DialogDescription>Update employee details in the system</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-empFirstName">First Name</Label>
                                                            <Input
                                                                id="edit-empFirstName"
                                                                value={editValues.first_name}
                                                                onChange={(e) => setEditValues((v) => ({ ...v, first_name: e.target.value }))}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-empLastName">Last Name</Label>
                                                            <Input
                                                                id="edit-empLastName"
                                                                value={editValues.last_name}
                                                                onChange={(e) => setEditValues((v) => ({ ...v, last_name: e.target.value }))}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-empPosition">Position</Label>
                                                            <Input
                                                                id="edit-empPosition"
                                                                value={editValues.position}
                                                                onChange={(e) => setEditValues((v) => ({ ...v, position: e.target.value }))}
                                                            />
                                                        </div>
                                                        <Select
                                                            value={editValues.pay_frequency}
                                                            onValueChange={(value) => setEditValues((v) => ({ ...v, pay_frequency: value }))}
                                                        >
                                                            <SelectTrigger id="edit-payType">
                                                                <SelectValue placeholder="Choose..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="HOURLY">Hourly</SelectItem>
                                                                <SelectItem value="BI_WEEKLY">Bi-Weekly</SelectItem>
                                                                <SelectItem value="SALARY">Salary</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-empPay">Pay</Label>
                                                            <Input
                                                                id="edit-empPay"
                                                                type="number"
                                                                value={editValues.pay_rate}
                                                                onChange={(e) => setEditValues((v) => ({ ...v, pay_rate: Number(e.target.value) }))}
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button
                                                            disabled={isSubmitting}
                                                            onClick={async () => {
                                                                try {
                                                                    setIsSubmitting(true);
                                                                    const updates = {
                                                                        first_name: editValues.first_name,
                                                                        last_name: editValues.last_name,
                                                                        position: editValues.position,
                                                                        pay_frequency: editValues.pay_frequency,
                                                                        pay_rate: editValues.pay_rate,
                                                                    };
                                                                    await updateEmployee(employee.id, updates);
                                                                    setEmployees((prev) =>
                                                                        prev.map((e) =>
                                                                            e.id === employee.id ? { ...e, ...updates } : e
                                                                        )
                                                                    );
                                                                    setEditOpenId(null);
                                                                    setError(null);
                                                                } catch {
                                                                    setError("Failed to update employee.");
                                                                } finally {
                                                                    setIsSubmitting(false)
                                                                }
                                                            }}>
                                                            {isSubmitting ? "Updating..." : "Update"}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog
                                                open={deleteOpenId === employee.id}
                                                onOpenChange={(open) => setDeleteOpenId(open ? employee.id : null)}
                                            >
                                                <DialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        Delete Employee
                                                    </DropdownMenuItem>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Delete Employee</DialogTitle>
                                                        <DialogDescription>Confirm deletion of employee from the system</DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="default" onClick={() => setDeleteOpenId(null)}>Cancel</Button>
                                                        <Button
                                                            variant="destructive"
                                                            disabled={isSubmitting}
                                                            onClick={async () => {
                                                                setIsSubmitting(true)
                                                                try {
                                                                    await deleteEmployee(employee.id);
                                                                    setEmployees((prev) => prev.filter((e) => e.id !== employee.id));
                                                                    setDeleteOpenId(null);
                                                                    setError(null);
                                                                } catch {
                                                                    setError("Failed to delete employee.");
                                                                } finally {
                                                                    setIsSubmitting(false)
                                                                }
                                                            }}>
                                                            {isSubmitting ? "Deleting..." : "Delete"}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card >
    )
}