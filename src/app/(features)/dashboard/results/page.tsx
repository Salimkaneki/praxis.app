'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import KPIGrid, { KPI } from "@/components/ui/Cards/kpi-grid";
import ExamResultCard, { ExamResult } from "../../teachers-dashboard/_components/ExamResultCard";
import { BarChart3, Loader2, Download, TrendingUp } from "lucide-react";
import adminResultService from "../_services/admin-result.service";

// Données mockées pour les sessions (2 sessions comme demandé)
const mockExamResults: ExamResult[] = [
  {
    id: 1,
    session_id: 1,
    session_title: "Évaluation Nationale - Mathématiques Terminale",
    exam_date: "2024-12-15T14:00:00Z",
    total_participants: 150,
    completed_participants: 145,
    average_score: 72.3,
    highest_score: 98,
    lowest_score: 35,
    pass_rate: 78.6,
    duration_minutes: 180,
    quiz_title: "Baccalauréat Blanc - Mathématiques",
    class_name: "Terminale S",
    status: "completed",
    created_at: "2024-12-15T17:00:00Z"
  },
  {
    id: 2,
    session_id: 2,
    session_title: "Contrôle Continu - Français Première",
    exam_date: "2024-12-14T10:00:00Z",
    total_participants: 120,
    completed_participants: 118,
    average_score: 68.9,
    highest_score: 95,
    lowest_score: 42,
    pass_rate: 74.2,
    duration_minutes: 120,
    quiz_title: "Évaluation Littéraire - 19ème siècle",
    class_name: "Première L",
    status: "completed",
    created_at: "2024-12-14T12:30:00Z"
  }
];

export default function AdminResultsPage() {
  const router = useRouter();
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les résultats au montage du composant
  useEffect(() => {
    loadExamResults();
  }, []);

  const loadExamResults = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Chargement des résultats depuis l\'API...');

      // Récupérer les sessions de quiz disponibles
      const sessions = await adminResultService.getAvailableQuizSessions();
      console.log('Sessions récupérées:', sessions);

      // Vérifier si sessions est un tableau
      if (!Array.isArray(sessions)) {
        console.warn('Sessions n\'est pas un tableau, utilisation des données mockées');
        setExamResults(mockExamResults);
        return;
      }

      if (sessions.length === 0) {
        console.log('Aucune session trouvée, utilisation des données mockées');
        setExamResults(mockExamResults);
        return;
      }

      // Transformer les sessions en format ExamResult pour les cartes
      const transformedResults: ExamResult[] = sessions.map(session => ({
        id: session.id,
        session_id: session.id,
        session_title: session.title || 'Session sans titre',
        exam_date: session.created_at, // Utiliser created_at comme date d'examen
        total_participants: session.total_participants || 0,
        completed_participants: session.completed_participants || 0,
        average_score: 0, // Sera calculé plus tard si nécessaire
        highest_score: 0,
        lowest_score: 0,
        pass_rate: 0,
        duration_minutes: 60, // Valeur par défaut
        quiz_title: session.quiz_title || 'Quiz sans titre',
        class_name: session.class_name || 'Classe inconnue',
        status: session.status === 'completed' ? 'completed' : 'in_progress',
        created_at: session.created_at
      }));

      console.log('Résultats transformés:', transformedResults);
      setExamResults(transformedResults);
    } catch (err: any) {
      console.error('Erreur lors du chargement des résultats:', err);
      console.error('Détails de l\'erreur:', err.response?.data);
      console.log('Utilisation des données mockées en fallback');
      setError(err.message || 'Impossible de charger les résultats. Veuillez réessayer.');
      // Fallback vers les données mockées en cas d'erreur
      setExamResults(mockExamResults);
    } finally {
      setLoading(false);
    }
  };

  const handleResultDeleted = async (resultId: number) => {
    try {
      // Simulation de suppression
      setExamResults(prev => prev.filter(result => result.id !== resultId));
    } catch (err) {
      setError('Erreur lors de la suppression du résultat');
    }
  };

  const calculateOverallStats = () => {
    if (examResults.length === 0) return null;

    const totalSessions = examResults.length;
    const totalParticipants = examResults.reduce((sum, result) => sum + result.completed_participants, 0);
    const averageScore = examResults.reduce((sum, result) => sum + result.average_score, 0) / totalSessions;
    const averagePassRate = examResults.reduce((sum, result) => sum + result.pass_rate, 0) / totalSessions;

    return {
      totalSessions,
      totalParticipants,
      averageScore: averageScore.toFixed(1),
      averagePassRate: averagePassRate.toFixed(1)
    };
  };

  const stats = calculateOverallStats();

  // Création des KPIs à partir des statistiques calculées
  const kpis: KPI[] = stats ? [
    {
      label: "Sessions totales",
      value: stats.totalSessions,
      trend: "positive",
      period: "Ce mois"
    },
    {
      label: "Participants",
      value: stats.totalParticipants,
      trend: "positive",
      period: "Toutes sessions"
    },
    {
      label: "Score moyen",
      value: `${stats.averageScore}%`,
      trend: parseFloat(stats.averageScore) > 70 ? "positive" : "negative",
      period: "Global"
    },
    {
      label: "Taux de réussite",
      value: `${stats.averagePassRate}%`,
      trend: parseFloat(stats.averagePassRate) > 75 ? "positive" : "negative",
      period: "Moyenne"
    }
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 font-poppins">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Résultats d'examens</h1>
            <p className="text-sm text-gray-600 mt-1">
              Vue d'ensemble des performances des étudiants
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard/results/export')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
            <button
              onClick={() => router.push('/dashboard/results/statistics')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Statistiques
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPIs avec le composant KPIGrid */}
        {stats && <KPIGrid kpis={kpis} />}

        {/* Section des résultats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Sessions d'examen</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {examResults.length} session{examResults.length > 1 ? 's' : ''} d'examen
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {error ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Erreur de chargement</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
                <button
                  onClick={loadExamResults}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            ) : examResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {examResults.map((result, index) => (
                  <ExamResultCard
                    key={result.id}
                    result={result}
                    index={index}
                    onDelete={handleResultDeleted}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Aucun résultat d'examen</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Les résultats des examens apparaîtront ici une fois que les sessions seront terminées.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}