/**
 * Vitest coverage for components/employee/grid-content/grid-cards/quick-stats-card.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import QuickStatsCard from '@/components/employee/grid-content/grid-cards/quick-stats-card';

describe('QuickStatsCard component', () => {
  it('renders quick stats card title, description, and employee stat rows', () => {
    render(<QuickStatsCard />);

    expect(screen.getByText('Quick Stats')).toBeInTheDocument();
    expect(screen.getByText('Your employment overview')).toBeInTheDocument();

    expect(screen.getByText('Position')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();

    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();

    expect(screen.getByText('Tenure')).toBeInTheDocument();
    expect(screen.getByText('2 years, 1 month')).toBeInTheDocument();

    expect(screen.getByText('Benefits Enrolled')).toBeInTheDocument();
    expect(screen.getByText('2 optional plans')).toBeInTheDocument();
  });
});
