import api from '@/lib/server/interceptor/axios';

// Types
export interface KPI {
  label: string;
  value: string | number;
  trend: 'positive' | 'negative';
  period: string;
}

export interface Quiz {
  id: number;
  title: string;
  class_name: string;
  questions: number;
  created_at: string;
}

export interface UpcomingEvaluation {
  id: number;
  title: string;
  date: string;
  time: string;
  class_name: string;
}

export interface TeacherDashboardData {
  kpis: KPI[];
  quizzes: Quiz[];
  upcoming_evaluations: UpcomingEvaluation[];
}

class TeacherDashboardService {
  private baseUrl = '/teacher/dashboard';

  /**
   * Récupère toutes les données du tableau de bord enseignant
   */
  async getDashboardData(): Promise<TeacherDashboardData> {
    try {
      const response = await api.get<TeacherDashboardData>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données du dashboard:', error);
      throw error;
    }
  }

  /**
   * Récupère les KPIs du tableau de bord
   */
  async getKPIs(): Promise<KPI[]> {
    try {
      const response = await api.get<{ kpis: KPI[] }>(`${this.baseUrl}/kpis`);
      return response.data.kpis;
    } catch (error) {
      console.error('Erreur lors de la récupération des KPIs:', error);
      throw error;
    }
  }

  /**
   * Récupère les quizzes de l'enseignant
   */
  async getQuizzes(): Promise<Quiz[]> {
    try {
      const response = await api.get<{ quizzes: Quiz[] }>(`${this.baseUrl}/quizzes`);
      return response.data.quizzes;
    } catch (error) {
      console.error('Erreur lors de la récupération des quizzes:', error);
      throw error;
    }
  }

  /**
   * Récupère les évaluations à venir
   */
  async getUpcomingEvaluations(): Promise<UpcomingEvaluation[]> {
    try {
      const response = await api.get<{ upcoming_evaluations: UpcomingEvaluation[] }>(`${this.baseUrl}/upcoming-evaluations`);
      return response.data.upcoming_evaluations;
    } catch (error) {
      console.error('Erreur lors de la récupération des évaluations à venir:', error);
      throw error;
    }
  }

  /**
   * Données mockées pour référence/tests (données réelles du 14/10/2025)
   */
  private getMockData(): TeacherDashboardData {
    return {
      kpis: [
        {
          label: 'Nombre d\'élèves',
          value: 13,
          trend: 'positive',
          period: 'Depuis le mois dernier'
        },
        {
          label: 'Évaluations complétées',
          value: 0,
          trend: 'negative',
          period: 'Cette semaine'
        },
        {
          label: 'Taux de réussite',
          value: '0%',
          trend: 'positive',
          period: 'Ce trimestre'
        },
        {
          label: 'Nouvelles inscriptions',
          value: 13,
          trend: 'positive',
          period: 'Aujourd\'hui'
        },
      ],
      quizzes: [
        {
          id: 1,
          title: "Algorithmique et Programmation - Concepts Fondamentaux",
          class_name: "Algorithmique et Programmation",
          questions: 5,
          created_at: "2025-10-13"
        },
        {
          id: 2,
          title: "Bases de Données - Modèle Relationnel",
          class_name: "Bases de Données",
          questions: 5,
          created_at: "2025-10-13"
        },
        {
          id: 3,
          title: "Mathématiques Discrètes - Théorie des Graphes",
          class_name: "Mathématiques Discrètes",
          questions: 5,
          created_at: "2025-10-13"
        },
        {
          id: 4,
          title: "Développement Web - HTML/CSS/JavaScript",
          class_name: "Développement Web",
          questions: 5,
          created_at: "2025-10-13"
        },
        {
          id: 5,
          title: "Programmation Orientée Objet - Concepts Avancés",
          class_name: "Programmation Orientée Objet",
          questions: 4,
          created_at: "2025-10-13"
        },
        {
          id: 6,
          title: "Intelligence Artificielle - Apprentissage Automatique",
          class_name: "Intelligence Artificielle",
          questions: 4,
          created_at: "2025-10-13"
        }
      ],
      upcoming_evaluations: []
    };
  }
}

// Export d'une instance singleton
export const teacherDashboardService = new TeacherDashboardService();
export default teacherDashboardService;
