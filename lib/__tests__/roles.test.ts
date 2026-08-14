import { describe, it, expect } from 'vitest';
import {
    canonicalizeAuthRole,
    canonicalizeSearchRole,
    getColumnsForRole,
} from '@/lib/auth/roles';

describe('canonicalizeAuthRole (profiles.role -> login routing)', () => {
    it('accepts MANAGER and EMPLOYEE verbatim', () => {
        expect(canonicalizeAuthRole('MANAGER')).toBe('MANAGER');
        expect(canonicalizeAuthRole('EMPLOYEE')).toBe('EMPLOYEE');
    });

    it('rejects lowercase and unknown values', () => {
        expect(canonicalizeAuthRole('manager')).toBeNull();
        expect(canonicalizeAuthRole('visitor')).toBeNull();
        expect(canonicalizeAuthRole('')).toBeNull();
    });

    it('rejects null and undefined', () => {
        expect(canonicalizeAuthRole(null)).toBeNull();
        expect(canonicalizeAuthRole(undefined)).toBeNull();
    });
});

describe('canonicalizeSearchRole (employees.role -> search tier)', () => {
    it('accepts lowercase manager/employee', () => {
        expect(canonicalizeSearchRole('manager')).toBe('manager');
        expect(canonicalizeSearchRole('employee')).toBe('employee');
    });

    it('is case-insensitive (mirrors original lowercasing)', () => {
        expect(canonicalizeSearchRole('MANAGER')).toBe('manager');
        expect(canonicalizeSearchRole('Employee')).toBe('employee');
    });

    it('resolves unknown/missing to visitor', () => {
        expect(canonicalizeSearchRole('Engineer')).toBe('visitor');
        expect(canonicalizeSearchRole('')).toBe('visitor');
        expect(canonicalizeSearchRole(null)).toBe('visitor');
        expect(canonicalizeSearchRole(undefined)).toBe('visitor');
    });
});

describe('getColumnsForRole (column exposure per tier)', () => {
    it('manager sees all columns', () => {
        expect(getColumnsForRole('manager')).toBe('*');
    });

    it('employee sees contact + employment fields', () => {
        expect(getColumnsForRole('employee')).toBe(
            'id, first_name, last_name, position, phone, email, hire_date, employment_status, department_id'
        );
    });

    it('visitor sees reduced fields', () => {
        expect(getColumnsForRole('visitor')).toBe(
            'id, first_name, last_name, position, phone, email'
        );
    });
});
