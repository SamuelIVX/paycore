'use client'

import * as React from 'react'

type CalendarClassNames = {
  month_caption?: string
  nav?: string
}

export type CalendarProps = {
  mode?: 'single'
  selected?: Date
  defaultMonth?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
  classNames?: CalendarClassNames
}

export function Calendar({
  selected,
  onSelect,
  className,
  classNames
}: CalendarProps) {
  const value = selected ? selected.toISOString().slice(0, 10) : ''

  return (
    <div className={className}>
      <div className={classNames?.month_caption} />
      <div className={classNames?.nav} />
      <input
        type='date'
        value={value}
        onChange={(event) => {
          const next = event.target.value ? new Date(event.target.value) : undefined
          onSelect?.(next)
        }}
      />
    </div>
  )
}
