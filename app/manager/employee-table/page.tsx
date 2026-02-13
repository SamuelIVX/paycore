import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Edit } from "lucide-react";

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
    return (
        <Card className="m-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Employee Management</CardTitle>
                        <CardDescription>Add, edit, or remove employees</CardDescription>
                    </div>
                    <Dialog >
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="w-4 h-4 mr-2" />
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
                                    <Label htmlFor="empName">Full Name</Label>
                                    <Input id="empName" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="empRole">Role</Label>
                                    <Input id="empRole" placeholder="Software Engineer" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="empSalary">Annual Salary</Label>
                                    <Input id="empSalary" type="number" placeholder="75000" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button>Add Employee</Button>
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
                                    <Badge variant={employee.status === "active" ? "default" : "outline"}>
                                        {employee.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}