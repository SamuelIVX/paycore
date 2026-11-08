/**
 * Vitest coverage for components/ui/data-table.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';

interface RowData {
  id: string;
  name: string;
}

const columns: ColumnDef<RowData>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
];

const data: RowData[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

describe('DataTable component', () => {
  it('renders table data, headerAction, and search placeholder', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Find users..."
        headerAction={<button>Export</button>}
      />
    );

    expect(screen.getByPlaceholderText('Find users...')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('3 row(s)')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });

  it('triggers onRowClick with row data when clicked', () => {
    const handleRowClick = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        onRowClick={handleRowClick}
      />
    );

    const rowCell = screen.getByText('Alice');
    fireEvent.click(rowCell);

    expect(handleRowClick).toHaveBeenCalledWith({ id: '1', name: 'Alice' });
  });

  it('renders loading state when isLoading is true', () => {
    render(<DataTable columns={columns} data={[]} isLoading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('No results found.')).not.toBeInTheDocument();
  });

  it('renders error message when error prop is provided', () => {
    render(<DataTable columns={columns} data={[]} error="Failed to load items" />);

    expect(screen.getByText('Failed to load items')).toBeInTheDocument();
  });

  it('renders empty state when not loading and data is empty', () => {
    render(<DataTable columns={columns} data={[]} isLoading={false} />);

    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('supports pagination next and previous buttons', () => {
    const manyRows: RowData[] = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      name: `User ${i + 1}`,
    }));

    render(<DataTable columns={columns} data={manyRows} pageSize={10} />);

    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    const prevBtn = screen.getByRole('button', { name: 'Previous page' });
    const nextBtn = screen.getByRole('button', { name: 'Next page' });

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeEnabled();

    fireEvent.click(nextBtn);
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    expect(prevBtn).toBeEnabled();

    fireEvent.click(prevBtn);
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });
});
