'use client'
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { 
  Users, GraduationCap, BookOpen, Search, Plus, Filter, Download, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, ChevronDown, Edit3, 
  Trash2, MoreVertical, Mail, Phone, Calendar, User, Loader2
} from "lucide-react";
import axios from "@/lib/server/interceptor/axios"; 
import { deleteStudent, fetchStudents, Student, PaginatedResponse } from "./_services/student.service";
import KPIGrid from "@/components/ui/Cards/kpi-grid";
import ConfirmationDialog from "@/components/ui/Feedback/ConfirmationDialog";


// Types

// API Functions

export default function StudentPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  
  // États pour l'API
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  // États pour la confirmation de suppression
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Données mockées pour les classes (à remplacer par une API si nécessaire)
  const classes = [
    {
      id: 1,
      name: "Licence 3 Informatique",
      code: "L3-INFO",
      studentCount: 45,
      capacity: 50,
      color: "from-blue-600 to-blue-700",
      stats: [
        { label: "Taux de présence", value: "92.1%", change: "+2.3", trend: "positive" },
        { label: "Moyenne générale", value: "14.2/20", change: "+0.8", trend: "positive" },
        { label: "Taux de réussite", value: "87%", change: "-3", trend: "negative" },
        { label: "Devoirs rendus", value: "156/180", change: "+12", trend: "positive" }
      ]
    },
    {
      id: 2,
      name: "Master 1 Génie Civil",
      code: "M1-GC",
      studentCount: 28,
      capacity: 35,
      color: "from-green-600 to-green-700",
      stats: [
        { label: "Taux de présence", value: "95.4%", change: "+1.2", trend: "positive" },
        { label: "Moyenne générale", value: "15.7/20", change: "+0.5", trend: "positive" },
        { label: "Taux de réussite", value: "93%", change: "+5", trend: "positive" },
        { label: "Projets validés", value: "24/28", change: "+8", trend: "positive" }
      ]
    },
    {
      id: 3,
      name: "Licence 2 Médecine",
      code: "L2-MED",
      studentCount: 67,
      capacity: 70,
      color: "from-red-600 to-red-700",
      stats: [
        { label: "Taux de présence", value: "89.3%", change: "-1.8", trend: "negative" },
        { label: "Moyenne générale", value: "13.1/20", change: "-0.3", trend: "negative" },
        { label: "Taux de réussite", value: "78%", change: "-7", trend: "negative" },
        { label: "TP validés", value: "201/268", change: "-15", trend: "negative" }
      ]
    },
    {
      id: 4,
      name: "Master 2 Économie",
      code: "M2-ECO",
      studentCount: 32,
      capacity: 40,
      color: "from-purple-600 to-purple-700",
      stats: [
        { label: "Taux de présence", value: "96.8%", change: "+3.1", trend: "positive" },
        { label: "Moyenne générale", value: "16.3/20", change: "+1.2", trend: "positive" },
        { label: "Taux de réussite", value: "97%", change: "+4", trend: "positive" },
        { label: "Mémoires soutenus", value: "28/32", change: "+6", trend: "positive" }
      ]
    }
  ];

  // Fonction pour charger les étudiants
  const loadStudents = async (page = 1, search = "") => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page,
        per_page: perPage
      };
      
      if (search.trim()) {
        params.search = search.trim();
      }
      
      const response = await fetchStudents(params);
      setStudents(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        total: response.total
      });
    } catch (err) {
      setError("Erreur lors du chargement des étudiants");
    } finally {
      setLoading(false);
    }
  };

  // Charger les étudiants au montage du composant
  useEffect(() => {
    loadStudents(currentPage, studentSearchTerm);
  }, [currentPage]);

  // Gérer la recherche avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      loadStudents(1, studentSearchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [studentSearchTerm]);

  const totalStudents = pagination.total;
  const totalCapacity = classes.reduce((sum, cls) => sum + cls.capacity, 0);
  const occupationRate = totalCapacity > 0 ? ((totalStudents / totalCapacity) * 100).toFixed(1) : "0.0";

  const kpis = useMemo(() => [
    {
      label: "Total Classes",
      value: classes.length,
      trend: "positive" as const,
      period: "ce mois"
    },
    {
      label: "Total Étudiants",
      value: loading ? "..." : totalStudents,
      trend: "positive" as const,
      period: "ce mois"
    },
    {
      label: "Taux d'Occupation",
      value: `${occupationRate}%`,
      trend: "negative" as const,
      period: "ce mois"
    }
  ], [classes.length, totalStudents, occupationRate, loading]);

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Options pour le filtre de classe
  const classOptions = [
    { value: "all", label: "Toutes les classes" },
    ...classes.map(cls => ({
      value: cls.id.toString(),
      label: `${cls.code} - ${cls.name}`
    }))
  ];

  // Filtrage des étudiants par classe (côté client pour le filtre de classe)
  const filteredStudents = useMemo(() => {
    if (selectedClass === "all") {
      return students;
    }
    
    return students.filter(student => 
      student.classe?.id?.toString() === selectedClass
    );
  }, [students, selectedClass]);

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fonction pour supprimer un étudiant
  const handleDeleteStudent = (student: Student) => {
    setStudentToDelete(student);
    setShowDeleteDialog(true);
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;

    setIsDeleting(true);
    try {
      await deleteStudent(studentToDelete.id);
      setStudents(prev => prev.filter(student => student.id !== studentToDelete.id));
      setShowDeleteDialog(false);
      setStudentToDelete(null);
    } catch (err) {
      // L'erreur sera gérée par le service ou un état d'erreur
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteStudent = () => {
    setShowDeleteDialog(false);
    setStudentToDelete(null);
  };

  // Fonction pour naviguer vers la page d'édition
  const handleEditStudent = (studentId: number) => {
    router.push(`/dashboard/student/edit/${studentId}`);
  };

  // Fonction pour naviguer vers la page de création
  const handleCreateStudent = () => {
    router.push('/dashboard/student/registration');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-poppins font-semibold text-gray-900">Classes & Étudiants</h1>
              <p className="text-sm font-poppins text-gray-600 mt-1">Suivi des performances par classe</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors font-poppins text-sm"
                />
              </div>
              <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </button>
              <button 
                onClick={handleCreateStudent}
                className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Étudiant
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Stats Overview */}
        <KPIGrid kpis={kpis} />

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-800 font-poppins text-sm">{error}</div>
              <button 
                onClick={() => loadStudents(currentPage, studentSearchTerm)}
                className="ml-auto text-red-600 hover:text-red-800 font-poppins text-sm font-medium"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Students Section */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un étudiant..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors font-poppins text-sm"
                  />
                </div>
              </div>
              <div className="text-sm font-poppins text-gray-500">
                {filteredStudents.length} / {totalStudents} étudiant{totalStudents > 1 ? 's' : ''} trouvé{totalStudents > 1 ? 's' : ''}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 font-poppins text-sm focus:ring-2 focus:ring-forest-500"
                >
                  {classOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-poppins font-medium text-gray-900">
              Liste des Étudiants
            </h2>
            <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Étudiant", "N° Étudiant", "Classe", "Statut", "Actions"].map((col) => (
                    <th key={col} className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-poppins">
                      <Loader2 className="w-12 h-12 mx-auto mb-4 text-gray-300 animate-spin" />
                      <p className="text-lg font-medium">Chargement des étudiants...</p>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-poppins">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Aucun étudiant trouvé</p>
                      <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-forest-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-poppins font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-sm font-poppins text-gray-500">{student.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-medium bg-gray-100 text-gray-800">
                          {student.student_number}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-poppins font-medium text-gray-900">
                          {student.classe?.code || 'N/A'}
                        </div>
                        <div className="text-sm font-poppins text-gray-500">
                          {student.classe?.name || 'Aucune classe'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-medium ${getStatusBadge(student.is_active)}`}>
                          {student.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditStudent(student.id)}
                            className="p-2 text-gray-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button 
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Plus d'options"
                          >
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

        {/* Pagination for Students */}
        {!loading && filteredStudents.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm font-poppins text-gray-700">
              Affichage de <span className="font-medium">{((pagination.current_page - 1) * perPage) + 1}</span> à{" "}
              <span className="font-medium">
                {Math.min(pagination.current_page * perPage, pagination.total)}
              </span> sur{" "}
              <span className="font-medium">{pagination.total}</span> étudiant{pagination.total > 1 ? 's' : ''}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={pagination.current_page <= 1}
                className="px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <span className="px-3 py-2 text-sm font-poppins text-gray-700">
                Page {pagination.current_page} sur {pagination.last_page}
              </span>
              <button
                onClick={handleNextPage}
                disabled={pagination.current_page >= pagination.last_page}
                className="px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogue de confirmation de suppression */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title="Supprimer l'étudiant"
        message={`Êtes-vous sûr de vouloir supprimer l'étudiant "${studentToDelete?.first_name} ${studentToDelete?.last_name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmButtonColor="red"
        onConfirm={confirmDeleteStudent}
        onCancel={cancelDeleteStudent}
        isLoading={isDeleting}
      />
    </div>
  );
}