// Bi-weekly pay period assumption: salaried and benefit calculations convert
// annual/period amounts across 26 pay periods per year. Single source of truth
// so salary, benefits, and annual-salary aggregations cannot drift apart.
export const BI_WEEKLY_PAY_PERIODS = 26;