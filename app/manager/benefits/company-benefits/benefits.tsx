import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

//TODO (Backend): Remove all hardcoded data and fetch/display data from Supabase
import { AVAILABLE_BENEFITS } from "../data";
import { BenefitDetailsProps } from "../types";
import { BENEFIT_ICONS } from "../constant";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export function CompanyBenefitDetails({ title, value }: BenefitDetailsProps) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-600">{title}</span>
            <span className="font-medium">{value}</span>
        </div>
    )
}

export default function CompanyBenefitsGrid() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Company-Provided Benefits</CardTitle>
                <CardDescription>These benefits are automatically provided to all employees</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_BENEFITS.filter(b => b.isCompanyProvided).map(benefit => {
                    const Icon = BENEFIT_ICONS[benefit.type];
                    return (
                        <Card key={benefit.id} className="hover:border-blue-300 hover:bg-blue-50">

                            <CardContent>

                                <div className="flex items-start gap-4">

                                    <div className="shrink-0 w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    <div className="flex-1 min-w-0">

                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-semibold text-lg">{benefit.name}</h3>
                                            <Badge variant="default">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Free
                                            </Badge>
                                        </div>

                                        <p className="text-sm text-gray-700 mb-3">{benefit.description}</p>

                                        <div className="space-y-1 text-sm">

                                            <CompanyBenefitDetails
                                                title="Provider:"
                                                value={benefit.provider}
                                            />

                                            {benefit.coverage && (
                                                <CompanyBenefitDetails
                                                    title="Coverage:"
                                                    value={benefit.coverage}
                                                />
                                            )}

                                            <CompanyBenefitDetails
                                                title="Type:"
                                                value={benefit.type.charAt(0).toUpperCase() + benefit.type.slice(1)}
                                            />

                                        </div>

                                    </div>

                                </div>

                            </CardContent>

                        </Card>
                    );
                })}
            </CardContent >
        </Card >
    )
}