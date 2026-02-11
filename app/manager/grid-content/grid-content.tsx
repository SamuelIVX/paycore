import QuickActionCard from "./grid-cards/quick-actions-card"
import TeamDistributionPieChart from "./grid-cards/team-distribution"
import RecentActivityCard from "./grid-cards/recent-activity"
import PayrollTrendChart from "./grid-cards/payroll-chart"
import SalaryDistributionBarChart from "./grid-cards/salary-distribution-chart"
import UpcomingTasksCard from "./grid-cards/upcoming-tasks"

export default function GridContent() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="space-y-6">
                <QuickActionCard />

                <TeamDistributionPieChart />

                <RecentActivityCard />

            </div>

            <div className="space-y-6">

                <PayrollTrendChart />

                <SalaryDistributionBarChart />

                <UpcomingTasksCard />
            </div>

        </div>
    )
}