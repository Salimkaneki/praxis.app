'use client'
import React, { useState, useEffect, useMemo } from "react";
import { 
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Search,
  ChevronDown,
  Download,
  MoreVertical,
  Loader2,
  Award,
  Calendar,
  GraduationCap
} from "lucide-react";
import Input from "@/components/ui/Inputs/Input";

// Types simplifiés pour l'administration
interface Subject {
  id: number;
  name: string;
  code: string;
  credits: number;
  coefficient: number;
  type: string;
  semester: number;
  formation_id: number;
  is_active: boolean;
  description?: string;
}

// Fonction utilitaire pour les badges de type
function getTypeBadge(type: string): string {
  switch (type.toLowerCase()) {
    case 'cours':
      return 'bg-blue-100 text-blue-800';
    case 'tp':
      return 'bg-green-100 text-green-800';
    case 'projet':
      return 'bg-purple-100 text-purple-800';
    case 'stage':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function AdminSubjectsList() {
  // Données simulées avec le format spécifié
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: 1,
      name: "Ergonomie et Expérience Utilisateur",
      code: "UX-ERG-001",
      description: "Méthodologies UX Design, recherche utilisateur, prototypage et test d'utilisabilité.",
      credits: 4,
      coefficient: 2,
      type: "projet",
      formation_id: 1,
      semester: 2,
      is_active: true
    },
    {
      id: 2,
      name: "Algorithmes Avancés",
      code: "ALG-ADV-002",
      description: "Étude des algorithmes complexes et optimisation des performances",
      credits: 6,
      coefficient: 3,
      type: "cours",
      formation_id: 1,
      semester: 3,
      is_active: true
    },
    {
      id: 3,
      name: "Base de Données NoSQL",
      code: "BD-NOSQL-003",
      description: "MongoDB, Redis, ElasticSearch et architectures distribuées",
      credits: 5,
      coefficient: 2,
      type: "tp",
      formation_id: 2,
      semester: 4,
      is_active: false
    },
    {
      id: 4,
      name: "Intelligence Artificielle",
      code: "IA-ML-004",
      description: "Machine Learning, Deep Learning et applications pratiques",
      credits: 8,
      coefficient: 4,
      type: "cours",
      formation_id: 1,
      semester: 5,
      is_active: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [loading, setLoading] = useState(false);

  // Options pour les filtres
  const typeOptions = [
    { value: "all", label: "Tous les types" },
    { value: "cours", label: "Cours" },
    { value: "tp", label: "TP" },
    { value: "projet", label: "Projet" },
    { value: "stage", label: "Stage" }
  ];

  const semesterOptions = [
    { value: "all", label: "Tous les semestres" },
    ...Array.from({length: 6}, (_, i) => ({
      value: (i + 1).toString(),
      label: `Semestre ${i + 1}`
    }))
  ];

  // Filtres appliqués
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesSearch = 
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === "all" || subject.type === selectedType;
      const matchesSemester = selectedSemester === "all" || subject.semester.toString() === selectedSemester;

      return matchesSearch && matchesType && matchesSemester;
    });
  }, [subjects, searchTerm, selectedType, selectedSemester]);

  // Statistiques
  const stats = useMemo(() => ({
    total: subjects.length,
    active: subjects.filter(s => s.is_active).length,
    inactive: subjects.filter(s => !s.is_active).length,
    totalCredits: subjects.reduce((sum, s) => sum + s.credits, 0)
  }), [subjects]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Actions
  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Êtes-vous sûr de vouloir supprimer cette matière ?");
    if (!confirm) return;

    try {
      setLoading(true);
      setSubjects(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Erreur suppression matière:", error);
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
              Matières
            </h1>
            <p className="text-sm font-poppins text-gray-600 mt-1">
              Université de Lomé - Gestion des matières et cours
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-smooth">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Matière
            </button>

            <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-forest-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-poppins font-medium text-gray-600">Total Matières</p>
              <p className="text-2xl font-poppins font-light text-gray-900">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-poppins font-medium text-gray-600">Actives</p>
              <p className="text-2xl font-poppins font-light text-gray-900">{stats.active}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-poppins font-medium text-gray-600">Inactives</p>
              <p className="text-2xl font-poppins font-light text-gray-900">{stats.inactive}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-poppins font-medium text-gray-600">Total Crédits</p>
              <p className="text-2xl font-poppins font-light text-gray-900">{stats.totalCredits}</p>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="max-w-md">
              <Input
                placeholder="Rechercher une matière..."
                leftIcon={Search}
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="text-sm font-poppins text-gray-500">
              {filteredSubjects.length} matière{filteredSubjects.length > 1 ? 's' : ''} trouvée{filteredSubjects.length > 1 ? 's' : ''}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 font-poppins text-sm focus:ring-2 focus:ring-forest-500"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="relative">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 font-poppins text-sm focus:ring-2 focus:ring-forest-500"
              >
                {semesterOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Liste matières */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-poppins font-medium text-gray-900">
              Liste des Matières
            </h2>
            {loading && (
              <div className="flex items-center text-sm text-gray-500">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Chargement...
              </div>
            )}
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 mr-3 animate-spin text-forest-600" />
                <span className="text-gray-600 font-poppins">Chargement des matières...</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Matière", "Code", "Type", "Semestre", "Crédits", "Actions"].map((col) => (
                      <th key={col} className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500 font-poppins">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Aucune matière trouvée</p>
                        <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map((subject) => (
                      <tr key={subject.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-forest-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-poppins font-medium text-gray-900">{subject.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-medium bg-gray-100 text-gray-800">
                            {subject.code}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-medium ${getTypeBadge(subject.type)}`}>
                            {subject.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-poppins text-gray-900">S{subject.semester}</td>
                        <td className="px-6 py-4 text-sm font-poppins font-medium text-gray-900">{subject.credits}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-smooth">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(subject.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-smooth"
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
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm font-poppins text-gray-700">
            Affichage page <span className="font-medium">1</span> sur{" "}
            <span className="font-medium">1</span> — Total : <span className="font-medium">{filteredSubjects.length}</span> matière{filteredSubjects.length > 1 ? 's' : ''}
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={true}
              className="px-3 py-2 text-sm font-poppins font-medium text-gray-500 bg-white border border-gray-300 rounded-md opacity-50 cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              disabled={true}
              className="px-3 py-2 text-sm font-poppins font-medium text-gray-500 bg-white border border-gray-300 rounded-md opacity-50 cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}