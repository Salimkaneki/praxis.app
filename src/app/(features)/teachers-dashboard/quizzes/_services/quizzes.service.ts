// teachers-dashboard/quizzes/_services/quizzes.service.ts
import axios from "@/lib/server/interceptor/axios";

// Définition du type Quiz correspondant à ta structure backend
// teachers-dashboard/quizzes/_services/quizzes.service.ts
export interface Quiz {
  id: number;
  title: string;
  description: string | null;
  subject_id: number;
  teacher_id: number;
  duration_minutes: number | null;
  total_points: number | null;
  shuffle_questions: boolean;
  show_results_immediately: boolean;
  allow_review: boolean;
  status: "draft" | "published" | "archived"; // Ajoutez "archived" ici
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

const BASE_URL = "/teacher/quizzes";

export const QuizzesService = {
  // Récupérer tous les quiz de l'enseignant connecté
  async getAll(): Promise<Quiz[]> {
    try {
      const response = await axios.get<Quiz[]>(BASE_URL);
      return response.data;
    } catch (error: any) {
      console.error("Erreur lors de la récupération des quiz :", error);
      throw error;
    }
  },

  // Récupérer un quiz par ID
  async getById(id: number): Promise<Quiz> {
    try {
      const response = await axios.get<Quiz>(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la récupération du quiz ${id} :`, error);
      throw error;
    }
  },

  // Créer un nouveau quiz
  async create(payload: Partial<Quiz>): Promise<Quiz> {
    try {
      const response = await axios.post<Quiz>(BASE_URL, payload);
      return response.data;
    } catch (error: any) {
      console.error("Erreur lors de la création du quiz :", error);
      throw error;
    }
  },

  // Mettre à jour un quiz existant
  async update(id: number, payload: Partial<Quiz>): Promise<Quiz> {
    try {
      const response = await axios.put<Quiz>(`${BASE_URL}/${id}`, payload);
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour du quiz ${id} :`, error);
      throw error;
    }
  },

  // Supprimer un quiz
  async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
    } catch (error: any) {
      console.error(`Erreur lors de la suppression du quiz ${id} :`, error);
      throw error;
    }
  },

  
};
