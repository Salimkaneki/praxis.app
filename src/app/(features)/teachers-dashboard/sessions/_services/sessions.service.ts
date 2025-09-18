// teachers-dashboard/sessions/_services/sessions.service.ts
import api from "@/lib/server/interceptor/axios";

export interface Session {
  id: number;
  quiz_id: number;
  title: string;
  starts_at: string;
  ends_at: string;
  max_participants?: number;
  current_participants?: number;
  status: "scheduled" | "active" | "paused" | "completed" | "cancelled";
  duration_minutes?: number;
  session_code: string;
  teacher_id: number;
  
  // Propriétés manquantes ajoutées
  allowed_students?: number[];
  require_student_list?: boolean;
  settings?: {
    shuffle_questions?: boolean;
    time_limit?: number;
    proctoring?: boolean;
    allow_pause?: boolean;
  };
  activated_at?: string | null;
  completed_at?: string | null;
  access_type?: 'public_code' | 'student_list' | 'open';
  duration_override?: number | null;
  attempts_allowed?: number;
  
  quiz?: {
    id: number;
    title: string;
    description?: string;
    subject_id?: number;
    teacher_id?: number;
    duration_minutes?: number;
    total_points?: number;
    shuffle_questions?: boolean;
    show_results_immediately?: boolean;
    allow_review?: boolean;
    status?: 'draft' | 'published' | 'archived';
    settings?: {
      difficulty?: 'easy' | 'medium' | 'hard';
      negative_marking?: boolean;
      require_all_questions?: boolean;
      randomize_options?: boolean;
    };
    created_at?: string;
    updated_at?: string;
  };
  
  created_at: string;
  updated_at: string;
}

export const SessionsService = {
  // Récupérer toutes les sessions
  getAll: async (): Promise<Session[]> => {
    try {
      const response = await api.get('/teacher/sessions');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      throw error;
    }
  },

  // Récupérer une session par ID
  getById: async (id: number): Promise<Session> => {
    try {
      const response = await api.get(`/teacher/sessions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      throw error;
    }
  },

  // Créer une nouvelle session
  create: async (sessionData: Partial<Session>): Promise<Session> => {
    try {
      const response = await api.post('/teacher/sessions', sessionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      throw error;
    }
  },

  // Mettre à jour une session
  update: async (id: number, sessionData: Partial<Session>): Promise<Session> => {
    try {
      const response = await api.put(`/teacher/sessions/${id}`, sessionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la session:', error);
      throw error;
    }
  },

  // Supprimer une session
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/teacher/sessions/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la session:', error);
      throw error;
    }
  },

  // Changer le statut d'une session
  changeStatus: async (id: number, action: string): Promise<Session> => {
    try {
      const response = await api.post(`/teacher/sessions/${id}/${action}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'action ${action} sur la session:`, error);
      throw error;
    }
  }
};