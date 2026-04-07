import SummaryCards from "@/components/manager/summary-cards/SummaryCards"
import CompanyBenefitsGrid from "@/components/manager/company-benefits/CompanyBenefits"
import OptionalBenefitsGrid from "@/components/manager/optional-benefits/OptionalBenefits"

export default function BenefitsPage() {
    return (
        <div className="container mx-auto py-6">

            <SummaryCards />

            <CompanyBenefitsGrid />

            <OptionalBenefitsGrid />

        </div>
    )
}