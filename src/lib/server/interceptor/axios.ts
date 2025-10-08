import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 secondes timeout
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  // Déterminer quel token utiliser en fonction de l'URL
  let token = null;

  if (config.url?.includes('/teacher/')) {
    token = localStorage.getItem("teacher_token");
  } else if (config.url?.includes('/admin/')) {
    token = localStorage.getItem("admin_token");
  } else if (config.url?.includes('/student/')) {
    token = localStorage.getItem("student_token");
  } else {
    // Fallback pour les autres routes
    token = localStorage.getItem("teacher_token") ||
            localStorage.getItem("admin_token") ||
            localStorage.getItem("student_token");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
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