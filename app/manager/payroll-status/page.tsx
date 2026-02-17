import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StatusCardProps, PayrollSectionProps } from "./types";
import {
    CircleCheck,
    Home,
    DollarSign,
    Users,
    FileText,
} from "lucide-react";

export function PayrollSection({ title, value, icon, color }: PayrollSectionProps) {
    return (
        <>
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-gray-500">{title}:</span>
            </div>
            <div className={`font-semibold text-right ${color}`}>{value}</div>
        </>
    )
}

export function StatusCard({ text, icon, color, children }: StatusCardProps) {
    return (
        <Card className={`border-2 ${color.border} ${color.bg}`}>
            <CardContent className="p-12">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="relative">
                        {icon}
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl mb-2">{text.title}</h2>
                        <p className="text-gray-500">{text.description}</p>
                    </div>

                    {children &&
                        <>
                            <div className="w-full bg-white rounded-lg p-6 mb-4">
                                {children}
                            </div>

                            <Button className="bg-black p-4" asChild>
                                <Link href="./dashboard">
                                    <Home className="w-4 h-4" /> Back To Dashboard
                                </Link>
                            </Button>

                        </>
                    }

                </div>
            </CardContent>
        </Card>
    )
}

export default function PayrollStatusPage() {

    // TODO (backend) : Please create the functions and algorithms that acquires the wait time
    // and any other important information to display within the respective components
    const isProcessing = true;
    const payrollResults = true;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="container mx-auto max-w-2xl">
                {isProcessing ? (

                    // Loading State
                    <StatusCard
                        text={{
                            title: "Payroll is Processing...",
                            description: "Running calculations, applying deductions, and updating records..."
                        }}
                        icon={<Spinner className="w-24 h-24" variant="bars" />}
                        color={{
                            border: "",
                            bg: "",
                        }}
                    />

                ) : (

                    // Completed State
                    <StatusCard
                        text={{
                            title: "Payroll Has Finished Processing",
                            description: "All calculations and database interactions has completed successfully"
                        }}
                        icon={<CircleCheck className="w-24 h-24 text-green-500" />}
                        color={{
                            border: "border-green-300",
                            bg: "bg-green-50",
                        }}
                    >
                        {payrollResults &&
                            <>

                                <h3 className="font-semibold mb-4 text-left">Summary</h3>

                                <div className="grid grid-cols-2 gap-4 text-sm">

                                    <PayrollSection
                                        title="Employees Processed"
                                        value="8"
                                        icon={<Users className="w-4 h-4 text-gray-500" />}
                                    />

                                    <PayrollSection
                                        title="Total Gross Pay"
                                        value="$10,999"
                                        icon={<FileText className="w-4 h-4 text-gray-500" />}
                                    />

                                    <PayrollSection
                                        title="Total Deductions"
                                        value="-$1,023"
                                        icon={<FileText className="w-4 h-4 text-gray-500" />}
                                        color="text-red-500"
                                    />

                                    <Separator className="col-span-2" />

                                    <PayrollSection
                                        title="Total Net Pay"
                                        value="$13,784"
                                        icon={<DollarSign className="w-4 h-4 text-green-600" />}
                                        color="text-green-500"
                                    />

                                </div>

                            </>
                        }

                    </StatusCard>

                )}
            </div>
        </div >
    )
}
