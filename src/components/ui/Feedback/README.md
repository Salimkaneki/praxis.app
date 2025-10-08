# ConfirmationDialog Component

Le composant `ConfirmationDialog` est un dialogue modal réutilisable pour les confirmations d'actions destructives (suppressions, etc.) dans l'application.

## Utilisation de base

### Avec le composant directement

```tsx
import { ConfirmationDialog } from '@/components/ui';

const MyComponent = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleDelete = async () => {
    // Logique de suppression
    setShowDialog(false);
  };

  return (
    <>
      <button onClick={() => setShowDialog(true)}>
        Supprimer
      </button>

      <ConfirmationDialog
        isOpen={showDialog}
        title="Supprimer l'élément"
        message="Êtes-vous sûr de vouloir supprimer cet élément ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmButtonColor="red"
        onConfirm={handleDelete}
        onCancel={() => setShowDialog(false)}
        isLoading={false}
      />
    </>
  );
};
```

### Avec le hook useConfirmation (recommandé)

```tsx
import { useConfirmation } from '@/hooks';
import { ConfirmationDialog } from '@/components/ui';

const MyComponent = () => {
  const { confirm, confirmationState, handleConfirm, handleCancel } = useConfirmation();

  const handleDelete = (itemId: number) => {
    confirm(
      async () => {
        // Logique de suppression
        await deleteItem(itemId);
      },
      {
        title: 'Supprimer l\'élément',
        message: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        confirmButtonColor: 'red'
      }
    );
  };

  return (
    <>
      <button onClick={() => handleDelete(123)}>
        Supprimer l'élément
      </button>

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
    </>
  );
};
```

## Props du composant ConfirmationDialog

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `isOpen` | `boolean` | - | Contrôle l'affichage du dialogue |
| `title` | `string` | - | Titre du dialogue |
| `message` | `string` | - | Message de confirmation |
| `confirmText` | `string` | `"Confirmer"` | Texte du bouton de confirmation |
| `cancelText` | `string` | `"Annuler"` | Texte du bouton d'annulation |
| `confirmButtonColor` | `"red" \| "blue" \| "green"` | `"red"` | Couleur du bouton de confirmation |
| `onConfirm` | `() => void` | - | Fonction appelée lors de la confirmation |
| `onCancel` | `() => void` | - | Fonction appelée lors de l'annulation |
| `isLoading` | `boolean` | `false` | Affiche un spinner de chargement |

## Avantages

- **UX cohérente** : Interface uniforme pour toutes les confirmations
- **Accessibilité** : Dialogue modal avec gestion du focus et overlay
- **Personnalisable** : Couleurs, textes et actions adaptables
- **Réutilisable** : Un seul composant pour toute l'application
- **TypeScript** : Types complets pour une meilleure DX

## Exemple dans quiz-details/[id]/page.tsx

Le composant est utilisé pour confirmer la suppression de quiz et de questions :

```tsx
// Suppression d'un quiz
const handleDeleteQuiz = () => {
  setShowDeleteQuizDialog(true);
};

// Suppression d'une question
const handleDeleteQuestion = (questionId: number) => {
  setQuestionToDelete(questionId);
  setShowDeleteQuestionDialog(true);
};
```

## Migration depuis window.confirm()

Remplacez :
```tsx
if (window.confirm("Êtes-vous sûr ?")) {
  // action
}
```

Par :
```tsx
confirm(
  () => { /* action */ },
  {
    title: "Titre",
    message: "Message de confirmation"
  }
);
```