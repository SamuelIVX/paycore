import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Briefcase,
    Calendar,
    Heart,
} from "lucide-react"

export default function QuickStatsCard() {
    return (
        <Card className="shadow-sm min-h-[410px]">
            <CardHeader>
                <CardTitle className="text-base">Quick Stats</CardTitle>
                <CardDescription>Your employment overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4 rounded-xl bg-blue-50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Position</div>
                        <div className="text-lg font-semibold">Software Engineer</div>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-purple-50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
                        <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Tenure</div>
                        <div className="text-lg font-semibold">2 years, 1 month</div>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-pink-50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
                        <Heart className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Benefits Enrolled</div>
                        <div className="text-lg font-semibold">2 optional plans</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}