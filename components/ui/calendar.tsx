"use client"

import * as React from "react"

type CalendarClassNames = {
  month_caption?: string
  nav?: string
}

export type CalendarProps = {
  mode?: "single"
  selected?: Date
  defaultMonth?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
  classNames?: CalendarClassNames
}

function formatDateForInput(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function parseDateFromInput(value: string) {
  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day) {
    return undefined
  }

  return new Date(year, month - 1, day)
}

export function Calendar({
  selected,
  onSelect,
  className,
  classNames,
}: CalendarProps) {
  const value = selected ? formatDateForInput(selected) : ""

  return (
    <div className={className}>
      <div className={classNames?.month_caption} />
      <div className={classNames?.nav} />
      <input
        type="date"
        value={value}
        onChange={(event) => {
          const next = event.target.value
            ? parseDateFromInput(event.target.value)
            : undefined
          onSelect?.(next)
        }}
      />
    </div>
  )
}