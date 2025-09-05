'use client';

import api from "@/lib/server/interceptor/axios";

/**
 * 📌 Interface pour une matière (version complète)
 */
export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
  credits: number;
  coefficient: number;
  type: string;        // ex: "cours", "tp", "projet", "stage", "examen"
  formation_id: number;
  semester: number;    // ex: 1, 2, 3, 4, 5, 6
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 📌 Interface pour la création/modification d'une matière
 */
export interface SubjectFormData {
  name: string;
  code: string;
  description?: string;
  credits: number;
  coefficient: number;
  type: string;
  formation_id: number;
  semester: number;
  is_active: boolean;
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
 * 📌 Récupération des matières avec pagination et recherche
 */
export async function getSubjects(page: number = 1, search?: string) {
  try {
    const res = await api.get<PaginatedResponse<Subject>>("/admin/subjects", {
      params: { page, search }
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors du chargement des matières");
  }
}

/**
 * 📌 Récupération d'une matière spécifique
 */
export async function getSubject(id: number): Promise<Subject> {
  try {
    // Validation de l'ID
    if (isNaN(id) || id <= 0) {
      throw new Error("ID de matière invalide");
    }
    
    const res = await api.get<Subject>(`/admin/subjects/${id}`);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors du chargement de la matière");
  }
}

/**
 * 📌 Création d'une nouvelle matière
 */
export async function createSubject(data: SubjectFormData): Promise<Subject> {
  try {
    const res = await api.post<Subject>("/admin/subjects", data);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors de la création de la matière");
  }
}

/**
 * 📌 Mise à jour d'une matière
 */
export async function updateSubject(id: number, data: Partial<SubjectFormData>): Promise<Subject> {
  try {
    // Validation de l'ID
    if (isNaN(id) || id <= 0) {
      throw new Error("ID de matière invalide");
    }
    
    const res = await api.put<Subject>(`/admin/subjects/${id}`, data);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors de la mise à jour de la matière");
  }
}

/**
 * 📌 Suppression d'une matière
 */
export async function deleteSubject(id: number): Promise<void> {
  try {
    // Validation de l'ID
    if (isNaN(id) || id <= 0) {
      throw new Error("ID de matière invalide");
    }
    
    await api.delete(`/admin/subjects/${id}`);
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors de la suppression de la matière");
  }
}

/**
 * 📌 Activation/Désactivation d'une matière
 */
export async function toggleSubjectStatus(id: number, is_active: boolean): Promise<Subject> {
  try {
    // Validation de l'ID
    if (isNaN(id) || id <= 0) {
      throw new Error("ID de matière invalide");
    }
    
    const res = await api.patch<Subject>(`/admin/subjects/${id}/status`, { is_active });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors du changement de statut");
  }
}