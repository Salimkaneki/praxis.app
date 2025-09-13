import api from "@/lib/server/interceptor/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

// Fonction pour l'admin (existante)
export async function loginAdmin(payload: LoginPayload) {
  try {
    const res = await api.post("/admin/login", payload);
    const data = res.data;

    return {
      user: data.user,
      token: data.token,
    };
  } catch (err: any) {
    console.error("Erreur loginAdmin:", err.response?.data || err.message);
    return { 
      error: err.response?.data?.message || "Erreur de connexion" 
    };
  }
}

// Fonction pour l'enseignant (nouvelle)
export async function loginTeacher(payload: LoginPayload) {
  try {
    const res = await api.post("/teacher/login", payload);
    const data = res.data;

    return {
      user: data.user,
      teacher: data.user.teacher,
      token: data.token,
    };
  } catch (err: any) {
    console.error("Erreur loginTeacher:", err.response?.data || err.message);
    return { 
      error: err.response?.data?.message || "Erreur de connexion" 
    };
  }
}

/**
 * Déconnexion du teacher
 */
// Dans auth.service.ts
export async function logoutTeacher() {
  try {
    const token = localStorage.getItem("teacher_token");
    if (token) {
      await api.post("/teacher/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (err) {
    console.error("Erreur lors de la déconnexion:", err);
  } finally {
    // Suppression des infos locales
    localStorage.removeItem("teacher_token");
    localStorage.removeItem("teacher_data");

    // CORRECTION: Redirection vers le bon chemin
    window.location.href = "/auth/sign-in/teacher";
  }
}

/**
 * Déconnexion de l'admin
 */
export async function logoutAdmin() {
  try {
    const token = localStorage.getItem("admin_token");
    if (token) {
      await api.post("/admin/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (err) {
    console.error("Erreur lors de la déconnexion:", err);
  } finally {
    // Suppression des infos locales
    localStorage.removeItem("admin_token");

    // Redirection vers la page de connexion
    window.location.href = "/auth/sign-in";
  }
}