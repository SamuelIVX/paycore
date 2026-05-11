export interface EligibilityInput {
  employmentStatus: string | null;
  hoursPerWeek: number | null;
  state: string | null;
}

export interface EligibilityResult {
  eligible: boolean;
  thresholdHours: 30;
  reason?: string;
  shortMessage?: string;
}

export function checkOptionalBenefitsEligibility(employee: EligibilityInput): EligibilityResult {
  const hours = employee.hoursPerWeek ?? 0;

  if (hours >= 30) {
    return { eligible: true, thresholdHours: 30 };
  }

  return {
    eligible: false,
    thresholdHours: 30,
    reason: `Optional benefits require 30+ approved hours. You currently have ${hours} approved hours on record. You may still be eligible for coverage through the NY State of Health Marketplace.`,
    shortMessage: "30+ approved hours required",
  };
}

export function shouldApplyOptionalDeductions(employee: EligibilityInput): boolean {
  return checkOptionalBenefitsEligibility(employee).eligible;
}
