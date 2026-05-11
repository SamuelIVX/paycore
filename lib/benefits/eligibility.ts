export interface EligibilityInput {
  employmentStatus: string | null;
  hoursPerWeek: number | null;
  state: string | null;
  loading?: boolean;
}

export interface EligibilityResult {
  eligible: boolean;
  loading?: boolean;
  thresholdHours: number;
  reason?: string;
  shortMessage?: string;
}

interface StateRule {
  thresholdHours: number;
  marketplaceMessage: string;
}

const DEFAULT_STATE_RULE: StateRule = {
  thresholdHours: 30,
  marketplaceMessage: "You may still be eligible for coverage through HealthCare.gov.",
};

const STATE_RULES: Record<string, StateRule> = {
  NY: {
    thresholdHours: 30,
    marketplaceMessage: "You may still be eligible for coverage through the NY State of Health Marketplace.",
  },
  CA: {
    thresholdHours: 30,
    marketplaceMessage: "You may still be eligible for coverage through Covered California.",
  },
  // Hawaii Prepaid Health Care Act sets a lower threshold than the federal ACA rule
  HI: {
    thresholdHours: 20,
    marketplaceMessage: "You may still be eligible for coverage through the Hawaii Health Connector.",
  },
};

const EXEMPT_EMPLOYMENT_STATUSES = new Set(["CONTRACTOR", "SEASONAL", "INTERN", "1099"]);

export function checkOptionalBenefitsEligibility(employee: EligibilityInput): EligibilityResult {
  const rule = (employee.state && STATE_RULES[employee.state.toUpperCase()]) || DEFAULT_STATE_RULE;
  const { thresholdHours, marketplaceMessage } = rule;

  if (employee.loading || employee.hoursPerWeek === null) {
    return { eligible: false, loading: true, thresholdHours };
  }

  const normalizedStatus = employee.employmentStatus?.toUpperCase() ?? null;

  if (normalizedStatus === "TERMINATED") {
    return {
      eligible: false,
      thresholdHours,
      reason: "Optional benefits are not available for terminated employees.",
      shortMessage: "Not eligible — terminated",
    };
  }

  if (normalizedStatus && EXEMPT_EMPLOYMENT_STATUSES.has(normalizedStatus)) {
    return {
      eligible: false,
      thresholdHours,
      reason: "Optional benefits are limited to W-2 employees. Contractors, interns, and seasonal workers are not eligible for payroll-deducted benefits.",
      shortMessage: "Not eligible for this employment type",
    };
  }

  if (employee.hoursPerWeek >= thresholdHours) {
    return { eligible: true, thresholdHours };
  }

  return {
    eligible: false,
    thresholdHours,
    reason: `Optional benefits require ${thresholdHours}+ approved hours per week. You currently have ${employee.hoursPerWeek} approved hours on record. ${marketplaceMessage}`,
    shortMessage: `${thresholdHours}+ approved hours required`,
  };
}

export function shouldApplyOptionalDeductions(employee: EligibilityInput): boolean {
  return checkOptionalBenefitsEligibility(employee).eligible;
}
