import ManagerStatCards from "@/components/manager/stat-cards/Statcards"
import GridContent from "@/components/manager/grid-content/GridContent"
import { getActiveEmployeesCount, getTotalAnnualPayroll } from "@/lib/supabase/employee"

export const dynamic = "force-dynamic"

export default async function ManagerDashboardPage() {
    const [totalEmployees, totalAnnualPayroll] = await Promise.all([
        getActiveEmployeesCount(),
        getTotalAnnualPayroll()
    ])

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