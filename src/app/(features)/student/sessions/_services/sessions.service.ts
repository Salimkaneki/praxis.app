// student/sessions/_services/sessions.service.ts
import api from "@/lib/server/interceptor/axios";

export interface StudentSession {
  id: number;
  quiz_id: number;
  title: string;
  subject: string;
  starts_at: string;
  ends_at: string;
  status: "available" | "upcoming" | "completed" | "expired";
  duration_minutes: number;
  total_questions: number;
  instructions?: string;
  score?: number;
  max_score?: number;
  completed_at?: string;
  time_spent?: number; // en minutes

  quiz?: {
    id: number;
    title: string;
    description?: string;
    subject_id?: number;
    teacher_id?: number;
    duration_minutes?: number;
    total_points?: number;
  };

  teacher?: {
    id: number;
    name: string;
    email?: string;
  };

  created_at: string;
  updated_at: string;
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
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      // Fallback vers les données mockées si l'API n'est pas disponible
      return getMockSessions();
    }
  },

  // Récupérer une session spécifique
  getById: async (id: number): Promise<StudentSession> => {
    try {
      const response = await api.get(`/student/sessions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      // Fallback vers les données mockées
      const mockSession = getMockSessions().find(s => s.id === id);
      if (!mockSession) throw new Error('Session non trouvée');
      return mockSession;
    }
  },

  // Commencer un examen
  startExam: async (sessionId: number): Promise<{ exam_token: string; questions: any[] }> => {
    try {
      const response = await api.post(`/student/sessions/${sessionId}/start`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'examen:', error);
      throw error;
    }
  },

  // Soumettre les réponses d'un examen
  submitExam: async (sessionId: number, answers: Record<number, any>): Promise<ExamResult> => {
    try {
      const response = await api.post(`/student/sessions/${sessionId}/submit`, { answers });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la soumission de l\'examen:', error);
      throw error;
    }
  },

  // Récupérer les résultats d'un examen
  getResults: async (sessionId: number): Promise<ExamResult> => {
    try {
      const response = await api.get(`/student/sessions/${sessionId}/results`);
      return response.data;
    } catch (error) {
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
      id: 1,
      quiz_id: 1,
      title: "Mathématiques - Algèbre Linéaire",
      subject: "Mathématiques",
      starts_at: now.toISOString(),
      ends_at: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2h plus tard
      status: "available",
      duration_minutes: 120,
      total_questions: 20,
      instructions: "Vous avez 2 heures pour répondre à toutes les questions. Bonne chance !",
      quiz: {
        id: 1,
        title: "Algèbre Linéaire",
        description: "Chapitre sur les matrices et les systèmes linéaires"
      },
      teacher: {
        id: 1,
        name: "M. Dupont"
      },
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    },
    {
      id: 2,
      quiz_id: 2,
      title: "Physique - Mécanique",
      subject: "Physique",
      starts_at: tomorrow.toISOString(),
      ends_at: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      status: "upcoming",
      duration_minutes: 120,
      total_questions: 25,
      instructions: "Apportez votre calculatrice scientifique.",
      quiz: {
        id: 2,
        title: "Mécanique Classique",
        description: "Lois de Newton et énergie"
      },
      teacher: {
        id: 2,
        name: "Mme. Martin"
      },
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    },
    {
      id: 3,
      quiz_id: 3,
      title: "Français - Littérature",
      subject: "Français",
      starts_at: yesterday.toISOString(),
      ends_at: new Date(yesterday.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      status: "completed",
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
        description: "Analyse littéraire et commentaire"
      },
      teacher: {
        id: 3,
        name: "M. Leroy"
      },
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    },
    {
      id: 4,
      quiz_id: 4,
      title: "Histoire - Révolution Française",
      subject: "Histoire",
      starts_at: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // dans 2h
      ends_at: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      status: "available",
      duration_minutes: 120,
      total_questions: 18,
      instructions: "Cite sources et dates importantes.",
      quiz: {
        id: 4,
        title: "Révolution Française",
        description: "Période révolutionnaire et ses conséquences"
      },
      teacher: {
        id: 4,
        name: "Mme. Bernard"
      },
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    }
  ];
}