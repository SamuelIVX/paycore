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
    DialogClose
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
    const [editFirstName, setEditFirstName] = useState<string>("");
    const [editLastName, setEditLastName] = useState<string>("");
    const [editPosition, setEditPosition] = useState<string>("");
    const [editPayFrequency, setEditPayFrequency] = useState<string>("");
    const [editPayRate, setEditPayRate] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

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
                                <Button onClick={handleAddEmployee} disabled={loading}>
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
                                        {employee.employment_status}
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
                                            <Dialog>
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
                                                            <Label htmlFor="edit-empPosition">First Name</Label>
                                                            <Input
                                                                id="edit-empPosition"
                                                                placeholder="Software Engineer"
                                                                onChange={(e) => setEditFirstName(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-empPosition">Last Name</Label>
                                                            <Input
                                                                id="edit-empPosition"
                                                                placeholder="Software Engineer"
                                                                onChange={(e) => setEditLastName(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-empPosition">Position</Label>
                                                            <Input
                                                                id="edit-empPosition"
                                                                placeholder="Software Engineer"
                                                                onChange={(e) => setEditPosition(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-payType">Pay Type</Label>
                                                            <Input
                                                                id="edit-payType"
                                                                placeholder="Hourly"
                                                                onChange={(e) => setEditPayFrequency(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-empPay">Pay</Label>
                                                            <Input
                                                                id="edit-empPay"
                                                                type="number"
                                                                placeholder="75000"
                                                                onChange={(e) => setEditPayRate(Number(e.target.value))}
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button
                                                                onClick={() => updateEmployee(employee.id,
                                                                    {
                                                                        first_name: editFirstName || employee.first_name,
                                                                        last_name: editLastName || employee.last_name,
                                                                        position: editPosition || employee.position,
                                                                        pay_frequency: editPayFrequency || employee.pay_frequency,
                                                                        pay_rate: editPayRate || employee.pay_rate
                                                                    })}>
                                                                Update
                                                            </Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog>
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
                                                        <DialogClose asChild>
                                                            <Button variant="default">Cancel</Button>
                                                        </DialogClose>
                                                        <DialogClose asChild>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => deleteEmployee(employee.id)}>
                                                                Delete
                                                            </Button>
                                                        </DialogClose>
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