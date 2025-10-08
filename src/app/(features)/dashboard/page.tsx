'use client'
import React, { useState, useEffect, useMemo } from "react";
import {
  User,
  Users,
  BookOpen,
  GraduationCap,
  Filter,
  Download,
  Calendar,
} from "lucide-react";
import KPIGrid, { KPI } from "@/components/ui/Cards/kpi-grid";
import { getDashboardData, DashboardData } from "./_services/dashboard.service";

import { useAppData } from "../../../contexts/hooks";export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [contextError, setContextError] = useState<string | null>(null);

  // Utilisation des contextes pour les données en temps réel
  const { students, teachers, subjects, classes } = useAppData();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
        setApiError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des données du dashboard:', err);
        setApiError('Le serveur backend n\'est pas accessible. Les KPIs affichent les données locales.');
        // Continuer sans les données du dashboard, afficher seulement les KPIs
        setDashboardData({ kpis: [], metrics: [], recentEvents: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Charger les données des contextes au montage
  useEffect(() => {
    const loadContextData = async () => {
      try {
        setContextError(null);
        // Charger seulement les étudiants pour commencer
        await students.refreshEntities();
        console.log('Étudiants chargés:', students.entities.length);
        
        // Charger les autres données après
        setTimeout(async () => {
          try {
            await teachers.refreshEntities();
            await subjects.refreshEntities();
            await classes.refreshEntities();
          } catch (secondaryError) {
            console.error('Erreur chargement context secondaire:', secondaryError);
            setContextError('Certaines données n\'ont pas pu être chargées depuis le serveur.');
          }
        }, 1000); // Délai de 1 seconde
        
      } catch (error) {
        console.error('Erreur chargement étudiants:', error);
        setContextError('Impossible de charger les données depuis le serveur. Vérifiez que le backend Laravel est démarré.');
        // Continuer avec les autres données même si étudiants échoue
        try {
          await teachers.refreshEntities();
          await subjects.refreshEntities();
          await classes.refreshEntities();
        } catch (secondaryError) {
          console.error('Erreur chargement context secondaire:', secondaryError);
        }
      }
    };

    loadContextData();
  }, [students, teachers, subjects, classes]);

  const recentEvents: { title: string; status: string; location: string; date: string; time: string }[] = dashboardData?.recentEvents || [];

  const kpis = useMemo(() => {
    // Utiliser les KPIs du backend si disponibles, sinon fallback vers les données context
    if (dashboardData?.kpis && dashboardData.kpis.length > 0) {
      return dashboardData.kpis.map(kpi => ({
        label: kpi.label,
        value: typeof kpi.value === 'number' ? kpi.value.toString() : kpi.value,
        trend: kpi.trend as 'positive' | 'negative' | 'stable',
        period: kpi.period
      }));
    }
    
    // Fallback vers les données context si l'API ne retourne pas de KPIs
    return [
      { label: 'Étudiants', value: students.entities.length.toString(), trend: 'positive' as const, period: 'Actuel' },
      { label: 'Enseignants', value: teachers.entities.length.toString(), trend: 'positive' as const, period: 'Actuel' },
      { label: 'Matières', value: subjects.entities.length.toString(), trend: 'positive' as const, period: 'Actuel' },
      { label: 'Classes', value: classes.entities.length.toString(), trend: 'positive' as const, period: 'Actuel' },
    ];
  }, [dashboardData?.kpis, students.entities.length, teachers.entities.length, subjects.entities.length, classes.entities.length]);

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
        
        {apiError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  {apiError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8">
          
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

        {/* Lists Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Students */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-poppins font-medium text-gray-900">
                  Derniers étudiants
                </h2>
                <User className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {students.entities.slice(0, 5).map((student) => (
                  <div key={student.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-poppins font-medium text-gray-900">
                          {student.user?.name || 'N/A'}
                        </p>
                        <p className="text-xs font-poppins text-gray-500">
                          {student.registration_number}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-poppins text-gray-400">
                      {student.classe?.name || 'N/A'}
                    </span>
                  </div>
                ))}
                {students.entities.length === 0 && (
                  <p className="text-sm font-poppins text-gray-500 text-center py-4">
                    Aucun étudiant trouvé
                  </p>
                )}
              </div>
              
              <button className="w-full mt-4 py-2 text-sm font-poppins font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                Voir tous les étudiants
              </button>
            </div>
          </div>

          {/* Recent Teachers */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-poppins font-medium text-gray-900">
                  Derniers enseignants
                </h2>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {teachers.entities.slice(0, 5).map((teacher) => (
                  <div key={teacher.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-poppins font-medium text-gray-900">
                          {teacher.user?.name || 'N/A'}
                        </p>
                        <p className="text-xs font-poppins text-gray-500">
                          {teacher.department || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-poppins text-gray-400">
                      {teacher.specialization || 'N/A'}
                    </span>
                  </div>
                ))}
                {teachers.entities.length === 0 && (
                  <p className="text-sm font-poppins text-gray-500 text-center py-4">
                    Aucun enseignant trouvé
                  </p>
                )}
              </div>
              
              <button className="w-full mt-4 py-2 text-sm font-poppins font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                Voir tous les enseignants
              </button>
            </div>
          </div>

          {/* Subjects List */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-poppins font-medium text-gray-900">
                  Matières
                </h2>
                <BookOpen className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {subjects.entities.slice(0, 5).map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-poppins font-medium text-gray-900">
                          {subject.name}
                        </p>
                        <p className="text-xs font-poppins text-gray-500">
                          {subject.code || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-poppins text-gray-400">
                      {subject.coefficient || 0} coeff.
                    </span>
                  </div>
                ))}
                {subjects.entities.length === 0 && (
                  <p className="text-sm font-poppins text-gray-500 text-center py-4">
                    Aucune matière trouvée
                  </p>
                )}
              </div>
              
              <button className="w-full mt-4 py-2 text-sm font-poppins font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                Voir toutes les matières
              </button>
            </div>
          </div>

          {/* Classes List */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-poppins font-medium text-gray-900">
                  Classes
                </h2>
                <GraduationCap className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {classes.entities.slice(0, 5).map((classe) => (
                  <div key={classe.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-poppins font-medium text-gray-900">
                          {classe.name}
                        </p>
                        <p className="text-xs font-poppins text-gray-500">
                          {classe.level || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-poppins text-gray-400">
                      {classe.capacity || 0} places
                    </span>
                  </div>
                ))}
                {classes.entities.length === 0 && (
                  <p className="text-sm font-poppins text-gray-500 text-center py-4">
                    Aucune classe trouvée
                  </p>
                )}
              </div>
              
              <button className="w-full mt-4 py-2 text-sm font-poppins font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                Voir toutes les classes
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}