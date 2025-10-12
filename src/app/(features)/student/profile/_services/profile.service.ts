// student/profile/_services/profile.service.ts
import api from "@/lib/server/interceptor/axios";

// =============================
// Types Profile
// =============================
export interface StudentProfileData {
  id: number;
  user_id: number;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_info?: string;
  profile_picture?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    language?: 'fr' | 'en';
    notifications?: boolean;
  };
  classe?: {
    id: number;
    name: string;
    formation?: {
      id: number;
      name: string;
      institution?: {
        id: number;
        name: string;
      };
    };
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_info?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    language?: string; // Changé de 'fr' | 'en' à string pour plus de flexibilité
    notifications?: boolean;
  };
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// =============================
// Student Profile Service
// =============================
const BASE_URL = "/student";

export const StudentProfileService = {
  async getProfile(): Promise<StudentProfileData> {
    const response = await api.get(`${BASE_URL}/profile`);
    return response.data.student || response.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<StudentProfileData> {
    const response = await api.put(`${BASE_URL}/profile`, payload);
    return response.data.student || response.data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    const response = await api.post(`${BASE_URL}/change-password`, payload);
    return response.data;
  },

  async uploadProfilePicture(file: File): Promise<{ message: string; profile_picture_url: string }> {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await api.post(`${BASE_URL}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteProfilePicture(): Promise<{ message: string }> {
    const response = await api.delete(`${BASE_URL}/profile-picture`);
    return response.data;
  },
};