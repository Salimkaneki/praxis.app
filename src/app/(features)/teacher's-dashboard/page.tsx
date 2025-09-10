"use client";
import React from "react";
import TeacherPageHeader from "./_components/page-header";
import KPIGrid from "./_components/kpi-grid";
import { Eye, Edit3, Trash2, Plus, Calendar } from "lucide-react";

export default function TeacherDashboardPage() {
  const quizzes = [
    { 
      id: 1, 
      title: "Examen de Mathématiques - Chapitre 1", 
      className: "L1 Informatique", 
      questions: 20, 
      createdAt: "2025-09-05" 
    },
    { 
      id: 2, 
      title: "Quiz Réseaux - Modèle OSI", 
      className: "L2 Réseaux", 
      questions: 15, 
      createdAt: "2025-09-07" 
    },
    { 
      id: 3, 
      title: "Projet Final - Développement Web", 
      className: "M1 Génie Logiciel", 
      questions: 25, 
      createdAt: "2025-09-09" 
    },
  ];

  const upcomingEvaluations = [
    { 
      id: 1, 
      title: "Devoir Surveillé - Algorithmes", 
      date: "2025-09-12", 
      time: "10:00", 
      className: "L1 Informatique" 
    },
    { 
      id: 2, 
      title: "Quiz - Administration Systèmes", 
      date: "2025-09-14", 
      time: "14:00", 
      className: "L2 Réseaux" 
    },
    { 
      id: 3, 
      title: "Examen Partiel - Bases de Données", 
      date: "2025-09-18", 
      time: "09:00", 
      className: "M1 Génie Logiciel" 
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <TeacherPageHeader 
        title="Tableau de bord" 
        subtitle="Vue d'ensemble de vos classes, quiz et évaluations"
      />

      {/* KPIS RAPIDES */}
      <div className="px-8 py-8">
        <KPIGrid 
          kpis={[
            { label: "Nombre d'élèves", value: 120, trend: "positive", period: "Depuis le mois dernier" },
            { label: "Évaluations complétées", value: 45, trend: "negative", period: "Cette semaine" },
            { label: "Taux de réussite", value: "86%", trend: "positive", period: "Ce trimestre" },
            { label: "Nouvelles inscriptions", value: 15, trend: "positive", period: "Aujourd'hui" },
          ]}
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-8 pb-12">
        
        {/* LISTE DES QUIZ */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-poppins font-medium text-gray-900">
              Mes Quiz
            </h2>
            <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-poppins rounded-md hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Créer un quiz</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">Classe</th>
                  <th className="px-6 py-3 text-center text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                  <th className="px-6 py-3 text-center text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">Créé le</th>
                  <th className="px-6 py-3 text-center text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {quizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td className="px-6 py-4 text-sm font-poppins text-gray-900">{quiz.title}</td>
                    <td className="px-6 py-4 text-sm font-poppins text-gray-600">{quiz.className}</td>
                    <td className="px-6 py-4 text-sm font-poppins text-center">{quiz.questions}</td>
                    <td className="px-6 py-4 text-sm font-poppins text-center">
                      {new Date(quiz.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 text-sm font-poppins text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button className="text-blue-600 hover:text-blue-800"><Eye className="w-4 h-4" /></button>
                        <button className="text-green-600 hover:text-green-800"><Edit3 className="w-4 h-4" /></button>
                        <button className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PROCHAINES EVALUATIONS */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-poppins font-medium text-gray-900">
              Prochaines évaluations
            </h2>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <div className="p-6 space-y-4">
            {upcomingEvaluations.map((evaluation) => (
              <div key={evaluation.id} className="flex items-start space-x-3 pb-4 last:pb-0 border-b border-gray-100 last:border-b-0">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-poppins font-medium text-gray-900">{evaluation.title}</p>
                  <p className="text-sm font-poppins text-gray-600">{evaluation.className}</p>
                  <p className="text-xs font-poppins text-gray-500">
                    {new Date(evaluation.date).toLocaleDateString("fr-FR", { 
                      weekday: "short", 
                      day: "numeric", 
                      month: "short" 
                    })} à {evaluation.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
