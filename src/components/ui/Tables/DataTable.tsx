'use client'
import React from "react";
import { Loader2, AlertCircle } from "lucide-react";

interface TableColumn {
  key: string;
  label: string;
  className?: string;
}

interface DataTableProps<T> {
  title: string;
  columns: TableColumn[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  loadingMessage?: string;
  showExport?: boolean;
  onExport?: () => void;
  renderRow: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export default function DataTable<T>({
  title,
  columns,
  data,
  loading = false,
  emptyMessage = "Aucun élément trouvé",
  emptyIcon,
  loadingMessage = "Chargement...",
  showExport = false,
  onExport,
  renderRow,
  className = ""
}: DataTableProps<T>) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h2 className="text-lg font-poppins font-medium text-gray-900">
          {title}
        </h2>
        <div className="flex items-center space-x-3">
          {loading && (
            <div className="flex items-center text-sm text-gray-500">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {loadingMessage}
            </div>
          )}
          {showExport && (
            <button
              onClick={onExport}
              className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 mr-3 animate-spin text-forest-600" />
                    <span className="text-gray-600 font-poppins">{loadingMessage}</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500 font-poppins">
                  {emptyIcon || <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />}
                  <p className="text-lg font-medium">{emptyMessage}</p>
                  <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                </td>
              </tr>
            ) : (
              data.map((item, index) => renderRow(item, index))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}