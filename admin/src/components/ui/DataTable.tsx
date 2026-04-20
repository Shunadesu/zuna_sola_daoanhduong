import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  loading?: boolean;
  skeletonRows?: number;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  sortKey,
  sortDir,
  onSort,
  loading = false,
  skeletonRows = 5,
  emptyMessage = 'Không có dữ liệu',
  onRowClick,
  className,
}: DataTableProps<T>) {
  const renderSortIcon = (col: Column<T>) => {
    if (!col.sortable || !onSort) return null;
    const isActive = sortKey === col.key;
    return (
      <span className="inline-flex ml-1">
        {isActive && sortDir === 'asc' ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : isActive && sortDir === 'desc' ? (
          <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <span className="w-3.5 h-3.5 opacity-30">↕</span>
        )}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={cn('bg-card rounded-xl border overflow-hidden', className)}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/40">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                    style={{ width: col.width }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-5 bg-muted rounded w-24" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn('bg-card rounded-xl border overflow-hidden flex items-center justify-center py-16', className)}>
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('bg-card rounded-xl border overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap',
                    col.sortable && onSort && 'cursor-pointer select-none hover:bg-muted/60'
                  )}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  <span className="inline-flex items-center">
                    {col.header}
                    {renderSortIcon(col)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item, index) => (
              <tr
                key={keyExtractor(item)}
                className={cn(
                  'hover:bg-muted/30 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 align-middle">
                    {col.render
                      ? col.render(item, index)
                      : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
