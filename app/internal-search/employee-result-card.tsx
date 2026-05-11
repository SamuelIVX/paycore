import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { EmployeeWithProfile } from "@/lib/supabase/employee";
import {
    formatLocation,
    getInitials,
    hasAddressInfo,
    hasPayFrequency,
    hasPayInfo,
} from "./utils";

interface Props {
    employee: EmployeeWithProfile;
}

interface FieldProps {
    label: string;
    value: string | null | undefined;
}

function Field({ label, value }: FieldProps) {
    return (
        <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-sm text-foreground">
                {value || <span className="text-muted-foreground">Not available</span>}
            </p>
        </div>
    );
}

export function EmployeeResultCard({ employee }: Props) {
    const fullName = `${employee.first_name ?? ""} ${employee.last_name ?? ""}`.trim() || "Unknown";
    const payRate = hasPayInfo(employee) && employee.pay_rate != null
        ? `$${employee.pay_rate.toLocaleString()}`
        : null;

    const mailtoHref = employee.email
        ? `mailto:${employee.email}?subject=${encodeURIComponent(`Hello ${fullName}`)}`
        : null;

    const card = (
        <Card
            className={[
                "transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5",
                mailtoHref ? "cursor-pointer" : "",
            ].filter(Boolean).join(" ")}
        >
            <CardContent className="p-5">
                <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 shrink-0">
                        <AvatarFallback className="text-sm font-medium">
                            {getInitials(employee.first_name, employee.last_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold text-foreground">{fullName}</p>
                        <p className="truncate text-sm text-muted-foreground">
                            {employee.position || "Title not available"}
                        </p>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Email" value={employee.email} />
                    <Field label="Phone" value={employee.phone} />

                    {hasAddressInfo(employee) && (
                        <div className="sm:col-span-2">
                            <Field label="Location" value={formatLocation(employee)} />
                        </div>
                    )}

                    {payRate && <Field label="Pay rate" value={payRate} />}

                    {hasPayFrequency(employee) && (
                        <Field label="Pay frequency" value={employee.pay_frequency} />
                    )}
                </div>
            </CardContent>
        </Card>
    );

    if (!mailtoHref) {
        return card;
    }

    return (
        <a
            href={mailtoHref}
            className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            aria-label={`Email ${fullName}`}
        >
            {card}
        </a>
    );
}
