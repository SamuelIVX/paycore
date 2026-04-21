"use client"

import { createElement, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BENEFIT_ICONS } from "../constants"
import { getCompanyBenefits } from "@/lib/supabase/benefits"

export default function CompanyBenefitsCard() {
    const [company_benefits, setCompanyBenefits] = useState<Awaited<ReturnType<typeof getCompanyBenefits>>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCompanyBenefits()
            .then(setCompanyBenefits)
            .catch((err) => {
                console.error('Failed to fetch company benefits:', err);
                setError('Failed to load benefits');
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <Card className="shadow-sm">

            <CardHeader>
                <CardTitle className="text-base">Company-Provided Benefits</CardTitle>
                <CardDescription>Automatically included with employment at no cost.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                {isLoading && (
                    <div aria-live="polite" className="text-sm text-muted-foreground">Loading company benefits...</div>
                )}


                {error && (
                    <div role="alert" className="text-sm text-destructive">{error}</div>
                )}

                {company_benefits.map((b) => (

                    <div key={b.benefit} className="rounded-lg border hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 dark:bg-blue-700">
                                {createElement(BENEFIT_ICONS[b.tag], { className: "h-4 w-4 text-white" })}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <div className="font-semibold">{b.benefit}</div>
                                    <Badge className="rounded-full bg-blue-400 dark:bg-blue-600 text-blue-950 dark:text-blue-100">
                                        {b.tag}
                                    </Badge>
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">{b.description}</div>

                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                    <span>
                                        Provider: <span className="text-foreground">{b.provider}</span>
                                    </span>
                                    <span>
                                        Coverage: <span className="text-foreground">{b.coverage}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                ))}
            </CardContent>

        </Card>
    )
}