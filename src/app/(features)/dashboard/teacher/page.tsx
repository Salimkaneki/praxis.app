'use client'
import React, { useState, useEffect } from "react";
import { 
  Users,
  Plus,
  Edit3,
  Eye,
  Trash2,
  Download,
  Search,
  Clock,
  GraduationCap,
  ChevronDown,
  MoreVertical,
  Mail,
  Phone,
  BookOpen,
  Award,
  User
} from "lucide-react";
import { fetchTeachers, Teacher, PaginatedResponse, deleteTeacher} from "./_services/teacher.service";

import { useRouter } from "next/navigation";
import KPIGrid from "@/components/ui/Cards/kpi-grid";


// -----------------------------
// Composant Input (réutilisable)
// -----------------------------
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

// -----------------------------
// TeachersList
// -----------------------------
export default function TeachersList() {

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Teacher> | null>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedAction, setSelectedAction] = useState("");

  const departments = [
    { value: "all", label: "Tous les départements" },
    { value: "Informatique", label: "Informatique" },
    { value: "Ingénierie", label: "Ingénierie" },
    { value: "Médecine", label: "Médecine" },
    { value: "Sciences Économiques", label: "Sciences Économiques" },
    { value: "Droit", label: "Droit" },
    { value: "Lettres", label: "Lettres" }
  ];

  const actions = [
    { value: "", label: "Actions rapides" },
    { value: "send_email", label: "Envoyer un email" },
    { value: "generate_report", label: "Générer rapport" },
    { value: "schedule_meeting", label: "Planifier réunion" },
    { value: "assign_course", label: "Assigner cours" },
    { value: "update_status", label: "Mettre à jour statut" }
  ];

  // -----------------------------
  // Charger enseignants depuis API
  // -----------------------------
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setLoading(true);
        const data = await fetchTeachers(page);
        setTeachers(data.data);
        setPagination(data);
      } catch (error) {
        console.error("Erreur chargement enseignants:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTeachers();
  }, [page]);

  // -----------------------------
  // Filtres côté front (search + département)
  // -----------------------------
  const filteredTeachers = teachers.filter((teacher) => {
    const name = teacher.user?.name?.toLowerCase() || "";
    const specialization = teacher.specialization?.toLowerCase() || "";
    const department = teacher.institution?.name?.toLowerCase() || "";

    const matchesSearch = 
      name.includes(searchTerm.toLowerCase()) ||
      specialization.includes(searchTerm.toLowerCase()) ||
      department.includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" || department === selectedDepartment.toLowerCase();

    return matchesSearch && matchesDepartment;
  });

  const stats = {
    total: pagination?.total || 0,
    active: teachers.filter(t => t.is_permanent).length, // ex: actifs = permanents
    onLeave: 0, // si ton backend gère "congé", il faudra mapper
    totalStudents: 0 // à remplacer quand dispo dans ton backend
  };

  const kpis = [
    {
      label: "Total Enseignants",
      value: stats.total,
      trend: "positive" as const,
      period: "ce mois"
    },
    {
      label: "Enseignants Actifs",
      value: stats.active,
      trend: "positive" as const,
      period: "ce mois"
    },
    {
      label: "En Congé",
      value: stats.onLeave,
      trend: "negative" as const,
      period: "ce mois"
    },
    {
      label: "Total Étudiants",
      value: stats.totalStudents,
      trend: "positive" as const,
      period: "ce mois"
    }
  ];

  const handleAction = (action: string) => {
    if (action) {
      console.log(`Action sélectionnée: ${action}`);
      setSelectedAction("");
    }
  };

  const router = useRouter();

  const handleDelete = async (id: number) => {
  const confirm = window.confirm("Voulez-vous vraiment supprimer cet enseignant ?");
  if (!confirm) return;

  try {
    await deleteTeacher(id);
    alert("Enseignant supprimé avec succès !");
      // Mettre à jour la liste après suppression
      setTeachers(prev => prev.filter(t => t.id !== id));
      setPagination(prev => prev ? { ...prev, total: prev.total - 1 } : prev);
    } catch (error) {
    console.error("Erreur suppression enseignant:", error);
    alert("Impossible de supprimer cet enseignant.");
  }
  };




  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-poppins font-semibold text-gray-900">
              Enseignants
            </h1>
            <p className="text-sm font-poppins text-gray-600 mt-1">
              Université de Lomé - Gestion du corps enseignant
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push("/dashboard/teacher/create")}
            className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-smooth"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Enseignant
          </button>

            <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Stats */}
        <KPIGrid kpis={kpis} />

        {/* Filtres */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Input
            placeholder="Rechercher un enseignant..."
            leftIcon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 font-poppins text-sm focus:ring-2 focus:ring-forest-500"
              >
                {departments.map(dep => (
                  <option key={dep.value} value={dep.value}>{dep.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="relative">
              <select
                value={selectedAction}
                onChange={(e) => handleAction(e.target.value)}
                className="appearance-none bg-forest-600 text-white border border-forest-600 rounded-lg px-4 py-2 pr-8 font-poppins text-sm hover:bg-forest-700 focus:ring-2 focus:ring-forest-500"
              >
                {actions.map(a => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-white w-4 h-4" />
            </div>

            <div className="text-sm font-poppins text-gray-500">
              {filteredTeachers.length} enseignant{filteredTeachers.length > 1 ? 's' : ''} trouvé{filteredTeachers.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Liste enseignants */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-poppins font-medium text-gray-900">
              Liste des Enseignants
            </h2>
            <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Chargement...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enseignant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spécialisation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Institution</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTeachers.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-forest-600 to-forest-700 rounded-full flex items-center justify-center text-white font-semibold">
                          {t.user?.name?.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{t.user?.name}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {t.user?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{t.grade}</td>
                      <td className="px-6 py-4 text-sm">{t.specialization}</td>
                      <td className="px-6 py-4 text-sm">{t.institution?.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/teacher/edit/${t.id}`)}
                            className="p-2 text-gray-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTeachers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        Aucun enseignant trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredTeachers.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm font-poppins text-gray-700">
              Affichage de <span className="font-medium">{((pagination?.current_page || 1) - 1) * 10 + 1}</span> à{" "}
              <span className="font-medium">
                {Math.min((pagination?.current_page || 1) * 10, pagination?.total || 0)}
              </span> sur{" "}
              <span className="font-medium">{pagination?.total || 0}</span> enseignant{(pagination?.total || 0) > 1 ? 's' : ''}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <span className="px-3 py-2 text-sm font-poppins text-gray-700">
                Page {pagination?.current_page} sur {pagination?.last_page}
              </span>
              <button
                onClick={() => setPage(p => (pagination && p < pagination.last_page ? p + 1 : p))}
                disabled={pagination ? page >= pagination.last_page : true}
                className="px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
