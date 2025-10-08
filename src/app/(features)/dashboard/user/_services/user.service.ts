'use client';

import api from "@/lib/server/interceptor/axios";

/**
 * 📌 Types de comptes utilisateur
 */
export type AccountType = 'admin' | 'teacher' | 'student';

/**
 * 📌 Interface pour un utilisateur (version complète)
 */
export interface User {
  id: number;
  name: string;
  email: string;
  account_type: AccountType;
  created_at: string;
  updated_at: string;
}

/**
 * 📌 Interface pour la création/modification d'un utilisateur
 */
export interface UserFormData {
  name: string;
  email: string;
  password: string;
  account_type: AccountType;
}

/**
 * 📌 Interface pour la mise à jour d'un utilisateur (mot de passe optionnel)
 */
export interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
  account_type?: AccountType;
}

/**
 * 📌 Interface de pagination générique
 */
export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  total: number;
  per_page: number;
  last_page: number;
}

/**
 * 📌 Récupération des utilisateurs avec pagination, recherche et filtrage par type
 */
export async function getUsers(
  page: number = 1,
  search?: string,
  accountType?: AccountType
): Promise<PaginatedResponse<User>> {
  try {
    const params: any = { page };
    if (search) params.search = search;
    if (accountType) params.account_type = accountType;

    const res = await api.get<PaginatedResponse<User>>("/users", { params });
    return res.data;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message ||
                        (err.response?.status === 401 ? "Accès non autorisé. Veuillez vous reconnecter." :
                         err.response?.status === 403 ? "Accès interdit." :
                         err.response?.status === 404 ? "Endpoint non trouvé." :
                         err.response?.status >= 500 ? "Erreur serveur. Réessayez plus tard." :
                         err.code === 'ECONNREFUSED' ? "Serveur indisponible. Vérifiez que le backend est démarré." :
                         err.code === 'ENOTFOUND' ? "Impossible de contacter le serveur." :
                         "Erreur lors du chargement des utilisateurs");

    throw new Error(errorMessage);
  }
}

/**
 * 📌 Récupération d'un utilisateur spécifique
 */
export async function getUser(id: number): Promise<User> {
  try {
    // Validation de l'ID
    if (isNaN(id) || id <= 0) {
      throw new Error("ID d'utilisateur invalide");
    }

    const res = await api.get<User>(`/users/${id}`);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors du chargement de l'utilisateur");
  }
}

/**
 * 📌 Création d'un nouvel utilisateur
 */
export async function createUser(data: UserFormData): Promise<User> {
  try {
    // Validation côté client
    if (!data.name?.trim()) {
      throw new Error("Le nom est obligatoire");
    }
    if (!data.email?.trim()) {
      throw new Error("L'email est obligatoire");
    }
    if (!data.password?.trim()) {
      throw new Error("Le mot de passe est obligatoire");
    }
    if (data.password.length < 8) {
      throw new Error("Le mot de passe doit contenir au moins 8 caractères");
    }
    if (!['admin', 'teacher', 'student'].includes(data.account_type)) {
      throw new Error("Type de compte invalide");
    }

    const res = await api.post<User>("/users", data);
    return res.data;
  } catch (err: any) {
    // Si c'est une erreur de validation côté client, la relancer
    if (err.message && !err.response) {
      throw err;
    }

    // Gestion des erreurs API
    const errorMessage = err.response?.data?.message ||
                        err.response?.data?.error ||
                        (err.response?.status === 422 ? "Données invalides. Vérifiez les champs du formulaire." :
                         err.response?.status === 409 ? "Cet email est déjà utilisé." :
                         "Erreur lors de la création de l'utilisateur");

    throw new Error(errorMessage);
  }
}

/**
 * 📌 Mise à jour d'un utilisateur
 */
export async function updateUser(id: number, data: UserUpdateData): Promise<User> {
  try {
    // Validation de l'ID
    if (isNaN(id) || id <= 0) {
      throw new Error("ID d'utilisateur invalide");
    }

    // Validation côté client
    if (data.password && data.password.length < 8) {
      throw new Error("Le mot de passe doit contenir au moins 8 caractères");
    }
    if (data.account_type && !['admin', 'teacher', 'student'].includes(data.account_type)) {
      throw new Error("Type de compte invalide");
    }

    const res = await api.put<User>(`/users/${id}`, data);
    return res.data;
  } catch (err: any) {
    // Si c'est une erreur de validation côté client, la relancer
    if (err.message && !err.response) {
      throw err;
    }

    throw new Error(err.response?.data?.message || "Erreur lors de la mise à jour de l'utilisateur");
  }
}

/**
 * 📌 Suppression d'un utilisateur
 */
export async function deleteUser(id: number): Promise<void> {
  try {
    // Validation de l'ID
    if (isNaN(id) || id <= 0) {
      throw new Error("ID d'utilisateur invalide");
    }

    await api.delete(`/users/${id}`);
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors de la suppression de l'utilisateur");
  }
}

/**
 * 📌 Récupération des utilisateurs par type de compte
 */
export async function getUsersByAccountType(
  accountType: AccountType,
  page: number = 1
): Promise<PaginatedResponse<User>> {
  try {
    if (!['admin', 'teacher', 'student'].includes(accountType)) {
      throw new Error("Type de compte invalide");
    }

    const res = await api.get<PaginatedResponse<User>>(`/users/by-account-type/${accountType}`, {
      params: { page }
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors du chargement des utilisateurs");
  }
}
