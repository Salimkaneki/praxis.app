// dashboard/formation/classe/_services/classe.service.ts
import axios from "@/lib/server/interceptor/axios";

export interface Classe {
  id: number;
  name: string;
  level: number;
  academic_year: string;
  formation_id: number;
  max_students?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  formation: {
    id: number;
    name: string;
    institution_id: number;
  };
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  total: number;
  per_page: number;
  last_page: number;
}

const ClasseService = {
  /**
   * Récupère les classes avec pagination et recherche
   */
  async getClasses(search?: string, page: number = 1): Promise<PaginatedResponse<Classe>> {
    const params: Record<string, any> = { page };
    if (search) params.search = search;

    const response = await axios.get<PaginatedResponse<Classe>>("/admin/classes", { params });
    return response.data;
  },

  /**
   * Récupérer une classe spécifique
   */
  async getClasse(id: number): Promise<Classe> {
    const response = await axios.get<Classe>(`/admin/classes/${id}`);
    return response.data;
  },

    /**
    * Crée une nouvelle classe
    */
    async createClasse(data: Partial<Omit<Classe, 'id' | 'created_at' | 'updated_at' | 'formation'>>): Promise<Classe> {
    const response = await axios.post<Classe>("/admin/classes", data);
    return response.data;
    },
    async updateClasse(id: number, data: Partial<Omit<Classe, 'id' | 'created_at' | 'updated_at' | 'formation'>>): Promise<Classe> {
        const response = await axios.put<Classe>(`/admin/classes/${id}`, data);
        return response.data;
    },


    async deleteClasse(id: number): Promise<void> {
        await axios.delete(`/admin/classes/${id}`);
    }

};




export default ClasseService;
