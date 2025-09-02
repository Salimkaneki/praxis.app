// teacher.service.ts
import api from "@/lib/server/interceptor/axios";

export interface Teacher {
  id: number;
  name: string;          // Ajouté pour correspondre à page.tsx
  email: string;
  phone?: string;
  department?: string;
  speciality?: string;
  status?: string;
  experience?: string;
  students?: number;
  courses?: number;
  joinDate?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  total: number;
  per_page: number;
  last_page: number;
}

export const TeacherService = {
  getAll: async (): Promise<Teacher[]> => {
    const { data } = await api.get("/teachers");
    return data; // Assure-toi que l'API renvoie bien un tableau d'objets avec `name`
  },

  getPaginated: async (page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Teacher>> => {
    const { data } = await api.get(`/teachers?page=${page}&per_page=${perPage}`);
    return data;
  },

  getById: async (id: number): Promise<Teacher> => {
    const { data } = await api.get(`/teachers/${id}`);
    return data;
  },

  create: async (teacher: Partial<Teacher>): Promise<Teacher> => {
    const { data } = await api.post("/teachers", teacher);
    return data;
  },

  update: async (id: number, teacher: Partial<Teacher>): Promise<Teacher> => {
    const { data } = await api.put(`/teachers/${id}`, teacher);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/teachers/${id}`);
  },
};
