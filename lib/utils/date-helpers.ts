// Normalizes the supplied date to midnight UTC and shifts it back to the Monday
// of that ISO-week. Accepts either a Date or a YYYY-MM-DD / ISO string. Used by
// the payroll weekly aggregation and the per-week eligibility window so both
// agree on the workweek boundary.
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

export function getWeekStartKey(date: Date | string = new Date()): string {
  return getWeekStartUTC(date).toISOString().slice(0, 10);
}
