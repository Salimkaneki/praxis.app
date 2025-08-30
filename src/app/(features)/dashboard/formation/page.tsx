'use client'
import React, { useState } from "react";
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
  MoreVertical
} from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const formations = [
    {
      id: 1,
      title: "Licence en Informatique",
      category: "Informatique",
      level: "Licence",
      duration: "3 ans",
      students: 245,
      status: "Actif",
      startDate: "2024-09-15",
      description: "Formation complète en développement logiciel et systèmes d'information"
    },
    {
      id: 2,
      title: "Master en Génie Civil",
      category: "Ingénierie",
      level: "Master",
      duration: "2 ans",
      students: 87,
      status: "Actif",
      startDate: "2024-10-01",
      description: "Spécialisation en construction et infrastructure"
    },
    {
      id: 3,
      title: "Doctorat en Médecine",
      category: "Médecine",
      level: "Doctorat",
      duration: "6 ans",
      students: 156,
      status: "Actif",
      startDate: "2024-09-01",
      description: "Formation médicale complète avec stages hospitaliers"
    },
    {
      id: 4,
      title: "Licence en Économie",
      category: "Sciences Économiques",
      level: "Licence",
      duration: "3 ans",
      students: 312,
      status: "Actif",
      startDate: "2024-09-20",
      description: "Fondamentaux de l'économie et de la gestion"
    },
    {
      id: 5,
      title: "Master en Droit des Affaires",
      category: "Droit",
      level: "Master",
      duration: "2 ans",
      students: 98,
      status: "Suspendu",
      startDate: "2024-11-15",
      description: "Spécialisation en droit commercial et des sociétés"
    },
    {
      id: 6,
      title: "Licence en Lettres Modernes",
      category: "Lettres",
      level: "Licence",
      duration: "3 ans",
      students: 189,
      status: "Actif",
      startDate: "2024-09-10",
      description: "Étude de la littérature française et francophone"
    }
  ];

  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "Informatique", label: "Informatique" },
    { value: "Ingénierie", label: "Ingénierie" },
    { value: "Médecine", label: "Médecine" },
    { value: "Sciences Économiques", label: "Sciences Économiques" },
    { value: "Droit", label: "Droit" },
    { value: "Lettres", label: "Lettres" }
  ];

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || formation.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: formations.length,
    active: formations.filter(f => f.status === "Actif").length,
    suspended: formations.filter(f => f.status === "Suspendu").length,
    totalStudents: formations.reduce((sum, f) => sum + f.students, 0)
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
              <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </button>
              <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
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
                <p className="text-2xl font-poppins font-light text-gray-900">{stats.totalStudents.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une formation..."
                leftIcon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                width="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 font-poppins text-sm focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              
              <div className="text-sm font-poppins text-gray-500">
                {filteredFormations.length} formation{filteredFormations.length > 1 ? 's' : ''} trouvée{filteredFormations.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Formations List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-poppins font-medium text-gray-900">
              Liste des Formations
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Formation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Durée
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
                {filteredFormations.map((formation) => (
                  <tr key={formation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-forest-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-poppins font-medium text-gray-900">
                            {formation.title}
                          </div>
                          <div className="text-sm font-poppins text-gray-500 max-w-xs truncate">
                            {formation.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-medium bg-gray-100 text-gray-800">
                        {formation.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-poppins text-gray-900">
                      {formation.level}
                    </td>
                    <td className="px-6 py-4 text-sm font-poppins text-gray-900">
                      {formation.duration}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-medium ${
                        formation.status === 'Actif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {formation.status}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm font-poppins text-gray-700">
            Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredFormations.length}</span> sur{' '}
            <span className="font-medium">{filteredFormations.length}</span> résultats
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm font-poppins font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
              Précédent
            </button>
            <button className="px-3 py-2 text-sm font-poppins font-medium text-white bg-forest-600 border border-transparent rounded-md">
              1
            </button>
            <button className="px-3 py-2 text-sm font-poppins font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}