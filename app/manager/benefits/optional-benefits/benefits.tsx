import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

//TODO (Backend): Remove all hardcoded data and fetch/display data from Supabase
import { AVAILABLE_BENEFITS, type Benefit } from "../summary-cards/types";
import { OptionalBenefitDetailsProps } from "./types";
import {
    Heart,
    Sparkles,
    Eye,
    Wallet,
    Shield,
    Umbrella,
    Info
} from "lucide-react"

const BENEFIT_ICONS: Record<Benefit["type"], any> = {
    health: Heart,
    dental: Sparkles,
    vision: Eye,
    retirement: Wallet,
    life: Shield,
    disability: Umbrella,
    wellness: Heart,
    other: Info
};

export function OptionalBenefitDetails({ title, value }: OptionalBenefitDetailsProps) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-600">{title}</span>
            <span className="font-medium">{value}</span>
        </div>
    )
}

export default function OptionalBenefitsGrid() {
    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Optional Employee Benefits</CardTitle>
                <CardDescription>Employees can choose to enroll in these benefits (cost deducted from paycheck)</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_BENEFITS.filter(b => !b.isCompanyProvided).map(benefit => {
                    const Icon = BENEFIT_ICONS[benefit.type];
                    return (
                        <Card key={benefit.id} className="border-gray-200 hover:border-purple-300 transition-all">

                            <CardContent className="p-5">

                                <div className="flex items-start gap-4">

                                    <div className="shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-purple-600" />
                                    </div>

                                    <div className="flex-1 min-w-0">

                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-semibold text-lg">{benefit.name}</h3>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-purple-600">
                                                    ${benefit.monthlyPrice}
                                                </div>
                                                <div className="text-xs text-gray-500">/month</div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-3">{benefit.description}</p>

                                        <div className="space-y-1 text-sm">

                                            <OptionalBenefitDetails
                                                title="Provider:"
                                                value={benefit.provider}
                                            />

                                            {benefit.coverage && (
                                                <OptionalBenefitDetails
                                                    title="Coverage:"
                                                    value={benefit.coverage}
                                                />
                                            )}

                                            <OptionalBenefitDetails
                                                title="Type:"
                                                value={benefit.type}
                                            />

                                        </div>

                                    </div>

                                </div>

                            </CardContent>

                        </Card>
                    );
                })}
            </CardContent>
        </Card>
    )
}