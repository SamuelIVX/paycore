/**
 * USD currency formatter for payroll/UI display.
 * @param value - Numeric amount (not pre-scaled cents).
 * @returns Locale currency string (en-US, USD).
 * @example
 * formatCurrency(1234.5) // => "$1,234.50"
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}