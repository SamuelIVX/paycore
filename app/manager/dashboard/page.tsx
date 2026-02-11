import ManagerStatCards from "../stat-cards/cards"
import GridContent from "../grid-content/page"

export default function ManagerDashboardPage() {
    return (
        <div className="container mx-auto py-4">

            <ManagerStatCards />

            <GridContent />

        </div>
    )
}