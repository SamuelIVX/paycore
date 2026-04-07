import ManagerStatCards from "@/components/manager/stat-cards/Statcards"
import GridContent from "@/components/manager/grid-content/GridContent"

export default function ManagerDashboardPage() {
    return (
        <div className="container mx-auto py-4">

            <ManagerStatCards />

            <GridContent />

        </div>
    )
}