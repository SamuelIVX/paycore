/**
 * Employee-facing UI: ImportantInfoCard.
 */
import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"

/**
 * Important Info Card presentational component.
 * @returns The rendered ImportantInfoCard UI.
 */
export default function ImportantInfoCard() {
  return (
    <Card className="bg-amber-50/70 border-amber-200/80 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/60 dark:text-amber-200 w-full md:w-2/3 lg:w-1/2 mx-auto mt-6 shadow-xs">
      <CardContent className="flex gap-3 p-4 sm:p-5">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />

        <div className="text-sm">
          <h3 className="font-semibold mb-1 text-amber-900 dark:text-amber-200">Important Information</h3>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-amber-800 dark:text-amber-300/90 leading-relaxed">
            <li>Changes to optional benefits take effect on the 1st of the following month</li>
            <li>Deductions are automatically calculated and shown on your pay stubs</li>
            <li>You can modify your benefits during open enrollment or after qualifying life events</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
