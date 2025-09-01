'use client'
import React, { useState } from "react";
import { 
  Home, MapPin, Users, Monitor, Wifi, Search, Plus, Filter, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Calendar, Clock
} from "lucide-react";

interface Classroom {
  id: number;
  name: string;
  code: string;
  capacity: number;
  building: string;
  status: 'available' | 'occupied' | 'maintenance';
}

export default function ClassroomsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const classrooms: Classroom[] = [
    {
      id: 1,
      name: "Classe A1",
      code: "CL-A1",
      capacity: 35,
      building: "Bâtiment Principal",
      status: "available"
    },
    {
      id: 2,
      name: "Classe A2",
      code: "CL-A2",
      capacity: 40,
      building: "Bâtiment Principal",
      status: "occupied"
    },
    {
      id: 3,
      name: "Classe B1",
      code: "CL-B1",
      capacity: 30,
      building: "Bâtiment Sciences",
      status: "available"
    },
    {
      id: 4,
      name: "Classe B2",
      code: "CL-B2",
      capacity: 38,
      building: "Bâtiment Sciences",
      status: "maintenance"
    },
    {
      id: 5,
      name: "Classe C1",
      code: "CL-C1",
      capacity: 42,
      building: "Bâtiment Technologie",
      status: "available"
    }
  ];

  const totalRooms = classrooms.length;
  const availableRooms = classrooms.filter(room => room.status === 'available').length;
  const occupiedRooms = classrooms.filter(room => room.status === 'occupied').length;
  const occupancyRate = ((occupiedRooms / totalRooms) * 100).toFixed(1);

  const getStatusBadge = (status: Classroom['status']): string => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Classroom['status']): string => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'occupied':
        return 'Occupée';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Inconnu';
    }
  };

  const filteredClassrooms = classrooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
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
              <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </button>
              <button className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-smooth">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Salle
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-poppins font-medium text-gray-600">Total Salles</h3>
              <Home className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-poppins font-light text-gray-900 mb-1">{totalRooms}</div>
            <div className="text-sm text-gray-500 font-poppins">Espaces d'enseignement</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-poppins font-medium text-gray-600">Disponibles</h3>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-poppins font-light text-gray-900 mb-1">{availableRooms}</div>
            <div className="text-sm text-gray-500 font-poppins">Prêtes à utiliser</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-poppins font-medium text-gray-600">Occupées</h3>
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-poppins font-light text-gray-900 mb-1">{occupiedRooms}</div>
            <div className="text-sm text-gray-500 font-poppins">En cours d'utilisation</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-poppins font-medium text-gray-600">Taux d'Occupation</h3>
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-poppins font-light text-gray-900 mb-1">{occupancyRate}%</div>
            <div className="text-sm text-gray-500 font-poppins">En temps réel</div>
          </div>
        </div>

        {/* Classrooms List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-poppins font-semibold text-gray-900">Liste des Classes</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Classe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Capacité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Bâtiment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClassrooms.map((classroom) => (
                  <tr key={classroom.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-poppins font-medium text-gray-900">{classroom.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-poppins text-gray-600">{classroom.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-poppins text-gray-900">{classroom.capacity} places</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-poppins text-gray-600">{classroom.building}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-poppins font-medium rounded-full ${getStatusBadge(classroom.status)}`}>
                        {getStatusText(classroom.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-forest-600 hover:text-forest-900 font-poppins font-medium">
                          Modifier
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 font-poppins font-medium">
                          Réserver
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}