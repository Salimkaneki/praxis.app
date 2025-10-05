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
      // L'API retourne { sessions: Session[], pagination: {...} }
      return response.data.sessions || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      throw error;
    }
  },

  // Récupérer une session par ID
  getById: async (id: number): Promise<Session> => {
    try {
      const response = await api.get(`/teacher/sessions/${id}`);
      // L'API retourne directement la session
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
    } catch (error: any) {
      console.error('Erreur lors de la création de la session:', error);

      // Afficher les détails de l'erreur de validation si disponible
      if (error.response?.status === 422 && error.response?.data) {
        console.error('Erreurs de validation:', error.response.data);
        if (error.response.data.errors) {
          Object.entries(error.response.data.errors).forEach(([field, messages]) => {
            console.error(`${field}:`, messages);
          });
        }
      }

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

  // Supprimer une session (avec gestion améliorée des erreurs)
  delete: async (id: number): Promise<void> => {
    try {
      // Validation de l'ID
      if (!id || id <= 0) {
        throw new Error('ID de session invalide');
      }

      console.log(`Tentative de suppression de la session ID: ${id}`);
      await api.delete(`/teacher/sessions/${id}`);
      console.log(`Session ${id} supprimée avec succès`);
    } catch (error: any) {
      console.error('Erreur lors de la suppression de la session:', error);

      // Gestion détaillée des erreurs 400
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        console.error('Détails de l\'erreur 400:', errorData);

        // Erreur spécifique pour session active
        if (errorData?.error && errorData.error.includes('active')) {
          throw new Error('Impossible de supprimer une session active. Veuillez d\'abord la terminer ou l\'annuler.');
        }

        // Erreur générique 400
        if (errorData?.error) {
          throw new Error(`Erreur de suppression: ${errorData.error}`);
        }

        // Erreur 400 sans message spécifique
        throw new Error('Impossible de supprimer cette session. Vérifiez qu\'elle n\'est pas active.');
      }

      // Gestion des autres erreurs
      if (error.response?.status === 404) {
        throw new Error('Session introuvable. Elle a peut-être déjà été supprimée.');
      }

      if (error.response?.status === 403) {
        throw new Error('Accès refusé. Vous n\'avez pas les permissions pour supprimer cette session.');
      }

      if (error.response?.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      // Erreur réseau ou autre
      console.error('Détails complets de l\'erreur:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });

      throw new Error(error.response?.data?.error || error.message || 'Une erreur inattendue est survenue lors de la suppression');
    }
  },

  // CORRECTION: Changer le statut d'une session avec la méthode PATCH
  changeStatus: async (id: number, action: string): Promise<Session> => {
    try {
      // Validation des paramètres
      if (!id || id <= 0) {
        throw new Error('ID de session invalide');
      }
      if (!action || typeof action !== 'string') {
        throw new Error('Action invalide');
      }

      console.log(`Tentative de changement de statut - Session ID: ${id}, Action: ${action}`);

      let response;

      // Essayer d'abord avec PATCH (méthode définie dans vos routes Laravel)
      try {
        response = await api.patch(`/teacher/sessions/${id}/${action}`);
      } catch (patchError: any) {
        console.log(`PATCH échoué pour ${action}, tentative avec POST`);
        
        // Si PATCH échoue avec 405, essayer avec POST
        if (patchError.response?.status === 405) {
          response = await api.post(`/teacher/sessions/${id}/${action}`);
        } else {
          throw patchError;
        }
      }

      console.log(`Action ${action} réussie pour la session ${id}`);

      // Émettre un événement DOM personnalisé pour notifier les autres contextes
      if (typeof window !== 'undefined') {
        try {
          const event = new CustomEvent('sessionStatusChanged', {
            detail: { sessionId: id, action, session: response.data.session || response.data }
          });
          window.dispatchEvent(event);
        } catch (eventError) {
          console.warn('Could not emit custom event:', eventError);
        }
      }

      return response.data.session || response.data;
    } catch (error: any) {
      console.error(`Erreur lors de l'action ${action} sur la session:`, error);

      // Log détaillé de l'erreur
      console.error('Détails complets de l\'erreur:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.response?.data?.error || error.response?.data?.message,
        url: error.config?.url,
        method: error.config?.method
      });

      // Gestion spécifique des erreurs
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData?.error) {
          // Erreurs spécifiques du contrôleur (statut incorrect, session active, etc.)
          throw new Error(errorData.error);
        }
        throw new Error(errorData?.message || 'Action non autorisée sur cette session');
      }

      if (error.response?.status === 404) {
        throw new Error('Session introuvable');
      }

      if (error.response?.status === 403) {
        throw new Error('Accès refusé - vous n\'avez pas les permissions');
      }

      if (error.response?.status === 405) {
        throw new Error('Méthode non autorisée. Contactez l\'administrateur.');
      }

      if (error.response?.status === 422) {
        const errorData = error.response.data;
        throw new Error(errorData?.error || errorData?.message || 'Données de validation invalides');
      }

      if (error.response?.status === 500) {
        throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
      }

      throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Une erreur est survenue lors du changement de statut');
    }
  },

  // Méthodes spécifiques pour chaque action (correspondant aux méthodes du contrôleur Laravel)
  activate: async (id: number): Promise<Session> => {
    return SessionsService.changeStatus(id, 'activate');
  },

  complete: async (id: number): Promise<Session> => {
    return SessionsService.changeStatus(id, 'complete');
  },

  // Annuler une session (utilise la route spécifique du contrôleur Laravel)
  cancel: async (id: number): Promise<Session> => {
    return SessionsService.changeStatus(id, 'cancel');
  },

  // Méthode utilitaire pour rafraîchir les données d'une session
  refresh: async (id: number): Promise<Session> => {
    return SessionsService.getById(id);
  }
};