import { describe, it, expect } from 'vitest';
import { roundMoney } from '@/lib/money';
import { BI_WEEKLY_PAY_PERIODS } from '@/lib/payroll-constants';

describe('roundMoney (single monetary normalization boundary)', () => {
    it('rounds to two decimals half-up', () => {
        expect(roundMoney(1.005)).toBe(1.01);
        expect(roundMoney(10.126)).toBe(10.13);
        expect(roundMoney(10.124)).toBe(10.12);
        expect(roundMoney(10.075)).toBe(10.08);
        expect(roundMoney(-1.005)).toBe(-1.01);
    });

    it('handles integers and zeros without drift', () => {
        expect(roundMoney(960)).toBe(960);
        expect(roundMoney(0)).toBe(0);
    });

    it('rounds to two decimals on the calculated value, no string coercion', () => {
        const gross = roundMoney(100000 / BI_WEEKLY_PAY_PERIODS);
        expect(typeof gross).toBe('number');
        expect(Number(gross.toFixed(2))).toBe(gross);
    });
});

describe('BI_WEEKLY_PAY_PERIODS (single source of the 26-period rule)', () => {
    it('is 26', () => {
        expect(BI_WEEKLY_PAY_PERIODS).toBe(26);
    });

    it('salary-per-period divides annual pay by the constant', () => {
        const payRate = 100000;
        expect(roundMoney(payRate / BI_WEEKLY_PAY_PERIODS)).toBe(3846.15);
    });
});