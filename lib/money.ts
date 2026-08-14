// Central monetary normalization boundary. All payroll money that crosses a
// data-boundary (DB writes/reads, run returns) is rounded here. Keeping this
// module free of imports and side effects means calc and server actions can
// both consume it without triggering module-scope client creation.

export const roundMoney = (value: number) => Math.round(value * 100) / 100;