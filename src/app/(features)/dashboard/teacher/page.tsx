'use client'
import React, { useState } from "react";
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
  MapPin,
  Calendar,
  BookOpen,
  Award,
  User
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

export default function TeachersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedAction, setSelectedAction] = useState("");

  const teachers = [
    {
      id: 1,
      name: "Dr. Marie Kouassi",
      email: "marie.kouassi@univ-lome.tg",
      phone: "+228 90 12 34 56",
      department: "Informatique",
      speciality: "Intelligence Artificielle",
      status: "Actif",
      experience: "8 ans",
      students: 145,
      courses: 3,
      joinDate: "2016-09-01",
      avatar: "MK"
    },
    {
      id: 2,
      name: "Prof. Jean Akakpo",
      email: "jean.akakpo@univ-lome.tg",
      phone: "+228 91 23 45 67",
      department: "Ingénierie",
      speciality: "Génie Civil",
      status: "Actif",
      experience: "15 ans",
      students: 89,
      courses: 4,
      joinDate: "2009-02-15",
      avatar: "JA"
    },
    {
      id: 3,
      name: "Dr. Fatou Diallo",
      email: "fatou.diallo@univ-lome.tg",
      phone: "+228 92 34 56 78",
      department: "Médecine",
      speciality: "Cardiologie",
      status: "Actif",
      experience: "12 ans",
      students: 67,
      courses: 2,
      joinDate: "2012-08-20",
      avatar: "FD"
    },
    {
      id: 4,
      name: "Dr. Paul Mensah",
      email: "paul.mensah@univ-lome.tg",
      phone: "+228 93 45 67 89",
      department: "Sciences Économiques",
      speciality: "Économie Internationale",
      status: "Actif",
      experience: "6 ans",
      students: 234,
      courses: 5,
      joinDate: "2018-03-10",
      avatar: "PM"
    },
    {
      id: 5,
      name: "Me. Adjoa Togo",
      email: "adjoa.togo@univ-lome.tg",
      phone: "+228 94 56 78 90",
      department: "Droit",
      speciality: "Droit des Affaires",
      status: "Congé",
      experience: "10 ans",
      students: 156,
      courses: 3,
      joinDate: "2014-01-15",
      avatar: "AT"
    },
    {
      id: 6,
      name: "Dr. Kodjo Agbenu",
      email: "kodjo.agbenu@univ-lome.tg",
      phone: "+228 95 67 89 01",
      department: "Lettres",
      speciality: "Littérature Française",
      status: "Actif",
      experience: "11 ans",
      students: 98,
      courses: 4,
      joinDate: "2013-09-05",
      avatar: "KA"
    }
  ];

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

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.speciality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || teacher.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const stats = {
    total: teachers.length,
    active: teachers.filter(t => t.status === "Actif").length,
    onLeave: teachers.filter(t => t.status === "Congé").length,
    totalStudents: teachers.reduce((sum, t) => sum + t.students, 0)
  };

  const handleAction = (action: string) => {
    if (action) {
      console.log(`Action sélectionnée: ${action}`);
      // Ici vous pouvez implémenter la logique pour chaque action
      setSelectedAction("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-poppins font-semibold text-gray-900">
                Enseignants
              </h1>
              <p className="text-sm font-poppins text-gray-600 mt-1">
                Université de Lomé - Gestion du corps enseignant
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-smooth">
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
      </div>

      <div className="px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-forest-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-poppins font-medium text-gray-600">Total Enseignants</p>
                <p className="text-2xl font-poppins font-light text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-poppins font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-poppins font-light text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-poppins font-medium text-gray-600">En Congé</p>
                <p className="text-2xl font-poppins font-light text-gray-900">{stats.onLeave}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-blue-600" />
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
                placeholder="Rechercher un enseignant..."
                leftIcon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                width="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 font-poppins text-sm focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                >
                  {departments.map(department => (
                    <option key={department.value} value={department.value}>
                      {department.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              <div className="relative">
                <select
                  value={selectedAction}
                  onChange={(e) => handleAction(e.target.value)}
                  className="appearance-none bg-forest-600 text-white border border-forest-600 rounded-lg px-4 py-2 pr-8 font-poppins text-sm focus:ring-2 focus:ring-forest-500 focus:border-transparent hover:bg-forest-700"
                >
                  {actions.map(action => (
                    <option key={action.value} value={action.value}>
                      {action.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
              </div>
              
              <div className="text-sm font-poppins text-gray-500">
                {filteredTeachers.length} enseignant{filteredTeachers.length > 1 ? 's' : ''} trouvé{filteredTeachers.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Teachers List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-poppins font-medium text-gray-900">
              Liste des Enseignants
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Enseignant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Expérience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Cours
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
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-forest-600 to-forest-700 rounded-full flex items-center justify-center">
                          <span className="text-sm text-white font-poppins font-semibold">
                            {teacher.avatar}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-poppins font-medium text-gray-900">
                            {teacher.name}
                          </div>
                          <div className="text-sm font-poppins text-gray-500">
                            {teacher.speciality}
                          </div>
                          <div className="text-xs font-poppins text-gray-400 flex items-center mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            {teacher.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-medium bg-gray-100 text-gray-800">
                        {teacher.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-poppins text-gray-900">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-gray-400 mr-1" />
                        {teacher.experience}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-poppins text-gray-900">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 text-blue-500 mr-1" />
                        {teacher.courses} cours
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-medium ${
                        teacher.status === 'Actif' 
                          ? 'bg-green-100 text-green-800' 
                          : teacher.status === 'Congé'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          title="Voir profil"
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-smooth"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          title="Modifier"
                          className="p-2 text-gray-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-smooth"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          title="Envoyer email"
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-smooth"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button 
                          title="Téléphoner"
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-smooth"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button 
                          title="Plus d'options"
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-smooth"
                        >
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
            Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredTeachers.length}</span> sur{' '}
            <span className="font-medium">{filteredTeachers.length}</span> résultats
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