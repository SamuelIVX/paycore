import SummaryCards from "@/components/manager/summary-cards/SummaryCards"
import CompanyBenefitsGrid from "@/components/manager/company-benefits/CompanyBenefits"
import OptionalBenefitsGrid from "@/components/manager/optional-benefits/OptionalBenefits"
import { getCompanyBenefitsCount, getOptionalBenefitsCount } from "@/lib/supabase/benefits"
import { getAverageBenefitDeductions } from "@/lib/supabase/payroll"

export const dynamic = "force-dynamic"

export default async function BenefitsPage() {
    const [companyBenefitsCount, optionalBenefitsCount, avgDeductions] = await Promise.all([
        getCompanyBenefitsCount(),
        getOptionalBenefitsCount(),
        getAverageBenefitDeductions()
    ])

    return (
        <div className="container mx-auto py-6">

            <SummaryCards
                companyBenefitsCount={companyBenefitsCount}
                optionalBenefitsCount={optionalBenefitsCount}
                avgDeductions={avgDeductions}
            />

            <CompanyBenefitsGrid />

            <OptionalBenefitsGrid />

        </div>
    )
}