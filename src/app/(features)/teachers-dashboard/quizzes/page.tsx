'use client';
import React, { useEffect, useState } from "react";
import TeacherPageHeader from "../_components/page-header";
import QuizGrid, { QuizCard } from "../_components/quiz-grid";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { QuizzesService, Quiz } from "./_services/quizzes.service";

export default function QuizPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data: Quiz[] = await QuizzesService.getAll();

        // Adapter le format API vers QuizCard utilisé par QuizGrid
        const formatted: QuizCard[] = data.map(q => ({
          title: q.title,
          description: q.description ?? "",
          duration_minutes: q.duration_minutes ?? 0,
          total_points: q.total_points ?? 0,
          status: q.status,
          allow_review: q.allow_review,
          show_results_immediately: q.show_results_immediately,
        }));

        setQuizzes(formatted);
      } catch (err: any) {
        console.error(err);
        setError("Impossible de récupérer les quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

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
        {loading && <p>Chargement des quiz...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && <QuizGrid quizzes={quizzes} />}
      </div>
    </div>
  );
}
