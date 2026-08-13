/**
 * Manager dashboard shell (force-dynamic) composing stat and grid cards.
 */
import ManagerStatCards from "@/components/manager/stat-cards/Statcards"
import GridContent from "@/components/manager/grid-content/GridContent"
import { getActiveEmployeesCount, getTotalAnnualPayroll } from "@/lib/supabase/employee"

/**
 * dynamic App Router page.
 * @returns The rendered dynamic UI.
 * @example
 * // Routed page component (dynamic)
 */
export const dynamic = "force-dynamic"

/**
 * Manager Dashboard Page App Router page.
 * @returns The rendered ManagerDashboardPage UI.
 * @example
 * // Routed page component (ManagerDashboardPage)
 */
export default async function ManagerDashboardPage() {
    const results = await Promise.allSettled([
        getActiveEmployeesCount(),
        getTotalAnnualPayroll()
    ])

    const totalEmployees = results[0].status === "fulfilled" ? results[0].value : undefined
    const totalAnnualPayroll = results[1].status === "fulfilled" ? results[1].value : undefined

    return (
        <div className="container mx-auto py-4">

            <ManagerStatCards
                totalEmployees={totalEmployees}
                totalAnnualPayroll={totalAnnualPayroll}
            />

            <GridContent />

        </div>
    )
}