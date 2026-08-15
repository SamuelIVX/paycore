// Central monetary normalization boundary. All payroll money that crosses a
// data-boundary (DB writes/reads, run returns) is rounded here. Keeping this
// module free of imports and side effects means calc and server actions can
// both consume it without triggering module-scope client creation.

// Exact half-way cents (1.005, 10.075, …) are not representable in binary
// floating point; they land a few ulps *below* the true value, so toFixed(2)
// rounds them down. Add a scale-aware epsilon relative to the amount's own
// magnitude to nudge them back over the half-way mark. The offset is far too
// small (< 1e-6 cents) to disturb any real value.
const HALF_WAY_EPSILON = (value: number) =>
    1e-9 * Math.max(1, Math.abs(value) * 100);

export const roundMoney = (value: number) => {
    const bump = value >= 0 ? HALF_WAY_EPSILON(value) : -HALF_WAY_EPSILON(value);
    return Math.round((value + bump) * 100) / 100;
};