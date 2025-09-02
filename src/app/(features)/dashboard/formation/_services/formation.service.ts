'use client';

import api from "@/lib/server/interceptor/axios";

export interface Formation {
  id: number;
  name: string;
  code: string;
  description: string;
  duration_years: number;
  institution_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  total: number;
  per_page: number;
  last_page: number;
}

/**
 * 📌 Récupération des formations avec pagination et recherche
 */
export async function getFormations(page: number = 1, search?: string) {
  try {
    const res = await api.get<PaginatedResponse<Formation>>("/admin/formations", {
      params: { page, search }
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors du chargement des formations");
  }
}

/**
 * 📌 Création d'une nouvelle formation
 */
export async function createFormation(data: Partial<Formation>) {
  try {
    const res = await api.post<Formation>("/admin/formations", data);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors de la création de la formation");
  }
}

/**
 * 📌 Mise à jour d'une formation (FIXED)
 */
export async function updateFormation(id: number, data: Partial<Formation>) {
  try {
    const res = await api.put<Formation>(`/admin/formations/${id}`, data);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors de la mise à jour de la formation");
  }
}

/**
 * 📌 Suppression d'une formation
 */
export async function deleteFormation(id: number) {
  try {
    const res = await api.delete(`/admin/formations/${id}`);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors de la suppression de la formation");
  }
}

/**
 * 📌 Récupération d'une formation spécifique
 */
export async function getFormation(id: number) {
  try {
    const res = await api.get<Formation>(`/admin/formations/${id}`);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors du chargement de la formation");
  }
}