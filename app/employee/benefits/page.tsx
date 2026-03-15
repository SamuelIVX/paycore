"use client"

import { useState } from "react"
import { companyBenefits, optionalBenefits } from "./data"

import SummaryCards from "./summary-cards/page"
import CompanyBenefitCards from "./company-benefits-cards/page"
import OptionalBenefitsCard from "./optional-benefits-cards/page"
import ProgressBarCard from "./progress-bar/page"
import ImportantInfoCard from "./important-info-card/page"

export default function BenefitsPage() {
  const [selectedOptional, setSelectedOptional] = useState<Record<string, boolean>>({
    "Vision Insurance": true,
    "Wellness Program": true,
  })

  const monthlyDeduction = Object.entries(selectedOptional).reduce((sum, [name, on]) => {
    if (!on) return sum
    const benefit = optionalBenefits.find((x) => x.title === name)
    return sum + (benefit?.monthlyCost ?? 0)
  }, 0)

  const companyCount = companyBenefits.length
  const optionalCount = optionalBenefits.length
  const selectedCount = Object.values(selectedOptional).filter(Boolean).length
  const activeTotal = companyCount + selectedCount
  const pctCompany = activeTotal > 0 ? Math.round((companyCount / activeTotal) * 100) : 100

  return (
    <div className="container mx-auto py-4">

      <SummaryCards
        company_count={companyCount}
        optional_count={optionalCount}
        monthly_deduction={monthlyDeduction}
      />

      <ProgressBarCard
        company_count={companyCount}
        optional_count={optionalCount}
        selected_count={selectedCount}
        pct_company={pctCompany}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <CompanyBenefitCards />

        <OptionalBenefitsCard
          selected_benefits={selectedOptional}
          set_selected_benefits={setSelectedOptional}
        />
      </div>

      <ImportantInfoCard />

    </div>
  )
}