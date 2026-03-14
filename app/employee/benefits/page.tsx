"use client"

import * as React from "react"
import {
  BadgeCheck,
  DollarSign,
  Heart,
  Info,
  Shield,
  Smile,
  Stethoscope,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type Benefit = {
  title: string
  description: string
  provider: string
  coverage: string
  type: string
  tag: "Company Provided" | "Optional"
  monthlyCost?: number
  icon: React.ReactNode
  accentClass: string
  iconBgClass: string
}

const companyBenefits: Benefit[] = [
  {
    title: "Basic Health Insurance",
    description:
      "Comprehensive health coverage including preventive care, hospitalization, and prescription drugs.",
    provider: "BlueCross BlueShield",
    coverage: "Employee Only",
    type: "Health",
    tag: "Company Provided",
    icon: <Heart className="h-4 w-4" />,
    accentClass: "text-blue-600",
    iconBgClass: "bg-blue-500/10",
  },
  {
    title: "Basic Dental Insurance",
    description: "Coverage for routine cleanings, exams, and basic dental procedures.",
    provider: "Delta Dental",
    coverage: "Employee Only",
    type: "Dental",
    tag: "Company Provided",
    icon: <Smile className="h-4 w-4" />,
    accentClass: "text-blue-600",
    iconBgClass: "bg-blue-500/10",
  },
  {
    title: "Basic Life Insurance",
    description: "Life insurance coverage equal to 1x annual salary.",
    provider: "MetLife",
    coverage: "$85,000",
    type: "Life",
    tag: "Company Provided",
    icon: <Shield className="h-4 w-4" />,
    accentClass: "text-blue-600",
    iconBgClass: "bg-blue-500/10",
  },
  {
    title: "401(k) Retirement Plan",
    description: "Company matches up to 4% of your contributions.",
    provider: "Fidelity",
    coverage: "4% match",
    type: "Retirement",
    tag: "Company Provided",
    icon: <BadgeCheck className="h-4 w-4" />,
    accentClass: "text-blue-600",
    iconBgClass: "bg-blue-500/10",
  },
]

const optionalBenefits: Benefit[] = [
  {
    title: "Premium Health Insurance",
    description: "Enhanced health coverage with lower deductibles and copays, includes specialist visits.",
    provider: "BlueCross BlueShield",
    coverage: "Employee + Family",
    type: "Health",
    tag: "Optional",
    monthlyCost: 150,
    icon: <Heart className="h-4 w-4" />,
    accentClass: "text-violet-600",
    iconBgClass: "bg-violet-500/10",
  },
  {
    title: "Family Dental Coverage",
    description: "Extend dental coverage to spouse and dependents.",
    provider: "Delta Dental",
    coverage: "Employee + Family",
    type: "Dental",
    tag: "Optional",
    monthlyCost: 45,
    icon: <Smile className="h-4 w-4" />,
    accentClass: "text-violet-600",
    iconBgClass: "bg-violet-500/10",
  },
  {
    title: "Vision Insurance",
    description: "Coverage for eye exams, glasses, and contact lenses.",
    provider: "VSP",
    coverage: "Employee Only",
    type: "Vision",
    tag: "Optional",
    monthlyCost: 12,
    icon: <Stethoscope className="h-4 w-4" />,
    accentClass: "text-violet-600",
    iconBgClass: "bg-violet-500/10",
  },
  {
    title: "Family Vision Insurance",
    description: "Vision coverage for employee and dependents.",
    provider: "VSP",
    coverage: "Employee + Family",
    type: "Vision",
    tag: "Optional",
    monthlyCost: 28,
    icon: <Stethoscope className="h-4 w-4" />,
    accentClass: "text-violet-600",
    iconBgClass: "bg-violet-500/10",
  },
  {
    title: "Short-term Disability",
    description: "Income protection for temporary disabilities (60% of salary).",
    provider: "Guardian",
    coverage: "60% salary replacement",
    type: "Disability",
    tag: "Optional",
    monthlyCost: 35,
    icon: <Shield className="h-4 w-4" />,
    accentClass: "text-violet-600",
    iconBgClass: "bg-violet-500/10",
  },
  {
    title: "Long-term Disability",
    description: "Income protection for extended disabilities (60% of salary).",
    provider: "Guardian",
    coverage: "60% salary replacement",
    type: "Disability",
    tag: "Optional",
    monthlyCost: 55,
    icon: <Shield className="h-4 w-4" />,
    accentClass: "text-violet-600",
    iconBgClass: "bg-violet-500/10",
  },
  {
    title: "Supplemental Life Insurance",
    description: "Additional life insurance up to 5x annual salary.",
    provider: "MetLife",
    coverage: "Up to 5x salary",
    type: "Life",
    tag: "Optional",
    monthlyCost: 25,
    icon: <Shield className="h-4 w-4" />,
    accentClass: "text-violet-600",
    iconBgClass: "bg-violet-500/10",
  },
  {
    title: "Wellness Program",
    description: "Access to gym memberships, fitness classes, and wellness coaching.",
    provider: "Wellness Corp",
    coverage: "Full access",
    type: "Wellness",
    tag: "Optional",
    monthlyCost: 20,
    icon: <Heart className="h-4 w-4" />,
    accentClass: "text-violet-600",
    iconBgClass: "bg-violet-500/10",
  },
  {
    title: "Legal Services Plan",
    description: "Legal consultation and document preparation services.",
    provider: "LegalShield",
    coverage: "Unlimited consultations",
    type: "Other",
    tag: "Optional",
    monthlyCost: 18,
    icon: <Info className="h-4 w-4" />,
    accentClass: "text-violet-600",
    iconBgClass: "bg-violet-500/10",
  },
  {
    title: "Pet Insurance",
    description: "Health insurance coverage for your pets.",
    provider: "Healthy Paws",
    coverage: "Up to 2 pets",
    type: "Other",
    tag: "Optional",
    monthlyCost: 40,
    icon: <Info className="h-4 w-4" />,
    accentClass: "text-violet-600",
    iconBgClass: "bg-violet-500/10",
  },
]

function CompanyBenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${benefit.iconBgClass} ${benefit.accentClass}`}
        >
          {benefit.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold">{benefit.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{benefit.description}</div>
            </div>

            <div className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
              Free
            </div>
          </div>

          <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <div className="text-muted-foreground">Provider:</div>
            <div className="text-right">{benefit.provider}</div>

            <div className="text-muted-foreground">Coverage:</div>
            <div className="text-right">{benefit.coverage}</div>

            <div className="text-muted-foreground">Type:</div>
            <div className="text-right">{benefit.type}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OptionalBenefitCard({
  benefit,
  enabled,
  onToggle,
}: {
  benefit: Benefit
  enabled: boolean
  onToggle: (checked: boolean) => void
}) {
  const switchId = `optional-benefit-${benefit.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

  return (
    <div
      className={[
        "rounded-xl border bg-background p-4 shadow-sm transition-colors",
        enabled ? "border-green-300 bg-green-50/30" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${benefit.iconBgClass} ${benefit.accentClass}`}
        >
          {benefit.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Label htmlFor={switchId} className="cursor-pointer font-semibold">
                {benefit.title}
              </Label>
              <div className="mt-1 text-sm text-muted-foreground">{benefit.description}</div>
            </div>

            <div className="flex shrink-0 items-start gap-3">
              <div className="text-right">
                <div className={`text-lg font-semibold ${benefit.accentClass}`}>
                  ${(benefit.monthlyCost ?? 0).toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">/month</div>
              </div>

              <Switch id={switchId} checked={enabled} onCheckedChange={onToggle} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <div className="text-muted-foreground">Provider:</div>
            <div className="text-right">{benefit.provider}</div>

            <div className="text-muted-foreground">Coverage:</div>
            <div className="text-right">{benefit.coverage}</div>

            <div className="text-muted-foreground">Type:</div>
            <div className="text-right">{benefit.type}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BenefitsPage() {
  const [selectedOptional, setSelectedOptional] = React.useState<Record<string, boolean>>({
    "Vision Insurance": true,
    "Wellness Program": true,
  })

  const monthlyDeduction = Object.entries(selectedOptional).reduce((sum, [name, on]) => {
    if (!on) return sum
    const benefit = optionalBenefits.find((x) => x.title === name)
    return sum + (benefit?.monthlyCost ?? 0)
  }, 0)

  const companyCount = companyBenefits.length
  const optionalCount = optionalBenefits.length
  const avgDeduction =
    optionalCount > 0
      ? optionalBenefits.reduce((sum, benefit) => sum + (benefit.monthlyCost ?? 0), 0) / optionalCount
      : 0

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium">Company Benefits</div>
                  <div className="mt-5 text-4xl font-bold text-blue-600">{companyCount}</div>
                  <div className="mt-2 text-xs text-muted-foreground">Provided to all employees</div>
                </div>
                <Heart className="h-4 w-4 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium">Optional Benefits</div>
                  <div className="mt-5 text-4xl font-bold text-violet-600">{optionalCount}</div>
                  <div className="mt-2 text-xs text-muted-foreground">Available for purchase</div>
                </div>
                <BadgeCheck className="h-4 w-4 text-violet-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium">Avg. Deductions</div>
                  <div className="mt-5 text-4xl font-bold text-orange-600">${avgDeduction.toFixed(2)}</div>
                  <div className="mt-2 text-xs text-muted-foreground">Per employee/month</div>
                </div>
                <DollarSign className="h-4 w-4 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Company-Provided Benefits</CardTitle>
            <CardDescription>
              These benefits are automatically provided to all employees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-2">
              {companyBenefits.map((benefit) => (
                <CompanyBenefitCard key={benefit.title} benefit={benefit} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Optional Employee Benefits</CardTitle>
            <CardDescription>
              Employees can choose to enroll in these benefits (cost deducted from paycheck)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-2">
              {optionalBenefits.map((benefit) => {
                const enabled = !!selectedOptional[benefit.title]

                return (
                  <OptionalBenefitCard
                    key={benefit.title}
                    benefit={benefit}
                    enabled={enabled}
                    onToggle={(checked) =>
                      setSelectedOptional((prev) => ({
                        ...prev,
                        [benefit.title]: checked,
                      }))
                    }
                  />
                )
              })}
            </div>

            <div className="rounded-lg border bg-muted/20 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-medium">Your current optional selections</div>
                  <div className="text-xs text-muted-foreground">
                    Changes take effect on the 1st of the following month
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Monthly Deduction</div>
                  <div className="text-2xl font-bold text-orange-600">${monthlyDeduction.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="border-yellow-200 bg-yellow-50/40">
          <Info className="h-4 w-4" />
          <AlertTitle>Important Information</AlertTitle>
          <AlertDescription>
            <ul className="list-disc space-y-1 pl-5 text-sm">
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