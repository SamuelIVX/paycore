import SummaryCards from "./summary-cards/cards"
import CompanyBenefitsGrid from "./company-benefits/benefits"
import OptionalBenefitsGrid from "./optional-benefits/benefits"

export default function BenefitsPage() {
    return (
        <div className="container mx-auto py-6">

            <SummaryCards />

            <CompanyBenefitsGrid />

            <OptionalBenefitsGrid />

        </div>
    )
}