"use client"

import * as React from "react"
import {DollarSign, Heart, Shield, Stethoscope, Smile, BadgeCheck, Info} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type Benefit = {
  title: string
  description: string
  provider: string
  coverage: string
  tag: "Company Provided" | "Optional"
  monthlyCost?: number
  icon: React.ReactNode
}

const companyBenefits: Benefit[] = [
  {
    title: "Basic Health Insurance",
    description:
      "Comprehensive health coverage including preventive care, hospitalization, and prescription drugs.",
    provider: "BlueCross BlueShield",
    coverage: "Employee Only",
    tag: "Company Provided",
    icon: <Stethoscope className="h-4 w-4 text-white" />,
  },
  {
    title: "Basic Dental Insurance",
    description: "Coverage for routine cleanings, exams, and basic dental procedures.",
    provider: "Delta Dental",
    coverage: "Employee Only",
    tag: "Company Provided",
    icon: <Smile className="h-4 w-4 text-white" />,
  },
  {
    title: "Basic Life Insurance",
    description: "Life insurance coverage equal to 1x annual salary.",
    provider: "MetLife",
    coverage: "$85,000",
    tag: "Company Provided",
    icon: <Shield className="h-4 w-4 text-white" />,
  },
  {
    title: "401(k) Retirement Plan",
    description: "Company matches up to 4% of contributions.",
    provider: "Fidelity",
    coverage: "4% match",
    tag: "Company Provided",
    icon: <BadgeCheck className="h-4 w-4 text-white" />,
  },
]

const optionalBenefits: Benefit[] = [
  {
    title: "Premium Health Insurance",
    description: "Enhanced health coverage with lower deductibles and copays, includes specialist visits.",
    provider: "BlueCross BlueShield",
    coverage: "Employee + Family",
    tag: "Optional",
    monthlyCost: 150,
    icon: <Heart className="h-4 w-4 text-white" />,
  },
  {
    title: "Family Dental Coverage",
    description: "Extend dental coverage to spouse and dependents.",
    provider: "Delta Dental",
    coverage: "Employee + Family",
    tag: "Optional",
    monthlyCost: 45,
    icon: <Smile className="h-4 w-4 text-white" />,
  },
  {
    title: "Vision Insurance",
    description: "Coverage for eye exams, glasses, and contact lenses.",
    provider: "VSP",
    coverage: "Employee Only",
    tag: "Optional",
    monthlyCost: 12,
    icon: <Shield className="h-4 w-4 text-white" />,
  },
  {
    title: "Family Vision Insurance",
    description: "Vision coverage for employee and dependents.",
    provider: "VSP",
    coverage: "Employee + Family",
    tag: "Optional",
    monthlyCost: 28,
    icon: <Shield className="h-4 w-4 text-white" />,
  },
  {
    title: "Short-term Disability",
    description: "Income protection for temporary disabilities (60% of salary).",
    provider: "Guardian",
    coverage: "60% salary replacement",
    tag: "Optional",
    monthlyCost: 35,
    icon: <Shield className="h-4 w-4 text-white" />,
  },
  {
    title: "Long-term Disability",
    description: "Income protection for extended disabilities (60% of salary).",
    provider: "Guardian",
    coverage: "60% salary replacement",
    tag: "Optional",
    monthlyCost: 55,
    icon: <Shield className="h-4 w-4 text-white" />,
  },
  {
    title: "Supplemental Life Insurance",
    description: "Additional life insurance up to 5x annual salary.",
    provider: "MetLife",
    coverage: "Up to 5x salary",
    tag: "Optional",
    monthlyCost: 25,
    icon: <Shield className="h-4 w-4 text-white" />,
  },
  {
    title: "Wellness Program",
    description: "Access to gym memberships, fitness classes, and wellness coaching.",
    provider: "Wellness Corp",
    coverage: "Full access",
    tag: "Optional",
    monthlyCost: 20,
    icon: <Heart className="h-4 w-4 text-white" />,
  },
  {
    title: "Legal Services Plan",
    description: "Legal consultation and document preparation services.",
    provider: "LegalShield",
    coverage: "Unlimited consultations",
    tag: "Optional",
    monthlyCost: 18,
    icon: <Shield className="h-4 w-4 text-white" />,
  },
  {
    title: "Pet Insurance",
    description: "Health insurance coverage for your pets.",
    provider: "Healthy Paws",
    coverage: "Up to 2 pets",
    tag: "Optional",
    monthlyCost: 40,
    icon: <Shield className="h-4 w-4 text-white" />,
  },
]
export default function BenefitsPage() {
  const [selectedOptional, setSelectedOptional] = React.useState<Record<string, boolean>>({
    "Vision Insurance": true,
    "Wellness Program": true,
  })

  const monthlyDeduction = Object.entries(selectedOptional).reduce((sum, [name, on]) => {
    if (!on) return sum
    const b = optionalBenefits.find((x) => x.title === name)
    return sum + (b?.monthlyCost ?? 0)
  }, 0)

  const annualCost = monthlyDeduction * 12

  const companyCount = companyBenefits.length
  const optionalCount = optionalBenefits.length
  const totalCount = companyCount + optionalCount
  const pctCompany = Math.round((companyCount / totalCount) * 100)

  return (
    <div className="min-h-screen bg-background">

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Top summary */}
        <Card className="shadow-sm border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <CardTitle className="text-base">Benefits Cost Summary</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="grid gap-3 md:grid-cols-3">
            <div className="rounded-md bg-background border p-4 text-center">
              <div className="text-xs text-muted-foreground">Company Benefits</div>
              <div className="text-2xl font-bold text-blue-600">{companyCount}</div>
              <div className="text-xs text-muted-foreground">No cost to employee</div>
            </div>

            <div className="rounded-md bg-background border p-4 text-center">
              <div className="text-xs text-muted-foreground">Monthly Deduction</div>
              <div className="text-2xl font-bold text-orange-600">${monthlyDeduction.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">From each paycheck</div>
            </div>

            <div className="rounded-md bg-background border p-4 text-center">
              <div className="text-xs text-muted-foreground">Annual Cost</div>
              <div className="text-2xl font-bold text-purple-600">${annualCost.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Total per year</div>
            </div>
          </CardContent>
        </Card>

        {/* Company vs Optional bar */}
        <div className="rounded-full border bg-muted/30 p-2">
          <div className="flex items-center justify-between text-xs px-2 mb-2">
            <span className="font-medium">Company Benefits ({companyCount})</span>
            <span className="font-medium">Optional Benefits ({optionalCount})</span>
          </div>
          <Progress value={pctCompany} />
        </div>

        {/* Content grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Company-provided */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Company-Provided Benefits</CardTitle>
              <CardDescription>Automatically included with employment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {companyBenefits.map((b) => (
                <div key={b.title} className="rounded-lg border bg-blue-50/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-md bg-blue-600 flex items-center justify-center">
                      {b.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{b.title}</div>
                        <Badge className="rounded-full bg-black text-white hover:bg-black/90">
                          {b.tag}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{b.description}</div>

                      <div className="text-xs text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1">
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

          {/* Optional */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Optional Benefits</CardTitle>
              <CardDescription>Additional coverage with payroll deductions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {optionalBenefits.map((b) => {
                const enabled = !!selectedOptional[b.title]
                return (
                  <div
                    key={b.title}
                    className={[
                      "rounded-lg border p-4 transition-colors",
                      enabled ? "bg-green-50/40 border-green-300" : "bg-background",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                        {b.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-semibold">{b.title}</div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground"> </Label>
                            <Switch
                              checked={enabled}
                              onCheckedChange={(v: boolean) =>
                                setSelectedOptional((prev) => ({ ...prev, [b.title]: v }))
                              }
                            />
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground mt-1">{b.description}</div>

                        <div className="text-xs text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1">
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
                          <span className="font-semibold">${(b.monthlyCost ?? 0).toFixed(2)}/mo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <Alert className="border-yellow-200 bg-yellow-50/40">
          <Info className="h-4 w-4" />
          <AlertTitle>Important Information</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Changes to optional benefits take effect on the 1st of the following month.</li>
              <li>Deductions are calculated automatically and shown on pay stubs.</li>
              <li>Benefit selections can be modified during open enrollment or after qualifying life events.</li>
            </ul>
          </AlertDescription>
        </Alert>
      </main>
    </div>
  )
}