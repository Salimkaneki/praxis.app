// Interfaces pour les notifications des enseignants
export interface TeacherNotification {
  id: number;
  type: string;
  type_label: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface TeacherNotificationsResponse {
  success: boolean;
  data: {
    current_page: number;
    data: TeacherNotification[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unread_count: number;
  };
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
  data?: TeacherNotification;
}

export interface BulkMarkAsReadResponse {
  success: boolean;
  message: string;
}

export interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}

import api from "@/lib/server/interceptor/axios";

/**
 * Récupérer toutes les notifications de l'enseignant
 */
export const getNotifications = async (params?: {
  page?: number;
  per_page?: number;
  type?: string;
  read?: boolean;
}): Promise<TeacherNotificationsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.read !== undefined) queryParams.append('read', params.read.toString());

    const url = `/teacher/notifications${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    console.error('Erreur getNotifications:', error);
    if (error.response?.status === 401) {
      throw new Error('Non authentifié. Veuillez vous reconnecter.');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erreur lors de la récupération des notifications');
  }
};

/**
 * Marquer une notification comme lue
 */
export const markAsRead = async (notificationId: number): Promise<MarkAsReadResponse> => {
  try {
    const response = await api.patch(`/teacher/notifications/${notificationId}/read`);
    return response.data;
  } catch (error: any) {
    console.error('Erreur markAsRead:', error);
    if (error.response?.status === 401) {
      throw new Error('Non authentifié. Veuillez vous reconnecter.');
    }
    if (error.response?.status === 404) {
      throw new Error('Notification non trouvée');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erreur lors du marquage de la notification comme lue');
  }
};

/**
 * Marquer plusieurs notifications comme lues
 */
export const markBulkAsRead = async (notificationIds: number[]): Promise<BulkMarkAsReadResponse> => {
  try {
    const response = await api.patch('/teacher/notifications/mark-bulk-read', {
      notification_ids: notificationIds
    });
    return response.data;
  } catch (error: any) {
    console.error('Erreur markBulkAsRead:', error);
    if (error.response?.status === 401) {
      throw new Error('Non authentifié. Veuillez vous reconnecter.');
    }
    if (error.response?.status === 422) {
      throw new Error('Données de validation invalides');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erreur lors du marquage des notifications comme lues');
  }
};

/**
 * Marquer toutes les notifications comme lues
 */
export const markAllAsRead = async (): Promise<BulkMarkAsReadResponse> => {
  try {
    const response = await api.patch('/teacher/notifications/mark-all-read');
    return response.data;
  } catch (error: any) {
    console.error('Erreur markAllAsRead:', error);
    if (error.response?.status === 401) {
      throw new Error('Non authentifié. Veuillez vous reconnecter.');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erreur lors du marquage de toutes les notifications comme lues');
  }
};

/**
 * Supprimer une notification
 */
export const deleteNotification = async (notificationId: number): Promise<DeleteNotificationResponse> => {
  try {
    const response = await api.delete(`/teacher/notifications/${notificationId}`);
    return response.data;
  } catch (error: any) {
    console.error('Erreur deleteNotification:', error);
    if (error.response?.status === 401) {
      throw new Error('Non authentifié. Veuillez vous reconnecter.');
    }
    if (error.response?.status === 404) {
      throw new Error('Notification non trouvée');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erreur lors de la suppression de la notification');
  }
};

/**
 * Récupérer le nombre de notifications non lues
 */
export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  try {
    const response = await api.get('/teacher/notifications/unread-count');
    return response.data;
  } catch (error: any) {
    console.error('Erreur getUnreadCount:', error);
    if (error.response?.status === 401) {
      throw new Error('Non authentifié. Veuillez vous reconnecter.');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erreur lors de la récupération du nombre de notifications non lues');
  }
};
