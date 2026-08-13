/**
 * General UI helpers: Tailwind class merge (cn), day/period formatting.
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names with clsx + tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Short weekday label for a Date (en-US).
 */
export function getShortDay(date: Date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
}

/**
 * Formats start/end date-only strings as "Mon D–Mon D, YYYY" (noon-anchored).
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
