import api from "@/lib/server/interceptor/axios";

export interface Formation {
  id: number;
  name: string;
  code: string;
  description: string;
  duration_years: number;
  institution_id: number;
  is_active: boolean;
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

export async function getFormations(page: number = 1, search?: string) {
  try {
    const res = await api.get<PaginatedResponse<Formation>>("/admin/formations", {
      params: { page, search }
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors du chargement des formations");
  }
}
