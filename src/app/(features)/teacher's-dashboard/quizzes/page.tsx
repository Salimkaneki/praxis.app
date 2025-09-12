'use client';
import React from "react";
import TeacherPageHeader from "../_components/page-header";
import QuizGrid, { QuizCard } from "../_components/quiz-grid";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const router = useRouter();

  // Exemple de données pour test
  const quizzes: QuizCard[] = [
    {
      title: "Quiz UX Design - Méthodologies et Prototypage",
      description: "Évaluation des connaissances sur les principes UX/UI, méthodologies de recherche utilisateur et techniques de prototypage",
      duration_minutes: 60,
      total_points: 30,
      status: "draft",
      allow_review: true,
      show_results_immediately: false,
    },
    {
      title: "Examen Frontend React",
      description: "Test des compétences en React, JSX, Hooks et gestion d'état",
      duration_minutes: 90,
      total_points: 50,
      status: "published",
      allow_review: false,
      show_results_immediately: true,
    },
    // ajoute d'autres quiz si nécessaire
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <TeacherPageHeader 
        title="Quiz & Examens" 
        subtitle="Gérez vos quiz et évaluations pour vos classes"
        actionButton={{
            label: "Nouveau Quiz",
            icon: <Plus className="w-4 h-4 mr-2" />,
            onClick: () => router.push("/dashboard/teacher/quizzes/create"),
        }}
      />

      <div className="px-8 py-8">
        <QuizGrid quizzes={quizzes} />
      </div>
    </div>
  );
}
