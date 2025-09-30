"use client";

import React, { useState, useEffect } from "react";
import StudentPageHeader from "../_components/page-header";
import StudentSessionGrid from "./_components/StudentSessionGrid";
import { RefreshCw, AlertCircle } from "lucide-react";
import { StudentSessionsService, StudentSession } from "../_services/sessions.service";

export default function StudentSessionsPage() {
  const [sessions, setSessions] = useState<StudentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fonction pour récupérer les sessions
  const fetchSessions = async () => {
    try {
      setError(null);
      const sessionsData = await StudentSessionsService.getAvailableSessions();
      setSessions(sessionsData);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des sessions:', err);

      // Gestion spécifique des erreurs d'authentification
      if (err.response?.status === 401) {
        setError('Votre session a expiré. Veuillez vous reconnecter.');
      } else if (err.response?.status === 403) {
        setError('Accès non autorisé. Vous n\'avez pas les permissions nécessaires.');
      } else if (err.response?.status === 404) {
        setError('Endpoint non trouvé. Veuillez vérifier la configuration.');
      } else if (err.message?.includes('Network Error')) {
        setError('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
      } else {
        setError(err.response?.data?.error || err.message || 'Une erreur est survenue lors du chargement des sessions');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Chargement initial des sessions
  useEffect(() => {
    fetchSessions();
  }, []);

  // Fonction pour rafraîchir les sessions
  const handleRefresh = () => {
    setRefreshing(true);
    fetchSessions();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentPageHeader
          title="Sessions d'examen"
          subtitle="Consultez et participez aux examens disponibles"
        />
        <div className="px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 aspect-square">
                    <div className="h-full flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isAuthError = error.includes('expiré') || error.includes('non autorisé');

    return (
      <div className="min-h-screen bg-white">
        <StudentPageHeader
          title="Sessions d'examen"
          subtitle="Consultez et participez aux examens disponibles"
        />
        <div className="px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {isAuthError ? 'Erreur d\'authentification' : 'Erreur de chargement'}
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!isAuthError && (
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Réessayer
                </button>
              )}

              {isAuthError && (
                <button
                  onClick={() => window.location.href = "/auth/sign-in/student"}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Se reconnecter
                </button>
              )}

              {!isAuthError && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Recharger la page
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <StudentPageHeader
        title="Sessions d'examen"
        subtitle="Consultez et participez aux examens disponibles"
      />

      {/* Bouton de rafraîchissement */}
      {sessions.length > 0 && (
        <div className="px-8 pt-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium inline-flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? "Rafraîchissement..." : "Rafraîchir"}
          </button>
        </div>
      )}

      <div className="px-8 py-8">
        <StudentSessionGrid sessions={sessions} />
      </div>
    </div>
  );
}