import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"

export default function ImportantInfoCard() {
    return (

        <Card className="bg-amber-50 border-amber-200 w-1/2 mx-auto mt-4">

            <CardContent className="flex gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />

                <div className="text-sm text-amber-900">
                    <p className="font-medium mb-1">Important Information</p>
                    <ul className="list-disc list-inside space-y-1 text-amber-800">
                        <li>Changes to optional benefits take effect on the 1st of the following month</li>
                        <li>Deductions are automatically calculated and shown on your pay stubs</li>
                        <li>You can modify your benefits during open enrollment or after qualifying life events</li>
                    </ul>
                </div>

            </CardContent>

        </Card>
    )
}