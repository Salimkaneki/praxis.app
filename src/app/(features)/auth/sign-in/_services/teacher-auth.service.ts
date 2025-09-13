import api from "@/lib/server/interceptor/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginTeacher(payload: LoginPayload) {
  try {
    const res = await api.post("/teacher/login", payload);
    const data = res.data;

    // ✅ Ne pas stocker ici - le composant s'en charge
    // Juste retourner les données dans le bon format

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
    // 🔒 Suppression des infos locales
    localStorage.removeItem("teacher_token");
    localStorage.removeItem("teacher_data");

    // 🔄 Redirection vers la page de connexion
    window.location.href = "/auth/sign-in";
  }
}