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
    const response = await axios.get<Quiz[]>(BASE_URL);
    return response.data;
  },

  async getById(id: number): Promise<Quiz> {
    const response = await axios.get<Quiz>(`${BASE_URL}/${id}`);
    return response.data;
  },

  async create(payload: Partial<Quiz>): Promise<Quiz> {
    const response = await axios.post<Quiz>(BASE_URL, payload);
    return response.data;
  },

  async update(id: number, payload: Partial<Quiz>): Promise<Quiz> {
    const response = await axios.put<Quiz>(`${BASE_URL}/${id}`, payload);
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
  type: "multiple_choice" | "true_false" | "open_ended" | "fill_blank";
  options?: any[];
  correct_answer?: string;
  points?: number;
  order?: number;
  explanation?: string | null;
  image_url?: string | null;
  time_limit?: number | null;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// =============================
// Questions Service
// =============================
export const QuestionsService = {
  async getAll(quizId: number): Promise<Question[]> {
    const response = await axios.get<Question[]>(`${BASE_URL}/${quizId}/questions`);
    return response.data;
  },

  async getById(quizId: number, questionId: number): Promise<Question> {
    const response = await axios.get<Question>(`${BASE_URL}/${quizId}/questions/${questionId}`);
    return response.data;
  },

  async create(quizId: number, payload: Partial<Question>): Promise<Question> {
    const response = await axios.post<Question>(`${BASE_URL}/${quizId}/questions`, payload);
    return response.data;
  },

  async batchCreate(quizId: number, payload: { questions: Partial<Question>[] }) {
    const response = await axios.post(`${BASE_URL}/${quizId}/questions/batch`, payload);
    return response.data;
  },

  async update(quizId: number, questionId: number, payload: Partial<Question>): Promise<Question> {
    const response = await axios.put<Question>(`${BASE_URL}/${quizId}/questions/${questionId}`, payload);
    return response.data;
  },

  async delete(quizId: number, questionId: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${quizId}/questions/${questionId}`);
  },
};
