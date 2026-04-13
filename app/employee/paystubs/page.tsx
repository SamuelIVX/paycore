"use client";

import { useEffect, useState } from "react";
import { Download, ChevronDown } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getEmployeePaystubs } from "@/lib/supabase/paystubs";
import { CheckPDF } from "@/components/employee/check-form/CheckPDF";
import { processPaystubData, COMPANY_INFO } from "./utils";
import type { ProcessedPaystub, RawPaystubRow, PayStubRowProps } from "./types";

const money = (n: number) => `$${n.toFixed(2)}`;

function PayStubRow({
  label,
  current,
  ytd,
  isNegative = false,
  isBold = false,
}: PayStubRowProps) {
  return (
    <tr className={isBold ? "font-bold bg-muted/30" : ""}>
      <td className="py-1.5 px-3 text-sm">{label}</td>
      <td className="py-1.5 px-3 text-sm text-right tabular-nums">
        {isNegative ? "-" : ""}
        {money(Math.abs(current))}
      </td>
      <td className="py-1.5 px-3 text-sm text-right tabular-nums">
        {isNegative ? "-" : ""}
        {money(Math.abs(ytd))}
      </td>
    </tr>
  );
}

function PayStubCard({
  stub,
  isExpanded,
  onToggle,
}: {
  stub: ProcessedPaystub;
  isExpanded: boolean;
  onToggle: () => void;
}) {

  const ytdMultiplier = stub.grossPay > 0 ? stub.ytdGross / stub.grossPay : 1;

  return (
    <Card className="shadow-md overflow-hidden pt-0">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className="w-full bg-green-900 text-white px-6 py-4 hover:bg-green-800 transition-colors flex justify-between items-center cursor-pointer"
      >
        <div className="text-left">
          <p className="text-lg font-bold tracking-wide">{COMPANY_INFO.name}</p>
          <p className="text-green-200 text-sm">Pay Date: {stub.paidOn}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-2xl font-bold text-green-400">
              {money(stub.netPay)}
            </p>
            <p className="text-xs text-green-300">{stub.period}</p>
          </div>

          {!isExpanded && (
            <Button
              variant="ghost"
              size="sm"
              aria-label="Expand to download"
              className="text-white hover:bg-slate-600 h-8"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          <ChevronDown
            className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""
              }`}
          />
        </div>
      </div>

      {isExpanded && (
        <CardContent className="p-0">
          <div className="grid grid-cols-2 gap-6 px-6 py-4 bg-muted/20 border-b">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Employee Information
              </p>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">{stub.employeeName}</p>
                <p className="text-muted-foreground">{stub.employeeAddress}</p>
                <p className="text-muted-foreground">SSN: {stub.ssn}</p>
                <p className="text-muted-foreground">
                  Employee ID: {stub.employeeId}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Payment Details
              </p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Pay Period:</span>{" "}
                  {stub.period}
                </p>
                <p>
                  <span className="text-muted-foreground">Pay Date:</span>{" "}
                  {stub.paidOn}
                </p>
                <p>
                  <span className="text-muted-foreground">Pay Type:</span>{" "}
                  {stub.payType}
                </p>
                <p>
                  <span className="text-muted-foreground">Pay Rate:</span>{" "}
                  {money(stub.payRate)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="px-6 py-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                EARNINGS
              </span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b">
                  <th className="text-left py-2 px-3 font-medium">
                    Description
                  </th>
                  <th className="text-right py-2 px-3 font-medium">Current</th>
                  <th className="text-right py-2 px-3 font-medium">YTD</th>
                </tr>
              </thead>
              <tbody>
                <PayStubRow
                  label="Regular Hours"
                  current={stub.regularHours}
                  ytd={stub.regularHours * ytdMultiplier}
                />
                <PayStubRow
                  label="Overtime Hours"
                  current={stub.overtimeHours}
                  ytd={stub.overtimeHours * ytdMultiplier}
                />
                <PayStubRow
                  label="Regular Pay"
                  current={stub.regularPay}
                  ytd={stub.regularPay * ytdMultiplier}
                />
                {stub.overtimeHours > 0 && (
                  <PayStubRow
                    label="Overtime Pay"
                    current={stub.overtimePay}
                    ytd={stub.overtimePay * ytdMultiplier}
                  />
                )}
                <PayStubRow
                  label="Gross Pay"
                  current={stub.grossPay}
                  ytd={stub.ytdGross}
                  isBold
                />
              </tbody>
            </table>
          </div>

          <Separator />

          <div className="px-6 py-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                DEDUCTIONS
              </span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b">
                  <th className="text-left py-2 px-3 font-medium">
                    Description
                  </th>
                  <th className="text-right py-2 px-3 font-medium">Current</th>
                  <th className="text-right py-2 px-3 font-medium">YTD</th>
                </tr>
              </thead>
              <tbody>
                <PayStubRow
                  label="Federal Tax"
                  current={stub.federalTax}
                  ytd={stub.ytdFederalTax}
                  isNegative
                />
                <PayStubRow
                  label="State Tax"
                  current={stub.stateTax}
                  ytd={stub.ytdStateTax}
                  isNegative
                />
                <PayStubRow
                  label="Social Security"
                  current={stub.socialSecurity}
                  ytd={stub.ytdSocialSecurity}
                  isNegative
                />
                <PayStubRow
                  label="Medicare"
                  current={stub.medicare}
                  ytd={stub.ytdMedicare}
                  isNegative
                />
                <PayStubRow
                  label="Benefits"
                  current={stub.benefitDeductions}
                  ytd={stub.ytdBenefits}
                  isNegative
                />
                <PayStubRow
                  label="Total Deductions"
                  current={stub.totalDeductions}
                  ytd={stub.ytdTotalDeductions}
                  isNegative
                  isBold
                />
              </tbody>
            </table>
          </div>

          <Separator />

          <div className="px-6 py-4 bg-green-50 border-t">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-bold text-green-800">
                  NET PAY
                </span>
                <p className="text-xs text-green-600 mt-1">
                  Year-to-Date: {money(stub.ytdNetPay)}
                </p>
              </div>
              <span className="text-2xl font-bold text-green-700">
                {money(stub.netPay)}
              </span>
            </div>
          </div>

          <div className="px-6 py-3 bg-muted/10 border-t flex justify-end">
            <PDFDownloadLink
              document={<CheckPDF data={stub} />}
              fileName={`${stub.employeeName.replace(/\s+/g, "_")}_${stub.payDate}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" size="sm" disabled={loading}>
                  <Download className="h-4 w-4 mr-2" />
                  {loading ? "Generating..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function PayStubsPage() {
  const [paystubs, setPaystubs] = useState<ProcessedPaystub[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadPaystubs() {
      try {
        setLoading(true);
        setLoadError(null);

        const rows = await getEmployeePaystubs();
        const processed = (rows as RawPaystubRow[]).map(processPaystubData);

        setPaystubs(processed);

        if (processed.length > 0) {
          setExpandedIds(new Set([processed[0].id]));
        }
      } catch (error) {
        console.error("Failed to load pay stubs:", error);
        setLoadError("Unable to load pay stubs. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadPaystubs();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-8 max-w-4xl">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Pay Stubs</h1>
        <p className="text-muted-foreground">
          View your payment history and deductions
        </p>
      </div>

      {loading && (
        <div className="text-center py-8 text-muted-foreground">
          Loading pay stubs...
        </div>
      )}

      {loadError && (
        <div role="alert" className="text-center py-8 text-destructive">
          {loadError}
        </div>
      )}

      {!loading && !loadError && paystubs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No pay stubs found.
        </div>
      )}

      <div className="space-y-6">
        {paystubs.map((stub) => (
          <PayStubCard
            key={stub.id}
            stub={stub}
            isExpanded={expandedIds.has(stub.id)}
            onToggle={() => toggleExpand(stub.id)}
          />
        ))}
      </div>
    </div>
  );
}
