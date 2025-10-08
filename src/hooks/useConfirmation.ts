'use client';

import { useState } from 'react';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: 'red' | 'blue' | 'green';
}

interface ConfirmationState {
  isOpen: boolean;
  options: ConfirmationOptions | null;
  onConfirm: (() => void) | null;
}

export const useConfirmation = () => {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    options: null,
    onConfirm: null,
  });

  const confirm = (
    onConfirm: () => void | Promise<void>,
    options: ConfirmationOptions
  ) => {
    setState({
      isOpen: true,
      options,
      onConfirm,
    });
  };

  const handleConfirm = async () => {
    if (state.onConfirm) {
      try {
        await state.onConfirm();
      } catch (error) {
        // L'erreur peut être gérée par le composant appelant
        console.error('Erreur lors de la confirmation:', error);
      }
    }
    setState({
      isOpen: false,
      options: null,
      onConfirm: null,
    });
  };

  const handleCancel = () => {
    setState({
      isOpen: false,
      options: null,
      onConfirm: null,
    });
  };

  return {
    confirm,
    confirmationState: state,
    handleConfirm,
    handleCancel,
  };
};