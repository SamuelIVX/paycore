import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getShortDay(date: Date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
}

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
