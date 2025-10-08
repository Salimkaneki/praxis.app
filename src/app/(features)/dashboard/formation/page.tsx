'use client';
import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Users,
  MoreVertical,
  Loader2,
  Search
} from "lucide-react";
import { getFormations, deleteFormation } from "./_services/formation.service";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Inputs/Input";
import KPIGrid from "@/components/ui/Cards/kpi-grid";
import TeacherPageHeader from "@/components/ui/Headers/page-header";
import DataTable from "@/components/ui/Tables/DataTable";
import Pagination from "@/components/ui/Tables/Pagination";
import TableActions from "@/components/ui/Actions/TableActions";
import Alert from "@/components/ui/Feedback/Alert";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { useCrud } from "@/hooks/useCrud";
import { usePagination } from "@/hooks/usePagination";
import { useSearch } from "@/hooks/useSearch";

// Types
interface Formation {
  id: number;
  name: string;
  code: string;
  duration_years: number;
  is_active: boolean;
  description?: string;
  category?: string;
  level?: string;
  students_count?: number;
  created_at?: string;
}

export default function FormationsList() {
  const router = useRouter();

  // Hooks personnalisés
  const { currentPage, updatePagination, nextPage, previousPage } = usePagination();
  const { query, updateQuery } = useSearch({
    onSearch: () => updatePagination({ current_page: 1, last_page: 1, total: 0 })
  });
  const { loading: crudLoading, showDeleteDialog, itemToDelete, handleDelete, confirmDelete, cancelDelete } = useCrud<Formation>({
    deleteMessage: "Êtes-vous sûr de vouloir supprimer cette formation ?",
    successMessage: "Formation supprimée avec succès !"
  });

  // États locaux
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getFormations(currentPage, query);
        setFormations(response.data);
        updatePagination({
          current_page: response.current_page,
          last_page: response.last_page,
          total: response.total
        });
        setTotal(response.total);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Erreur lors du chargement des formations");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, query, updatePagination]);

  // Statistiques calculées avec useMemo
  const stats = useMemo(() => ({
    total,
    active: formations.filter(f => f.is_active).length,
    suspended: formations.filter(f => !f.is_active).length,
    totalStudents: formations.reduce((sum, f) => sum + (f.students_count || 0), 0)
  }), [formations, total]);

  const kpis = useMemo(() => [
    {
      label: "Total Formations",
      value: stats.total,
      trend: "positive" as const,
      period: "ce mois"
    },
    {
      label: "Formations Actives",
      value: stats.active,
      trend: "positive" as const,
      period: "ce mois"
    },
    {
      label: "Formations Suspendues",
      value: stats.suspended,
      trend: "negative" as const,
      period: "ce mois"
    },
    {
      label: "Total Étudiants",
      value: stats.totalStudents,
      trend: "positive" as const,
      period: "ce mois"
    }
  ], [stats]);

  // Gestionnaire de suppression
  const onDeleteFormation = (formation: Formation) => {
    handleDelete(formation, async (id) => {
      await deleteFormation(id);
      // Recharger les données après suppression
      const response = await getFormations(currentPage, query);
      setFormations(response.data);
      updatePagination({
        current_page: response.current_page,
        last_page: response.last_page,
        total: response.total
      });
      setTotal(response.total);
    });
  };

  // Gestionnaire de confirmation de suppression
  const onConfirmDeleteFormation = async () => {
    await confirmDelete(async (id) => {
      await deleteFormation(id);
      // Recharger les données après suppression
      const response = await getFormations(currentPage, query);
      setFormations(response.data);
      updatePagination({
        current_page: response.current_page,
        last_page: response.last_page,
        total: response.total
      });
      setTotal(response.total);
    });
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Header avec le composant réutilisable */}
      <TeacherPageHeader
        title="Formations"
        subtitle="Université de Lomé - Catalogue des formations"
        actionButton={{
          label: "Nouvelle Formation",
          onClick: () => router.push("/dashboard/formation/create")
        }}
      />

      <div className="px-8 py-8">
        {/* KPIs */}
        <KPIGrid kpis={kpis} />

        {/* Message d'erreur */}
        {error && (
          <Alert
            type="error"
            message={error}
            onRetry={() => {
              const fetchData = async () => {
                setLoading(true);
                setError(null);
                try {
                  const response = await getFormations(currentPage, query);
                  setFormations(response.data);
                  updatePagination({
                    current_page: response.current_page,
                    last_page: response.last_page,
                    total: response.total
                  });
                  setTotal(response.total);
                } catch (e: any) {
                  setError(e?.response?.data?.message || "Erreur lors du chargement des formations");
                } finally {
                  setLoading(false);
                }
              };
              fetchData();
            }}
            className="mb-6"
          />
        )}

        {/* Barre de recherche */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <Input
            placeholder="Rechercher une formation..."
            leftIcon={Search}
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
          />
          <div className="text-sm font-poppins text-gray-500 mt-2">
            {loading ? "Recherche..." : `${total} formation${total > 1 ? 's' : ''} trouvée${total > 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Table des formations */}
        <DataTable
          title="Liste des Formations"
          columns={[
            { key: 'formation', label: 'Formation' },
            { key: 'code', label: 'Code' },
            { key: 'duree', label: 'Durée' },
            { key: 'statut', label: 'Statut' },
            { key: 'actions', label: 'Actions' }
          ]}
          data={formations}
          loading={loading}
          emptyMessage="Aucune formation trouvée"
          emptyIcon={<BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />}
          renderRow={(formation, index) => (
            <tr key={formation.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 flex items-center">
                <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-forest-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-poppins font-medium text-gray-900">
                    {formation.name}
                  </div>
                  {formation.description && (
                    <div className="text-sm font-poppins text-gray-500 max-w-xs truncate">
                      {formation.description}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-medium bg-gray-100 text-gray-800">
                  {formation.code}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-poppins text-gray-900">
                {formation.duration_years} {formation.duration_years > 1 ? 'ans' : 'an'}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-medium ${
                  formation.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {formation.is_active ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td className="px-6 py-4">
                <TableActions
                  onEdit={() => router.push(`/dashboard/formation/edit/${formation.id}`)}
                  onDelete={() => onDeleteFormation(formation)}
                  onMore={() => {/* Action supplémentaire */}}
                />
              </td>
            </tr>
          )}
        />

        {/* Pagination */}
        {formations.length > 0 && (
          <Pagination
            currentPage={currentPage}
            lastPage={Math.ceil(total / 10)}
            total={total}
            loading={loading}
            itemName="formation"
            onPrevious={previousPage}
            onNext={nextPage}
          />
        )}
      </div>

      {/* Dialogue de confirmation de suppression */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title="Supprimer la formation"
        message={`Êtes-vous sûr de vouloir supprimer la formation "${itemToDelete?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmButtonColor="red"
        onConfirm={onConfirmDeleteFormation}
        onCancel={cancelDelete}
        isLoading={crudLoading}
      />
    </div>
  );
}
