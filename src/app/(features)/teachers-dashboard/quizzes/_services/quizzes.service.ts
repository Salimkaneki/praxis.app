// teachers-dashboard/quizzes/_services/quizzes.service.ts
import axios from "@/lib/server/interceptor/axios";

// =============================
// Types Quiz
// =============================
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
  status: "draft" | "published" | "archived";
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// =============================
// Quiz Service
// =============================
const BASE_URL = "/teacher/quizzes";

export const QuizzesService = {
  async getAll(): Promise<Quiz[]> {
    const response = await axios.get(BASE_URL);
    // L'API retourne probablement { quizzes: Quiz[], pagination: {...} }
    return response.data.quizzes || response.data || [];
  },

  async getById(id: number): Promise<Quiz> {
    const response = await axios.get(`${BASE_URL}/${id}`);
    // L'API retourne directement le quiz
    return response.data;
  },

  async create(payload: Partial<Quiz>): Promise<Quiz> {
    const response = await axios.post(BASE_URL, payload);
    // L'API retourne directement le quiz créé
    return response.data;
  },

  async update(id: number, payload: Partial<Quiz>): Promise<Quiz> {
    const response = await axios.put(`${BASE_URL}/${id}`, payload);
    // L'API retourne directement le quiz mis à jour
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};

// =============================
// Types Question
// =============================
export interface Question {
  id: number;
  question_text: string;
  type: 'multiple_choice' | 'true_false' | 'open_ended' | 'fill_blank';
  points?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  options?: any[];
  correct_answer?: string;
  explanation?: string;
  created_at?: string;
  updated_at?: string;
  order?: number;
  time_limit?: number;
}
// =============================
// Questions Service
// =============================
export const QuestionsService = {
  async getAll(quizId: number): Promise<Question[]> {
    const response = await axios.get(`${BASE_URL}/${quizId}/questions`);
    // L'API retourne probablement { questions: Question[], pagination: {...} }
    return response.data.questions || response.data || [];
  },

  async getById(quizId: number, questionId: number): Promise<Question> {
    const response = await axios.get(`${BASE_URL}/${quizId}/questions/${questionId}`);
    // L'API retourne directement la question
    return response.data;
  },

  async create(quizId: number, payload: Partial<Question>): Promise<Question> {
    const response = await axios.post(`${BASE_URL}/${quizId}/questions`, payload);
    // L'API retourne directement la question créée
    return response.data;
  },

  async batchCreate(quizId: number, payload: { questions: Partial<Question>[] }) {
    const response = await axios.post(`${BASE_URL}/${quizId}/questions/batch`, payload);
    return response.data;
  },

  async update(quizId: number, questionId: number, payload: Partial<Question>): Promise<Question> {
    const response = await axios.put(`${BASE_URL}/${quizId}/questions/${questionId}`, payload);
    // L'API retourne directement la question mise à jour
    return response.data;
  },

  async delete(quizId: number, questionId: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${quizId}/questions/${questionId}`);
  },
};
