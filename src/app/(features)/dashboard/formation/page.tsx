'use client'
import React, { useState, useEffect } from "react";
import { 
  BookOpen,
  Plus,
  Edit3,
  Eye,
  Trash2,
  Filter,
  Download,
  Search,
  Clock,
  Users,
  GraduationCap,
  ChevronDown,
  MoreVertical,
  Loader2
} from "lucide-react";

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

interface ApiResponse {
  data: Formation[];
  total: number;
  last_page: number;
  current_page: number;
}

// Import du service
import { getFormations } from "../_services/formation.service";

// Import du composant Input
type InputProps = {
  label?: string;
  placeholder?: string;
  width?: string;
  leftIcon?: React.ComponentType<{ className?: string }>;
  rightIcon?: React.ComponentType<{ className?: string }>;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

function Input({ 
  label, 
  placeholder, 
  width = "w-full",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onLeftIconClick,
  onRightIconClick,
  value,
  onChange,
  type = "text"
}: InputProps) {
  return (
    <div className={`flex flex-col gap-2 ${width}`}>
      {label && (
        <label className="font-poppins text-base text-gray-600">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Left Icon */}
        {LeftIcon && (
          <div 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-10 ${
              onLeftIconClick ? 'cursor-pointer text-gray-400 hover:text-forest-600 transition-smooth' : 'text-gray-400'
            }`}
            onClick={onLeftIconClick}
          >
            <LeftIcon className="w-5 h-5" />
          </div>
        )}
        
        {/* Input */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder || "Enter text"}
          className={`h-[50px] px-4 py-2 rounded-xl 
                     font-poppins font-medium text-base
                     border border-gray-300 bg-gray-50
                     focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500
                     text-gray-700 placeholder-gray-400
                     transition-smooth
                     hover:bg-gray-100 hover:border-gray-400 w-full
                     ${LeftIcon ? 'pl-11' : 'pl-4'}
                     ${RightIcon ? 'pr-11' : 'pr-4'}`}
        />
        
        {/* Right Icon */}
        {RightIcon && (
          <div 
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 z-10 ${
              onRightIconClick ? 'cursor-pointer text-gray-400 hover:text-forest-600 transition-smooth' : 'text-gray-400'
            }`}
            onClick={onRightIconClick}
          >
            <RightIcon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function FormationsList() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

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
    setPage(1); // reset page quand on recherche
    setSearchTerm(e.target.value);
  };

  const handlePreviousPage = () => {
    setPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage(prev => Math.min(lastPage, prev + 1));
  };

  // Calcul des statistiques
  const stats = {
    total: total,
    active: formations.filter(f => f.is_active).length,
    suspended: formations.filter(f => !f.is_active).length,
    totalStudents: formations.reduce((sum, f) => sum + (f.students_count || 0), 0)
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-poppins font-semibold text-gray-900">
                Formations
              </h1>
              <p className="text-sm font-poppins text-gray-600 mt-1">
                Université de Lomé - Catalogue des formations
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-smooth">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Formation
              </button>
              {/* <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </button>
              <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-forest-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-poppins font-medium text-gray-600">Total Formations</p>
                <p className="text-2xl font-poppins font-light text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
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
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une formation..."
                leftIcon={Search}
                value={searchTerm}
                onChange={handleSearchChange}
                width="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm font-poppins text-gray-500">
                {loading ? "Recherche..." : `${total} formation${total > 1 ? 's' : ''} trouvée${total > 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
        </div>

        {/* Formations List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
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
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Formation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Étudiants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
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
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="text-gray-500 font-poppins">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Aucune formation trouvée</p>
                        <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  formations.map((formation) => (
                    <tr key={formation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center">
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
                          formation.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {formation.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-smooth">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-smooth">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-smooth">
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
              <>
                Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{lastPage}</span> — Total : <span className="font-medium">{total}</span> formation{total > 1 ? 's' : ''}
              </>
            ) : (
              "Aucun résultat"
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePreviousPage}
              disabled={loading || page === 1}
              className="px-3 py-2 text-sm font-poppins font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button className="px-3 py-2 text-sm font-poppins font-medium text-white bg-forest-600 border border-transparent rounded-md">
              {currentPage}
            </button>
            <button 
              onClick={handleNextPage}
              disabled={loading || page >= lastPage}
              className="px-3 py-2 text-sm font-poppins font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}