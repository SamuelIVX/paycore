import { useState } from "react"
import { addBenefit } from "@/lib/supabase/benefits"

export function useAddBenefit(initialType: "COMPANY" | "OPTIONAL" = "COMPANY") {
    const [benefit, setBenefit] = useState("")
    const [tag, setTag] = useState("")
    const [type, setType] = useState<"COMPANY" | "OPTIONAL">(initialType)
    const [description, setDescription] = useState("")
    const [provider, setProvider] = useState("")
    const [monthlyCost, setMonthlyCost] = useState(0)
    const [coverage, setCoverage] = useState("")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const handleAddBenefit = async (): Promise<boolean> => {
        if (!benefit.trim() || !tag) {
            console.error("Benefit name and tag are required.")
            return false

        }

        setLoading(true)
        try {
            await addBenefit({
                benefit,
                tag,
                type,
                description,
                provider,
                monthly_cost: monthlyCost,
                coverage,
            })
            setOpen(false)
            setBenefit("")
            setTag("")
            setType(initialType)
            setDescription("")
            setProvider("")
            setMonthlyCost(0)
            setCoverage("")
            return true
        } catch (error) {
            console.error("Error adding benefit:", error)
            alert("Failed to add benefit. Please try again.")
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        benefit, setBenefit,
        tag, setTag,
        type, setType,
        description, setDescription,
        provider, setProvider,
        monthlyCost, setMonthlyCost,
        coverage, setCoverage,
        loading,
        open, setOpen,
        handleAddBenefit,
    }
}
