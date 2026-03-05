import { useState } from "react"
import { addEmployee as addEmployeeToDB } from "@/lib/employee"

export function useAddEmployee() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [position, setPosition] = useState("")
    const [payFrequency, setPayFrequency] = useState("")
    const [payRate, setPayRate] = useState(0)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const handleAddEmployee = async () => {
        setLoading(true)
        await addEmployeeToDB({
            employee_number: `EMP-${Date.now()}`,
            hire_date: new Date().toISOString().split("T")[0],
            first_name: firstName,
            last_name: lastName,
            position,
            pay_frequency: payFrequency,
            pay_rate: payRate,
        })
        setLoading(false)
        setOpen(false)
        setFirstName("")
        setLastName("")
        setPosition("")
        setPayFrequency("")
        setPayRate(0)
    }

    return {
        firstName, setFirstName,
        lastName, setLastName,
        position, setPosition,
        payFrequency, setPayFrequency,
        payRate, setPayRate,
        loading,
        open, setOpen,
        handleAddEmployee,
    }
}
