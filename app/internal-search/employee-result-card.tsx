/**
 * Directory search result card; fields shown depend on caller role.
 */
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { EmployeeWithProfile } from "@/lib/supabase/employee";
import {
    Briefcase,
    DollarSign,
    Mail,
    MapPin,
    Phone,
} from "lucide-react";
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

/**
 * Directory result card; field visibility follows role-gated payload shape.
 * @param employee - Search hit (visitor-safe or elevated columns).
 * @returns Card showing name, role, and optional pay/address.
 */
export function EmployeeResultCard({ employee }: Props) {
    const fullName = `${employee.first_name ?? ""} ${employee.last_name ?? ""}`.trim() || "Unknown Employee";
    const payRate = hasPayInfo(employee) && employee.pay_rate != null
        ? `$${employee.pay_rate.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
        : null;

    const mailtoHref = employee.email
        ? `mailto:${employee.email}?subject=${encodeURIComponent(`PayCore: Hello ${fullName}`)}`
        : null;

    const telHref = employee.phone ? `tel:${employee.phone}` : null;

    return (
        <Card className="transition-all duration-200 hover:shadow-xs border-border bg-card">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                        <Avatar className="h-11 w-11 shrink-0 ring-1 ring-border">
                            <AvatarFallback className="text-sm font-semibold bg-muted text-foreground">
                                {getInitials(employee.first_name, employee.last_name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-foreground leading-tight">
                                {fullName}
                            </p>
                            <p className="truncate text-xs text-muted-foreground mt-0.5">
                                {employee.position || "Employee"}
                            </p>
                        </div>
                    </div>

                    {employee.position && (
                        <Badge variant="secondary" className="shrink-0 text-[11px] font-medium hidden sm:inline-flex">
                            {employee.position}
                        </Badge>
                    )}
                </div>

                <Separator className="my-4" />

                <div className="grid gap-3.5 sm:grid-cols-2 text-xs">
                    {/* Email */}
                    <div className="flex items-start gap-2 min-w-0">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-medium text-muted-foreground">Email</p>
                            {mailtoHref ? (
                                <a
                                    href={mailtoHref}
                                    className="text-foreground hover:text-primary transition-colors hover:underline truncate block"
                                >
                                    {employee.email}
                                </a>
                            ) : (
                                <p className="text-muted-foreground truncate">Not available</p>
                            )}
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-2 min-w-0">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-medium text-muted-foreground">Phone</p>
                            {telHref ? (
                                <a
                                    href={telHref}
                                    className="text-foreground hover:text-primary transition-colors hover:underline truncate block"
                                >
                                    {employee.phone}
                                </a>
                            ) : (
                                <p className="text-muted-foreground truncate">Not available</p>
                            )}
                        </div>
                    </div>

                    {/* Location (Elevated) */}
                    {hasAddressInfo(employee) && (
                        <div className="flex items-start gap-2 sm:col-span-2 min-w-0">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium text-muted-foreground">Location</p>
                                <p className="text-foreground truncate">{formatLocation(employee)}</p>
                            </div>
                        </div>
                    )}

                    {/* Pay Info (Manager Only) */}
                    {payRate && (
                        <div className="flex items-start gap-2 min-w-0">
                            <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium text-muted-foreground">Pay Rate</p>
                                <p className="font-semibold tabular-nums text-foreground">{payRate}</p>
                            </div>
                        </div>
                    )}

                    {/* Pay Frequency (Manager Only) */}
                    {hasPayFrequency(employee) && employee.pay_frequency && (
                        <div className="flex items-start gap-2 min-w-0">
                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium text-muted-foreground">Frequency</p>
                                <p className="text-foreground capitalize">{employee.pay_frequency.toLowerCase()}</p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
