import api from '@/lib/server/interceptor/axios';

// Types pour les notifications étudiants
export interface StudentNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  read_at: string | null;
  created_at: string;
  action_url?: string;
}

export interface NotificationFilters {
  read?: boolean;
  type?: string;
  page?: number;
  per_page?: number;
}

export interface NotificationResponse {
  notifications: StudentNotification[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  unread_count: number;
}

export interface MarkAsReadResponse {
  message: string;
  notification: StudentNotification;
}

export interface BulkMarkAsReadResponse {
  message: string;
  unread_count: number;
}

export interface DeleteNotificationResponse {
  message: string;
  unread_count: number;
}

export interface UnreadCountResponse {
  unread_count: number;
}

// Service pour les notifications étudiants
export const StudentNotificationService = {
  // Récupérer les notifications de l'étudiant
  getNotifications: async (filters: NotificationFilters = {}): Promise<NotificationResponse> => {
    try {
      const params = new URLSearchParams();

      if (filters.read !== undefined) {
        params.append('read', filters.read.toString());
      }

      if (filters.type) {
        params.append('type', filters.type);
      }

      if (filters.page) {
        params.append('page', filters.page.toString());
      }

      if (filters.per_page) {
        params.append('per_page', filters.per_page.toString());
      }

      const response = await api.get(`/student/notifications?${params}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      } else if (error.response?.status === 403) {
        throw new Error('Accès refusé aux notifications.');
      } else if (error.response?.status === 404) {
        throw new Error('Service de notifications non disponible.');
      }

      throw new Error('Erreur lors du chargement des notifications.');
    }
  },

  // Marquer une notification comme lue
  markAsRead: async (notificationId: number): Promise<MarkAsReadResponse> => {
    try {
      const response = await api.patch(`/student/notifications/${notificationId}/read`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      } else if (error.response?.status === 403) {
        throw new Error('Accès refusé à cette notification.');
      } else if (error.response?.status === 404) {
        throw new Error('Notification non trouvée.');
      }

      throw new Error('Erreur lors de la mise à jour de la notification.');
    }
  },

  // Marquer plusieurs notifications comme lues
  markBulkAsRead: async (notificationIds: number[]): Promise<BulkMarkAsReadResponse> => {
    try {
      const response = await api.post('/student/notifications/mark-bulk-read', {
        notification_ids: notificationIds
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      } else if (error.response?.status === 403) {
        throw new Error('Accès refusé aux notifications.');
      } else if (error.response?.status === 422) {
        throw new Error('Données invalides pour la mise à jour.');
      }

      throw new Error('Erreur lors de la mise à jour des notifications.');
    }
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async (): Promise<BulkMarkAsReadResponse> => {
    try {
      const response = await api.post('/student/notifications/mark-all-read');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      } else if (error.response?.status === 403) {
        throw new Error('Accès refusé aux notifications.');
      }

      throw new Error('Erreur lors de la mise à jour des notifications.');
    }
  },

  // Supprimer une notification
  deleteNotification: async (notificationId: number): Promise<DeleteNotificationResponse> => {
    try {
      const response = await api.delete(`/student/notifications/${notificationId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      } else if (error.response?.status === 403) {
        throw new Error('Accès refusé à cette notification.');
      } else if (error.response?.status === 404) {
        throw new Error('Notification non trouvée.');
      }

      throw new Error('Erreur lors de la suppression de la notification.');
    }
  },

  // Récupérer le compteur de notifications non lues
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    try {
      const response = await api.get('/student/notifications/unread-count');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      } else if (error.response?.status === 403) {
        throw new Error('Accès refusé aux notifications.');
      }

      throw new Error('Erreur lors de la récupération du compteur.');
    }
  }
};

