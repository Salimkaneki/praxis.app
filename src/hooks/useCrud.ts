import { useState } from 'react';

interface UseCrudOptions<T> {
  deleteMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useCrud<T extends { id: number }>(options: UseCrudOptions<T> = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (
    item: T,
    deleteFunction: (id: number) => Promise<void>,
    customMessage?: string
  ) => {
    const message = customMessage || options.deleteMessage || `Voulez-vous vraiment supprimer cet élément ?`;

    if (!confirm(message)) return false;

    try {
      setLoading(true);
      setError(null);
      await deleteFunction(item.id);

      if (options.successMessage) {
        alert(options.successMessage);
      }

      options.onSuccess?.();
      return true;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || options.errorMessage || "Une erreur est survenue";
      setError(errorMsg);
      alert(errorMsg);
      options.onError?.(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async (
    items: T[],
    deleteFunction: (ids: number[]) => Promise<void>,
    customMessage?: string
  ) => {
    const message = customMessage || `Voulez-vous vraiment supprimer ${items.length} élément(s) ?`;

    if (!confirm(message)) return false;

    try {
      setLoading(true);
      setError(null);
      await deleteFunction(items.map(item => item.id));

      if (options.successMessage) {
        alert(options.successMessage);
      }

      options.onSuccess?.();
      return true;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || options.errorMessage || "Une erreur est survenue";
      setError(errorMsg);
      alert(errorMsg);
      options.onError?.(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    handleDelete,
    handleBulkDelete
  };
}