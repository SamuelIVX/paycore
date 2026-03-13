import { createElement } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { companyBenefits } from "../data"
import { Badge } from "@/components/ui/badge"
import { BENEFIT_ICONS } from "../constants"

export default function CompanyBenefitsCard() {
    return (
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
                                {createElement(BENEFIT_ICONS[b.type], { className: "h-4 w-4 text-white" })}
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
    )
}