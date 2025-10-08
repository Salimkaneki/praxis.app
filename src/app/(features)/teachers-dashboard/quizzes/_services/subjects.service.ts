// teachers-dashboard/quizzes/_services/subjects.service.ts
import axios from "@/lib/server/interceptor/axios";

export interface TeacherSubject {
  id: number;
  subject_id: number;
  subject_name: string;
  classe_id?: number;
  classe_name?: string;
  academic_year: string;
  is_active: boolean;
}

export const SubjectService = {
  async getMySubjects(): Promise<TeacherSubject[]> {
    try {
      const response = await axios.get<TeacherSubject[]>("/teacher/my-subjects");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};
