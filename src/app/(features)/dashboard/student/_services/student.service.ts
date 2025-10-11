import api from "@/lib/server/interceptor/axios";
import axios from "@/lib/server/interceptor/axios";
import Papa from "papaparse";

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  student_number: string;
  class_id: number;
  institution_id: number;
  birth_date: string;
  is_active: boolean;
  metadata?: Record<string, any>;
  user?: {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
  };
  classe?: {
    id: number;
    name: string;
    code: string;
    formation?: {
      id: number;
      name: string;
    };
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}

export interface StudentCreateData {
  student_number: string;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  phone: string;
  class_id: number;
  metadata: {
    gender: string;
    address: string;
  };
}

export interface StudentUpdateData {
  student_number?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  birth_date?: string;
  phone?: string;
  class_id?: number;
  is_active?: boolean;
  metadata?: Record<string, any>;
}

// 🔹 Lister les étudiants
export const fetchStudents = async (params?: {
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<PaginatedResponse<Student>> => {
  try {
    const response = await axios.get("/admin/students", {
      params,
      timeout: 30000 // 30 secondes pour cette requête spécifique
    });
    return response.data;
  } catch (error: any) {
    console.error('Erreur fetchStudents:', error);
    throw error;
  }
};

// 🔹 Récupérer un étudiant par ID
export const getStudentById = async (id: string | number): Promise<{ data: Student }> => {
  try {
    const response = await axios.get(`/admin/students/${id}`);
    return { data: response.data };
  } catch (error: any) {
    throw error;
  }
};

// 🔹 Mettre à jour un étudiant
export const updateStudent = async (
  id: number | string,
  data: StudentUpdateData
): Promise<Student> => {
  try {
    const response = await axios.put(`/admin/students/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

// 🔹 Créer un étudiant
export const createStudent = async (data: StudentCreateData): Promise<Student> => {
  const response = await axios.post("/admin/students", data);
  return response.data;
};

// 🔹 Supprimer un étudiant
export const deleteStudent = async (id: number): Promise<void> => {
  await axios.delete(`/admin/students/${id}`);
};

// 🔹 Import CSV étudiants - VERSION FINALE AVEC VALIDATION COLONNES

export const importStudents = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file, file.name);

  try {
    const response = await api.post("/admin/students/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;

  } catch (error: any) {

    if (error.response?.status === 422) {
      // Erreur de validation - affichez les détails
      const validationErrors = error.response.data;

      let errorMessage = "Erreurs de validation :\n";

      if (validationErrors.message) {
        errorMessage += validationErrors.message + "\n";
      }

      if (validationErrors.errors) {
        Object.entries(validationErrors.errors).forEach(([field, messages]) => {
          errorMessage += `${field}: ${(messages as string[]).join(', ')}\n`;
        });
      }

      throw new Error(errorMessage);
    }

    throw new Error(error.response?.data?.message || "Erreur lors de l'importation");
  }
};