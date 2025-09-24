'use client'
import React from "react";
import { Search, Filter } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  total?: number;
  itemName?: string;
  showFilter?: boolean;
  onFilter?: () => void;
  loading?: boolean;
  className?: string;
}

export default function SearchBar({
  placeholder = "Rechercher...",
  value,
  onChange,
  total,
  itemName = "élément",
  showFilter = false,
  onFilter,
  loading = false,
  className = ""
}: SearchBarProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors font-poppins text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {showFilter && (
            <button
              onClick={onFilter}
              className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </button>
          )}

          {total !== undefined && (
            <div className="text-sm font-poppins text-gray-500">
              {loading ? "Recherche..." : `${total} ${itemName}${total > 1 ? 's' : ''} trouvé${total > 1 ? 's' : ''}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}