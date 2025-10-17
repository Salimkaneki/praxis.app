import api from '@/lib/server/interceptor/axios';

// Types pour les résultats
export interface ExamResult {
  id: number;
  session_id: number;
  session_title: string;
  exam_date: string;
  total_participants: number;
  completed_participants: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  pass_rate: number;
  duration_minutes: number;
  quiz_title: string;
  status: "completed" | "in_progress" | "draft";
  created_at: string;
}

export interface StudentSubmission {
  id: number;
  student: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  score: number;
  maxScore: number;
  percentage: number;
  status: 'completed' | 'in_progress' | 'not_started';
  submittedAt: string;
  duration: number;
  questionsAnswered: number;
  totalQuestions: number;
}

export interface QuestionResponse {
  id: number;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'open_ended' | 'fill_blank';
  correctAnswer: string;
  studentAnswer: string;
  isCorrect: boolean;
  points: number;
  maxPoints: number;
  timeSpent: number;
  options?: {
    text: string;
    isCorrect: boolean;
    isSelected: boolean;
  }[];
  explanation?: string;
}

export interface StudentQuizResponse {
  id: number;
  student: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  quiz: {
    id: number;
    title: string;
    totalQuestions: number;
    maxScore: number;
  };
  score: number;
  percentage: number;
  timeSpent: number;
  submittedAt: string;
  responses: QuestionResponse[];
}

class ResultService {
  /**
   * Récupère la liste des sessions de résultats pour l'enseignant connecté
   * Utilise les endpoints du ResultController Laravel
   */
  async getExamResults(): Promise<ExamResult[]> {
    try {
      // Récupérer les sessions terminées via le nouvel endpoint
      const sessionsResponse = await api.get('/teacher/sessions?status=completed');
      const sessions = sessionsResponse.data.sessions || [];

      // Pour chaque session terminée, récupérer les statistiques des résultats
      const examResults: ExamResult[] = [];

      for (const session of sessions) {
        try {
          // Récupérer tous les résultats pour cette session
          const resultsResponse = await api.get(`/teacher/quiz/${session.id}/results`);
          const results = resultsResponse.data || [];

          if (results.length > 0) {
            // Calculer les statistiques
            const completedResults = results.filter((r: any) => r.status === 'submitted' || r.status === 'graded' || r.status === 'published');
            const scores = completedResults.map((r: any) => parseFloat(r.percentage) || 0);

            const averageScore = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
            const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
            const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
            const passRate = scores.length > 0 ? (scores.filter((s: number) => s >= 60).length / scores.length) * 100 : 0;

            // Calculer le nombre total de participants
            const totalParticipants = session.max_participants || session.total_participants || results.length;

            examResults.push({
              id: session.id,
              session_id: session.id,
              session_title: `${session.quiz?.title || session.title || 'Quiz'} - ${session.session_code || session.code || ''}`,
              exam_date: session.completed_at || session.ends_at || session.created_at,
              total_participants: totalParticipants,
              completed_participants: completedResults.length,
              average_score: Math.round(averageScore * 100) / 100,
              highest_score: highestScore,
              lowest_score: lowestScore,
              pass_rate: Math.round(passRate * 100) / 100,
              duration_minutes: session.duration_minutes || 60,
              quiz_title: session.quiz?.title || session.title || 'Quiz',
              status: 'completed',
              created_at: session.created_at
            });
          }
        } catch (error) {
          console.warn(`Erreur lors du chargement des résultats pour la session ${session.id}:`, error);
          // Continuer avec les autres sessions
        }
      }

      return examResults;
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions terminées:', error);
      throw error;
    }
  }

  /**
   * Récupère les détails d'une session avec la participation des étudiants
   * GET /api/teacher/quiz/{quizSessionId}/results
   */
  async getSessionParticipation(sessionId: number): Promise<StudentSubmission[]> {
    try {
      const response = await api.get(`/teacher/quiz/${sessionId}/results`);

      // Transformer les données pour correspondre à notre interface StudentSubmission
      return response.data.map((result: any) => {
        // Essayer différentes structures possibles pour le nom de l'étudiant
        let studentName = 'Étudiant';
        if (result.student?.first_name && result.student?.last_name) {
          studentName = `${result.student.first_name} ${result.student.last_name}`;
        } else if (result.student?.full_name) {
          studentName = result.student.full_name;
        } else if (result.student?.name) {
          studentName = result.student.name;
        } else if (result.student_name) {
          studentName = result.student_name;
        } else if (result.user?.name) {
          studentName = result.user.name;
        } else if (result.user?.first_name && result.user?.last_name) {
          studentName = `${result.user.first_name} ${result.user.last_name}`;
        }

        return {
          id: result.id,
          student: {
            id: result.student_id,
            name: studentName,
            email: result.student?.email || result.student?.user?.email || '',
          },
          score: parseFloat(result.total_points) || 0,
          maxScore: parseFloat(result.max_points) || 100,
          percentage: parseFloat(result.percentage) || 0,
          status: result.status === 'submitted' || result.status === 'graded' || result.status === 'published' ? 'completed' : 'in_progress',
          submittedAt: result.submitted_at || result.created_at,
          duration: result.time_spent_total ? Math.round(result.time_spent_total / 60) : 0, // Convertir en minutes
          questionsAnswered: result.total_questions || 0,
          totalQuestions: result.total_questions || 0
        };
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère les réponses détaillées d'un étudiant pour une session
   * GET /api/teacher/results/{id} ou GET /api/teacher/quiz-sessions/{sessionId}/results/{studentId}
   */
  async getStudentResponses(sessionId: number, studentId: number): Promise<StudentQuizResponse> {
    try {
      // D'abord récupérer tous les résultats de la session
      const sessionResults = await this.getSessionParticipation(sessionId);
      // Trouver le résultat de l'étudiant spécifique
      const studentResult = sessionResults.find(r => r.student.id === studentId);

      if (!studentResult) {
        throw new Error('Résultat étudiant non trouvé');
      }

      // Essayer d'abord l'endpoint spécifique aux résultats détaillés
      let response;
      try {
        response = await api.get(`/teacher/results/${studentResult.id}`);
      } catch (error: any) {
        // Si l'endpoint n'existe pas (404) ou erreur serveur (500), essayer un endpoint alternatif
        if (error.response?.status === 404 || error.response?.status === 500) {
          // Retourner les données limitées de la session au lieu de rien
          return {
            id: studentResult.id,
            student: studentResult.student,
            quiz: {
              id: 1, // TODO: récupérer depuis la session
              title: 'Quiz', // TODO: récupérer depuis la session
              totalQuestions: studentResult.totalQuestions,
              maxScore: studentResult.maxScore
            },
            score: studentResult.score,
            percentage: studentResult.percentage,
            timeSpent: studentResult.duration,
            submittedAt: studentResult.submittedAt,
            responses: [] // Pas de réponses détaillées disponibles
          };
        }
        throw error;
      }

      // Transformer les données pour correspondre à notre interface StudentQuizResponse
      const result = response.data;

      // Essayer différentes structures possibles pour le nom de l'étudiant
      let studentName = 'Étudiant';
      if (result.student?.first_name && result.student?.last_name) {
        studentName = `${result.student.first_name} ${result.student.last_name}`;
      } else if (result.student?.full_name) {
        studentName = result.student.full_name;
      } else if (result.student?.name) {
        studentName = result.student.name;
      } else if (result.student_name) {
        studentName = result.student_name;
      } else if (result.user?.name) {
        studentName = result.user.name;
      } else if (result.user?.first_name && result.user?.last_name) {
        studentName = `${result.user.first_name} ${result.user.last_name}`;
      }

      return {
        id: result.id,
        student: {
          id: result.student_id,
          name: studentName,
          email: result.student?.email || '',
        },
        quiz: {
          id: result.quiz_session_id || 1,
          title: 'Quiz UI/UX Design', // Titre par défaut basé sur les données
          totalQuestions: result.total_questions || 0,
          maxScore: parseFloat(result.max_points) || 100
        },
        score: parseFloat(result.total_points) || 0,
        percentage: parseFloat(result.percentage) || 0,
        timeSpent: result.time_spent_total ? Math.round(result.time_spent_total / 60) : 0, // Convertir en minutes
        submittedAt: result.submitted_at || result.created_at,
        responses: (result.student_responses || []).map((response: any) => {
          const question = response.question || {};
          const questionType = question.type || 'multiple_choice';

          // Transformer les options selon le type de question
          let options: any[] = [];
          if (questionType === 'multiple_choice' && question.options) {
            options = question.options.map((opt: any) => ({
              text: opt.text,
              isCorrect: opt.is_correct,
              isSelected: response.answer === opt.text
            }));
          } else if (questionType === 'true_false') {
            // Pour Vrai/Faux, créer les options manuellement
            options = [
              { text: 'Vrai', isCorrect: question.correct_answer === 'true', isSelected: response.answer === 'true' },
              { text: 'Faux', isCorrect: question.correct_answer === 'false', isSelected: response.answer === 'false' }
            ];
          }

          return {
            id: response.id,
            questionText: question.question_text || '',
            questionType: questionType,
            correctAnswer: question.correct_answer || '',
            studentAnswer: response.answer || '',
            isCorrect: response.is_correct,
            points: parseFloat(response.points_earned) || 0,
            maxPoints: parseFloat(response.points_possible) || 0,
            timeSpent: response.time_spent || 0,
            options: options,
            explanation: question.explanation || ''
          };
        })
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Met à jour un résultat (correction manuelle)
   * PUT /api/teacher/results/{id}
   */
  async updateResult(resultId: number, data: {
    total_points?: number;
    max_points?: number;
    percentage?: number;
    grade?: number;
    teacher_feedback?: string;
  }): Promise<any> {
    try {
      const response = await api.put(`/teacher/results/${resultId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Corrige la réponse d'un étudiant à une question
   * PUT /api/teacher/results/{resultId}/responses/{responseId}
   */
  async updateStudentResponse(resultId: number, responseId: number, data: {
    is_correct?: boolean;
    points_earned?: number;
    teacher_comment?: string;
  }): Promise<any> {
    try {
      const response = await api.put(`/teacher/results/${resultId}/responses/${responseId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Marque un résultat comme corrigé
   * POST /api/teacher/results/{id}/mark-graded
   */
  async markAsGraded(resultId: number): Promise<any> {
    try {
      const response = await api.post(`/teacher/results/${resultId}/mark-graded`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Publie un résultat pour l'étudiant
   * POST /api/teacher/results/{id}/publish
   */
  async publishResult(resultId: number): Promise<any> {
    try {
      const response = await api.post(`/teacher/results/${resultId}/publish`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Supprime un résultat
   */
  async deleteResult(resultId: number): Promise<void> {
    try {
      await api.delete(`/api/results/${resultId}`);
    } catch (error) {
      throw error;
    }
  }
}

export default new ResultService();
