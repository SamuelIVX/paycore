'use client'

import { createElement, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BENEFIT_ICONS } from "../constants"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import type { OptionalBenefitsCardProps } from "../types"
import { getOptionalBenefits, upsertEmployeeBenefit } from "@/lib/supabase/benefits"

export default function OptionalBenefitsCard({ selected_benefits, set_selected_benefits }: OptionalBenefitsCardProps) {
    const [optional_benefits, setOptionalBenefits] = useState<Awaited<ReturnType<typeof getOptionalBenefits>>>([]);
    const [pendingBenefits, setPendingBenefits] = useState<Record<string, boolean>>({});

    useEffect(() => {
        getOptionalBenefits().then(setOptionalBenefits);
    }, []);

    return (
        <Card className="shadow-sm">

            <CardHeader>
                <CardTitle className="text-base">Optional Benefits</CardTitle>
                <CardDescription>Additional coverage with payroll deductions</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                {optional_benefits.map((b) => {
                    const enabled = !!selected_benefits[b.id]
                    const isPending = !!pendingBenefits[b.id]
                    const switchId = `optional-benefit-${b.id}`

                    return (
                        <div
                            key={b.id}
                            className={[
                                "rounded-lg border p-4 transition-colors",
                                enabled ? "border-green-400 bg-green-50" : "border-purple-300 hover:bg-purple-50",
                            ].join(" ")}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-purple-200">
                                    {BENEFIT_ICONS[b.tag] && createElement(BENEFIT_ICONS[b.tag], { className: "h-4 w-4 text-purple-600" })}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <Label htmlFor={switchId} className="font-semibold cursor-pointer">
                                            {b.benefit}
                                        </Label>
                                        <Switch
                                            id={switchId}
                                            checked={enabled}
                                            disabled={isPending}
                                            onCheckedChange={async (v: boolean) => {
                                                const previous = enabled
                                                setPendingBenefits((prev) => ({ ...prev, [b.id]: true }))
                                                set_selected_benefits((prev) => ({ ...prev, [b.id]: v }))
                                                try {
                                                    await upsertEmployeeBenefit({
                                                        benefit_id: b.id,
                                                        status: v ? 'ACTIVE' : 'NOT_ENROLLED',
                                                    })
                                                } catch (error) {
                                                    console.error('Error updating employee benefit:', error)
                                                    set_selected_benefits((prev) => ({ ...prev, [b.id]: previous }))
                                                } finally {
                                                    setPendingBenefits((prev) => ({ ...prev, [b.id]: false }))
                                                }
                                            }}
                                        />
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

                                    <Separator className="my-3" />

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Monthly Cost</span>
                                        <span className="font-semibold">${(b.monthly_cost ?? 0).toFixed(2)}/mo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

            </CardContent>

        </Card>
    )
}