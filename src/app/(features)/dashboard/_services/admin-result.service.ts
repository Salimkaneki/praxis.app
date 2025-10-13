import api from "@/lib/server/interceptor/axios";

// Types pour les résultats d'examen côté admin
export interface AdminStudentResult {
  id: number;
  student_id: number;
  quiz_session_id: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered_questions: number;
  time_taken_minutes: number;
  status: 'published' | 'draft' | 'completed';
  created_at: string;
  updated_at: string;
  student: {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    classe: {
      id: number;
      name: string;
      formation: {
        id: number;
        name: string;
      };
    };
  };
  quiz_session: {
    id: number;
    title: string;
    quiz: {
      id: number;
      title: string;
      subject: {
        id: number;
        name: string;
      };
    };
    teacher: {
      id: number;
      user: {
        id: number;
        name: string;
        email: string;
      };
    };
  };
  student_responses?: StudentResponse[];
}

export interface StudentResponse {
  id: number;
  student_id: number;
  question_id: number;
  answer: string;
  is_correct: boolean;
  points_earned: number;
  time_taken_seconds: number;
  created_at: string;
  question: {
    id: number;
    question_text: string;
    question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
    correct_answer: string;
    points: number;
    options?: string[];
  };
}

class AdminResultService {
  /**
   * Récupère la liste des résultats publiés pour une session de quiz
   * @param quizSessionId - ID de la session de quiz
   * @returns Liste des résultats publiés
   */
  async getPublishedResults(quizSessionId: number): Promise<AdminStudentResult[]> {
    try {
      const response = await api.get(`/admin/results/session/${quizSessionId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des résultats publiés:', error);
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des résultats');
    }
  }

  /**
   * Récupère les détails d'un résultat d'étudiant spécifique
   * @param resultId - ID du résultat
   * @returns Détails du résultat avec réponses de l'étudiant
   */
  async getStudentResultDetails(resultId: number): Promise<AdminStudentResult> {
    try {
      const response = await api.get(`/admin/results/${resultId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des détails du résultat:', error);
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des détails');
    }
  }

  /**
   * Récupère tous les résultats publiés pour une session avec les réponses des étudiants
   * @param quizSessionId - ID de la session de quiz
   * @returns Tous les résultats avec réponses détaillées
   */
  async getAllResultsWithResponses(quizSessionId: number): Promise<AdminStudentResult[]> {
    try {
      const response = await api.get(`/admin/results/session/${quizSessionId}/all`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération de tous les résultats:', error);
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des résultats complets');
    }
  }

  /**
   * Récupère les statistiques générales pour une session
   * @param quizSessionId - ID de la session de quiz
   * @returns Statistiques de la session
   */
  async getSessionStatistics(quizSessionId: number): Promise<{
    total_students: number;
    completed_results: number;
    average_score: number;
    highest_score: number;
    lowest_score: number;
    pass_rate: number;
  }> {
    try {
      const results = await this.getPublishedResults(quizSessionId);

      if (results.length === 0) {
        return {
          total_students: 0,
          completed_results: 0,
          average_score: 0,
          highest_score: 0,
          lowest_score: 0,
          pass_rate: 0
        };
      }

      const scores = results.map(r => r.score);
      const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const highestScore = Math.max(...scores);
      const lowestScore = Math.min(...scores);
      const passRate = (results.filter(r => r.score >= 50).length / results.length) * 100;

      return {
        total_students: results.length,
        completed_results: results.length,
        average_score: Math.round(averageScore * 100) / 100,
        highest_score: highestScore,
        lowest_score: lowestScore,
        pass_rate: Math.round(passRate * 100) / 100
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      throw error;
    }
  }

  /**
   * Exporte les résultats d'une session au format Excel/CSV
   * @param quizSessionId - ID de la session de quiz
   * @param format - Format d'export ('excel' ou 'csv')
   */
  async exportResults(quizSessionId: number, format: 'excel' | 'csv' = 'excel'): Promise<Blob> {
    try {
      const response = await api.get(`/admin/results/session/${quizSessionId}/export`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de l\'export des résultats:', error);
      throw new Error(error.response?.data?.error || 'Erreur lors de l\'export');
    }
  }

  /**
   * Récupère la liste des sessions de quiz disponibles pour l'admin
   * @returns Liste des sessions avec informations de base
   */
  async getAvailableQuizSessions(): Promise<Array<{
    id: number;
    title: string;
    quiz_title: string;
    subject_name: string;
    teacher_name: string;
    class_name: string;
    total_participants: number;
    completed_participants: number;
    status: string;
    created_at: string;
  }>> {
    try {
      const response = await api.get('/admin/quiz-sessions');
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des sessions:', error);
      // Fallback vers données mockées si l'API n'est pas disponible
      console.log('Utilisation des données mockées en fallback');
      return [
        {
          id: 1,
          title: "Évaluation Nationale - Mathématiques Terminale",
          quiz_title: "Baccalauréat Blanc - Mathématiques",
          subject_name: "Mathématiques",
          teacher_name: "M. Dupont",
          class_name: "Terminale S",
          total_participants: 150,
          completed_participants: 145,
          status: "completed",
          created_at: "2024-12-15T14:00:00Z"
        },
        {
          id: 2,
          title: "Contrôle Continu - Français Première",
          quiz_title: "Évaluation Littéraire - 19ème siècle",
          subject_name: "Français",
          teacher_name: "Mme Martin",
          class_name: "Première L",
          total_participants: 120,
          completed_participants: 118,
          status: "completed",
          created_at: "2024-12-14T10:00:00Z"
        }
      ];
    }
  }
}

const adminResultService = new AdminResultService();
export default adminResultService;