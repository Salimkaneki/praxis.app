export interface LoginPayload {
  email: string;
  password: string;
}

// TODO: Implémenter l'appel API plus tard
export async function loginStudent(payload: LoginPayload) {
  // Simulation temporaire
  console.log("loginStudent appelé avec:", payload);

  // Retour simulé pour le développement
  return {
    user: {
      id: 1,
      email: payload.email,
      account_type: "student"
    },
    student: {
      id: 1,
      name: "Étudiant Test"
    },
    token: "fake_student_token"
  };
}

/**
 * Déconnexion de l'étudiant
 */
export async function logoutStudent() {
  try {
    // TODO: Implémenter l'appel API de déconnexion
    console.log("logoutStudent appelé");

    // Suppression des infos locales
    localStorage.removeItem("student_token");
    localStorage.removeItem("student_data");

    // Redirection vers la page de connexion étudiant
    window.location.href = "/auth/sign-in/student";
  } catch (err) {
    console.error("Erreur lors de la déconnexion:", err);
  }
}