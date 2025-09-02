'use client'
import React, { useState, useEffect } from "react";
import { Home, Search, Plus, Filter, MoreHorizontal, Edit3, Trash2, Eye, MoreVertical } from "lucide-react";
import ClasseService, { Classe, PaginatedResponse } from "./_services/classe.service";
import { useRouter } from "next/navigation";


export default function ClassroomsPage() {
  const router = useRouter();


  const [searchTerm, setSearchTerm] = useState<string>("");
  const [classrooms, setClassrooms] = useState<Classe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  // Statistiques calculées
  const stats = {
    total: classrooms.length,
    available: classrooms.filter(r => r.is_active).length,
    occupied: classrooms.filter(r => !r.is_active).length,
    get occupancyRate() { return ((this.occupied / this.total) * 100 || 0).toFixed(1); }
  };

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

  const StatCard = ({ title, value, subtitle, icon: Icon, dotColor }: any) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-poppins font-medium text-gray-600">{title}</h3>
        {Icon ? <Icon className="w-5 h-5 text-gray-400" /> :
          dotColor && <div className={`w-3 h-3 ${dotColor} rounded-full`}></div>}
      </div>
      <div className="text-3xl font-poppins font-light text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500 font-poppins">{subtitle}</div>
    </div>
  );

  // Navigation vers la page de création
  const handleCreateClass = () => {
      router.push("/dashboard/formation/classe/create");
  };

  // Dans ton composant ClassroomsPage
  const handleDeleteClass = async (id: number) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette classe ?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await ClasseService.deleteClasse(id);
      // Recharger la liste après suppression
      await fetchClasses();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la suppression de la classe.");
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
            <h1 className="text-2xl font-poppins font-semibold text-gray-900">Salles de Classes</h1>
            <p className="text-sm font-poppins text-gray-600 mt-1">Gestion et suivi des espaces d'enseignement</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une salle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors font-poppins text-sm"
              />
            </div>
            <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />Filtrer
            </button>
            <button 
              onClick={handleCreateClass}
              className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-smooth"
            >
              <Plus className="w-4 h-4 mr-2" />Nouvelle Classe
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Classes" value={stats.total} subtitle="Espaces d'enseignement" icon={Home} />
          <StatCard title="Disponibles" value={stats.available} subtitle="Prêtes à utiliser" dotColor="bg-green-400" />
          <StatCard title="Inactives" value={stats.occupied} subtitle="En cours d'utilisation" dotColor="bg-red-400" />
          <StatCard title="Taux d'Occupation" value={`${stats.occupancyRate}%`} subtitle="En temps réel" icon={MoreHorizontal} />
        </div>

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
                            onClick={() => handleDeleteClass(room.id)}
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
    </div>
  );
}