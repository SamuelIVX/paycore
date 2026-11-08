/**
 * Vitest coverage for components/ui/table.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';

describe('Table UI primitives', () => {
  it('renders a complete table with all subcomponents and slot attributes', () => {
    const { container } = render(
      <Table className="custom-table">
        <TableCaption className="custom-caption">Test Caption</TableCaption>
        <TableHeader className="custom-header">
          <TableRow className="custom-row" data-state="selected">
            <TableHead className="custom-head">Header Cell</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="custom-body">
          <TableRow>
            <TableCell className="custom-cell">Body Cell</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter className="custom-footer">
          <TableRow>
            <TableCell>Footer Cell</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    const tableContainer = container.querySelector('[data-slot="table-container"]');
    expect(tableContainer).toBeInTheDocument();
    expect(tableContainer).toHaveClass('relative', 'w-full', 'overflow-x-auto');

    const table = screen.getByRole('table');
    expect(table).toHaveClass('custom-table', 'w-full', 'caption-bottom', 'text-sm');
    expect(table).toHaveAttribute('data-slot', 'table');

    const caption = screen.getByText('Test Caption');
    expect(caption).toHaveAttribute('data-slot', 'table-caption');
    expect(caption).toHaveClass('custom-caption', 'text-muted-foreground', 'mt-4', 'text-sm');

    const thead = container.querySelector('thead');
    expect(thead).toHaveClass('[&_tr]:border-b');

    const tbody = container.querySelector('tbody');
    expect(tbody).toHaveClass('[&_tr:last-child]:border-0');

    const tfoot = container.querySelector('tfoot');
    expect(tfoot).toHaveClass('bg-muted/50', 'border-t', 'font-medium', '[&>tr]:last:border-b-0');

    const tr = container.querySelector('tr[data-state=selected]');
    expect(tr).toHaveClass('hover:bg-muted/50', 'border-b', 'transition-colors');

    const th = screen.getByText('Header Cell');
    expect(th).toHaveAttribute('data-slot', 'table-head');
    expect(th).toHaveAttribute('scope', 'col');
    expect(th).toHaveClass('custom-head', 'text-foreground', 'h-10', 'px-2', 'text-left', 'align-middle', 'font-medium');

    const td = screen.getByText('Body Cell');
    expect(td).toHaveAttribute('data-slot', 'table-cell');
    expect(td).toHaveClass('custom-cell', 'p-2', 'align-middle');

    expect(screen.getByText('Footer Cell')).toBeInTheDocument();
  });
});
