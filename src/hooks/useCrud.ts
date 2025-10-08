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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

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
        // Message de succès géré par le composant parent
      }

      options.onSuccess?.();
      setShowDeleteDialog(false);
      setItemToDelete(null);
      return true;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || options.errorMessage || "Une erreur est survenue";
      setError(errorMsg);
      // Erreur affichée via l'état error
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
    // Pour la suppression en masse, nous pourrions avoir besoin d'un état séparé
    // Pour l'instant, utilisons confirm() comme fallback
    const message = customMessage || `Voulez-vous vraiment supprimer ${items.length} élément(s) ?`;

    if (!confirm(message)) return false;

    try {
      setLoading(true);
      setError(null);
      await deleteFunction(items.map(item => item.id));

      if (options.successMessage) {
        // Message de succès géré par le composant parent
      }

      options.onSuccess?.();
      return true;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || options.errorMessage || "Une erreur est survenue";
      setError(errorMsg);
      // Erreur affichée via l'état error
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
    showDeleteDialog,
    itemToDelete,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleBulkDelete
  };
}