'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { 
  Users, Eye, Clock, CheckCircle, XCircle, Award,
  Calendar, Download, MoreVertical,
  User, TrendingUp, Target, BookOpen
} from "lucide-react";
import TeacherPageHeader from "../../_components/page-header";
import KPIGrid from "@/components/ui/Cards/kpi-grid";

// Interface pour les soumissions d'étudiants
interface StudentSubmission {
  id: number;
  student: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  score: number;
  maxScore: number;
  percentage: number;
  status: 'completed' | 'in_progress' | 'not_started';
  submittedAt: string;
  duration: number; // en minutes
  questionsAnswered: number;
  totalQuestions: number;
}

// Données mockées pour 6 étudiants
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

const QuizSubmissionsPage = () => {
  const router = useRouter();
  const [submissions] = useState<StudentSubmission[]>(mockSubmissions);

  // Calculs des statistiques
  const completedSubmissions = submissions.filter(s => s.status === 'completed');
  const averageScore = completedSubmissions.reduce((acc, s) => acc + s.score, 0) / completedSubmissions.length;
  const highestScore = Math.max(...completedSubmissions.map(s => s.score));
  const lowestScore = Math.min(...completedSubmissions.map(s => s.score));

  // KPIs pour le composant KPIGrid
  const kpis = [
    {
      label: "Soumissions",
      value: completedSubmissions.length,
      period: "total",
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

  const handleViewDetails = (submissionId: number) => {
    // TODO: Naviguer vers la page de détails de la soumission
    console.log(`Voir détails soumission ${submissionId}`);
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

  // Filtrer et trier les soumissions
  const filteredAndSortedSubmissions = submissions;

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <TeacherPageHeader
        title="Résultats du Quiz"
        subtitle={`${completedSubmissions.length} soumissions • Score moyen: ${averageScore.toFixed(1)}/100`}
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
        <div className="max-w-6xl mx-auto">
          {/* Statistiques rapides */}
          <KPIGrid kpis={kpis} />

          {/* Liste des soumissions */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Soumissions des étudiants
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredAndSortedSubmissions.map((submission) => (
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
                        <p className="text-sm text-gray-500">{submission.student.email}</p>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(submission.submittedAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDuration(submission.duration)}
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            {submission.questionsAnswered}/{submission.totalQuestions} questions
                          </div>
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
                        onClick={() => handleViewDetails(submission.id)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir les détails"
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

            {filteredAndSortedSubmissions.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune soumission trouvée</h3>
                <p className="text-gray-600">
                  Les étudiants n'ont pas encore soumis ce quiz.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSubmissionsPage;