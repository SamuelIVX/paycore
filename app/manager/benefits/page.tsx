import SummaryCards from "@/components/manager/summary-cards/SummaryCards"
import CompanyBenefitsGrid from "@/components/manager/company-benefits/CompanyBenefits"
import OptionalBenefitsGrid from "@/components/manager/optional-benefits/OptionalBenefits"
import { getCompanyBenefitsCount, getOptionalBenefitsCount } from "@/lib/supabase/benefits"
import { getAverageBenefitDeductions } from "@/lib/supabase/payroll"

export const dynamic = "force-dynamic"

export default async function BenefitsPage() {
    const results = await Promise.allSettled([
        getCompanyBenefitsCount(),
        getOptionalBenefitsCount(),
        getAverageBenefitDeductions()
    ])

    const companyBenefitsCount = results[0].status === "fulfilled" ? results[0].value : undefined
    const optionalBenefitsCount = results[1].status === "fulfilled" ? results[1].value : undefined
    const avgDeductions = results[2].status === "fulfilled" ? results[2].value : undefined

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