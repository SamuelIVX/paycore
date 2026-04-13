"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CheckData } from "@/app/employee/paystubs/types";

const greenTheme = {
	primary: "#1B5E20",
	primaryLight: "#2E7D32",
	primaryLighter: "#4CAF50",
	background: "#E8F5E9",
	white: "#FFFFFF",
	text: "#1B5E20",
	textLight: "#2E7D32",
	grey: "#558B2F",
	border: "#4CAF50",
};

const styles = StyleSheet.create({
	page: {
		padding: 40,
		fontFamily: "Helvetica",
		fontSize: 10,
		backgroundColor: greenTheme.white,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
		paddingBottom: 15,
		borderBottomWidth: 2,
		borderBottomColor: greenTheme.primary,
	},
	companyInfo: {
		fontSize: 9,
		color: greenTheme.textLight,
	},
	checkHeader: {
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "right",
		color: greenTheme.primary,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	divider: {
		height: 1,
		backgroundColor: greenTheme.primaryLight,
		marginVertical: 10,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 4,
		paddingVertical: 2,
	},
	label: {
		width: 120,
		color: greenTheme.textLight,
	},
	value: {
		fontWeight: "bold",
		color: greenTheme.text,
	},
	sectionTitle: {
		fontSize: 11,
		fontWeight: "bold",
		marginTop: 15,
		marginBottom: 8,
		borderBottom: `1px solid ${greenTheme.border}`,
		paddingBottom: 4,
		color: greenTheme.primary,
		textTransform: "uppercase",
	},
	tableHeader: {
		flexDirection: "row",
		backgroundColor: greenTheme.background,
		paddingVertical: 4,
		paddingHorizontal: 4,
		borderBottomWidth: 1,
		borderBottomColor: greenTheme.border,
	},
	tableHeaderCell: {
		fontSize: 8,
		fontWeight: "bold",
		color: greenTheme.text,
		textTransform: "uppercase",
	},
	tableRow: {
		flexDirection: "row",
		paddingVertical: 3,
		paddingHorizontal: 4,
		borderBottomWidth: 0.5,
		borderBottomColor: "#E0E0E0",
	},
	tableCell: {
		fontSize: 9,
		color: greenTheme.text,
	},
	tableCellDesc: {
		fontSize: 9,
		color: greenTheme.textLight,
	},
	amountBox: {
		border: `2px solid ${greenTheme.primary}`,
		padding: 10,
		marginTop: 20,
		marginBottom: 20,
		backgroundColor: greenTheme.background,
	},
	amountRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	amountLabel: {
		fontSize: 12,
		fontWeight: "bold",
		color: greenTheme.primary,
	},
	amountValue: {
		fontSize: 18,
		fontWeight: "bold",
		color: greenTheme.primary,
	},
	footer: {
		marginTop: 30,
		fontSize: 9,
		color: greenTheme.textLight,
		paddingTop: 10,
		borderTopWidth: 1,
		borderTopColor: greenTheme.border,
	},
});

function formatCurrency(amount: number): string {
	return `$${amount.toFixed(2)}`;
}

function formatDate(dateStr: string): string {
	if (!dateStr) return "";
	const date = new Date(dateStr);

	if (isNaN(date.getTime())) return dateStr;

	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function CheckPDF({ data }: { data: CheckData }) {
	return (
		<Document>
			<Page size="LETTER" style={styles.page}>
				<View style={styles.header}>
					<View>
						<Text style={styles.companyInfo}>{data.companyName}</Text>
						<Text style={styles.companyInfo}>{data.companyAddress}</Text>
						<Text style={styles.companyInfo}>{data.companyPhone}</Text>
					</View>
					<View>
						<Text style={styles.checkHeader}>PAYMENT VOUCHER</Text>
					</View>
				</View>

				<View style={styles.divider} />

				<View style={styles.row}>
					<Text style={styles.label}>PAY TO:</Text>
					<Text style={styles.value}>{data.employeeName}</Text>
				</View>

				<View style={styles.row}>
					<Text style={styles.label}>ADDRESS:</Text>
					<Text style={styles.value}>{data.employeeAddress}</Text>
				</View>

				<View style={styles.row}>
					<Text style={styles.label}>PAY DATE:</Text>
					<Text style={styles.value}>{formatDate(data.payDate)}</Text>
				</View>

				<View style={styles.row}>
					<Text style={styles.label}>PAY TYPE:</Text>
					<Text style={styles.value}>{data.payType}</Text>
				</View>

				<View style={styles.row}>
					<Text style={styles.label}>HOURS WORKED:</Text>
					<Text style={styles.value}>
						{data.regularHours.toFixed(2)} regular +{" "}
						{data.overtimeHours.toFixed(2)} overtime
					</Text>
				</View>

				<View style={styles.row}>
					<Text style={styles.label}>PAY RATE:</Text>
					<Text style={styles.value}>{formatCurrency(data.payRate)}</Text>
				</View>

				<View style={styles.divider} />

				<Text style={styles.sectionTitle}>EARNINGS</Text>
				<View style={styles.tableHeader}>
					<Text style={[styles.tableHeaderCell, { width: 140 }]}>
						Description
					</Text>
					<Text
						style={[styles.tableHeaderCell, { width: 70, textAlign: "right" }]}
					>
						Current
					</Text>
					<Text
						style={[styles.tableHeaderCell, { width: 70, textAlign: "right" }]}
					>
						YTD
					</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.tableCellDesc, { width: 140 }]}>
						Regular Hours
					</Text>
					<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
						{data.regularHours.toFixed(2)}
					</Text>
					<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
						{(data.regularHours * (data.ytdGross / data.grossPay || 1)).toFixed(2)}
					</Text>
				</View>
				{data.overtimeHours > 0 && (
					<View style={styles.tableRow}>
						<Text style={[styles.tableCellDesc, { width: 140 }]}>
							Overtime Hours
						</Text>
						<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
							{data.overtimeHours.toFixed(2)}
						</Text>
						<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
							{(data.overtimeHours * 4).toFixed(2)}
						</Text>
					</View>
				)}
				<View style={styles.tableRow}>
					<Text style={[styles.tableCellDesc, { width: 140 }]}>
						Regular Pay
					</Text>
					<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
						{formatCurrency(data.regularPay)}
					</Text>
					<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
						{formatCurrency(data.regularPay * 4)}
					</Text>
				</View>
				{data.overtimePay > 0 && (
					<View style={styles.tableRow}>
						<Text style={[styles.tableCellDesc, { width: 140 }]}>
							Overtime Pay
						</Text>
						<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
							{formatCurrency(data.overtimePay)}
						</Text>
						<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
							{formatCurrency(data.overtimePay * 4)}
						</Text>
					</View>
				)}
				<View style={styles.tableRow}>
					<Text style={[styles.value, { width: 140 }]}>Gross Pay</Text>
					<Text style={[styles.value, { width: 70, textAlign: "right" }]}>
						{formatCurrency(data.grossPay)}
					</Text>
					<Text style={[styles.value, { width: 70, textAlign: "right" }]}>
						{formatCurrency(data.ytdGross)}
					</Text>
				</View>

				<Text style={styles.sectionTitle}>DEDUCTIONS</Text>
				<View style={styles.tableHeader}>
					<Text style={[styles.tableHeaderCell, { width: 140 }]}>
						Description
					</Text>
					<Text
						style={[styles.tableHeaderCell, { width: 70, textAlign: "right" }]}
					>
						Current
					</Text>
					<Text
						style={[styles.tableHeaderCell, { width: 70, textAlign: "right" }]}
					>
						YTD
					</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.tableCellDesc, { width: 140 }]}>
						Federal Tax
					</Text>
					<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
						-{formatCurrency(data.federalTax)}
					</Text>
					<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
						-{formatCurrency(data.ytdFederalTax)}
					</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.tableCellDesc, { width: 140 }]}>State Tax</Text>
					<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
						-{formatCurrency(data.stateTax)}
					</Text>
					<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
						-{formatCurrency(data.ytdStateTax)}
					</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.tableCellDesc, { width: 140 }]}>
						Social Security
					</Text>
					<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
						-{formatCurrency(data.socialSecurity)}
					</Text>
					<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
						-{formatCurrency(data.ytdSocialSecurity)}
					</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.tableCellDesc, { width: 140 }]}>Medicare</Text>
					<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
						-{formatCurrency(data.medicare)}
					</Text>
					<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
						-{formatCurrency(data.ytdMedicare)}
					</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.tableCellDesc, { width: 140 }]}>Benefits</Text>
					<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
						-{formatCurrency(data.benefitDeductions)}
					</Text>
					<Text style={[styles.tableCell, { width: 70, textAlign: "right" }]}>
						-{formatCurrency(data.ytdBenefits)}
					</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.value, { width: 140 }]}>Total Deductions</Text>
					<Text style={[styles.value, { width: 70, textAlign: "right" }]}>
						-
						{formatCurrency(
							data.federalTax +
							data.stateTax +
							data.socialSecurity +
							data.medicare +
							data.benefitDeductions,
						)}
					</Text>
					<Text style={[styles.value, { width: 70, textAlign: "right" }]}>
						-
						{formatCurrency(
							data.ytdFederalTax +
							data.ytdStateTax +
							data.ytdSocialSecurity +
							data.ytdMedicare +
							data.ytdBenefits,
						)}
					</Text>
				</View>

				<View style={styles.amountBox}>
					<View style={styles.amountRow}>
						<View>
							<Text style={styles.amountLabel}>NET AMOUNT:</Text>
							<Text
								style={{
									fontSize: 9,
									color: greenTheme.textLight,
									marginTop: 4,
								}}
							>
								Year-to-Date: {formatCurrency(data.ytdNetPay)}
							</Text>
						</View>
						<Text style={styles.amountValue}>
							{formatCurrency(data.netPay)}
						</Text>
					</View>
				</View>

				<View style={styles.footer}>
					<Text>Authorized Signature: _________________________</Text>
					<Text style={{ marginTop: 10 }}>
						This document serves as a payment voucher. For questions, contact{" "}
						{data.companyName} at {data.companyPhone}.
					</Text>
				</View>
			</Page>
		</Document>
	);
}
