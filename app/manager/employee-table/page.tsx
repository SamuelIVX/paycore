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

/* TODO (Backend): Remove all hardcoded from the employee data table and replace with data fetched from Supabase  */
const employees = ([
    { id: "1", name: "John Smith", role: "Software Engineer", payType: "Annual", pay: 85000, status: "active" },
    { id: "2", name: "Sarah Johnson", role: "Product Manager", payType: "Hourly", pay: 35, status: "offline" },
    { id: "3", name: "Mike Chen", role: "Designer", payType: "Bi-Weekly", pay: 3600, status: "on break" },
    { id: "4", name: "Emily Davis", role: "Data Analyst", payType: "Weekly", pay: 1800, status: "active" },
    { id: "5", name: "John Smith", role: "Software Engineer", payType: "Annual", pay: 85000, status: "active" },
    { id: "6", name: "Sarah Johnson", role: "Product Manager", payType: "Hourly", pay: 35, status: "offline" },
    { id: "7", name: "Mike Chen", role: "Designer", payType: "Bi-Weekly", pay: 3600, status: "on break" },
    { id: "8", name: "Emily Davis", role: "Data Analyst", payType: "Weekly", pay: 1800, status: "active" },
    { id: "9", name: "John Smith", role: "Software Engineer", payType: "Annual", pay: 85000, status: "active" },
    { id: "10", name: "Sarah Johnson", role: "Product Manager", payType: "Hourly", pay: 35, status: "offline" },
    { id: "11", name: "John Smith", role: "Software Engineer", payType: "Annual", pay: 85000, status: "active" },
    { id: "12", name: "Sarah Johnson", role: "Product Manager", payType: "Hourly", pay: 35, status: "offline" },
]);

/* TODO (Backend): Add functionalities to the table (e.g., edit, delete, search, sort)  */
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
                                            <SelectItem value="MONTHLY">Monthly</SelectItem>
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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Pay Type</TableHead>
                            <TableHead>Pay</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map(employee => (
                            <TableRow key={employee.id}>
                                <TableCell className="font-medium">{employee.name}</TableCell>
                                <TableCell>{employee.role}</TableCell>
                                <TableCell>{employee.payType}</TableCell>
                                <TableCell>${employee.pay.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={employee.status === "active" ? "default" : employee.status === "offline" ? "destructive" : "outline"}>
                                        {employee.status}
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
                                                            <Label htmlFor="edit-empName">Full Name</Label>
                                                            <Input id="edit-empName" placeholder="John Doe" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-empRole">Role</Label>
                                                            <Input id="edit-empRole" placeholder="Software Engineer" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-payType">Pay Type</Label>
                                                            <Input id="edit-payType" placeholder="Hourly/Salary" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-empPay">Pay</Label>
                                                            <Input id="edit-empPay" type="number" placeholder="75000" />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button> Edit Employee </Button>
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
                                                            <Button variant="destructive">Delete</Button>
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