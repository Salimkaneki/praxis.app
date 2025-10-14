# TeacherDashboard Service

Ce service fournit une interface TypeScript pour interagir avec l'API du tableau de bord des enseignants.

## ✅ API Opérationnelle

L'API Laravel est maintenant **opérationnelle** et retourne des données réelles :
- **13 élèves** dans l'institution
- **6 questionnaires** créés (Algorithmique, Bases de Données, Mathématiques Discrètes, etc.)
- **0 évaluations** à venir (pour le moment)

## Architecture

Le service est basé sur le contrôleur PHP Laravel `TeacherDashboardController` et fournit les mêmes fonctionnalités côté frontend.

## Types

### KPI
```typescript
interface KPI {
  label: string;
  value: string | number;
  trend: 'positive' | 'negative';
  period: string;
}
```

### Quiz
```typescript
interface Quiz {
  id: number;
  title: string;
  class_name: string;
  questions: number;
  created_at: string;
}
```

### UpcomingEvaluation
```typescript
interface UpcomingEvaluation {
  id: number;
  title: string;
  date: string;
  time: string;
  class_name: string;
}
```

## Méthodes

### `getDashboardData()`
Récupère toutes les données du tableau de bord en une seule requête.

```typescript
const data = await teacherDashboardService.getDashboardData();
// Retourne: { kpis: KPI[], quizzes: Quiz[], upcoming_evaluations: UpcomingEvaluation[] }
```

### `getKPIs()`
Récupère uniquement les KPIs.

### `getQuizzes()`
Récupère uniquement les quizzes de l'enseignant.

### `getUpcomingEvaluations()`
Récupère uniquement les évaluations à venir.

### `deleteQuiz(quizId: number)`
Supprime un quiz.

### `updateQuizStatus(quizId: number, status: string)`
Met à jour le statut d'un quiz.

## Hook personnalisé

Utilisez le hook `useTeacherDashboard` pour une intégration facile dans les composants React :

```typescript
import { useTeacherDashboard } from './_hooks/useTeacherDashboard';

function MyComponent() {
  const {
    kpis,
    quizzes,
    upcomingEvaluations,
    loading,
    error,
    refreshData
  } = useTeacherDashboard();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {/* Utilisez kpis, quizzes, upcomingEvaluations */}
    </div>
  );
}
```

## Endpoints API Laravel (implémentés)

Le service fait des appels vers ces endpoints Laravel :

- `GET /api/teacher/dashboard` - Toutes les données ✅
- `GET /api/teacher/dashboard/kpis` - KPIs uniquement
- `GET /api/teacher/dashboard/quizzes` - Quizzes uniquement
- `GET /api/teacher/dashboard/upcoming-evaluations` - Évaluations à venir
- `DELETE /api/teacher/dashboard/quizzes/{id}` - Supprimer un quiz
- `PATCH /api/teacher/dashboard/quizzes/{id}/status` - Mettre à jour le statut

## Routes Laravel

Un fichier `teacher-api-routes.php` a été créé avec les routes nécessaires. Intégrez-le dans votre `routes/api.php` :

```php
// Dans routes/api.php
require __DIR__.'/teacher-api-routes.php';
```

## Contrôleur Laravel

Utilisez le contrôleur `TeacherDashboardController` fourni précédemment.

## Gestion des erreurs

Toutes les méthodes incluent une gestion d'erreur appropriée et loguent les erreurs en console. Les erreurs sont propagées pour être gérées par l'interface utilisateur.