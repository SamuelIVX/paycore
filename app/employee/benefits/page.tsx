"use client"

import { useState, useEffect, useMemo } from "react"
import { Info } from "lucide-react"
import SummaryCards from "@/components/employee/summary-cards/SummaryCards"
import CompanyBenefitCards from "@/components/employee/company-benefits-cards/CompanyBenefits"
import OptionalBenefitsCard from "@/components/employee/optional-benefits-cards/OptionalBenefits"
import ProgressBarCard from "@/components/employee/progress-bar/ProgressBar"
import ImportantInfoCard from "@/components/employee/important-info-card/ImportantInfoCard"
import {
  getCompanyBenefitsCount,
  getOptionalBenefitsCount,
  getActiveOptionalEmployeeBenefits,
  getOptionalBenefits,
} from "@/lib/supabase/benefits"
import { getCurrentEmployee } from "@/lib/supabase/employee"
import { getApprovedHoursWorked } from "@/lib/supabase/time-entries"
import { checkOptionalBenefitsEligibility } from "@/lib/benefits/eligibility"
import type { EmployeeBenefit, BenefitOption } from "@/app/employee/benefits/types"

export default function BenefitsPage() {
  const [employeeId, setEmployeeId] = useState<string>("");
  const [employmentStatus, setEmploymentStatus] = useState<string | null>(null);
  const [hoursPerWeek, setHoursPerWeek] = useState<number | null>(null);
  const [employeeState, setEmployeeState] = useState<string | null>(null);
  const [hoursLoading, setHoursLoading] = useState<boolean>(true);
  const [hoursLoadError, setHoursLoadError] = useState<boolean>(false);

  useEffect(() => {
    getCurrentEmployee().then((emp) => {
      const employee = emp?.employee;
      setEmployeeId(employee?.id || "");
      setEmploymentStatus(employee?.employment_status ?? null);
      setEmployeeState(employee?.state ?? null);
    }).catch((err) => {
      console.error("Failed to get current employee:", err);
    });

    getApprovedHoursWorked()
      .then((hours) => setHoursPerWeek(hours))
      .catch((err) => {
        console.error("Failed to get approved hours worked:", err);
        setHoursLoadError(true);
      })
      .finally(() => setHoursLoading(false));
  }, []);

  const eligibility = useMemo(
    () => checkOptionalBenefitsEligibility({
      employmentStatus,
      hoursPerWeek,
      state: employeeState,
      loading: hoursLoading,
      error: hoursLoadError,
    }),
    [employmentStatus, hoursPerWeek, employeeState, hoursLoading, hoursLoadError]
  );

  const [selectedOptional, setSelectedOptional] = useState<Record<string, boolean>>({})
  const [optionalBenefits, setOptionalBenefits] = useState<BenefitOption[]>([])
  const [companyCount, setCompanyCount] = useState(0)
  const [optionalCount, setOptionalCount] = useState(0)

  useEffect(() => {
    if (!employeeId) return;

    getCompanyBenefitsCount().then(setCompanyCount);
    getOptionalBenefitsCount().then(setOptionalCount);

    getOptionalBenefits().then(setOptionalBenefits).catch((error) => {
      console.error("Failed to fetch optional benefits.", error)
    })

    getActiveOptionalEmployeeBenefits(employeeId).then((rows) => {
      const selected: Record<string, boolean> = {};
      rows.forEach((row: EmployeeBenefit) => {
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

        <div className="flex flex-col gap-4">
          {!eligibility.eligible && !eligibility.loading && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-500 dark:text-amber-400" />
                <div className="space-y-1">
                  <p className="font-semibold text-amber-600 dark:text-amber-400">
                    You are not currently eligible to enroll in optional benefits
                  </p>
                  {eligibility.reason && (
                    <p className="text-sm text-amber-700/80 dark:text-amber-300/80">
                      {eligibility.reason}
                    </p>
                  )}
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/70 pt-1 border-t border-amber-500/20 mt-2">
                    Your company-provided benefits remain active at no cost. Contact HR if your scheduled hours have changed.
                  </p>
                </div>
              </div>
            </div>
          )}

          <OptionalBenefitsCard
            selected_benefits={selectedOptional}
            set_selected_benefits={setSelectedOptional}
            eligibility={eligibility}
          />
        </div>
      </div>

      <ImportantInfoCard />

    </div>
  )
}