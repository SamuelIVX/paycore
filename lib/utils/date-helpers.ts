/**
 * UTC week-start helpers shared by payroll overtime and eligibility lookbacks.
 */

/**
 * Normalizes a date to midnight UTC and shifts it to the Monday of that ISO week.
 * Accepts a Date or YYYY-MM-DD / ISO string so payroll weekly aggregation and the
 * per-week eligibility window agree on the workweek boundary.
 * @param date - Instant or date-only/ISO string (defaults to now).
 * @returns Monday 00:00:00.000Z for that week.
 * @example
 * getWeekStartUTC("2026-08-13").toISOString().slice(0, 10) // => "2026-08-10"
 */
export function getWeekStartUTC(date: Date | string = new Date()): Date {
  const d = typeof date === "string" ? new Date(date) : date;
  const monday = new Date(Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
  ));
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
  return monday;
}

/**
 * ISO date key (YYYY-MM-DD) of the Monday that starts the UTC week for `date`.
 * @param date - Instant or date-only/ISO string (defaults to now).
 * @returns Week-start key used as Map keys in overtime/eligibility bucketing.
 * @example
 * getWeekStartKey("2026-08-13") // => "2026-08-10"
 */
export function getWeekStartKey(date: Date | string = new Date()): string {
  return getWeekStartUTC(date).toISOString().slice(0, 10);
}
