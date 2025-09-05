import api from "@/lib/server/interceptor/axios"; // ton axios configuré avec baseURL + auth

export interface AssignSubjectPayload {
  teacher_id: number;
  subject_id: number;
  classe_id?: number | null;
  academic_year: string;
  is_active: boolean;
}

export interface AssignSubjectResponse {
  message: string;
  data: any; // tu peux typer avec ton modèle TeacherSubject si tu veux
}

export async function assignSubject(
  payload: AssignSubjectPayload
): Promise<AssignSubjectResponse> {
  const response = await api.post<AssignSubjectResponse>(
    "/admin/teacher-subjects",
    payload
  );
  return response.data;
}
