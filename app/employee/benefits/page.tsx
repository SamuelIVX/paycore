"use client"

import { useState, useEffect } from "react"
import SummaryCards from "./summary-cards/page"
import CompanyBenefitCards from "./company-benefits-cards/page"
import OptionalBenefitsCard from "./optional-benefits-cards/page"
import ProgressBarCard from "./progress-bar/page"
import ImportantInfoCard from "./important-info-card/page"
import {
  getCompanyBenefitsCount,
  getOptionalBenefitsCount,
  getActiveOptionalEmployeeBenefits,
  getOptionalBenefits,
} from "@/lib/supabase/benefits"
import { getCurrentEmployee } from "@/lib/supabase/employee"

export default function BenefitsPage() {
  const [employeeId, setEmployeeId] = useState<string>("");

  useEffect(() => {
    getCurrentEmployee().then((emp) => {
      setEmployeeId(emp?.employee.id || "");
    }).catch((err) => {
      console.error("Failed to get current employee:", err);
    });
  }, []);

  const [selectedOptional, setSelectedOptional] = useState<Record<string, boolean>>({})
  const [optionalBenefits, setOptionalBenefits] = useState<any[]>([])
  const [companyCount, setCompanyCount] = useState(0)
  const [optionalCount, setOptionalCount] = useState(0)

  useEffect(() => {
    if (!employeeId) return;

    // Fetch counts and active optionals
    getCompanyBenefitsCount().then(setCompanyCount);
    getOptionalBenefitsCount().then(setOptionalCount);

    getOptionalBenefits().then(setOptionalBenefits).catch((error) => {
      console.error("Failed to fetch optional benefits.", error)
    })

    getActiveOptionalEmployeeBenefits(employeeId).then((rows) => {
      // Set selectedOptional keyed by benefit_id
      const selected: Record<string, boolean> = {};

      rows.forEach((row: any) => {
        if (row.status === 'ACTIVE' && row.benefit?.id) {
          selected[row.benefit.id] = true;
        }
      });

      setSelectedOptional(selected);
    }).catch((error) => {
      console.error("Failed to fetch active employee benefits:", error)
    })
  }, [employeeId]);

  const monthlyDeduction = optionalBenefits.reduce((sum, benefit) => {
    if (selectedOptional[benefit.id]) {
      return sum + (benefit.monthly_cost || 0)
    }
    return sum
  }, 0)

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