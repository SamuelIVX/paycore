"use client";

import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, Download } from "lucide-react";
import { CheckPDF } from "./CheckPDF";
import type { CheckData } from "@/app/employee/paystubs/types";

interface CheckFormProps {
	data: CheckData;
	children: React.ReactNode;
}

export function CheckForm({ data, children }: CheckFormProps) {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState<CheckData>(data);

	const handleChange = (field: keyof CheckData, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Printer className="h-5 w-5" />
						Print Check
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm">
								Check Details (Editable)
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-4 md:grid-cols-2">
							<div className="grid gap-2">
								<Label htmlFor="employeeName">Pay To (Name)</Label>
								<Input
									id="employeeName"
									value={formData.employeeName}
									onChange={(e) => handleChange("employeeName", e.target.value)}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="employeeAddress">Address</Label>
								<Input
									id="employeeAddress"
									value={formData.employeeAddress}
									onChange={(e) =>
										handleChange("employeeAddress", e.target.value)
									}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="payDate">Pay Date</Label>
								<Input
									id="payDate"
									type="date"
									value={formData.payDate}
									onChange={(e) => handleChange("payDate", e.target.value)}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="payType">Pay Type</Label>
								<Input
									id="payType"
									value={formData.payType}
									onChange={(e) => handleChange("payType", e.target.value)}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="payRate">Pay Rate</Label>
								<Input
									id="payRate"
									type="number"
									value={formData.payRate}
									onChange={(e) =>
										handleChange("payRate", Number(e.target.value))
									}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="hoursWorked">Hours Worked</Label>
								<Input
									id="hoursWorked"
									type="number"
									value={formData.hoursWorked}
									onChange={(e) =>
										handleChange("hoursWorked", Number(e.target.value))
									}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="grossPay">Gross Pay</Label>
								<Input
									id="grossPay"
									type="number"
									value={formData.grossPay}
									onChange={(e) =>
										handleChange("grossPay", Number(e.target.value))
									}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="netPay">Net Pay</Label>
								<Input
									id="netPay"
									type="number"
									value={formData.netPay}
									onChange={(e) =>
										handleChange("netPay", Number(e.target.value))
									}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="federalTax">Federal Tax</Label>
								<Input
									id="federalTax"
									type="number"
									value={formData.federalTax}
									onChange={(e) =>
										handleChange("federalTax", Number(e.target.value))
									}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="stateTax">State Tax</Label>
								<Input
									id="stateTax"
									type="number"
									value={formData.stateTax}
									onChange={(e) =>
										handleChange("stateTax", Number(e.target.value))
									}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="socialSecurity">Social Security</Label>
								<Input
									id="socialSecurity"
									type="number"
									value={formData.socialSecurity}
									onChange={(e) =>
										handleChange("socialSecurity", Number(e.target.value))
									}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="benefitDeductions">Benefits</Label>
								<Input
									id="benefitDeductions"
									type="number"
									value={formData.benefitDeductions}
									onChange={(e) =>
										handleChange("benefitDeductions", Number(e.target.value))
									}
								/>
							</div>
						</CardContent>
					</Card>

					<div className="flex justify-end gap-2">
						<PDFDownloadLink
							document={<CheckPDF data={formData} />}
							fileName={`${formData.employeeName.replace(/\s+/g, "_")}_${formData.payDate}.pdf`}
						>
							{({ loading }) => (
								<Button disabled={loading}>
									<Download className="h-4 w-4 mr-2" />
									{loading ? "Generating..." : "Download PDF"}
								</Button>
							)}
						</PDFDownloadLink>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
