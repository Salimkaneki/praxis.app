'use client';
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Users, Eye, Clock, CheckCircle, XCircle, Award,
  Calendar, Download, MoreVertical,
  User, TrendingUp, Target, BookOpen, Loader2, AlertCircle
} from "lucide-react";
import TeacherPageHeader from "../../_components/page-header";
import KPIGrid from "@/components/ui/Cards/kpi-grid";
import resultService, { StudentSubmission } from "../_services/result.service";// Données mockées pour 6 étudiants
const mockSubmissions: StudentSubmission[] = [
  {
    id: 1,
    student: {
      id: 101,
      name: "Marie Dupont",
      email: "marie.dupont@etudiant.fr"
    },
    score: 85,
    maxScore: 100,
    percentage: 85,
    status: 'completed',
    submittedAt: '2024-03-15T14:30:00Z',
    duration: 25,
    questionsAnswered: 20,
    totalQuestions: 20
  },
  {
    id: 2,
    student: {
      id: 102,
      name: "Jean Martin",
      email: "jean.martin@etudiant.fr"
    },
    score: 92,
    maxScore: 100,
    percentage: 92,
    status: 'completed',
    submittedAt: '2024-03-15T14:45:00Z',
    duration: 22,
    questionsAnswered: 20,
    totalQuestions: 20
  },
  {
    id: 3,
    student: {
      id: 103,
      name: "Sophie Leroy",
      email: "sophie.leroy@etudiant.fr"
    },
    score: 78,
    maxScore: 100,
    percentage: 78,
    status: 'completed',
    submittedAt: '2024-03-15T15:10:00Z',
    duration: 28,
    questionsAnswered: 19,
    totalQuestions: 20
  },
  {
    id: 4,
    student: {
      id: 104,
      name: "Pierre Moreau",
      email: "pierre.moreau@etudiant.fr"
    },
    score: 67,
    maxScore: 100,
    percentage: 67,
    status: 'completed',
    submittedAt: '2024-03-15T15:25:00Z',
    duration: 30,
    questionsAnswered: 18,
    totalQuestions: 20
  },
  {
    id: 5,
    student: {
      id: 105,
      name: "Camille Bernard",
      email: "camille.bernard@etudiant.fr"
    },
    score: 95,
    maxScore: 100,
    percentage: 95,
    status: 'completed',
    submittedAt: '2024-03-15T16:00:00Z',
    duration: 20,
    questionsAnswered: 20,
    totalQuestions: 20
  },
  {
    id: 6,
    student: {
      id: 106,
      name: "Lucas Petit",
      email: "lucas.petit@etudiant.fr"
    },
    score: 73,
    maxScore: 100,
    percentage: 73,
    status: 'completed',
    submittedAt: '2024-03-15T16:15:00Z',
    duration: 27,
    questionsAnswered: 20,
    totalQuestions: 20
  }
];

const QuizParticipationPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <QuizParticipationContent />
    </Suspense>
  );
};

const QuizParticipationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données de participation au montage
  useEffect(() => {
    if (sessionId) {
      loadParticipation(parseInt(sessionId));
    } else {
      setError('ID de session manquant');
      setLoading(false);
    }
  }, [sessionId]);

  const loadParticipation = async (sessionId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await resultService.getSessionParticipation(sessionId);
      setSubmissions(data);
    } catch (err) {
      console.error('Erreur lors du chargement de la participation:', err);
      setError('Impossible de charger les données de participation');
    } finally {
      setLoading(false);
    }
  };

  // Calculs des statistiques
  const completedSubmissions = submissions.filter(s => s.status === 'completed');
  const averageScore = completedSubmissions.length > 0
    ? completedSubmissions.reduce((acc, s) => acc + s.score, 0) / completedSubmissions.length
    : 0;
  const highestScore = completedSubmissions.length > 0
    ? Math.max(...completedSubmissions.map(s => s.score))
    : 0;
  const lowestScore = completedSubmissions.length > 0
    ? Math.min(...completedSubmissions.map(s => s.score))
    : 0;

  // KPIs pour le composant KPIGrid
  const kpis = [
    {
      label: "Participations",
      value: completedSubmissions.length,
      period: "étudiants",
      trend: "positive" as const
    },
    {
      label: "Score moyen",
      value: `${averageScore.toFixed(1)}/100`,
      period: "moyenne",
      trend: "positive" as const
    },
    {
      label: "Meilleur score",
      value: highestScore,
      period: "maximum",
      trend: "positive" as const
    },
    {
      label: "Score le plus bas",
      value: lowestScore,
      period: "minimum",
      trend: "negative" as const
    }
  ];

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 bg-green-100";
    if (percentage >= 75) return "text-blue-600 bg-blue-100";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getGradeLabel = (percentage: number) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 75) return "Bien";
    if (percentage >= 60) return "Assez bien";
    return "Insuffisant";
  };

  const handleViewStudentDetails = (studentId: number) => {
    // Navigation vers les réponses détaillées de l'étudiant avec le sessionId
    router.push(`/teachers-dashboard/results/participation/student/${studentId}?sessionId=${sessionId}`);
  };

  const handleExportResults = () => {
    // TODO: Implémenter l'export des résultats
    console.log("Exporter les résultats");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Chargement de la participation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins">
        <TeacherPageHeader
          title="Erreur de chargement"
          subtitle="Impossible de charger les données de participation"
          backButton={{
            onClick: () => router.back()
          }}
        />
        <div className="px-8 py-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Erreur de chargement</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => sessionId && loadParticipation(parseInt(sessionId))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <TeacherPageHeader
        title="Participation des étudiants"
        subtitle={`${completedSubmissions.length} étudiants • Score moyen: ${averageScore.toFixed(1)}/100`}
        actionButton={{
          label: "Exporter les résultats",
          icon: <Download className="w-4 h-4 mr-2" />,
          onClick: handleExportResults
        }}
        backButton={{
          onClick: () => router.back()
        }}
      />

      <div className="px-8 py-8">
  <div className="w-full">
          {/* Statistiques rapides */}
          <KPIGrid kpis={kpis} />

          {/* Informations communes du quiz */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Détails du quiz
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Date du quiz</p>
                  <p className="text-sm text-gray-600">{submissions.length > 0 ? formatDate(submissions[0].submittedAt) : 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Questions totales</p>
                  <p className="text-sm text-gray-600">{submissions.length > 0 ? submissions[0].totalQuestions : 0} questions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Durée moyenne</p>
                  <p className="text-sm text-gray-600">{formatDuration(Math.round(completedSubmissions.reduce((acc, s) => acc + s.duration, 0) / completedSubmissions.length))}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des participations */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Participations des étudiants
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {submissions.map((submission) => (
                <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>

                      {/* Informations étudiant */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-gray-900">{submission.student.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(submission.percentage)}`}>
                            {getGradeLabel(submission.percentage)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDuration(submission.duration)}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            {submission.questionsAnswered}/{submission.totalQuestions} questions
                          </span>
                          <span>Soumis le {formatDate(submission.submittedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Score et actions */}
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {submission.score}<span className="text-base text-gray-500">/{submission.maxScore}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {submission.percentage}%
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewStudentDetails(submission.student.id)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir les réponses détaillées"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {submissions.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune participation trouvée</h3>
                <p className="text-gray-600">
                  Les étudiants n'ont pas encore participé à ce quiz.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizParticipationPage;