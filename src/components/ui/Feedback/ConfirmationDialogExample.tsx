// Exemple d'utilisation du hook useConfirmation
// Ce fichier montre comment utiliser le hook useConfirmation
// pour remplacer facilement les window.confirm()

'use client';

import React, { useState } from 'react';
import { useConfirmation } from '../../../hooks';
import { ConfirmationDialog } from '../../../components/ui';

const ExampleComponent = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const { confirm, confirmationState, handleConfirm, handleCancel } = useConfirmation();

  const handleDeleteItem = (index: number) => {
    confirm(
      () => {
        // Action à effectuer lors de la confirmation
        setItems(prev => prev.filter((_, i) => i !== index));
      },
      {
        title: 'Supprimer l\'élément',
        message: `Êtes-vous sûr de vouloir supprimer "${items[index]}" ? Cette action est irréversible.`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        confirmButtonColor: 'red'
      }
    );
  };

  const handleResetAll = () => {
    confirm(
      () => {
        setItems([]);
      },
      {
        title: 'Réinitialiser tout',
        message: 'Êtes-vous sûr de vouloir supprimer tous les éléments ? Cette action est irréversible.',
        confirmText: 'Tout supprimer',
        cancelText: 'Annuler',
        confirmButtonColor: 'red'
      }
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Exemple d'utilisation du ConfirmationDialog</h2>

      <div className="space-y-2 mb-6">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>{item}</span>
            <button
              onClick={() => handleDeleteItem(index)}
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <button
          onClick={handleResetAll}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Tout supprimer
        </button>
      )}

      {/* Le dialogue de confirmation */}
      <ConfirmationDialog
        isOpen={confirmationState.isOpen}
        title={confirmationState.options?.title || ''}
        message={confirmationState.options?.message || ''}
        confirmText={confirmationState.options?.confirmText}
        cancelText={confirmationState.options?.cancelText}
        confirmButtonColor={confirmationState.options?.confirmButtonColor}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ExampleComponent;