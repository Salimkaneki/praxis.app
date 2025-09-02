'use client';
import React, { useState, useEffect, useMemo } from "react";
import { 
  BookOpen,
  Plus,
  Edit3,
  Eye,
  Trash2,
  Users,
  MoreVertical,
  Loader2,
  Search
} from "lucide-react";
import { getFormations, deleteFormation } from "./_services/formation.service";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Inputs/Input";

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
  const [formations, setFormations] = useState<Formation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getFormations(page, searchTerm);
        setFormations(response.data);
        setTotal(response.total);
        setLastPage(response.last_page);
        setCurrentPage(response.current_page);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearchTerm(e.target.value);
  };

  const handlePreviousPage = () => setPage(prev => Math.max(1, prev - 1));
  const handleNextPage = () => setPage(prev => Math.min(lastPage, prev + 1));

  // Calcul des stats optimisé avec useMemo
  const stats = useMemo(() => ({
    total,
    active: formations.filter(f => f.is_active).length,
    suspended: formations.filter(f => !f.is_active).length,
    totalStudents: formations.reduce((sum, f) => sum + (f.students_count || 0), 0)
  }), [formations, total]);

    const handleDelete = async (id: number) => {
    const confirm = window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?");
    if (!confirm) return;

    try {
      setLoading(true);
      await deleteFormation(id);
      // Après suppression, rafraîchir la liste
      const response = await getFormations(page, searchTerm);
      setFormations(response.data);
      setTotal(response.total);
      setLastPage(response.last_page);
      setCurrentPage(response.current_page);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-poppins font-semibold text-gray-900">
              Formations
            </h1>
            <p className="text-sm font-poppins text-gray-600 mt-1">
              Université de Lomé - Catalogue des formations
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/formation/create")}
            className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-smooth"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Formation
          </button>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-forest-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-poppins font-medium text-gray-600">Total Formations</p>
              <p className="text-2xl font-poppins font-light text-gray-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-poppins font-medium text-gray-600">Total Étudiants</p>
              <p className="text-2xl font-poppins font-light text-gray-900">
                {loading ? "..." : stats.totalStudents.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Input
            placeholder="Rechercher une formation..."
            leftIcon={Search}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="text-sm font-poppins text-gray-500">
            {loading ? "Recherche..." : `${total} formation${total > 1 ? 's' : ''} trouvée${total > 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Liste des Formations */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-poppins font-medium text-gray-900">
              Liste des Formations
            </h2>
            {loading && (
              <div className="flex items-center text-sm text-gray-500">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Chargement...
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Formation", "Code", "Durée", "Étudiants", "Statut", "Actions"].map((col) => (
                    <th key={col} className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 mr-3 animate-spin text-forest-600" />
                        <span className="text-gray-600 font-poppins">Chargement des formations...</span>
                      </div>
                    </td>
                  </tr>
                ) : formations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 font-poppins">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Aucune formation trouvée</p>
                      <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                    </td>
                  </tr>
                ) : (
                  formations.map((formation) => (
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
                      <td className="px-6 py-4 text-sm font-poppins text-gray-900">
                        {formation.students_count ? (
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1 text-gray-400" />
                            {formation.students_count}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-medium ${
                          formation.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {formation.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {/* <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-smooth">
                            <Eye className="w-4 h-4" />
                          </button> */}
                          <button
                            className="p-2 text-gray-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-smooth"
                            onClick={() => router.push(`/dashboard/formation/edit/${formation.id}`)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-smooth"
                            onClick={() => handleDelete(formation.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-smooth">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm font-poppins text-gray-700">
            {loading ? (
              "Chargement..."
            ) : total > 0 ? (
              <>Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{lastPage}</span> — Total : <span className="font-medium">{total}</span> formation{total > 1 ? 's' : ''}</>
            ) : (
              "Aucun résultat"
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePreviousPage}
              disabled={loading || page === 1}
              className="px-3 py-2 text-sm font-poppins font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Précédent
            </button>
            <button className="px-3 py-2 text-sm font-poppins font-medium text-white bg-forest-600 rounded-md">
              {currentPage}
            </button>
            <button 
              onClick={handleNextPage}
              disabled={loading || page >= lastPage}
              className="px-3 py-2 text-sm font-poppins font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
