"use client"

/**
 * Reusable Add Employee Dialog component used across manager dashboard and table views.
 */
import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAddEmployee } from "@/hooks/use-add-employee"

export interface AddEmployeeDialogProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

/**
 * Add Employee Dialog modal with form fields for profile and pay details.
 * @param props - Trigger node and optional success callback.
 * @returns Dialog component wrapping useAddEmployee hook.
 * @example
 * <AddEmployeeDialog onSuccess={refreshEmployees} />
 */
export function AddEmployeeDialog({ trigger, onSuccess }: AddEmployeeDialogProps) {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    position,
    setPosition,
    payFrequency,
    setPayFrequency,
    payRate,
    setPayRate,
    loading,
    open,
    setOpen,
    handleAddEmployee,
  } = useAddEmployee()

  const handleSubmit = async () => {
    const success = await handleAddEmployee()
    if (success && onSuccess) {
      onSuccess()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Enter employee details to add them to the system.
          </DialogDescription>
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
              <SelectTrigger id="addEmpPayFrequency">
                <SelectValue placeholder="Choose frequency..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOURLY">Hourly</SelectItem>
                <SelectItem value="BI_WEEKLY">Bi-Weekly</SelectItem>
                <SelectItem value="SALARY">Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="addEmpPayRate">Pay Rate</Label>
            <Input
              id="addEmpPayRate"
              type="number"
              placeholder="75000"
              value={payRate || ""}
              onChange={(e) => setPayRate(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? "Adding..." : "Add Employee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
