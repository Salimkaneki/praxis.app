import api from "@/lib/server/interceptor/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface StudentLoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    account_type: string;
    is_active: boolean;
    name?: string;
  };
}

/**
 * Connexion de l'étudiant
 */
export async function loginStudent(payload: LoginPayload): Promise<StudentLoginResponse> {
  try {
    const response = await api.post<StudentLoginResponse>('/student/auth/login', payload);

    // Stocker le token et les données utilisateur
    if (response.data.token) {
      localStorage.setItem('student_token', response.data.token);
      localStorage.setItem('student_data', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la connexion étudiant:', error);

    // Gestion des erreurs spécifiques
    if (error.response?.status === 401) {
      throw new Error('Email ou mot de passe invalide');
    } else if (error.response?.status === 403) {
      throw new Error('Compte inactif, contactez l\'administration');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Erreur de connexion, veuillez réessayer');
    }
  }
}

export interface StudentProfile {
  id: number;
  name: string;
  email: string;
  account_type: string;
  is_active: boolean;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Récupère le profil de l'étudiant connecté
 */
export async function getStudentProfile(): Promise<StudentProfile> {
  try {
    const response = await api.get<StudentProfile>('/student/auth/me');
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération du profil:', error);

    if (error.response?.status === 401) {
      throw new Error('Session expirée, veuillez vous reconnecter');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Erreur lors de la récupération du profil');
    }
  }
}

/**
 * Déconnexion de l'étudiant
 */
export async function logoutStudent(): Promise<void> {
  try {
    await api.post('/student/auth/logout');

    // Suppression des données locales même si l'API échoue
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_data');

    // Redirection vers la page de connexion
    window.location.href = '/auth/sign-in/student';
  } catch (error: any) {
    console.error('Erreur lors de la déconnexion:', error);

    // Même en cas d'erreur API, on nettoie les données locales
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_data');

    // Redirection forcée
    window.location.href = '/auth/sign-in/student';
  }
}