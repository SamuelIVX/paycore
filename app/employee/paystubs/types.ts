export interface PaystubInfoProps {
	title: string;
	value: string | number;
	valueClassName?: string;
}

export interface PayStub {
	id: string;
	period: string;
	paidOn: string;
	netPay: number;
	grossPay: number;
	taxes: number;
	benefits: number;
}

export interface CheckData {
	employeeName: string;
	employeeAddress: string;
	payDate: string;
	payType: "HOURLY" | "SALARY" | "BI_WEEKLY";
	payRate: number;
	hoursWorked: number;
	regularHours: number;
	overtimeHours: number;
	regularPay: number;
	overtimePay: number;
	grossPay: number;
	netPay: number;
	federalTax: number;
	stateTax: number;
	socialSecurity: number;
	medicare: number;
	benefitDeductions: number;
	ytdGross: number;
	ytdFederalTax: number;
	ytdStateTax: number;
	ytdSocialSecurity: number;
	ytdMedicare: number;
	ytdBenefits: number;
	ytdNetPay: number;
	companyName: string;
	companyAddress: string;
	companyPhone: string;
}
export interface RawPaystubRow {
	id: string;
	regular_hours: number | null;
	overtime_hours: number | null;
	gross_pay: number;
	federal_tax: number | null;
	state_tax: number | null;
	benefit_deductions: number | null;
	social_security: number | null;
	medicare: number | null;
	net_pay: number;
	created_at: string | null;
	payroll_runs: {
		id: string;
		pay_period_start: string | null;
		pay_period_end: string | null;
		run_date: string | null;
		status: string | null;
	} | null;
	employees: {
		id?: string;
		pay_rate: number | null;
		pay_frequency: string | null;
		first_name: string | null;
		last_name: string | null;
		address_line: string | null;
		city: string | null;
		state: string | null;
		zip_code: string | null;
		phone: string | null;
	} | null;
	ytd_gross?: number;
	ytd_federal_tax?: number;
	ytd_state_tax?: number;
	ytd_social_security?: number;
	ytd_medicare?: number;
	ytd_benefits?: number;
	ytd_net_pay?: number;
}

export interface PayStubRowProps {
	label: string;
	current: number;
	ytd: number;
	isNegative?: boolean;
	isBold?: boolean;
}
export interface ProcessedPaystub extends CheckData {
	id: string;
	period: string;
	paidOn: string;
	employeeId: string;
	ssn: string;
	totalDeductions: number;
	ytdTotalDeductions: number;
}