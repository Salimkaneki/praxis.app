// student/_services/sessions.service.ts
import api from '@/lib/server/interceptor/axios';

// Types pour les sessions étudiants
export interface StudentSession {
  id: number;
  quiz_id: number;
  title: string;
  starts_at: string;
  ends_at: string;
  status: "scheduled" | "active" | "paused" | "completed" | "cancelled";
  duration_minutes?: number;
  session_code: string;
  teacher_id: number;
  max_participants?: number;
  current_participants?: number;

  quiz?: {
    id: number;
    title: string;
    description?: string;
    subject_id?: number;
    duration_minutes?: number;
    total_points?: number;
  };

  created_at: string;
  updated_at: string;
}

export interface SessionAttempt {
  id: number;
  session_id: number;
  student_id: number;
  started_at: string;
  completed_at?: string;
  score?: number;
  max_score?: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  time_spent_minutes?: number;
}

export interface ExamQuestion {
  id: number;
  question_text: string;
  type: 'multiple_choice' | 'true_false' | 'open_ended' | 'fill_blank';
  points: number;
  options?: {
    id: string;
    text: string;
  }[];
  order: number;
}

export interface ExamData {
  session: StudentSession;
  attempt: SessionAttempt;
  questions: ExamQuestion[];
  time_remaining?: number; // en secondes
}

export interface StudentAnswer {
  question_id: number;
  answer: string;
  selected_options?: string[];
  time_spent?: number; // en secondes
}

export interface SubmitExamPayload {
  answers: StudentAnswer[];
  time_spent: number; // en minutes
}

export interface ExamResult {
  attempt_id: number;
  score: number;
  max_score: number;
  percentage: number;
  time_spent: number;
  completed_at: string;
  answers: {
    question_id: number;
    question_text: string;
    student_answer: string;
    correct_answer?: string;
    is_correct: boolean;
    points_earned: number;
    max_points: number;
  }[];
}

// Service pour les sessions étudiants
export const StudentSessionsService = {
  // Récupérer toutes les sessions disponibles pour l'étudiant
  getAvailableSessions: async (): Promise<StudentSession[]> => {
    try {
      const response = await api.get('/student/sessions');
      return response.data.sessions || response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions disponibles:', error);
      throw error;
    }
  },

  // Récupérer les détails d'une session
  getSessionDetails: async (sessionId: number): Promise<StudentSession> => {
    try {
      const response = await api.get(`/student/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de session:', error);
      throw error;
    }
  },

  // Rejoindre une session avec un code
  joinSession: async (sessionCode: string): Promise<StudentSession> => {
    try {
      const response = await api.post('/student/sessions/join', {
        session_code: sessionCode
      });
      return response.data.session;
    } catch (error) {
      console.error('Erreur lors de la jonction de session:', error);
      throw error;
    }
  },

  // Démarrer un examen pour une session
  startExam: async (sessionId: number): Promise<ExamData> => {
    try {
      const response = await api.post(`/student/sessions/${sessionId}/start`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'examen:', error);
      throw error;
    }
  },

  // Soumettre les réponses d'un examen
  submitExam: async (sessionId: number, payload: SubmitExamPayload): Promise<ExamResult> => {
    try {
      const response = await api.post(`/student/sessions/${sessionId}/submit`, payload);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la soumission de l\'examen:', error);
      throw error;
    }
  },

  // Récupérer les résultats d'un examen terminé
  getExamResults: async (sessionId: number): Promise<ExamResult> => {
    try {
      const response = await api.get(`/student/sessions/${sessionId}/results`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des résultats:', error);
      throw error;
    }
  },

  // Récupérer l'état actuel d'un examen en cours
  getExamStatus: async (sessionId: number): Promise<ExamData> => {
    try {
      const response = await api.get(`/student/sessions/${sessionId}/status`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du statut de l\'examen:', error);
      throw error;
    }
  },

  // Sauvegarder automatiquement les réponses (auto-save)
  saveProgress: async (sessionId: number, answers: StudentAnswer[]): Promise<void> => {
    try {
      await api.post(`/student/sessions/${sessionId}/save-progress`, {
        answers
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error);
      throw error;
    }
  }
};