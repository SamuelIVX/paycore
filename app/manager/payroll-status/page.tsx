'use client'

/**
 * Manager payroll status/run UI: trigger runPayroll for a pay period.
 * SECURITY: initiates payroll mutation affecting compensation records.
 */
import { Suspense } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StatusCardProps, PayrollSectionProps } from "./types";
import {
    CircleCheck,
    CircleX,
    Home,
    DollarSign,
    FileText,
    ArrowLeft,
} from "lucide-react";
import { runPayroll } from "@/lib/supabase/payroll-actions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

/**
 * Payroll Section presentational component.
 */
export function PayrollSection({ title, value, icon, color }: PayrollSectionProps) {
    return (
        <>
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-muted-foreground">{title}:</span>
            </div>
            <div className={`font-semibold text-right tabular-nums ${color ?? "text-foreground"}`}>{value}</div>
        </>
    )
}

/**
 * Status Card presentational component.
 */
export function StatusCard({ text, icon, color, children }: StatusCardProps) {
    return (
        <Card className={`border ${color.border || "border-border"} ${color.bg || "bg-card"} shadow-sm`}>
            <CardContent className="p-8 sm:p-12">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="relative">
                        {icon}
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl tracking-tight mb-2 text-foreground">{text.title}</h2>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">{text.description}</p>
                    </div>

                    {children && (
                        <div className="w-full bg-background/80 dark:bg-card/80 border border-border rounded-lg p-6 mb-2">
                            {children}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Button className="cursor-pointer" asChild>
                            <Link href="/manager/dashboard" className="flex items-center gap-2 no-underline">
                                <Home className="w-4 h-4" />
                                <span>Back To Dashboard</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function PayrollStatusContent() {
    const searchParams = useSearchParams();
    const startDate = searchParams.get("startDate") ?? "";
    const endDate = searchParams.get("endDate") ?? "";

    const [status, setStatus] = useState(startDate && endDate ? "PROCESSING" : "ERROR");
    const [results, setResults] = useState<{ total_gross: number; total_net: number; total_taxes: number } | null>(null);
    const hasRunRef = useRef(false);

    useEffect(() => {
        if (!startDate || !endDate || hasRunRef.current) return;
        hasRunRef.current = true;

        runPayroll(startDate, endDate)
            .then(({ total_gross, total_net, total_taxes }) => {
                const gross = Number(total_gross);
                const net = Number(total_net);
                const taxes = Number(total_taxes);

                if (![gross, net, taxes].every(Number.isFinite)) {
                    throw new Error("Invalid payroll totals returned from runPayroll");
                }

                setResults({
                    total_gross: gross,
                    total_net: net,
                    total_taxes: taxes
                });
                setStatus("SUCCESS");
            })
            .catch((err) => {
                console.error("Payroll failed:", err);
                setStatus("ERROR");
            });
    }, [startDate, endDate]);

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <div className="container mx-auto max-w-2xl">
                {status === "PROCESSING" && (
                    <StatusCard
                        text={{
                            title: "Payroll is Processing...",
                            description: "Running calculations, applying deductions, and updating records..."
                        }}
                        icon={<Spinner className="w-16 h-16 text-primary" variant="bars" />}
                        color={{
                            border: "border-border",
                            bg: "bg-card",
                        }}
                    />
                )}

                {status === "SUCCESS" && (
                    <StatusCard
                        text={{
                            title: "Payroll Has Finished Processing",
                            description: "All calculations and database interactions have completed successfully."
                        }}
                        icon={<CircleCheck className="w-16 h-16 text-emerald-500" />}
                        color={{
                            border: "border-emerald-500/20",
                            bg: "bg-emerald-500/5",
                        }}
                    >
                        {results && (
                            <>
                                <h3 className="font-semibold text-sm mb-4 text-left text-foreground">Run Summary</h3>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <PayrollSection
                                        title="Total Gross Pay"
                                        value={`$${results.total_gross.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                                        icon={<FileText className="w-4 h-4 text-muted-foreground" />}
                                    />

                                    <PayrollSection
                                        title="Total Deductions"
                                        value={`-$${results.total_taxes.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                                        icon={<FileText className="w-4 h-4 text-muted-foreground" />}
                                        color="text-rose-500 dark:text-rose-400"
                                    />

                                    <Separator className="col-span-2" />

                                    <PayrollSection
                                        title="Total Net Pay"
                                        value={`$${results.total_net.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                                        icon={<DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                                        color="text-emerald-600 dark:text-emerald-400"
                                    />
                                </div>
                            </>
                        )}
                    </StatusCard>
                )}

                {status === "ERROR" && (
                    <StatusCard
                        text={{
                            title: "Payroll Failed to Process",
                            description: "An error occurred while processing the payroll. Please verify that a valid pay period was selected and that you have manager permissions."
                        }}
                        icon={<CircleX className="w-16 h-16 text-destructive" />}
                        color={{
                            border: "border-destructive/30",
                            bg: "bg-destructive/5",
                        }}
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Button variant="outline" asChild className="w-full sm:w-auto cursor-pointer">
                                <Link href="/manager/payroll-records-table" className="flex items-center gap-2 no-underline">
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Payroll Records</span>
                                </Link>
                            </Button>
                        </div>
                    </StatusCard>
                )}
            </div>
        </div>
    )
}

/**
 * Manager payroll-run status App Router page.
 * @returns The rendered PayrollStatusPage UI.
 */
export default function PayrollStatusPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
                <div className="container mx-auto max-w-2xl">
                    <StatusCard
                        text={{
                            title: "Loading Payroll Status...",
                            description: "Please wait"
                        }}
                        icon={<Spinner className="w-16 h-16 text-primary" variant="bars" />}
                        color={{
                            border: "border-border",
                            bg: "bg-card",
                        }}
                    />
                </div>
            </div>
        }>
            <PayrollStatusContent />
        </Suspense>
    )
}
