import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  itemsPerPage?: number;
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  total: number;
  lastPage: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, itemsPerPage = 10 } = options;

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: initialPage,
    itemsPerPage,
    total: 0,
    lastPage: 1
  });

  const updatePagination = useCallback((data: {
    current_page: number;
    last_page: number;
    total: number;
    per_page?: number;
  }) => {
    setPagination({
      currentPage: data.current_page,
      itemsPerPage: data.per_page || itemsPerPage,
      total: data.total,
      lastPage: data.last_page
    });
  }, [itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.lastPage))
    }));
  }, []);

  const nextPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, prev.lastPage)
    }));
  }, []);

  const previousPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 1)
    }));
  }, []);

  const resetPagination = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  }, []);

  return {
    ...pagination,
    updatePagination,
    goToPage,
    nextPage,
    previousPage,
    resetPagination
  };
}