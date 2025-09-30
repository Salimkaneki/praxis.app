// student/sessions/_services/sessions.service.ts
import api from "@/lib/server/interceptor/axios";

export interface StudentSession {
  id: number;
  title: string;
  session_code?: string;
  status: "available" | "active" | "upcoming" | "completed" | "expired";
  starts_at: string;
  ends_at: string;
  max_participants?: number;
  current_participants?: number;
  duration_minutes?: number;
  total_questions?: number;
  instructions?: string;
  score?: number;
  max_score?: number;
  completed_at?: string;
  time_spent?: number; // en minutes

  quiz?: {
    id: number;
    title: string;
    description?: string;
    subject?: {
      id: number;
      name: string;
    };
    duration_minutes?: number;
    total_points?: number;
    settings?: {
      difficulty?: 'easy' | 'medium' | 'hard';
      show_results_immediately?: boolean;
      allow_review?: boolean;
    };
  };

  teacher?: {
    id: number;
    name: string;
    email?: string;
  };

  created_at?: string;
  updated_at?: string;

  // Champs pour compatibilité avec l'ancien format
  quiz_id?: number;
  subject?: string;
}

export interface SessionWithQuestions extends StudentSession {
  questions?: Question[];
}

export interface Question {
  id: number;
  question_text: string;
  type: 'multiple_choice' | 'true_false' | 'open_ended' | 'fill_blank';
  points?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  options?: any[];
  correct_answer?: string;
  explanation?: string;
  time_limit?: number;
  order?: number;
}

export interface ExamResult {
  session_id: number;
  score: number;
  max_score: number;
  percentage: number;
  time_spent: number;
  completed_at: string;
  answers: Array<{
    question_id: number;
    answer: any;
    is_correct: boolean;
    points_earned: number;
  }>;
}

export interface SessionsResponse {
  sessions: StudentSession[];
  total: number;
  current_page?: number;
  last_page?: number;
  per_page?: number;
}

export interface ExamResult {
  session_id: number;
  score: number;
  max_score: number;
  percentage: number;
  time_spent: number;
  completed_at: string;
  answers: Array<{
    question_id: number;
    answer: any;
    is_correct: boolean;
    points_earned: number;
  }>;
}

export const StudentSessionsService = {
  // Récupérer toutes les sessions disponibles pour l'étudiant
  getAll: async (): Promise<StudentSession[]> => {
    try {
      const response = await api.get('/student/sessions');
      const data = response.data;

      // Gérer différents formats de réponse possibles
      let sessions: StudentSession[] = [];

      if (Array.isArray(data)) {
        sessions = data;
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.data)) {
          sessions = data.data;
        } else if (Array.isArray(data.sessions)) {
          sessions = data.sessions;
        } else if (data.sessions && Array.isArray(data.sessions.data)) {
          sessions = data.sessions.data;
        }
      }

      // Transformer les données pour assurer la compatibilité
      return sessions.map(session => StudentSessionsService.transformSessionData(session));

    } catch (error: any) {
      console.error('Erreur lors de la récupération des sessions:', error);

      // En développement, retourner des données mockées si l'API n'est pas disponible
      if (process.env.NODE_ENV === 'development') {
        console.warn('API non disponible, utilisation des données mockées');
        return getMockSessions();
      }

      throw error;
    }
  },

  // Récupérer une session spécifique avec ses détails
  getById: async (id: number): Promise<StudentSession> => {
    try {
      const response = await api.get(`/student/sessions/${id}`);
      return StudentSessionsService.transformSessionData(response.data);
    } catch (error: any) {
      console.error(`Erreur lors de la récupération de la session ${id}:`, error);

      // En développement, retourner des données mockées
      if (process.env.NODE_ENV === 'development') {
        const mockSession = getMockSessions().find(s => s.id === id);
        if (mockSession) {
          return mockSession;
        }
      }

      throw error;
    }
  },

  // Récupérer une session avec ses questions (pour les détails)
  getByIdWithQuestions: async (id: number): Promise<SessionWithQuestions> => {
    try {
      const [sessionResponse, questionsResponse] = await Promise.all([
        api.get(`/student/sessions/${id}`),
        api.get(`/student/sessions/${id}/questions`).catch(() => ({ data: [] })) // Questions peuvent ne pas être disponibles
      ]);

      const session = StudentSessionsService.transformSessionData(sessionResponse.data);
      const questions = Array.isArray(questionsResponse.data) ? questionsResponse.data : [];

      return {
        ...session,
        questions
      };
    } catch (error: any) {
      console.error(`Erreur lors de la récupération de la session ${id} avec questions:`, error);

      // En développement, retourner des données mockées
      if (process.env.NODE_ENV === 'development') {
        const mockSession = getMockSessions().find(s => s.id === id);
        if (mockSession) {
          return {
            ...mockSession,
            questions: getMockQuestions(mockSession.quiz?.id || 1)
          };
        }
      }

      throw error;
    }
  },

  // Transformer les données de session pour assurer la compatibilité
  transformSessionData: (data: any): StudentSession => {
    // Gérer les différents formats possibles
    const session: StudentSession = {
      id: data.id,
      title: data.title,
      session_code: data.session_code,
      status: StudentSessionsService.mapBackendStatusToFrontend(data.status),
      starts_at: data.starts_at,
      ends_at: data.ends_at,
      max_participants: data.max_participants,
      current_participants: data.current_participants,
      duration_minutes: data.duration_minutes || data.quiz?.duration_minutes,
      total_questions: data.total_questions,
      instructions: data.instructions,
      score: data.score,
      max_score: data.max_score,
      completed_at: data.completed_at,
      time_spent: data.time_spent,
      created_at: data.created_at,
      updated_at: data.updated_at,

      // Gestion du quiz
      quiz: data.quiz ? {
        id: data.quiz.id,
        title: data.quiz.title,
        description: data.quiz.description,
        subject: data.quiz.subject || (data.quiz.subject_id ? { id: data.quiz.subject_id, name: 'Matière' } : undefined),
        duration_minutes: data.quiz.duration_minutes,
        total_points: data.quiz.total_points,
        settings: data.quiz.settings
      } : undefined,

      // Gestion de l'enseignant
      teacher: data.teacher ? {
        id: data.teacher.id,
        name: data.teacher.name,
        email: data.teacher.email
      } : undefined,

      // Champs de compatibilité
      quiz_id: data.quiz_id || data.quiz?.id,
      subject: data.subject || data.quiz?.subject?.name
    };

    return session;
  },

  // Mapper les statuts du backend vers le frontend
  mapBackendStatusToFrontend: (backendStatus: string): StudentSession['status'] => {
    const statusMap: Record<string, StudentSession['status']> = {
      'scheduled': 'upcoming',    // Session programmée mais pas encore active
      'active': 'available',      // Session en cours, disponible pour les étudiants
      'paused': 'upcoming',       // Session en pause
      'completed': 'completed',   // Session terminée
      'cancelled': 'expired'      // Session annulée
    };

    return statusMap[backendStatus] || 'upcoming';
  },

  // Vérifier si une session peut être commencée
  canStartSession: (session: StudentSession): boolean => {
    const now = new Date();
    const startTime = new Date(session.starts_at);
    const endTime = new Date(session.ends_at);

    // Une session peut être commencée si :
    // 1. Le statut est "available" (session active) OU "upcoming" (session programmée)
    // 2. L'heure actuelle est entre starts_at et ends_at
    const isValidStatus = session.status === 'available' || session.status === 'upcoming';
    const isInTimeRange = now >= startTime && now <= endTime;

    return isValidStatus && isInTimeRange;
  },

  // Calculer le temps restant avant le début ou la fin de la session
  getTimeRemaining: (session: StudentSession): {
    type: 'not_started' | 'in_progress' | 'ended';
    timeRemaining: number; // en minutes
    formattedTime: string;
  } => {
    const now = new Date();
    const startTime = new Date(session.starts_at);
    const endTime = new Date(session.ends_at);

    if (now < startTime) {
      // Session pas encore commencée
      const diffMs = startTime.getTime() - now.getTime();
      const diffMinutes = Math.ceil(diffMs / (1000 * 60));

      return {
        type: 'not_started',
        timeRemaining: diffMinutes,
        formattedTime: StudentSessionsService.formatTimeRemaining(diffMinutes)
      };
    } else if (now >= startTime && now <= endTime) {
      // Session en cours
      const diffMs = endTime.getTime() - now.getTime();
      const diffMinutes = Math.ceil(diffMs / (1000 * 60));

      return {
        type: 'in_progress',
        timeRemaining: diffMinutes,
        formattedTime: StudentSessionsService.formatTimeRemaining(diffMinutes)
      };
    } else {
      // Session terminée
      return {
        type: 'ended',
        timeRemaining: 0,
        formattedTime: 'Terminé'
      };
    }
  },

  // Formatter le temps restant
  formatTimeRemaining: (minutes: number): string => {
    if (minutes <= 0) return 'Terminé';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}min`;
    } else {
      return `${mins}min`;
    }
  },

  // Commencer un examen
  startExam: async (sessionId: number): Promise<{ exam_token: string; questions: Question[] }> => {
    try {
      const response = await api.post(`/student/sessions/${sessionId}/start`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors du démarrage de l\'examen:', error);
      throw error;
    }
  },

  // Soumettre les réponses d'un examen
  submitExam: async (sessionId: number, answers: Record<number, any>): Promise<ExamResult> => {
    try {
      const response = await api.post(`/student/sessions/${sessionId}/submit`, { answers });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la soumission de l\'examen:', error);
      throw error;
    }
  },

  // Récupérer les résultats d'un examen
  getResults: async (sessionId: number): Promise<ExamResult> => {
    try {
      const response = await api.get(`/student/sessions/${sessionId}/results`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des résultats:', error);
      throw error;
    }
  }
};

// Fonction mockée pour les données de développement
function getMockSessions(): StudentSession[] {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  return [
    {
      id: 9,
      title: "Examen - Quiz Design Graphique 2",
      session_code: "G5LUJW",
      starts_at: "2025-09-30T11:30:00.000000Z",
      ends_at: "2025-09-30T13:00:00.000000Z",
      status: "available",
      max_participants: 150,
      duration_minutes: 60,
      total_questions: 10,
      instructions: "Répondez à toutes les questions dans le temps imparti.",
      quiz: {
        id: 8,
        title: "Quiz Design Graphique - Couleurs et Typographie",
        description: "Évaluation des connaissances en design graphique : harmonie des couleurs, typographie et principes visuels",
        subject: {
          id: 1,
          name: "Ergonomie et Expérience Utilisateurr"
        },
        duration_minutes: 60,
        total_points: 30
      },
      teacher: {
        id: 1,
        name: "M. Dupont",
        email: "dupont@ecole.fr"
      },
      created_at: "2025-09-30T09:37:48.000000Z",
      updated_at: "2025-09-30T09:38:12.000000Z"
    },
    {
      id: 1,
      title: "Mathématiques - Algèbre Linéaire",
      session_code: "MATH001",
      starts_at: now.toISOString(),
      ends_at: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2h plus tard
      status: "available",
      max_participants: 50,
      duration_minutes: 120,
      total_questions: 20,
      instructions: "Vous avez 2 heures pour répondre à toutes les questions. Bonne chance !",
      quiz: {
        id: 1,
        title: "Algèbre Linéaire",
        description: "Chapitre sur les matrices et les systèmes linéaires",
        subject: {
          id: 1,
          name: "Mathématiques"
        },
        duration_minutes: 120,
        total_points: 100
      },
      teacher: {
        id: 1,
        name: "M. Dupont",
        email: "dupont@ecole.fr"
      },
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    },
    {
      id: 2,
      title: "Physique - Mécanique",
      session_code: "PHYS001",
      starts_at: tomorrow.toISOString(),
      ends_at: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      status: "upcoming",
      max_participants: 45,
      duration_minutes: 120,
      total_questions: 25,
      instructions: "Apportez votre calculatrice scientifique.",
      quiz: {
        id: 2,
        title: "Mécanique Classique",
        description: "Lois de Newton et énergie",
        subject: {
          id: 2,
          name: "Physique"
        },
        duration_minutes: 120,
        total_points: 100
      },
      teacher: {
        id: 2,
        name: "Mme. Martin",
        email: "martin@ecole.fr"
      },
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    },
    {
      id: 3,
      title: "Français - Littérature",
      session_code: "FR001",
      starts_at: yesterday.toISOString(),
      ends_at: new Date(yesterday.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      status: "completed",
      max_participants: 40,
      duration_minutes: 120,
      total_questions: 15,
      score: 85,
      max_score: 100,
      completed_at: new Date(yesterday.getTime() + 90 * 60 * 1000).toISOString(),
      time_spent: 90,
      instructions: "Répondez de manière structurée et argumentée.",
      quiz: {
        id: 3,
        title: "Littérature Française",
        description: "Analyse littéraire et commentaire",
        subject: {
          id: 3,
          name: "Français"
        },
        duration_minutes: 120,
        total_points: 100
      },
      teacher: {
        id: 3,
        name: "M. Leroy",
        email: "leroy@ecole.fr"
      },
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    },
    {
      id: 4,
      title: "Histoire - Révolution Française",
      session_code: "HIST001",
      starts_at: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // dans 2h
      ends_at: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      status: "available",
      max_participants: 35,
      duration_minutes: 120,
      total_questions: 18,
      instructions: "Cite sources et dates importantes.",
      quiz: {
        id: 4,
        title: "Révolution Française",
        description: "Période révolutionnaire et ses conséquences",
        subject: {
          id: 4,
          name: "Histoire"
        },
        duration_minutes: 120,
        total_points: 100
      },
      teacher: {
        id: 4,
        name: "Mme. Bernard",
        email: "bernard@ecole.fr"
      },
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    }
  ];
}

// Fonction mockée pour générer des questions fictives
function getMockQuestions(quizId: number): Question[] {
  const questionTemplates = [
    {
      question_text: "Quelle est la valeur du déterminant de la matrice A = [[1, 2], [3, 4]] ?",
      type: 'multiple_choice' as const,
      points: 5,
      options: ["-2", "2", "-4", "4"],
      correct_answer: "-2",
      explanation: "Le déterminant se calcule par (1×4) - (2×3) = 4 - 6 = -2"
    },
    {
      question_text: "Dans un espace vectoriel de dimension 3, combien de vecteurs forment une base ?",
      type: 'multiple_choice' as const,
      points: 5,
      options: ["2", "3", "4", "Infini"],
      correct_answer: "3",
      explanation: "Une base doit contenir exactement n vecteurs linéairement indépendants pour un espace de dimension n."
    },
    {
      question_text: "Deux matrices carrées de même taille sont toujours compatibles pour la multiplication.",
      type: 'true_false' as const,
      points: 3,
      options: ["Vrai", "Faux"],
      correct_answer: "Faux",
      explanation: "Pour multiplier deux matrices, le nombre de colonnes de la première doit égaler le nombre de lignes de la deuxième."
    },
    {
      question_text: "Résoudre le système: x + y = 5, 2x - y = 1",
      type: 'open_ended' as const,
      points: 8,
      correct_answer: "x = 2, y = 3",
      explanation: "Addition: 3x = 6 ⇒ x = 2. Substitution: 2 + y = 5 ⇒ y = 3"
    },
    {
      question_text: "Quelle est la dimension de l'espace nul de la matrice identité 3×3 ?",
      type: 'multiple_choice' as const,
      points: 4,
      options: ["0", "1", "3", "Infini"],
      correct_answer: "0",
      explanation: "L'espace nul contient les solutions de Ax = 0. Pour l'identité, seule la solution triviale existe."
    }
  ];

  return questionTemplates.map((template, index) => ({
    id: index + 1,
    ...template,
    order: index + 1
  }));
}