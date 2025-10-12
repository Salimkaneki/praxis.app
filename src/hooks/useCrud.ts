import { useState } from 'react';
import { useToast } from './useToast';
import toast from 'react-hot-toast';

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const { showSuccess, showError } = useToast();

  const handleDelete = async (
    item: T,
    deleteFunction: (id: number) => Promise<void>,
    customMessage?: string
  ) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async (
    deleteFunction: (id: number) => Promise<void>
  ) => {
    if (!itemToDelete) return false;

    try {
      setLoading(true);
      setError(null);
      await deleteFunction(itemToDelete.id);

      if (options.successMessage) {
        showSuccess(options.successMessage);
      }

      options.onSuccess?.();
      setShowDeleteDialog(false);
      setItemToDelete(null);
      return true;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || options.errorMessage || "Une erreur est survenue";
      setError(errorMsg);
      showError(errorMsg);
      options.onError?.(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const handleBulkDelete = async (
    items: T[],
    deleteFunction: (ids: number[]) => Promise<void>,
    customMessage?: string
  ) => {
    const message = customMessage || `Suppression de ${items.length} élément(s)...`;

    try {
      await toast.promise(
        deleteFunction(items.map(item => item.id)),
        {
          loading: message,
          success: options.successMessage || `${items.length} élément(s) supprimé(s) avec succès`,
          error: (err: any) => err?.response?.data?.message || options.errorMessage || "Erreur lors de la suppression",
        }
      );

      options.onSuccess?.();
      return true;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || options.errorMessage || "Une erreur est survenue";
      setError(errorMsg);
      options.onError?.(err);
      return false;
    }
  };

  return {
    loading,
    error,
    setError,
    showDeleteDialog,
    itemToDelete,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleBulkDelete
  };
}