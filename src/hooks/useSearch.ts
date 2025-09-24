import { useState, useCallback, useEffect } from 'react';

interface UseSearchOptions {
  debounceMs?: number;
  onSearch?: (query: string) => void;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 500, onSearch } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      onSearch?.(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch]);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  return {
    query,
    debouncedQuery,
    updateQuery,
    clearSearch
  };
}