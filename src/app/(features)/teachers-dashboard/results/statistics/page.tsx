'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import {
  BarChart3, TrendingUp, TrendingDown, Users,
  Target, Clock, Award, AlertTriangle,
  Calendar, BookOpen, PieChart, Activity,
  Loader2, RefreshCw
} from "lucide-react";
import TeacherPageHeader from "../../_components/page-header";
import KPIGrid from "../../_components/kpi-grid";

// Types pour les statistiques
interface QuestionStats {
  id: number;
  questionText: string;
  type: string;
  totalResponses: number;
  correctResponses: number;
  incorrectResponses: number;
  averageTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface StudentPerformance {
  id: number;
  name: string;
  email: string;
  totalScore: number;
  averageTime: number;
  questionsAnswered: number;
  correctAnswers: number;
  improvement: number; // Pourcentage d'amélioration
}

interface TimeDistribution {
  range: string;
  count: number;
  percentage: number;
}

const AdvancedStatisticsPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'semester'>('month');

  // Données simulées pour les statistiques
  const questionStats: QuestionStats[] = [
    {
      id: 1,
      questionText: "Quel est le rôle principal d'un algorithme ?",
      type: "multiple_choice",
      totalResponses: 25,
      correctResponses: 20,
      incorrectResponses: 5,
      averageTime: 45,
      difficulty: 'easy'
    },
    {
      id: 2,
      questionText: "Quelle structure de contrôle permet de répéter...",
      type: "multiple_choice",
      totalResponses: 25,
      correctResponses: 15,
      incorrectResponses: 10,
      averageTime: 67,
      difficulty: 'medium'
    },
    {
      id: 3,
      questionText: "En programmation, une variable est un espace...",
      type: "true_false",
      totalResponses: 25,
      correctResponses: 22,
      incorrectResponses: 3,
      averageTime: 23,
      difficulty: 'easy'
    }
  ];

  const studentPerformance: StudentPerformance[] = [
    {
      id: 1,
      name: "Dupont Marie",
      email: "marie.dupont@email.com",
      totalScore: 85,
      averageTime: 32,
      questionsAnswered: 20,
      correctAnswers: 17,
      improvement: 12
    },
    {
      id: 2,
      name: "Martin Jean",
      email: "jean.martin@email.com",
      totalScore: 92,
      averageTime: 28,
      questionsAnswered: 20,
      correctAnswers: 18,
      improvement: 8
    },
    {
      id: 3,
      name: "Leroy Sophie",
      email: "sophie.leroy@email.com",
      totalScore: 78,
      averageTime: 35,
      questionsAnswered: 19,
      correctAnswers: 15,
      improvement: -3
    }
  ];

  const timeDistribution: TimeDistribution[] = [
    { range: "0-15 min", count: 3, percentage: 12 },
    { range: "15-30 min", count: 12, percentage: 48 },
    { range: "30-45 min", count: 8, percentage: 32 },
    { range: "45+ min", count: 2, percentage: 8 }
  ];

  useEffect(() => {
    // Simulation du chargement
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (improvement < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const advancedKPIs = [
    {
      label: "Temps moyen par question",
      value: "42s",
      period: "moyenne",
      trend: "positive" as const
    },
    {
      label: "Taux de completion",
      value: "96%",
      period: "global",
      trend: "positive" as const
    },
    {
      label: "Questions difficiles",
      value: questionStats.filter(q => q.difficulty === 'hard').length.toString(),
      period: "identifiées",
      trend: "positive" as const
    },
    {
      label: "Amélioration moyenne",
      value: "+5.6%",
      period: "par étudiant",
      trend: "positive" as const
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Chargement des statistiques avancées...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <TeacherPageHeader
        title="Statistiques avancées"
        subtitle="Analyse détaillée des performances et tendances"
        backButton={{
          onClick: () => router.back()
        }}
        actionButton={{
          label: "Actualiser",
          icon: <RefreshCw className="w-4 h-4 mr-2" />,
          onClick: () => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1000);
          }
        }}
      />

      <div className="px-8 py-8">
        <div className="space-y-8">
          {/* Période de sélection */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Période d'analyse</h3>
                <p className="text-xs text-gray-600">Sélectionnez la période pour les statistiques</p>
              </div>
              <div className="flex items-center gap-2">
                {(['week', 'month', 'semester'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedPeriod === period
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period === 'week' ? 'Semaine' : period === 'month' ? 'Mois' : 'Semestre'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* KPIs avancés */}
          <KPIGrid kpis={advancedKPIs} />

          {/* Statistiques par question */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Performance par question</h2>
                  <p className="text-sm text-gray-600">Analyse détaillée de chaque question</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {questionStats.map((question) => (
                <div key={question.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          Question {question.id}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty === 'easy' ? 'Facile' : question.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {question.type === 'multiple_choice' ? 'QCM' : question.type === 'true_false' ? 'Vrai/Faux' : 'Libre'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{question.questionText}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((question.correctResponses / question.totalResponses) * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Taux de réussite</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {question.averageTime}s
                      </div>
                      <div className="text-xs text-gray-600">Temps moyen</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {question.totalResponses}
                      </div>
                      <div className="text-xs text-gray-600">Réponses totales</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {question.incorrectResponses}
                      </div>
                      <div className="text-xs text-gray-600">Erreurs</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance des étudiants */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Performance des étudiants</h2>
                  <p className="text-sm text-gray-600">Classement et évolution des étudiants</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {studentPerformance.map((student, index) => (
                <div key={student.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{student.totalScore}%</div>
                        <div className="text-xs text-gray-600">Score total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{student.averageTime}s</div>
                        <div className="text-xs text-gray-600">Temps moyen</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {Math.round((student.correctAnswers / student.questionsAnswered) * 100)}%
                        </div>
                        <div className="text-xs text-gray-600">Précision</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getImprovementIcon(student.improvement)}
                        <span className={`text-sm font-medium ${
                          student.improvement > 0 ? 'text-green-600' :
                          student.improvement < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {student.improvement > 0 ? '+' : ''}{student.improvement}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution temporelle */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Distribution temporelle</h2>
                  <p className="text-sm text-gray-600">Répartition des temps de completion</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {timeDistribution.map((range) => (
                  <div key={range.range} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-gray-600">{range.range}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${range.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right">
                      <span className="text-sm font-medium text-gray-900">{range.count}</span>
                      <span className="text-xs text-gray-600 ml-1">({range.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedStatisticsPage;