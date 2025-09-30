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
   * Utilise l'endpoint des sessions avec historique
   */
  async getExamResults(): Promise<ExamResult[]> {
    try {
      // Pour l'instant, utilisons l'endpoint existant des sessions
      // TODO: Adapter quand l'endpoint /api/teacher/results/sessions sera disponible
      const response = await api.get('/teacher/sessions');

      // Transformer les sessions en résultats d'examen
      return response.data.sessions?.map((session: any) => ({
        id: session.id,
        session_id: session.id,
        session_title: `${session.quiz?.title || 'Quiz'} - ${session.session_code}`,
        exam_date: session.completed_at || session.ends_at || session.created_at,
        total_participants: session.max_participants || 0,
        completed_participants: session.current_participants || 0,
        average_score: 0, // TODO: Calculer depuis les résultats
        highest_score: 100,
        lowest_score: 0,
        pass_rate: 0, // TODO: Calculer depuis les résultats
        duration_minutes: session.duration_minutes || 60,
        quiz_title: session.quiz?.title || 'Quiz',
        status: session.status === 'completed' ? 'completed' as const : 'in_progress' as const,
        created_at: session.created_at
      })) || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des résultats:', error);
      throw error;
    }
  }

  /**
   * Récupère les détails d'une session avec la participation des étudiants
   * GET /api/teacher/quiz-sessions/{quizSessionId}/results
   */
  async getSessionParticipation(sessionId: number): Promise<StudentSubmission[]> {
    try {
      const response = await api.get(`/teacher/quiz-sessions/${sessionId}/results`);
      console.log('API Response for session participation:', response.data);

      // Transformer les données pour correspondre à notre interface StudentSubmission
      return response.data.map((result: any) => {
        console.log('Individual result:', result);

        // Essayer différentes structures possibles pour le nom de l'étudiant
        let studentName = 'Étudiant';
        if (result.student?.full_name) {
          studentName = result.student.full_name;
        } else if (result.student?.first_name && result.student?.last_name) {
          studentName = `${result.student.first_name} ${result.student.last_name}`;
        } else if (result.student?.name) {
          studentName = result.student.name;
        } else if (result.student_name) {
          studentName = result.student_name;
        } else if (result.user?.name) {
          studentName = result.user.name;
        } else if (result.user?.first_name && result.user?.last_name) {
          studentName = `${result.user.first_name} ${result.user.last_name}`;
        }

        console.log('Student name resolution:', {
          result,
          studentName,
          student: result.student,
          user: result.user
        });

        return {
          id: result.id,
          student: {
            id: result.student_id,
            name: studentName,
            email: result.student?.user?.email || result.student_email || '',
          },
          score: result.total_points || result.score || 0,
          maxScore: result.max_points || 100,
          percentage: result.percentage || 0,
          status: result.status === 'submitted' || result.status === 'graded' || result.status === 'published' ? 'completed' : 'in_progress',
          submittedAt: result.submitted_at || result.created_at,
          duration: Math.round((result.time_spent_total || 0) / 60), // Convertir en minutes
          questionsAnswered: result.correct_answers + (result.total_questions - result.correct_answers) || result.total_questions || 0,
          totalQuestions: result.total_questions || 0
        };
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la participation:', error);
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
          console.warn(`Endpoint /teacher/results/${studentResult.id} non disponible, utilisation des données de session`);
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
      console.log('Student response data:', result);

      // Essayer différentes structures possibles pour le nom de l'étudiant
      let studentName = 'Étudiant';
      if (result.student?.full_name) {
        studentName = result.student.full_name;
      } else if (result.student?.first_name && result.student?.last_name) {
        studentName = `${result.student.first_name} ${result.student.last_name}`;
      } else if (result.student?.name) {
        studentName = result.student.name;
      } else if (result.student_name) {
        studentName = result.student_name;
      } else if (result.user?.name) {
        studentName = result.user.name;
      } else if (result.user?.first_name && result.user?.last_name) {
        studentName = `${result.user.first_name} ${result.user.last_name}`;
      }

      console.log('Transformed student response:', {
        id: result.id,
        student: {
          id: result.student_id,
          name: studentName,
          email: result.student?.email || '',
        },
        score: parseFloat(result.total_points) || 0,
        percentage: parseFloat(result.percentage) || 0,
        responsesCount: (result.student_responses || []).length
      });

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
      console.error('Erreur lors de la récupération des réponses:', error);
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
      console.error('Erreur lors de la mise à jour du résultat:', error);
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
      console.error('Erreur lors de la correction de la réponse:', error);
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
      console.error('Erreur lors du marquage comme corrigé:', error);
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
      console.error('Erreur lors de la publication du résultat:', error);
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
      console.error('Erreur lors de la suppression du résultat:', error);
      throw error;
    }
  }
}

export default new ResultService();
