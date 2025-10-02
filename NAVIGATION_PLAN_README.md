# Plan de Navigation - Praxis

## Chapitre 2 : Exploitation et Utilisation - Expérience Utilisateur

Ce document présente le plan de navigation complet de la plateforme d'évaluation en ligne **Praxis**, en détaillant les principales interfaces utilisateur et leur organisation logique.

## 🏗️ Architecture Générale

La plateforme Praxis est organisée autour de trois rôles principaux :
- **Administrateur** : Gestion globale de la plateforme
- **Enseignant** : Création et gestion des évaluations
- **Étudiant** : Participation aux examens

## 📋 Structure des Interfaces

### 1. Authentification
Point d'entrée de l'application avec gestion des rôles utilisateurs.

```
/
├── auth/
│   ├── sign-in/                    # Connexion générale
│   ├── sign-in/student/           # Connexion étudiant
│   └── sign-in/teacher/           # Connexion enseignant
```

### 2. Interface Administrateur
Espace de gestion complète de la plateforme éducative.

```
dashboard/
├── /                           # Tableau de bord principal
├── formation/                  # Gestion des formations
│   ├── classe/                 # Gestion des classes
│   │   ├── create/            # Création d'une classe
│   │   └── edit/[id]/         # Édition d'une classe
│   ├── create/                # Création d'une formation
│   └── edit/[id]/             # Édition d'une formation
├── student/                    # Gestion des étudiants
│   ├── edit/[id]/             # Édition d'un étudiant
│   ├── import/                # Import d'étudiants
│   └── registration/          # Inscription d'étudiants
├── subject/                    # Gestion des matières
│   ├── create/                # Création d'une matière
│   └── edit/[id]/             # Édition d'une matière
└── teacher/                    # Gestion des enseignants
    ├── assign-a-subject/      # Assignation de matière
    ├── create/                # Création d'un enseignant
    └── edit/[id]/             # Édition d'un enseignant
```

### 3. Interface Enseignant
Espace dédié à la création et au suivi des évaluations.

```
teachers-dashboard/
├── /                           # Tableau de bord enseignant
├── quizzes/                    # Gestion des quiz
│   ├── create/                # Création d'un quiz
│   ├── edit/[id]/             # Édition d'un quiz
│   └── quiz-details/[id]/     # Détails d'un quiz
│       ├── add-questions/     # Ajout de questions
│       └── add-questions/[id]/ # Édition d'une question
├── results/                    # Consultation des résultats
│   └── participation/         # Suivi de la participation
│       └── student/[id]/      # Résultats d'un étudiant
└── sessions/                   # Gestion des sessions d'examen
    ├── create/                # Création d'une session
    ├── edit/                  # Édition d'une session
    └── session-details/       # Détails des sessions
        └── [id]/              # Détails d'une session spécifique
```

### 4. Interface Étudiant
Parcours complet de participation aux examens.

```
student/
├── /                           # Page d'accueil étudiant
├── profile/                    # Profil de l'étudiant
├── sessions/                   # Liste des sessions disponibles
│   ├── [id]/                  # Aperçu d'une session
│   └── [id]/details/          # Détails complets d'une session
├── join-session/              # Rejoindre une session
├── test/                      # Interface d'examen
└── results/[id]/              # Consultation des résultats
```

## 🔄 Flux Utilisateur - Étudiant

### Parcours d'Examen Complet

1. **Connexion** → `/auth/sign-in/student`
2. **Accueil** → `/student`
3. **Consultation Sessions** → `/student/sessions`
4. **Détails Session** → `/student/sessions/[id]/details`
5. **Rejoindre Session** → `/student/join-session`
6. **Passage Examen** → `/student/test`
7. **Consultation Résultats** → `/student/results/[id]`

### Fonctionnalités Clés
- ✅ Navigation intuitive entre les sessions
- ✅ Indicateurs de statut temps réel (disponible/actif/terminé)
- ✅ Interface d'examen avec timer et navigation par questions
- ✅ Système de marquage et de validation des réponses
- ✅ Affichage détaillé des résultats avec corrections

## 🔄 Flux Utilisateur - Enseignant

### Gestion des Évaluations

1. **Connexion** → `/auth/sign-in/teacher`
2. **Tableau de Bord** → `/teachers-dashboard`
3. **Création Quiz** → `/teachers-dashboard/quizzes/create`
4. **Ajout Questions** → `/teachers-dashboard/quizzes/quiz-details/[id]/add-questions`
5. **Création Session** → `/teachers-dashboard/sessions/create`
6. **Suivi Résultats** → `/teachers-dashboard/results`

### Fonctionnalités Clés
- ✅ Création et gestion de quiz personnalisés
- ✅ Support multi-types de questions (QCM, Vrai/Faux, Texte libre, Texte à trous)
- ✅ Programmation de sessions d'examen
- ✅ Suivi en temps réel de la participation
- ✅ Analyse détaillée des performances

## 🔄 Flux Utilisateur - Administrateur

### Administration Plateforme

1. **Connexion** → `/auth/sign-in`
2. **Tableau de Bord** → `/dashboard`
3. **Gestion Utilisateurs** → `/dashboard/student`, `/dashboard/teacher`
4. **Configuration Formations** → `/dashboard/formation`
5. **Gestion Matières** → `/dashboard/subject`

### Fonctionnalités Clés
- ✅ Gestion complète des utilisateurs (CRUD)
- ✅ Import en masse d'étudiants
- ✅ Configuration des formations et classes
- ✅ Assignation des matières aux enseignants

## 🎨 Éléments de Navigation Communs

### Composants Réutilisables
- **Header** : Navigation principale avec menu utilisateur
- **Sidebar** : Navigation secondaire contextuelle
- **Breadcrumbs** : Fil d'Ariane pour la localisation
- **Pagination** : Navigation dans les listes longues
- **SearchBar** : Recherche et filtrage
- **DataTable** : Affichage tabulaire avec actions

### États et Indicateurs
- **Status Badges** : Disponible/Actif/Terminé/Annulé
- **Progress Bars** : Avancement des examens
- **Timer** : Compte à rebours avec alertes
- **Notifications** : Messages système et erreurs

## 📱 Responsive Design

Toutes les interfaces sont conçues pour être :
- **Desktop First** : Optimisé pour écrans larges
- **Tablet Compatible** : Adaptation aux tablettes
- **Mobile Friendly** : Navigation tactile optimisée

## 🔒 Sécurité et Authentification

- **Sanctum Authentication** : Gestion des sessions sécurisées
- **Role-Based Access** : Contrôle d'accès par rôle
- **Route Protection** : Redirections automatiques selon le rôle
- **Session Management** : Gestion des timeouts et reconnexions

## 📊 Métriques et Analytics

- **Dashboard Analytics** : Statistiques d'utilisation
- **Performance Tracking** : Suivi des performances des examens
- **Participation Reports** : Rapports de participation
- **Success Rates** : Taux de réussite par matière/session

---

*Ce plan de navigation constitue la base de l'expérience utilisateur de Praxis, assurant une navigation intuitive et une séparation claire des responsabilités entre les différents acteurs de la plateforme éducative.*