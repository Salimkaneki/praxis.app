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
  const response = await axios.get("/admin/students", { params });
  return response.data;
};

// 🔹 Récupérer un étudiant par ID
export const getStudentById = async (id: string | number): Promise<{ data: Student }> => {
  try {
    const response = await axios.get(`/admin/students/${id}`);
    return { data: response.data };
  } catch (error: any) {
    console.error("Erreur API getStudentById:", error);
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
    console.error("Erreur API updateStudent:", error);
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
export const importStudentsCSV = async (
  file: File
): Promise<{ message: string; imported: number; errors: any[] }> => {
  const formData = new FormData();
  formData.append("file", file);

  // ✅ VALIDATION PRÉALABLE: Vérifier les colonnes du CSV
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      preview: 1, // Lire seulement la première ligne pour vérifier les headers
      complete: async (results) => {
        const csvHeaders = results.meta.fields || [];
        
        // 🔍 COLONNES EXACTES selon le controller Laravel (StudentImportController.php)
        const requiredColumns = [
          'student_number', 'first_name', 'last_name', 'birth_date', 
          'email', 'phone', 'class_id'
        ];
        
        // ❌ Laravel n'accepte PAS ces colonnes
        const forbiddenColumns = ['gender', 'address'];
        
        // Vérifier que toutes les colonnes requises sont présentes
        const missingColumns = requiredColumns.filter(col => !csvHeaders.includes(col));
        const forbiddenFound = csvHeaders.filter(col => forbiddenColumns.includes(col));
        
        // ⚠️ IMPORTANT: Laravel vérifie l'ORDRE EXACT des colonnes
        const expectedOrder = ['student_number','first_name','last_name','birth_date','email','phone','class_id'];
        const correctOrder = JSON.stringify(csvHeaders) === JSON.stringify(expectedOrder);
        
        console.log("🔍 Validation colonnes CSV:");
        console.log("- Headers trouvés:", csvHeaders);
        console.log("- Ordre attendu:", expectedOrder);
        console.log("- Ordre correct:", correctOrder);
        console.log("- Colonnes manquantes:", missingColumns);
        console.log("- Colonnes interdites trouvées:", forbiddenFound);
        
        if (missingColumns.length > 0) {
          reject(new Error(
            `Colonnes manquantes: ${missingColumns.join(', ')}\n` +
            `Colonnes requises: ${requiredColumns.join(', ')}\n` +
            `Téléchargez le modèle pour avoir le bon format.`
          ));
          return;
        }
        
        if (forbiddenFound.length > 0) {
          reject(new Error(
            `Colonnes non supportées: ${forbiddenFound.join(', ')}\n` +
            `Le backend n'accepte que: ${requiredColumns.join(', ')}\n` +
            `Téléchargez le nouveau modèle.`
          ));
          return;
        }
        
        if (!correctOrder) {
          reject(new Error(
            `Ordre des colonnes incorrect.\n` +
            `Ordre requis: ${expectedOrder.join(', ')}\n` +
            `Ordre trouvé: ${csvHeaders.join(', ')}\n` +
            `Téléchargez le modèle pour avoir le bon ordre.`
          ));
          return;
        }
        
        // Si validation OK, procéder à l'upload
        try {
          console.log("📤 Import CSV - Validation colonnes OK");
          console.log("- Fichier:", file.name, `(${(file.size / 1024).toFixed(1)} KB)`);
          
          const response = await axios.post("/admin/students/import", formData, {
            headers: {
              'Accept': 'application/json',
            },
            timeout: 120000,
          });

          console.log("✅ Import réussi:", response.data);
          resolve(response.data);

        } catch (error: any) {
          console.group("❌ Erreur Import CSV - Debug complet");
          console.log("Type d'erreur:", error.constructor.name);
          console.log("Message:", error.message);
          
          if (error.response) {
            console.log("📡 Réponse serveur:");
            console.log("- Status:", error.response.status);
            console.log("- Data:", error.response.data);
            
            // Extraction du message d'erreur Laravel
            let errorMessage = "Erreur serveur";
            if (error.response.data) {
              if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
              } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
              } else if (error.response.data.error) {
                errorMessage = error.response.data.error;
              }
            }
            
            const status = error.response.status;
            console.log("- Message extrait:", errorMessage);
            console.groupEnd();
            
            switch (status) {
              case 422:
                reject(new Error(`Validation échouée: ${errorMessage}`));
                break;
              case 413:
                reject(new Error("Fichier trop volumineux"));
                break;
              case 415:
                reject(new Error("Format de fichier non supporté"));
                break;
              case 500:
                reject(new Error(`Erreur serveur: ${errorMessage}`));
                break;
              default:
                reject(new Error(`Erreur ${status}: ${errorMessage}`));
            }
          } else if (error.request) {
            console.groupEnd();
            reject(new Error("Impossible de joindre le serveur. Vérifiez que l'API fonctionne."));
          } else {
            console.groupEnd();
            reject(new Error(`Erreur configuration: ${error.message}`));
          }
        }
      },
      error: (parseError) => {
        reject(new Error(`Erreur lecture CSV: ${parseError.message}`));
      }
    });
  });
};