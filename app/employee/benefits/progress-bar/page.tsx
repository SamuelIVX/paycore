import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ProgressBarCardProps } from "./types"

export default function ProgressBarCard({ company_count, optional_count, selected_count, pct_company }: ProgressBarCardProps) {
    const clampedPct = Math.max(0, Math.min(100, pct_company));

    return (
        <Card className="mb-4 mt-4 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="text-sm font-medium">Company Benefits</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{company_count}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{selected_count}/{optional_count}</span>
                    <span className="text-sm font-medium">Optional Benefits</span>
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
                </div>
            </CardHeader>
            <CardContent>
                <Progress value={clampedPct} className="h-2" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{clampedPct}%</span>
                    <span>{100 - clampedPct}%</span>
                </div>
            </CardContent>
        </Card>
    )
}