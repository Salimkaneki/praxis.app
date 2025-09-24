'use client'
import React from "react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  loading?: boolean;
  itemName?: string;
  itemsPerPage?: number;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  lastPage,
  total,
  loading = false,
  itemName = "élément",
  itemsPerPage = 10,
  onPrevious,
  onNext,
  className = ""
}: PaginationProps) {
  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  return (
    <div className={`mt-6 flex items-center justify-between ${className}`}>
      <div className="text-sm font-poppins text-gray-700">
        {loading ? (
          "Chargement..."
        ) : total > 0 ? (
          <>
            Affichage de <span className="font-medium">{startItem}</span> à{" "}
            <span className="font-medium">{endItem}</span> sur{" "}
            <span className="font-medium">{total}</span> {itemName}{total > 1 ? 's' : ''}
          </>
        ) : (
          "Aucun résultat"
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onPrevious}
          disabled={loading || currentPage === 1}
          className="px-3 py-2 text-sm font-poppins font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Précédent
        </button>

        <span className="px-3 py-2 text-sm font-poppins text-gray-700">
          Page {currentPage} sur {lastPage}
        </span>

        <button
          onClick={onNext}
          disabled={loading || currentPage >= lastPage}
          className="px-3 py-2 text-sm font-poppins font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}