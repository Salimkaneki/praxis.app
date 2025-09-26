'use client'
import React, { useState, useEffect } from "react";
import { 
  User,
  Users,
  BookOpen,
  GraduationCap,
  Filter,
  Download,
  Calendar,
} from "lucide-react";
import KPIGrid from "@/components/ui/Cards/kpi-grid";
import { getDashboardData, DashboardData } from "./_services/dashboard.service";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { kpis = [], metrics = [], recentEvents = [] } = data;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-poppins font-semibold text-gray-900">
                Université de Lomé
              </h1>
              <p className="text-sm font-poppins text-gray-600 mt-1">
                Tableau de bord de pilotage
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </button>
              <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
              <div className="text-sm font-poppins text-gray-500">
                {new Date().toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* KPIs */}
        <KPIGrid kpis={kpis} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Metrics Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-poppins font-medium text-gray-900">
                    Indicateurs de performance
                  </h2>
                  <button className="text-sm font-poppins text-gray-500 hover:text-gray-700">
                    Voir tout
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {metrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-poppins font-medium text-gray-600 mb-1">
                          {metric.label}
                        </div>
                        <div className="text-2xl font-poppins font-light text-gray-900">
                          {metric.value}
                        </div>
                      </div>
                      <div className={`text-right ${
                        metric.change.startsWith('+') ? 'text-green-700' : 'text-red-700'
                      }`}>
                        <div className="text-sm font-poppins font-medium">
                          {metric.change}{metric.unit}
                        </div>
                        <div className="text-xs font-poppins text-gray-500">
                          30j
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-poppins font-medium text-gray-900">
                  Agenda
                </h2>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {recentEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 last:pb-0 border-b border-gray-100 last:border-b-0">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-poppins font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-poppins font-medium rounded-full ${
                          event.status === 'En cours' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <p className="text-sm font-poppins text-gray-600 mb-1">
                        {event.location}
                      </p>
                      <p className="text-xs font-poppins text-gray-500">
                        {new Date(event.date).toLocaleDateString('fr-FR', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'short' 
                        })} à {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 text-sm font-poppins font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                Voir l'agenda complet
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}