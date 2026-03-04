'use client'

import { useState } from "react"
import { ArrowRight, DollarSign, FileCheck, Heart, UserPlus } from "lucide-react"
import { Button } from "@/components/animate-ui/components/buttons/button"
import { Button as BaseButton } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { addEmployee as addEmployeeToDB } from "@/lib/employee"

export default function QuickActionCard() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [position, setPosition] = useState("");
    const [payFrequency, setPayFrequency] = useState("");
    const [payRate, setPayRate] = useState(0);

    const handleAddEmployee = async () => {
        await addEmployeeToDB({
            employee_number: `EMP-${Date.now()}`,
            hire_date: new Date().toISOString().split("T")[0],
            first_name: firstName,
            last_name: lastName,
            position,
            pay_frequency: payFrequency,
            pay_rate: payRate
        })
    }

    return (
        <Card>

            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common payroll management tasks</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="h-24 flex flex-col gap-2"
                            variant="outline">
                            <UserPlus className="w-8 h-8" />
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
                                <Label >First Name</Label>
                                <Input
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label >Last Name</Label>
                                <Input
                                    placeholder="Smith"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label >Position</Label>
                                <Input
                                    placeholder="Software Engineer"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label >Pay Frequency</Label>
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
                            <DialogClose asChild>
                                <Button onClick={handleAddEmployee}>Add Employee</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="h-24 flex flex-col gap-2" variant="outline">
                            <DollarSign className="w-8 h-8" />
                            <span>Run Payroll</span>
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
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes (Optional)</Label>
                                <Textarea id="notes" placeholder="Add any notes..." />
                            </div>
                        </div>
                        <DialogFooter>
                            <BaseButton asChild>
                                <Link href="/manager/payroll-status">
                                    Run Payroll
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </BaseButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <BaseButton className="h-24 flex flex-col gap-2" variant="outline" asChild>
                    <Link href="/manager/payroll-records-table">
                        <FileCheck className="w-8 h-8" />
                        <span>Approve Payroll</span>
                    </Link>
                </BaseButton>

                <BaseButton className="h-24 flex flex-col gap-2" variant="outline" asChild>
                    <Link href="/manager/benefits">
                        <Heart className="w-8 h-8" />
                        <span>View Benefits</span>
                    </Link>
                </BaseButton>

            </CardContent>

        </Card >
    )
}