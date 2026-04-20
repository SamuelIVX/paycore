'use client'

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
} from "lucide-react";
import { runPayroll } from "@/lib/supabase/payroll-actions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function PayrollSection({ title, value, icon, color }: PayrollSectionProps) {
    return (
        <>
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-gray-500 dark:text-gray-400">{title}:</span>
            </div>
            <div className={`font-semibold text-right ${color}`}>{value}</div>
        </>
    )
}

export function StatusCard({ text, icon, color, children }: StatusCardProps) {
    return (
        <Card className={`border-2 ${color.border} ${color.bg}`}>
            <CardContent className="p-12">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="relative">
                        {icon}
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl mb-2">{text.title}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{text.description}</p>
                    </div>

                    {children &&
                        <>
                            <div className="w-full bg-white dark:bg-card rounded-lg p-6 mb-4">
                                {children}
                            </div>

                            <Button className="bg-black dark:bg-primary p-4" asChild>
                                <Link href="/manager/dashboard">
                                    <Home className="w-4 h-4" /> Back To Dashboard
                                </Link>
                            </Button>
                        </>
                    }
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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="container mx-auto max-w-2xl">
                {status === "PROCESSING" && (
                    // Loading State
                    <StatusCard
                        text={{
                            title: "Payroll is Processing...",
                            description: "Running calculations, applying deductions, and updating records..."
                        }}
                        icon={<Spinner className="w-24 h-24" variant="bars" />}
                        color={{
                            border: "",
                            bg: "",
                        }}
                    />
                )}

                {status === "SUCCESS" && (
                    // Completed State
                    <StatusCard
                        text={{
                            title: "Payroll Has Finished Processing",
                            description: "All calculations and database interactions have completed successfully"
                        }}
                        icon={<CircleCheck className="w-24 h-24 text-green-500" />}
                        color={{
                            border: "border-green-300",
                            bg: "bg-green-50",
                        }}
                    >
                        {results &&
                            <>
                                <h3 className="font-semibold mb-4 text-left">Summary</h3>

                                <div className="grid grid-cols-2 gap-4 text-sm">

                                    <PayrollSection
                                        title="Total Gross Pay"
                                        value={`$${results.total_gross.toLocaleString()}`}
                                        icon={<FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                                    />

                                    <PayrollSection
                                        title="Total Deductions"
                                        value={`-$${results.total_taxes.toLocaleString()}`}
                                        icon={<FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                                        color="text-red-500"
                                    />

                                    <Separator className="col-span-2" />

                                    <PayrollSection
                                        title="Total Net Pay"
                                        value={`$${results.total_net.toLocaleString()}`}
                                        icon={<DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />}
                                        color="text-green-500"
                                    />

                                </div>
                            </>
                        }
                    </StatusCard>
                )}

                {status === "ERROR" && (
                    // Error State
                    <StatusCard
                        text={{
                            title: "Payroll Failed to Process",
                            description: "An error occurred while processing the payroll."
                        }}
                        icon={<CircleX className="w-24 h-24 text-red-500" />}
                        color={{
                            border: "border-red-300",
                            bg: "bg-red-50",
                        }}
                    />
                )}

            </div>
        </div>
    )
}

export default function PayrollStatusPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="container mx-auto max-w-2xl">
                    <StatusCard
                        text={{
                            title: "Loading Payroll Status...",
                            description: "Please wait"
                        }}
                        icon={<Spinner className="w-24 h-24" variant="bars" />}
                        color={{
                            border: "",
                            bg: "",
                        }}
                    />
                </div>
            </div>
        }>
            <PayrollStatusContent />
        </Suspense>
    )
}
