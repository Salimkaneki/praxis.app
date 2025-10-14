import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://praxis-api.bestwebapp.tech/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, // Augmenté à 30 secondes
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  // Déterminer quel token utiliser en fonction de l'URL
  let token = null;
  let tokenType = 'none';

  if (config.url?.includes('/teacher/')) {
    token = localStorage.getItem("teacher_token");
    tokenType = 'teacher_token';
  } else if (config.url?.includes('/admin/')) {
    token = localStorage.getItem("admin_token");
    tokenType = 'admin_token';
  } else if (config.url?.includes('/student/')) {
    token = localStorage.getItem("student_token");
    tokenType = 'student_token';
  } else {
    // Fallback pour les autres routes
    token = localStorage.getItem("teacher_token") ||
            localStorage.getItem("admin_token") ||
            localStorage.getItem("student_token");
    tokenType = token === localStorage.getItem("teacher_token") ? 'teacher_token_fallback' :
                token === localStorage.getItem("admin_token") ? 'admin_token_fallback' :
                token === localStorage.getItem("student_token") ? 'student_token_fallback' : 'none';
  }

  console.log(`🔑 [AXIOS] ${config.method?.toUpperCase()} ${config.url} - Token: ${tokenType} (${token ? 'présent' : 'absent'})`);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      // Ne pas logger les erreurs 403 pour les vérifications de participation aux sessions
      // car c'est un comportement normal (étudiant n'a pas rejoint la session)
      const isSessionJoinCheck = error.config?.url?.includes('/student/sessions/') && 
                                error.config?.method === 'get' && 
                                error.response?.status === 403;
      
      if (!isSessionJoinCheck) {
        console.error(`❌ [AXIOS ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url} - Status: ${error.response?.status}`, error.response?.data);
      }

      if (error.response?.status === 401) {
        console.warn('🚨 [AXIOS] Erreur 401 détectée, redirection en cours...');

        // Déconnexion en fonction du type de token
        if (window.location.pathname.includes('/teacher')) {
          localStorage.removeItem("teacher_token");
          localStorage.removeItem("teacher_data");
          window.location.href = "/auth/sign-in/teacher";
        } else if (window.location.pathname.includes('/admin') ||
                   window.location.pathname.includes('/dashboard')) {
          localStorage.removeItem("admin_token");
          window.location.href = "/auth/sign-in";
        } else if (window.location.pathname.includes('/student')) {
          localStorage.removeItem("student_token");
          localStorage.removeItem("student_data");
          window.location.href = "/auth/sign-in/student";
        } else {
          localStorage.removeItem("token");
          window.location.href = "/error-page?code=401";
        }
      }
    }
    return Promise.reject(error);
  }
);export default api;