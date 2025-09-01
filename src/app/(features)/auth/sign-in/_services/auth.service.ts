import api from "@/lib/server/interceptor/axios";

export interface LoginPayload {
  email: string;
  password: string;
  institution_id?: number;
}

export async function loginAdmin(payload: LoginPayload) {
  try {
    const res = await api.post("/admin/login", payload);
    const data = res.data;

    // 🔐 Stockage du token
    localStorage.setItem("token", data.token);

    // 💾 Stockage complet des infos admin et institution
    localStorage.setItem(
      "admin_data",
      JSON.stringify({
        user: data.user,
        admin: data.admin,
        institution: data.institution
      })
    );

    return {
      user: data.user,
      admin: data.admin,
      institution: data.institution,
      token: data.token
    };
  } catch (err: any) {
    return { error: err.response?.data?.message || "Erreur connexion" };
  }
}

/**
 * Déconnexion de l’admin
 */
export async function logoutAdmin() {
  try {
    await api.post(
      "/admin/logout",
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (err) {
    console.error("Erreur lors de la déconnexion:", err);
  } finally {
    // 🔒 Suppression des infos locales
    localStorage.removeItem("token");
    localStorage.removeItem("admin_data");

    // 🔄 Redirection vers la page de connexion
    window.location.href = "/auth/sign-in";
  }
}
