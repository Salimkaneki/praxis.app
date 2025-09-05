'use client'
import React, { useState, useMemo } from "react";
import { 
  Users, GraduationCap, BookOpen, Search, Plus, Filter, Download, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, ChevronDown, Edit3, 
  Trash2, MoreVertical, Mail, Phone, Calendar, User
} from "lucide-react";

export default function StudentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [studentSearchTerm, setStudentSearchTerm] = useState("");

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

  // Mock data pour les étudiants
  const students = [
    {
      id: 1,
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@univ-lome.tg",
      phone: "+228 90 12 34 56",
      studentNumber: "L3-INFO-001",
      classId: 1,
      className: "Licence 3 Informatique",
      classCode: "L3-INFO",
      average: 14.5,
      status: "active",
      birthDate: "1999-03-15",
      enrollmentDate: "2022-09-01"
    },
    {
      id: 2,
      firstName: "Marie",
      lastName: "Koffi",
      email: "marie.koffi@univ-lome.tg",
      phone: "+228 90 23 45 67",
      studentNumber: "L3-INFO-002",
      classId: 1,
      className: "Licence 3 Informatique",
      classCode: "L3-INFO",
      average: 16.2,
      status: "active",
      birthDate: "1998-07-22",
      enrollmentDate: "2022-09-01"
    },
    {
      id: 3,
      firstName: "Kwame",
      lastName: "Asante",
      email: "kwame.asante@univ-lome.tg",
      phone: "+228 90 34 56 78",
      studentNumber: "M1-GC-001",
      classId: 2,
      className: "Master 1 Génie Civil",
      classCode: "M1-GC",
      average: 15.8,
      status: "active",
      birthDate: "1997-11-10",
      enrollmentDate: "2023-09-01"
    },
    {
      id: 4,
      firstName: "Fatou",
      lastName: "Diallo",
      email: "fatou.diallo@univ-lome.tg",
      phone: "+228 90 45 67 89",
      studentNumber: "L2-MED-001",
      classId: 3,
      className: "Licence 2 Médecine",
      classCode: "L2-MED",
      average: 13.7,
      status: "active",
      birthDate: "2000-01-05",
      enrollmentDate: "2023-09-01"
    },
    {
      id: 5,
      firstName: "Ibrahim",
      lastName: "Sow",
      email: "ibrahim.sow@univ-lome.tg",
      phone: "+228 90 56 78 90",
      studentNumber: "M2-ECO-001",
      classId: 4,
      className: "Master 2 Économie",
      classCode: "M2-ECO",
      average: 17.1,
      status: "active",
      birthDate: "1996-05-18",
      enrollmentDate: "2022-09-01"
    },
    {
      id: 6,
      firstName: "Adjoa",
      lastName: "Mensah",
      email: "adjoa.mensah@univ-lome.tg",
      phone: "+228 90 67 89 01",
      studentNumber: "L3-INFO-003",
      classId: 1,
      className: "Licence 3 Informatique",
      classCode: "L3-INFO",
      average: 12.8,
      status: "inactive",
      birthDate: "1999-09-12",
      enrollmentDate: "2022-09-01"
    }
  ];

  const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0);
  const totalCapacity = classes.reduce((sum, cls) => sum + cls.capacity, 0);
  const occupationRate = ((totalStudents / totalCapacity) * 100).toFixed(1);

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

  // Filtrage des étudiants
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesClass = selectedClass === "all" || student.classId.toString() === selectedClass;
      const matchesSearch = studentSearchTerm === "" || 
        student.firstName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.studentNumber.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.className.toLowerCase().includes(studentSearchTerm.toLowerCase());
      
      return matchesClass && matchesSearch;
    });
  }, [students, selectedClass, studentSearchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
              <button className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Étudiant
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-poppins font-medium text-gray-600">Total Classes</h3>
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-poppins font-light text-gray-900 mb-1">{classes.length}</div>
            <div className="flex items-center text-sm">
              <span className="inline-flex items-center font-poppins font-medium text-green-700">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +1
              </span>
              <span className="text-gray-500 font-poppins ml-2">vs mois précédent</span>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-poppins font-medium text-gray-600">Total Étudiants</h3>
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-poppins font-light text-gray-900 mb-1">{totalStudents}</div>
            <div className="flex items-center text-sm">
              <span className="inline-flex items-center font-poppins font-medium text-green-700">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +23
              </span>
              <span className="text-gray-500 font-poppins ml-2">vs mois précédent</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-poppins font-medium text-gray-600">Taux d'Occupation</h3>
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-poppins font-light text-gray-900 mb-1">{occupationRate}%</div>
            <div className="flex items-center text-sm">
              <span className="inline-flex items-center font-poppins font-medium text-red-700">
                <ArrowDownRight className="w-3 h-3 mr-1" />
                -2.1%
              </span>
              <span className="text-gray-500 font-poppins ml-2">vs mois précédent</span>
            </div>
          </div>
        </div>

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
                {filteredStudents.length} / {students.length} étudiant{students.length > 1 ? 's' : ''} trouvé{students.length > 1 ? 's' : ''}
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
                {filteredStudents.length === 0 ? (
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
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm font-poppins text-gray-500">{student.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-medium bg-gray-100 text-gray-800">
                          {student.studentNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-poppins font-medium text-gray-900">{student.classCode}</div>
                        <div className="text-sm font-poppins text-gray-500">{student.className}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-medium ${getStatusBadge(student.status)}`}>
                          {student.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="p-2 text-gray-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
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
        {filteredStudents.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm font-poppins text-gray-700">
              Affichage de <span className="font-medium">1</span> à{" "}
              <span className="font-medium">{filteredStudents.length}</span> sur{" "}
              <span className="font-medium">{filteredStudents.length}</span> étudiant{filteredStudents.length > 1 ? 's' : ''}
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={true}
                className="px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                disabled={true}
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