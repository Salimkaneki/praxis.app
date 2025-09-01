'use client'
import React, { useState } from "react";
import { 
  Users, GraduationCap, BookOpen, Search, Plus, Filter, Download, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal
} from "lucide-react";

export default function StudentPage() {
  const [searchTerm, setSearchTerm] = useState("");

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

  const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0);
  const totalCapacity = classes.reduce((sum, cls) => sum + cls.capacity, 0);
  const occupationRate = ((totalStudents / totalCapacity) * 100).toFixed(1);

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <button className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-smooth">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Classe
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

      </div>
    </div>
  );
}