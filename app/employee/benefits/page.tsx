"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Info, DollarSign } from "lucide-react"
import { SummaryCardProps } from "./types"
import { companyBenefits, optionalBenefits } from "./data"
import { BENEFIT_ICONS } from "./constants"

export function SummaryCard({ title, value, description }: SummaryCardProps) {
  return (
    <div className="rounded-md border bg-background dark:bg-blue-200 border-none p-4 text-center">
      <div className="text-md text-muted-foreground mb-1">{title}</div>
      <div className="text-2xl font-bold text-blue-600">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{description}</div>
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

  const annualCost = monthlyDeduction * 12

  const companyCount = companyBenefits.length
  const optionalCount = optionalBenefits.length
  const totalCount = companyCount + optionalCount
  const pctCompany = Math.round((companyCount / totalCount) * 100)

  return (
    <div className="container mx-auto py-4">

      <Card className="border-blue-300 bg-blue-100">

        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 dark:text-black" />
            <CardTitle className="text-gray-600 dark:text-black">Benefits Cost Summary</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="grid gap-3 md:grid-cols-3">
          <SummaryCard
            title="Company Benefits"
            value={companyCount}
            description="No cost to employee"
          />

          <SummaryCard
            title="Monthly Deduction"
            value={`${monthlyDeduction.toFixed(2)}`}
            description="Total per month"
          />

          <SummaryCard
            title="Annual Cost"
            value={`${annualCost.toFixed(2)}`}
            description="Total per year"
          />
        </CardContent>

      </Card>


      <div className="rounded-full border bg-muted/30 p-2 mb-4 mt-4">
        <div className="mb-2 flex items-center justify-between px-2 text-xs">
          <span className="font-medium">Company Benefits ({companyCount})</span>
          <span className="font-medium">Optional Benefits ({optionalCount})</span>
        </div>

        <Progress value={pctCompany} />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card className="shadow-sm">

          <CardHeader>
            <CardTitle className="text-base">Company-Provided Benefits</CardTitle>
            <CardDescription>Automatically included with employment</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {companyBenefits.map((b) => (

              <div key={b.title} className="rounded-lg border hover:border-blue-300 hover:bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600">
                    {React.createElement(BENEFIT_ICONS[b.type], { className: "h-4 w-4 text-white" })}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{b.title}</div>
                      <Badge className="rounded-full bg-blue-400">
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

        <Card className="shadow-sm">

          <CardHeader>
            <CardTitle className="text-base">Optional Benefits</CardTitle>
            <CardDescription>Additional coverage with payroll deductions</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {optionalBenefits.map((b) => {
              const enabled = !!selectedOptional[b.title]
              const switchId = `optional-benefit-${b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

              return (
                <div
                  key={b.title}
                  className={[
                    "rounded-lg border p-4 transition-colors",
                    enabled ? "border-green-400 bg-green-50" : "border-purple-300",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-purple-200">
                      {React.createElement(BENEFIT_ICONS[b.type], { className: "h-4 w-4 text-purple-600" })}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <Label htmlFor={switchId} className="font-semibold cursor-pointer">
                          {b.title}
                        </Label>
                        <Switch
                          id={switchId}
                          checked={enabled}
                          onCheckedChange={(v: boolean) =>
                            setSelectedOptional((prev) => ({ ...prev, [b.title]: v }))
                          }
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

      <Card className="bg-amber-50 border-amber-200 w-1/2 mx-auto mt-4">

        <CardContent className="flex gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />

          <div className="text-sm text-amber-900">
            <p className="font-medium mb-1">Important Information</p>
            <ul className="list-disc list-inside space-y-1 text-amber-800">
              <li>Changes to optional benefits take effect on the 1st of the following month</li>
              <li>Deductions are automatically calculated and shown on your pay stubs</li>
              <li>You can modify your benefits during open enrollment or after qualifying life events</li>
            </ul>
          </div>

        </CardContent>

      </Card>

    </div >
  )
}