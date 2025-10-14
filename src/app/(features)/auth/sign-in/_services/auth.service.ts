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

    // Gestion spécifique des erreurs
    if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
      return {
        error: "Erreur de connexion réseau. Vérifiez votre connexion internet."
      };
    }

    if (err.response?.status === 0) {
      return {
        error: "Impossible de contacter le serveur. Vérifiez l'URL du backend."
      };
    }

    if (err.response?.status === 401) {
      return {
        error: "Identifiants invalides. Vérifiez votre email et mot de passe."
      };
    }

    if (err.response?.status === 403) {
      return {
        error: "Accès refusé. Vous n'avez pas les permissions nécessaires."
      };
    }

    if (err.response?.status >= 500) {
      return {
        error: "Erreur serveur. Réessayez dans quelques instants."
      };
    }

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

    // Stocker le token dans localStorage et cookies
    if (data.token) {
      localStorage.setItem("teacher_token", data.token);
      localStorage.setItem("teacher_data", JSON.stringify(data.user.teacher));
      document.cookie = `teacher_token=${data.token}; path=/; max-age=86400; samesite=strict`;
    }

    return {
      user: data.user,
      teacher: data.user.teacher,
      token: data.token,
    };
  } catch (err: any) {
    console.error("Erreur loginTeacher:", err.response?.data || err.message);

    // Gestion spécifique des erreurs
    if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
      return {
        error: "Erreur de connexion réseau. Vérifiez votre connexion internet."
      };
    }

    if (err.response?.status === 0) {
      return {
        error: "Impossible de contacter le serveur. Vérifiez l'URL du backend."
      };
    }

    if (err.response?.status === 401) {
      return {
        error: "Identifiants invalides. Vérifiez votre email et mot de passe."
      };
    }

    if (err.response?.status === 403) {
      return {
        error: "Accès refusé. Vous n'avez pas les permissions nécessaires."
      };
    }

    if (err.response?.status >= 500) {
      return {
        error: "Erreur serveur. Réessayez dans quelques instants."
      };
    }

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
    document.cookie = "teacher_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

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
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Redirection vers la page de connexion
    window.location.href = "/auth/sign-in";
  }
}