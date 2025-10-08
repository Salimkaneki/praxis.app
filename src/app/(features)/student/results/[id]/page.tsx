"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import StudentPageHeader from "../../_components/page-header";
import Button from "../../../../../components/ui/Buttons/Button";
import {
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Calendar,
  Award
} from "lucide-react";
import { StudentSessionsService, ExamResult } from "../../_services/sessions.service";

export default function ExamResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = parseInt(params.id as string);

  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExamResults();
  }, [sessionId]);

  const loadExamResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const examResult = await StudentSessionsService.getExamResults(sessionId);
      setResult(examResult);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des résultats');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/student/sessions');
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (percentage: number) => {
    if (percentage >= 80) return <Trophy className="w-6 h-6 text-green-600" />;
    if (percentage >= 60) return <Target className="w-6 h-6 text-yellow-600" />;
    return <AlertCircle className="w-6 h-6 text-red-600" />;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <StudentPageHeader
          title="Chargement des résultats..."
          subtitle="Récupération de vos résultats d'examen"
        />
        <div className="w-full px-8 py-16 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-white">
        <StudentPageHeader
          title="Erreur"
          subtitle="Impossible de charger les résultats"
        />
        <div className="w-full px-8 py-16">
          <div className="max-w-md mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || 'Résultats introuvables'}
            </h2>
            <p className="text-gray-600 mb-6">
              Les résultats de cet examen ne sont pas disponibles ou vous n'y avez pas accès.
            </p>
            <Button onClick={handleGoBack} variant="primary">
              Retour aux sessions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const completionDateTime = formatDateTime(result.completed_at);
  const scorePercentage = Math.round((result.score / result.max_score) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentPageHeader
        title="Résultats de l'examen"
        subtitle={`Session ${sessionId}`}
      />

      <div className="w-full max-w-4xl mx-auto px-8 py-8">
        {/* Bouton retour */}
        <div className="mb-6">
          <Button
            onClick={handleGoBack}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux sessions
          </Button>
        </div>

        {/* Score principal */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {getScoreIcon(scorePercentage)}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {result.score}/{result.max_score} points
            </h2>
            <p className={`text-2xl font-semibold mb-4 ${getScoreColor(scorePercentage)}`}>
              {scorePercentage}%
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{result.time_spent} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{completionDateTime.date} à {completionDateTime.time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {result.answers.filter(a => a.is_correct).length}
                </p>
                <p className="text-sm text-gray-600">Questions correctes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {result.answers.filter(a => !a.is_correct).length}
                </p>
                <p className="text-sm text-gray-600">Questions incorrectes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {result.answers.length}
                </p>
                <p className="text-sm text-gray-600">Total des questions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Détail des réponses */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Détail des réponses
          </h3>

          <div className="space-y-6">
            {result.answers.map((answer, index) => (
              <div
                key={index}
                className={`border rounded-lg p-6 ${
                  answer.is_correct
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    answer.is_correct
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {answer.is_correct ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Question {index + 1}: {answer.question_text}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Votre réponse:
                        </p>
                        <p className={`text-sm p-2 rounded ${
                          answer.is_correct
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {answer.student_answer || 'Non répondu'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Points obtenus:
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {answer.points_earned}/{answer.max_points}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={handleGoBack} variant="primary">
            Retour aux sessions
          </Button>
          <Button
            onClick={() => window.print()}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            Imprimer les résultats
          </Button>
        </div>
      </div>
    </div>
  );
}