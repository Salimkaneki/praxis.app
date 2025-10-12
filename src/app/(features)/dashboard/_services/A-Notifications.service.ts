// Interfaces pour les notifications admin
export interface AdminNotificationData {
  type: 'admin_announcement' | 'schedule_change' | 'maintenance_warning' | 'policy_update' | 'training_required' | 'system_update';
  title: string;
  message: string;
  data?: Record<string, any>;
  expires_at?: string;
}

export interface BulkNotificationResponse {
  message: string;
  notification_type: string;
  title: string;
  recipients_count: number;
}

export interface SpecificNotificationResponse {
  message: string;
  notification: any;
  teacher: {
    id: number;
    name: string;
    email: string;
  };
}

export interface MultipleTeachersResponse extends BulkNotificationResponse {
  recipients: Array<{
    id: number;
    name: string;
    email: string;
  }>;
}

export interface AvailableTeacher {
  id: number;
  name: string;
  email: string | null;
  subjects: string[];
  grade: string;
  is_permanent: boolean;
}

export interface AvailableTeachersResponse {
  teachers: AvailableTeacher[];
}

import api from "@/lib/server/interceptor/axios";

/**
 * Envoyer une notification à tous les enseignants
 */
export const sendToAllTeachers = async (data: AdminNotificationData): Promise<BulkNotificationResponse> => {
  try {
    const response = await api.post('/admin/teacher-notifications/send-to-all', data);
    return response.data;
  } catch (error: any) {
    console.error('Erreur sendToAllTeachers:', error);
    if (error.response?.status === 401) {
      throw new Error('Non authentifié. Veuillez vous reconnecter.');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erreur lors de l\'envoi de la notification');
  }
};

/**
 * Envoyer une notification à un enseignant spécifique
 */
export const sendToSpecificTeacher = async (teacherId: number, data: AdminNotificationData): Promise<SpecificNotificationResponse> => {
  try {
    const response = await api.post(`/admin/teacher-notifications/send-to-specific/${teacherId}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Erreur sendToSpecificTeacher:', error);
    if (error.response?.status === 401) {
      throw new Error('Non authentifié. Veuillez vous reconnecter.');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erreur lors de l\'envoi de la notification');
  }
};

/**
 * Envoyer une notification à plusieurs enseignants spécifiques
 */
export const sendToMultipleTeachers = async (data: AdminNotificationData & { teacher_ids: number[] }): Promise<MultipleTeachersResponse> => {
  try {
    const response = await api.post('/admin/teacher-notifications/send-to-multiple', data);
    return response.data;
  } catch (error: any) {
    console.error('Erreur sendToMultipleTeachers:', error);
    if (error.response?.status === 401) {
      throw new Error('Non authentifié. Veuillez vous reconnecter.');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erreur lors de l\'envoi de la notification');
  }
};

/**
 * Récupérer la liste des enseignants disponibles
 */
export const getAvailableTeachers = async (search?: string): Promise<AvailableTeachersResponse> => {
  try {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await api.get(`/admin/teacher-notifications/available-teachers${params}`);
    return response.data;
  } catch (error: any) {
    console.error('Erreur getAvailableTeachers:', error);
    if (error.response?.status === 401) {
      throw new Error('Non authentifié. Veuillez vous reconnecter.');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erreur lors de la récupération des enseignants');
  }
};

/**
 * Mapper les types de notification frontend vers backend
 */
export const mapNotificationType = (frontendType: string): string => {
  const typeMapping: Record<string, string> = {
    'announcement': 'admin_announcement',
    'educational': 'training_required',
    'reminder': 'schedule_change',
    'alert': 'maintenance_warning',
    'system': 'system_update'
  };

  return typeMapping[frontendType] || 'admin_announcement';
};