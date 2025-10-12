'use client'
import React, { useState, useEffect } from "react";
import { Search, Plus, Filter, Edit3, Trash2, Eye, MoreVertical } from "lucide-react";
import ClasseService, { Classe, PaginatedResponse } from "./_services/classe.service";
import { useRouter } from "next/navigation";
import TeacherPageHeader from "@/components/ui/Headers/page-header";
import KPIGrid from "@/components/ui/Cards/kpi-grid";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";
import { useCrud } from "@/hooks/useCrud";


export default function ClassroomsPage() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [classrooms, setClassrooms] = useState<Classe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  // Hook pour la gestion CRUD avec confirmation et toasts
  const {
    loading: crudLoading,
    showDeleteDialog,
    itemToDelete,
    handleDelete: handleDeleteRequest,
    confirmDelete,
    cancelDelete
  } = useCrud<Classe>({
    successMessage: "Classe supprimée avec succès",
    errorMessage: "Erreur lors de la suppression de la classe"
  });

  // Statistiques calculées
  const stats = {
    total: classrooms.length,
    available: classrooms.filter(r => r.is_active).length,
    occupied: classrooms.filter(r => !r.is_active).length,
    get occupancyRate() { return ((this.occupied / this.total) * 100 || 0).toFixed(1); }
  };

  const kpis = [
    {
      label: "Classes",
      value: stats.total,
      trend: "positive" as const,
      period: "ce mois"
    },
    {
      label: "Disponibles",
      value: stats.available,
      trend: "positive" as const,
      period: "ce mois"
    },
    {
      label: "Inactives",
      value: stats.occupied,
      trend: "negative" as const,
      period: "ce mois"
    },
    {
      label: "Taux d'Occupation",
      value: `${stats.occupancyRate}%`,
      trend: "negative" as const,
      period: "ce mois"
    }
  ];

  const statusConfig = {
    available: { bg: 'bg-green-100 text-green-800', text: 'Disponible', dot: 'bg-green-400' },
    occupied: { bg: 'bg-red-100 text-red-800', text: 'Inactive', dot: 'bg-red-400' },
    maintenance: { bg: 'bg-orange-100 text-orange-800', text: 'Maintenance', dot: 'bg-orange-400' }
  };

  // Fonction pour récupérer les classes depuis l'API
  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: PaginatedResponse<Classe> = await ClasseService.getClasses(searchTerm, currentPage);
      setClassrooms(data.data);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
      setTotal(data.total);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la récupération des classes.");
    } finally {
      setLoading(false);
    }
  };

  // Recharger les classes à chaque changement de recherche ou de page
  useEffect(() => {
    fetchClasses();
  }, [searchTerm, currentPage]);

  // Pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < lastPage) setCurrentPage(prev => prev + 1);
  };

  // Filtrage local pour la recherche (optionnel si API filtre déjà)
  const filteredClassrooms = classrooms.filter(room =>
    [room.name, room.formation?.name].some(field =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Navigation vers la page de création
  const handleCreateClass = () => {
      router.push("/dashboard/formation/classe/create");
  };

  // Dans ton composant ClassroomsPage
  const handleDeleteClass = (classe: Classe) => {
    handleDeleteRequest(classe, ClasseService.deleteClasse, `Voulez-vous vraiment supprimer la classe "${classe.name}" ?`);
  };

  const handleConfirmDelete = async () => {
    const success = await confirmDelete(ClasseService.deleteClasse);
    if (success) {
      // Recharger la liste après suppression
      await fetchClasses();
    }
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Header avec le composant réutilisable */}
      <TeacherPageHeader
        title="Salles de Classes"
        subtitle="Gestion et suivi des espaces d'enseignement"
        actionButton={{
          label: "Nouvelle Classe",
          onClick: handleCreateClass
        }}
      />

      <div className="px-8 py-8">
        {/* Barre de recherche et filtres */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher une salle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors font-poppins text-sm"
                />
              </div>
            </div>
            <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />Filtrer
            </button>
          </div>
        </div>

        {/* Stats avec le composant KPIGrid */}
        <KPIGrid kpis={kpis} />

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-poppins font-semibold text-gray-900">Liste des Classes</h2>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Chargement des classes...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Classe', 'Formation', 'Année', 'Statut', 'Actions'].map((header, i) => (
                      <th key={i} className={`px-6 py-3 text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider ${i === 4 ? 'text-right' : 'text-left'}`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClassrooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-sm font-poppins font-medium text-gray-900">{room.name}</td>
                      <td className="px-6 py-3 text-sm font-poppins text-gray-600">{room.formation?.name}</td>
                      <td className="px-6 py-3 text-sm font-poppins text-gray-600">{room.academic_year}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-poppins font-medium rounded-full ${room.is_active ? statusConfig.available.bg : statusConfig.occupied.bg}`}>
                          {room.is_active ? statusConfig.available.text : statusConfig.occupied.text}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end space-x-1">
                          {/* <button 
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-smooth"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button> */}
                          <button 
                            className="p-2 text-gray-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-smooth"
                            title="Modifier"
                            onClick={() => router.push(`/dashboard/formation/classe/edit/${room.id}`)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button 
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-smooth"
                            title="Supprimer"
                            onClick={() => handleDeleteClass(room)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button 
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-smooth"
                            title="Plus d'options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
              disabled={loading || currentPage === 1}
              className="px-3 py-2 text-sm font-poppins font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Précédent
            </button>

            <button
              className="w-8 h-8 flex items-center justify-center text-sm font-poppins font-medium text-white bg-forest-600 rounded-md"
            >
              {currentPage}
            </button>

            <button
              onClick={handleNextPage}
              disabled={loading || currentPage >= lastPage}
              className="px-3 py-2 text-sm font-poppins font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title="Confirmer la suppression"
        message={`Voulez-vous vraiment supprimer la classe "${itemToDelete?.name}" ? Cette action est irréversible.`}
        onConfirm={handleConfirmDelete}
        onCancel={cancelDelete}
        isLoading={crudLoading}
      />
    </div>
  );
}