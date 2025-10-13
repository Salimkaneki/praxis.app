'use client';
import api from "@/lib/server/interceptor/axios";

// Interface adaptée à ton API (ajuste si besoin selon ta réponse JSON)
export interface Teacher {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  institution: {
    id: number;
    name: string;
  };
  specialization: string;
  grade: string;
  is_permanent: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  total: number;
  per_page: number;
  last_page: number;
}

export async function fetchTeachers(
  page: number = 1,
  filters?: { grade?: string; specialization?: string; is_permanent?: boolean }
): Promise<PaginatedResponse<Teacher>> {
  const response = await api.get("/admin/teachers", {
    params: {
      page,
      ...filters,
      with: 'user,institution' // Inclure les relations user et institution
    },
  });
  return response.data;
}

export async function fetchTeacher(id: number): Promise<Teacher> {
  const response = await api.get(`/admin/teachers/${id}`);
  return response.data;
}

export async function createTeacher(data: Partial<Teacher>) {
  const response = await api.post("/admin/teachers", data);
  return response.data;
}

export async function updateTeacher(id: number, data: Partial<Teacher>) {
  const response = await api.put(`/admin/teachers/${id}`, data);
  return response.data;
}

export async function deleteTeacher(id: number) {
  const response = await api.delete(`/admin/teachers/${id}`);
  return response.data;
}
