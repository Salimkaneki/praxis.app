"use client";
import React from "react";
import StudentPageHeader from "./_components/page-header";
import KPIGrid from "./_components/kpi-grid";
import { BookOpen, Trophy, Clock, Target, Calendar, Play } from "lucide-react";

export default function StudentDashboardPage() {
  // Données mockées pour développement
  const availableQuizzes = [
    {
      id: 1,
      title: "Mathématiques - Chapitre 1",
      subject: "Mathématiques",
      teacher: "M. Dupont",
      questions: 20,
      duration: 30,
      dueDate: "2025-09-15"
    },
    {
      id: 2,
      title: "Réseaux - Modèle OSI",
      subject: "Réseaux",
      teacher: "Mme. Martin",
      questions: 15,
      duration: 25,
      dueDate: "2025-09-18"
    },
    {
      id: 3,
      title: "Développement Web - HTML/CSS",
      subject: "Informatique",
      teacher: "M. Leroy",
      questions: 25,
      duration: 45,
      dueDate: "2025-09-20"
    },
  ];

  const recentResults = [
    {
      id: 1,
      title: "Algorithmes - Tri et recherche",
      score: 85,
      maxScore: 100,
      percentage: 85,
      completedAt: "2025-09-10",
      status: "completed"
    },
    {
      id: 2,
      title: "Bases de données - SQL",
      score: 92,
      maxScore: 100,
      percentage: 92,
      completedAt: "2025-09-08",
      status: "completed"
    },
    {
      id: 3,
      title: "Programmation Orientée Objet",
      score: 78,
      maxScore: 100,
      percentage: 78,
      completedAt: "2025-09-05",
      status: "completed"
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: "Projet Final - Application Web",
      dueDate: "2025-09-25",
      subject: "Développement Web"
    },
    {
      id: 2,
      title: "Rapport - Analyse de données",
      dueDate: "2025-09-22",
      subject: "Statistiques"
    },
  ];

  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* HEADER */}
      <StudentPageHeader
        title="Mon Espace Étudiant"
        subtitle="Suivez vos cours, quiz et résultats"
      />

      {/* KPIS RAPIDES */}
      <div className="px-8 py-8">
        <KPIGrid
          kpis={[
            { label: "Cours inscrits", value: 6, trend: "positive", period: "Ce semestre" },
            { label: "Quiz complétés", value: 12, trend: "positive", period: "Ce mois" },
            { label: "Score moyen", value: "87%", trend: "positive", period: "Derniers quiz" },
            { label: "Quiz en attente", value: 3, trend: "neutral", period: "À faire" },
          ]}
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-8 pb-12">

        {/* QUIZ DISPONIBLES */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-poppins font-medium text-gray-900">
              Quiz disponibles
            </h2>
            <BookOpen className="w-5 h-5 text-gray-400" />
          </div>

          <div className="divide-y divide-gray-200">
            {availableQuizzes.map((quiz) => (
              <div key={quiz.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{quiz.title}</h3>
                    <p className="text-sm text-gray-600">{quiz.subject} • {quiz.teacher}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {quiz.questions} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {quiz.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Échéance: {new Date(quiz.dueDate).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-forest-600 text-white text-sm font-medium rounded-lg hover:bg-forest-700 transition-colors">
                    <Play className="w-4 h-4" />
                    Commencer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PANNEAU DROIT */}
        <div className="space-y-6">

          {/* RÉSULTATS RÉCENTS */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-poppins font-medium text-gray-900">
                Derniers résultats
              </h2>
              <Trophy className="w-5 h-5 text-gray-400" />
            </div>
            <div className="p-6 space-y-4">
              {recentResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(result.completedAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {result.score}/{result.maxScore}
                    </p>
                    <p className={`text-xs font-medium ${
                      result.percentage >= 80 ? 'text-green-600' :
                      result.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {result.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ÉCHÉANCES */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-poppins font-medium text-gray-900">
                Échéances proches
              </h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="p-6 space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                    <p className="text-sm text-gray-600">{deadline.subject}</p>
                    <p className="text-xs text-gray-500">
                      Échéance: {new Date(deadline.dueDate).toLocaleDateString("fr-FR")}
                    </p>
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