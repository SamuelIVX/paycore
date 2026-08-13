/**
 * General UI helpers: Tailwind class merge (cn), day/period formatting.
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names with clsx + tailwind-merge.
 * @param inputs - Class values (strings, arrays, conditionals).
 * @returns Single class string with Tailwind conflicts resolved.
 * @example
 * cn("px-2", false && "hidden", "px-4") // => "px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Short weekday label for a Date (en-US).
 * @param date - Instant to format.
 * @returns Abbreviated weekday (e.g. "Mon").
 * @example
 * getShortDay(new Date("2026-08-10T12:00:00")) // => "Mon"
 */
export function getShortDay(date: Date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
}

/**
 * Formats start/end date-only strings as "Mon D–Mon D, YYYY" (noon-anchored).
 * @param start - Inclusive period start (YYYY-MM-DD), or nullish.
 * @param end - Inclusive period end (YYYY-MM-DD), or nullish.
 * @returns Formatted range, or "Unknown period" when either bound is missing.
 * @example
 * formatPayPeriod("2026-08-01", "2026-08-14") // => "Aug 1–Aug 14, 2026"
 */
export function formatPayPeriod(start?: string | null, end?: string | null) {
  if (!start || !end) return "Unknown period"

  const startDate = new Date(`${start}T12:00:00`)
  const endDate = new Date(`${end}T12:00:00`)

  const startText = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(startDate)

  const endText = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(endDate)

  return `${startText}–${endText}`
}

/**
 * Formats a paid-on date string; noon-anchors date-only values to avoid TZ shifts.
 * @param date - ISO or YYYY-MM-DD paid-on value.
 * @returns Locale short date, or "Unknown" when falsy.
 * @example
 * formatPaidOn("2026-08-15") // => "Aug 15, 2026"
 */
export function formatPaidOn(date?: string | null) {
  if (!date) return "Unknown"

  // Use noon to avoid timezone shift issues with date-only strings
  const dateValue = date.includes("T") ? date : `${date}T12:00:00`

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue))
}
