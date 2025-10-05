// teachers-dashboard/quizzes/page.tsx
'use client';
import React, { useEffect } from "react";
import TeacherPageHeader from "../_components/page-header";
import QuizGrid, { QuizCard } from "../_components/quiz-grid";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuizContext } from "../_contexts/quiz-context";

export default function QuizPage() {
  const router = useRouter();
  const { entities: quizzes, loading, error, refreshEntities: refreshQuizzes } = useQuizContext();

  useEffect(() => {
    refreshQuizzes();
  }, [refreshQuizzes]);

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <TeacherPageHeader
        title="Quiz & Examens"
        subtitle="Gérez vos quiz et évaluations pour vos classes"
        actionButton={{
            label: "Nouveau Quiz",
            icon: <Plus className="w-4 h-4 mr-2" />,
            onClick: () => router.push("/teachers-dashboard/quizzes/create"),
        }}
      />

      <div className="px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement des quiz...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && <QuizGrid quizzes={quizzes} />}
      </div>
    </div>
  );
}