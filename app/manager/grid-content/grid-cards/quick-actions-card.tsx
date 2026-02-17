import { ArrowRight, DollarSign, FileCheck, Heart, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function QuickActionCard() {
    return (
        <Card>

            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common payroll management tasks</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="h-24 flex flex-col gap-2" variant="outline">
                            <UserPlus className="w-8 h-8" />
                            <span>Add Employee</span>
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
                            <Button >Add Employee</Button>
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
                            <Button asChild>
                                <Link href="/manager/payroll-status">
                                    Run Payroll
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Button className="h-24 flex flex-col gap-2" variant="outline" asChild>
                    <Link href="/manager/payroll-records-table">
                        <FileCheck className="w-8 h-8" />
                        <span>Approve Payroll</span>
                    </Link>
                </Button>

                <Button className="h-24 flex flex-col gap-2" variant="outline">
                    <Heart className="w-8 h-8" />
                    <span>View Benefits</span>
                </Button>

            </CardContent>

        </Card >
    )
}