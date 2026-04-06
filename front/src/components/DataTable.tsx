"use client";

import type { ReactNode } from "react";

// Column configuration
export type ColumnConfig<T> = {
  key: keyof T;
  label: string;
  cellClassName: string;
};

interface DataTableProps<T extends { id: number }> {
  data: T[];
  columns: ColumnConfig<T>[];
  sortField: keyof T | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof T) => void;
  renderCell?: (item: T, column: ColumnConfig<T>) => ReactNode;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T extends { id: number }>({
  data,
  columns,
  sortField,
  sortDirection,
  onSort,
  renderCell,
  onRowClick,
}: DataTableProps<T>) {
  const defaultRenderCell = (item: T, column: ColumnConfig<T>) =>
    String(item[column.key] ?? "");

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => onSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {sortField === column.key && (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      {sortDirection === "asc" ? (
                        <path
                          fillRule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      ) : (
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      )}
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={`hover:bg-gray-50 ${onRowClick ? "cursor-pointer" : ""}`}
            >
              {columns.map((column) => (
                <td
                  key={`${item.id}-${String(column.key)}`}
                  className={`px-6 py-4 ${column.cellClassName}`}
                >
                  {renderCell
                    ? renderCell(item, column)
                    : defaultRenderCell(item, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
