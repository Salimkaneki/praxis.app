'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TeacherPageHeader from "../_components/page-header";
import ExamResultCard, { ExamResult } from "../_components/ExamResultCard";
import KPIGrid, { KPI } from "../_components/kpi-grid";
import { Plus, BarChart3, Loader2 } from "lucide-react";
import resultService from "./_services/result.service";

// Données d'exemple pour les résultats d'examen
const mockExamResults: ExamResult[] = [
  {
    id: 1,
    session_id: 1,
    session_title: "Examen de Mathématiques - Algèbre",
    exam_date: "2024-12-15T14:00:00Z",
    total_participants: 25,
    completed_participants: 23,
    average_score: 78.5,
    highest_score: 95,
    lowest_score: 45,
    pass_rate: 82.6,
    duration_minutes: 90,
    quiz_title: "Quiz Mathématiques - Chapitre 5",
    class_name: "Terminale S",
    status: "completed",
    created_at: "2024-12-15T16:30:00Z"
  },
  {
    id: 2,
    session_id: 2,
    session_title: "Test de Français - Grammaire",
    exam_date: "2024-12-14T10:00:00Z",
    total_participants: 30,
    completed_participants: 28,
    average_score: 65.3,
    highest_score: 89,
    lowest_score: 32,
    pass_rate: 71.4,
    duration_minutes: 60,
    quiz_title: "Évaluation Français - Conjugaison",
    class_name: "Première L",
    status: "completed",
    created_at: "2024-12-14T11:30:00Z"
  },
  {
    id: 3,
    session_id: 3,
    session_title: "Contrôle de Sciences Physiques",
    exam_date: "2024-12-13T15:30:00Z",
    total_participants: 22,
    completed_participants: 20,
    average_score: 85.7,
    highest_score: 98,
    lowest_score: 68,
    pass_rate: 95.0,
    duration_minutes: 75,
    quiz_title: "Quiz Physique - Électricité",
    class_name: "Terminale S",
    status: "completed",
    created_at: "2024-12-13T17:00:00Z"
  },
  {
    id: 4,
    session_id: 4,
    session_title: "Examen d'Histoire - Révolution",
    exam_date: "2024-12-12T09:00:00Z",
    total_participants: 28,
    completed_participants: 25,
    average_score: 72.1,
    highest_score: 94,
    lowest_score: 41,
    pass_rate: 80.0,
    duration_minutes: 120,
    quiz_title: "Quiz Histoire - 18ème siècle",
    class_name: "Première ES",
    status: "completed",
    created_at: "2024-12-12T12:00:00Z"
  },
  {
    id: 5,
    session_id: 5,
    session_title: "Test d'Anglais - Vocabulaire",
    exam_date: "2024-12-11T14:00:00Z",
    total_participants: 26,
    completed_participants: 24,
    average_score: 58.9,
    highest_score: 87,
    lowest_score: 28,
    pass_rate: 62.5,
    duration_minutes: 45,
    quiz_title: "Quiz Anglais - Unit 3",
    class_name: "Seconde",
    status: "completed",
    created_at: "2024-12-11T15:30:00Z"
  },
  {
    id: 6,
    session_id: 6,
    session_title: "Évaluation Géographie",
    exam_date: "2024-12-10T11:00:00Z",
    total_participants: 32,
    completed_participants: 30,
    average_score: 76.4,
    highest_score: 96,
    lowest_score: 52,
    pass_rate: 86.7,
    duration_minutes: 80,
    quiz_title: "Quiz Géographie - Europe",
    class_name: "Première L",
    status: "completed",
    created_at: "2024-12-10T13:00:00Z"
  }
];

export default function ResultsPage() {
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
      const results = await resultService.getExamResults();
      setExamResults(results);
    } catch (err) {
      setError('Impossible de charger les résultats. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleResultDeleted = async (resultId: number) => {
    try {
      await resultService.deleteResult(resultId);
      // Recharger la liste après suppression
      await loadExamResults();
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-poppins">
      <TeacherPageHeader
        title="Résultats"
        subtitle="Consultez et analysez les résultats de vos sessions"
      />

      <div className="p-6 space-y-6">
        {/* KPIs avec le composant KPIGrid */}
        {stats && <KPIGrid kpis={kpis} />}

        {/* Header avec actions */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Derniers résultats</h2>
            <p className="text-sm text-gray-600 mt-1">
              {examResults.length} résultat{examResults.length > 1 ? 's' : ''} d'examen
            </p>
          </div>
          <button
            onClick={() => router.push('/teachers-dashboard/results/export')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Exporter tout
          </button>
          <button
            onClick={() => router.push('/teachers-dashboard/results/statistics')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Statistiques avancées
          </button>
        </div>

        {/* Grille des cartes de résultats */}
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
              Les résultats des examens apparaîtront ici une fois que vos étudiants auront terminé leurs sessions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}