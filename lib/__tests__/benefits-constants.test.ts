/**
 * Vitest tests for lib/constants/benefits.
 */
import { describe, expect, it } from 'vitest';
import { BENEFIT_ICONS } from '../constants/benefits';

describe('BENEFIT_ICONS mapping', () => {
  it('maps all expected benefit types to lucide icons', () => {
    expect(BENEFIT_ICONS.Health).toBeDefined();
    expect(BENEFIT_ICONS.Dental).toBeDefined();
    expect(BENEFIT_ICONS.Vision).toBeDefined();
    expect(BENEFIT_ICONS.Retirement).toBeDefined();
    expect(BENEFIT_ICONS.Life).toBeDefined();
    expect(BENEFIT_ICONS.Disability).toBeDefined();
    expect(BENEFIT_ICONS.Wellness).toBeDefined();
    expect(BENEFIT_ICONS.Other).toBeDefined();
  });
});
