/**
 * Maps raw payroll_record rows into ProcessedPaystub for PDF/UI; company letterhead constants.
 * SECURITY: processes compensation and address PII.
 */
import { formatPayPeriod, formatPaidOn } from "@/lib/utils";
import type { RawPaystubRow, CheckData, ProcessedPaystub } from "./types";

/** Letterhead constants stamped onto generated paystub PDFs. */
export const COMPANY_INFO = {
  name: "PayCore Inc.",
  address: "123 Business Ave",
  city: "San Francisco, CA 94105",
  phone: "(555) 123-4567",
};

/**
 * Deterministic pseudo-random in [min, min+range) from a string seed.
 * Used for synthetic YTD/SSN display values on demo paystubs (not real SSN).
 * SECURITY: output can look like an SSN — never treat as a real identifier.
 * @param seed - Hash seed (usually record id).
 * @param min - Inclusive lower bound.
 * @param range - Width of the half-open interval.
 * @returns Integer in [min, min+range).
 * @example
 * stableNumber("rec-1", 1000, 9000) // => deterministic 4-digit-ish int
 */
function stableNumber(seed: string, min: number, range: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return min + (Math.abs(hash) % range);
}

/**
 * Normalizes a RawPaystubRow into ProcessedPaystub for PDF/list UI.
 * SECURITY: carries pay and address fields through to the PDF.
 * @param row - Payroll record with nested run + employee joins.
 * @returns Display/PDF-ready paystub including synthetic YTD/SSN demo fields.
 * @example
 * const stub = processPaystubData(rawRow);
 * // stub.netPay / stub.ssn ready for CheckPDF
 */
export function processPaystubData(row: RawPaystubRow): ProcessedPaystub {
  const payrollRun = row.payroll_runs;
  const employee = row.employees;

  const employeeName =
    [employee?.first_name, employee?.last_name].filter(Boolean).join(" ") ||
    "Unknown";
  const employeeAddress =
    [
      employee?.address_line,
      employee?.city,
      employee?.state,
      employee?.zip_code,
    ]
      .filter(Boolean)
      .join(", ") || "No address on file";
  const payDate = (payrollRun?.run_date || row.created_at || "").split("T")[0];

  const regularHours = row.regular_hours || 0;
  const overtimeHours = row.overtime_hours || 0;
  const payRate = employee?.pay_rate || 0;
  const regularPay = payRate * regularHours;
  const overtimePay = payRate * overtimeHours * 1.5;
  const grossPay = row.gross_pay || 0;
  const netPay = row.net_pay || 0;

  const federalTax = row.federal_tax || 0;
  const stateTax = row.state_tax || 0;
  const socialSecurity = row.social_security || 0;
  const medicare = row.medicare ?? grossPay * 0.0145;
  const benefitDeductions = row.benefit_deductions || 0;

  const totalDeductions =
    federalTax + stateTax + socialSecurity + medicare + benefitDeductions;

  const ytdMultiplier = stableNumber(row.id, 3, 5);
  const ytdGross = row.ytd_gross ?? grossPay * ytdMultiplier;
  const ytdFederalTax = row.ytd_federal_tax ?? federalTax * ytdMultiplier;
  const ytdStateTax = row.ytd_state_tax ?? stateTax * ytdMultiplier;
  const ytdSocialSecurity =
    row.ytd_social_security ?? socialSecurity * ytdMultiplier;
  const ytdMedicare = row.ytd_medicare ?? medicare * ytdMultiplier;
  const ytdBenefits = row.ytd_benefits ?? benefitDeductions * ytdMultiplier;
  const ytdNetPay = row.ytd_net_pay ?? netPay * ytdMultiplier;
  const ytdTotalDeductions =
    ytdFederalTax +
    ytdStateTax +
    ytdSocialSecurity +
    ytdMedicare +
    ytdBenefits;

  const employeeId = employee?.id?.slice(0, 8) || "EMP001";
  const ssnSuffix = String(stableNumber(row.id + "ssn", 1000, 9000)).padStart(
    4,
    "0",
  );
  const ssn = `***-**-${ssnSuffix}`;

  const period = formatPayPeriod(
    payrollRun?.pay_period_start ?? null,
    payrollRun?.pay_period_end ?? null,
  );
  const paidOn = formatPaidOn(payrollRun?.run_date ?? row.created_at ?? null);

  return {
    id: row.id,
    period,
    paidOn,
    employeeId,
    ssn,
    totalDeductions,
    ytdTotalDeductions,
    employeeName,
    employeeAddress,
    payDate,
    payType: (employee?.pay_frequency as CheckData["payType"]) || "HOURLY",
    payRate,
    hoursWorked: regularHours + overtimeHours,
    regularHours,
    overtimeHours,
    regularPay,
    overtimePay,
    grossPay,
    netPay,
    federalTax,
    stateTax,
    socialSecurity,
    medicare,
    benefitDeductions,
    ytdGross,
    ytdFederalTax,
    ytdStateTax,
    ytdSocialSecurity,
    ytdMedicare,
    ytdBenefits,
    ytdNetPay,
    companyName: COMPANY_INFO.name,
    companyAddress: `${COMPANY_INFO.address}, ${COMPANY_INFO.city}`,
    companyPhone: COMPANY_INFO.phone,
  };
}
