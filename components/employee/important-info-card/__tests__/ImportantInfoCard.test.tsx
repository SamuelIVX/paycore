/**
 * Vitest coverage for components/employee/important-info-card/ImportantInfoCard.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ImportantInfoCard from '@/components/employee/important-info-card/ImportantInfoCard';

describe('ImportantInfoCard component', () => {
  it('renders important information title and bullet points', () => {
    render(<ImportantInfoCard />);

    expect(screen.getByText('Important Information')).toBeInTheDocument();
    expect(
      screen.getByText('Changes to optional benefits take effect on the 1st of the following month'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Deductions are automatically calculated and shown on your pay stubs'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'You can modify your benefits during open enrollment or after qualifying life events',
      ),
    ).toBeInTheDocument();
  });
});
