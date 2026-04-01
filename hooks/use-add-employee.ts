import { useState } from "react"
import { addEmployee as addEmployeeToDB } from "@/lib/supabase/employee"

export function useAddEmployee() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [position, setPosition] = useState("")
    const [payFrequency, setPayFrequency] = useState("")
    const [payRate, setPayRate] = useState(0)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const handleAddEmployee = async (): Promise<boolean> => {
        setLoading(true)
        try {
            await addEmployeeToDB({
                employee_number: `EMP-${Date.now()}`,
                hire_date: new Date().toISOString().split("T")[0],
                first_name: firstName,
                last_name: lastName,
                position,
                pay_frequency: payFrequency,
                pay_rate: payRate,
                employment_status: "ACTIVE",
            })
            setOpen(false)
            setFirstName("")
            setLastName("")
            setPosition("")
            setPayFrequency("")
            setPayRate(0)
            return true;
        } catch (error) {
            console.error("Error adding employee:", error);
            alert("Failed to add employee. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
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
