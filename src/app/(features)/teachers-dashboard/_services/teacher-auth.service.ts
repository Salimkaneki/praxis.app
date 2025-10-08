import api from "@/lib/server/interceptor/axios";

// Types pour les données de l'enseignant
export interface TeacherUser {
  id: number;
  name: string;
  email: string;
  account_type: string;
  teacher?: {
    id: number;
    user_id: number;
    department?: string;
    institution?: {
      id: number;
      name: string;
    };
    // Autres propriétés du modèle Teacher si nécessaire
  };
}

export interface TeacherAuthResponse {
  token: string;
  user: TeacherUser;
}

class TeacherAuthService {
  private readonly TOKEN_KEY = "teacher_token";
  private readonly DATA_KEY = "teacher_data";

  /**
   * Récupère les informations de l'enseignant connecté depuis l'API
   */
  async getCurrentTeacher(): Promise<TeacherUser | null> {
    try {
      const response = await api.get('/teacher/me');
      const teacherData: TeacherUser = response.data;

      // Stocker les données en localStorage pour une utilisation hors ligne
      this.setTeacherData(teacherData);

      return teacherData;
    } catch (error) {
      // En cas d'erreur, essayer de récupérer depuis localStorage
      return this.getTeacherData();
    }
  }

  /**
   * Récupère les données de l'enseignant depuis localStorage
   */
  getTeacherData(): TeacherUser | null {
    try {
      const stored = localStorage.getItem(this.DATA_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Stocke les données de l'enseignant en localStorage
   */
  setTeacherData(data: TeacherUser): void {
    try {
      localStorage.setItem(this.DATA_KEY, JSON.stringify(data));
    } catch (error) {
    }
  }

  /**
   * Récupère le token d'authentification
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Stocke le token d'authentification
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Supprime toutes les données d'authentification
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.DATA_KEY);
  }

  /**
   * Vérifie si l'enseignant est connecté
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Récupère le nom de l'enseignant
   */
  getTeacherName(): string {
    const data = this.getTeacherData();
    return data?.name || "Professeur";
  }

  /**
   * Récupère le département de l'enseignant
   */
  getTeacherDepartment(): string {
    const data = this.getTeacherData();
    return data?.teacher?.department || "Département";
  }

  /**
   * Récupère le nom de l'institution
   */
  getInstitutionName(): string {
    const data = this.getTeacherData();
    return data?.teacher?.institution?.name || "Institution";
  }

  /**
   * Met à jour les données de l'enseignant depuis l'API
   * Utile pour rafraîchir les données après modification
   */
  async refreshTeacherData(): Promise<TeacherUser | null> {
    return this.getCurrentTeacher();
  }
}

// Instance singleton du service
const teacherAuthService = new TeacherAuthService();

export default teacherAuthService;