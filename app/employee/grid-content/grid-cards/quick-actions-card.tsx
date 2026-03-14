import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/animate-ui/components/buttons/button"
import { Button as BaseButton } from "@/components/ui/button"
import { Clock, Heart, FileText } from "lucide-react"
import Link from "next/link"

export default function QuickActionsCard() {
    return (
        <Card className="border-green-200 bg-green-50">

            <CardHeader>
                <CardTitle className="text-green-900">Quick Actions</CardTitle>
                <CardDescription>Common employee operations</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="w-full justify-start bg-white hover:bg-gray-50 h-10 text-sm dark:text-black"
                            variant="outline">
                            <Clock className="w-5 h-5 mr-3" />
                            Submit Hours
                        </Button>
                    </DialogTrigger>
                </Dialog>

                <BaseButton
                    variant="outline"
                    className="w-full justify-start bg-white hover:bg-gray-50 h-10 text-sm dark:text-black"
                    asChild
                >
                    <Link href="/employee/benefits">
                        <Heart className="w-5 h-5 mr-3" />
                        Manage Benefits
                    </Link>
                </BaseButton>

                <BaseButton
                    variant="outline"
                    className="w-full justify-start bg-white hover:bg-gray-50 h-10 text-sm dark:text-black"
                    asChild
                >
                    <Link href="/employee/paystubs">
                        <FileText className="w-5 h-5 mr-3" />
                        View Pay Stubs
                    </Link>
                </BaseButton>

            </CardContent>

        </Card>
    )
}