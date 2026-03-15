export interface PaystubInfoProps {
    title: string;
    value: string | number;
    valueClassName?: string;
}

export interface PayStub {
    id: string
    period: string
    paidOn: string
    netPay: number
    grossPay: number
    taxes: number
    benefits: number
}