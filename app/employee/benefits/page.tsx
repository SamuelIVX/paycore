"use client"

import { useState } from "react"
import { companyBenefits, optionalBenefits } from "./data"
import SummaryCards from "./summary_cards/page"
import CompanyBenefitsCard from "./company_benefits/page"
import OptionalBenefitsCard from "./optional_benefits/page"
import ProgressBarCard from "../progress_bar/page"
import ImportantInfoCard from "../important_info/page"

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

  const annualCost = monthlyDeduction * 12

  const companyCount = companyBenefits.length
  const optionalCount = optionalBenefits.length
  const selectedCount = Object.values(selectedOptional).filter(Boolean).length
  const activeTotal = companyCount + selectedCount
  const pctCompany = activeTotal > 0 ? Math.round((companyCount / activeTotal) * 100) : 100

  return (
    <div className="container mx-auto py-4">

      <SummaryCards company_count={companyCount} monthly_deduction={monthlyDeduction} annual_cost={annualCost} />

      <ProgressBarCard
        company_count={companyCount}
        optional_count={optionalCount}
        selected_count={selectedCount}
        pct_company={pctCompany}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompanyBenefitsCard />

        <OptionalBenefitsCard selected_benefits={selectedOptional} set_selected_benefits={setSelectedOptional} />

      </div>

      <ImportantInfoCard />

    </div >
  )
}