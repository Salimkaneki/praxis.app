'use client';
import React from "react";
import TeacherPageHeader from "../_components/page-header";
import ExamResultCard, { ExamResult } from "../_components/ExamResultCard";
import { BarChart3 } from "lucide-react";
// import { useRouter } from "next/navigation";

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
    status: "completed",
    created_at: "2024-12-10T13:00:00Z"
  }
];

export default function ResultsPage() {
  const handleResultDeleted = (resultId: number) => {
    console.log("Résultat supprimé:", resultId);
    // Ici vous pourriez mettre à jour votre état ou recharger les données
  };

  return (
    <div className="min-h-screen bg-white">
      <TeacherPageHeader
        title="Résultats"
        subtitle="Consultez et analysez les résultats de vos sessions"
      />

      <div className="p-6 space-y-6">
        {/* Grille des cartes de résultats */}
        {mockExamResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockExamResults.map((result, index) => (
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