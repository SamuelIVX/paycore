import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Calendar, Heart, Building2 } from "lucide-react"

export default function QuickStatsCard() {
    return (
        <Card className="shadow-sm">
            <CardHeader className="space-y-0">
                <CardTitle className="text-base">Quick Stats</CardTitle>
                <CardDescription>Your employment overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 dark:bg-blue-900/50">
                        <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Position</div>
                        <div className="text-sm font-semibold">Software Engineer</div>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 hover:border-teal-400 dark:hover:border-teal-600 transition-colors p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 dark:bg-teal-900/50">
                        <Building2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Department</div>
                        <div className="text-sm font-semibold">Engineering</div>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-colors p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 dark:bg-purple-900/50">
                        <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Tenure</div>
                        <div className="text-sm font-semibold">2 years, 1 month</div>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 hover:border-pink-400 dark:hover:border-pink-600 transition-colors p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 dark:bg-pink-900/50">
                        <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Benefits Enrolled</div>
                        <div className="text-sm font-semibold">2 optional plans</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}