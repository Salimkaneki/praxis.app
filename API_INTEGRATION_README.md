# Intégration API Notifications Admin

## 🚀 Utilisation du Service TypeScript

Le service `A-Notifications.service.ts` est maintenant configuré pour fonctionner avec votre contrôleur Laravel.

### Configuration de l'authentification

**PLUS BESOIN de configurer manuellement le token !** L'intercepteur axios récupère automatiquement le token depuis localStorage :

- Pour les admins : `localStorage.getItem('admin_token')`
- Pour les enseignants : `localStorage.getItem('teacher_token')`
- Pour les étudiants : `localStorage.getItem('student_token')`

### Endpoints utilisés

Le service appelle ces endpoints sur votre serveur Laravel :

- **POST** `http://localhost:8000/api/admin/teacher-notifications/send-to-all`
- **POST** `http://localhost:8000/api/admin/teacher-notifications/send-to-specific/{teacherId}`
- **POST** `http://localhost:8000/api/admin/teacher-notifications/send-to-multiple`
- **GET** `http://localhost:8000/api/admin/teacher-notifications/available-teachers`

### Exemple d'utilisation

```typescript
// Envoyer à tous les enseignants
const response = await adminNotificationsService.sendToAllTeachers({
  type: 'admin_announcement',
  title: 'Nouvelle politique',
  message: 'Message de la notification',
  data: { priority: 'high' },
  expires_at: '2025-12-01 23:59:59'
});

// Envoyer à un enseignant spécifique
const response = await adminNotificationsService.sendToSpecificTeacher(123, {
  type: 'training_required',
  title: 'Formation obligatoire',
  message: 'Nouvelle formation disponible'
});
```

### Mode Simulation

Si l'API n'est pas disponible, activez le mode simulation :

```typescript
adminNotificationsService.setSimulationMode(true);
```

## 🔧 Configuration Laravel

Assurez-vous que :

1. **Routes enregistrées** dans `routes/api.php` :
```php
use App\Http\Controllers\Admin\AdminTeacherNotificationController;

Route::middleware(['auth:sanctum'])->prefix('admin/teacher-notifications')->group(function () {
    Route::post('/send-to-all', [AdminTeacherNotificationController::class, 'sendToAllTeachers']);
    Route::post('/send-to-specific/{teacherId}', [AdminTeacherNotificationController::class, 'sendToSpecificTeacher']);
    Route::post('/send-to-multiple', [AdminTeacherNotificationController::class, 'sendToMultipleTeachers']);
    Route::get('/available-teachers', [AdminTeacherNotificationController::class, 'getAvailableTeachers']);
});
```

2. **Middleware Sanctum** configuré
3. **Base de données** avec les tables `platform_notifications`, `teachers`, `users`, `administrators`

## 📋 Payload d'exemple

```json
{
  "type": "admin_announcement",
  "title": "Nouvelle politique d'évaluation",
  "message": "Veuillez prendre connaissance de la nouvelle politique...",
  "data": {"priority": "high"},
  "expires_at": "2025-11-01 23:59:59"
}
```

Le service TypeScript gère automatiquement la conversion des types et l'authentification ! 🎉

## 🔍 Dépannage

### Erreur "Unauthenticated"
- Vérifiez que vous êtes connecté en tant qu'admin
- Vérifiez que `localStorage.getItem('admin_token')` contient un token valide
- Vérifiez que le middleware `auth:sanctum` est configuré sur les routes

### Erreur de connexion
- Vérifiez que votre serveur Laravel tourne sur `http://localhost:8000`
- Vérifiez que les routes sont correctement enregistrées
- Vérifiez les logs Laravel pour les erreurs