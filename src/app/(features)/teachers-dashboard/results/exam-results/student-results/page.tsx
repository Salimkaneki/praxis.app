'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { 
  User, CheckCircle, XCircle, Clock, Award,
  FileText, Target, AlertCircle,
  ThumbsUp, ThumbsDown, Calendar, Timer,
  BookOpen, Star, Eye, RotateCcw
} from "lucide-react";
import TeacherPageHeader from "../../../_components/page-header";
import KPIGrid from "@/components/ui/Cards/kpi-grid";

// Types pour les réponses
interface QuestionResponse {
  id: number;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'open_ended' | 'fill_blank';
  correctAnswer: string;
  studentAnswer: string;
  isCorrect: boolean;
  points: number;
  maxPoints: number;
  timeSpent: number; // en secondes
  options?: {
    text: string;
    isCorrect: boolean;
    isSelected: boolean;
  }[];
  explanation?: string;
}

interface StudentQuizResponse {
  id: number;
  student: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  quiz: {
    id: number;
    title: string;
    totalQuestions: number;
    maxScore: number;
  };
  score: number;
  percentage: number;
  timeSpent: number; // en minutes
  submittedAt: string;
  responses: QuestionResponse[];
}

// Données mockées
const mockStudentResponse: StudentQuizResponse = {
  id: 1,
  student: {
    id: 101,
    name: "Marie Dupont",
    email: "marie.dupont@etudiant.fr"
  },
  quiz: {
    id: 1,
    title: "Quiz de Mathématiques - Algèbre",
    totalQuestions: 5,
    maxScore: 100
  },
  score: 85,
  percentage: 85,
  timeSpent: 25,
  submittedAt: '2024-03-15T14:30:00Z',
  responses: [
    {
      id: 1,
      questionText: "Quelle est la solution de l'équation 2x + 5 = 13 ?",
      questionType: 'multiple_choice',
      correctAnswer: "x = 4",
      studentAnswer: "x = 4",
      isCorrect: true,
      points: 20,
      maxPoints: 20,
      timeSpent: 45,
      options: [
        { text: "x = 3", isCorrect: false, isSelected: false },
        { text: "x = 4", isCorrect: true, isSelected: true },
        { text: "x = 5", isCorrect: false, isSelected: false },
        { text: "x = 6", isCorrect: false, isSelected: false }
      ],
      explanation: "En soustrayant 5 des deux côtés : 2x = 8, puis en divisant par 2 : x = 4"
    },
    {
      id: 2,
      questionText: "Le discriminant d'une équation du second degré ax² + bx + c = 0 est toujours positif.",
      questionType: 'true_false',
      correctAnswer: "Faux",
      studentAnswer: "Faux",
      isCorrect: true,
      points: 15,
      maxPoints: 15,
      timeSpent: 30,
      options: [
        { text: "Vrai", isCorrect: false, isSelected: false },
        { text: "Faux", isCorrect: true, isSelected: true }
      ],
      explanation: "Le discriminant peut être négatif, nul ou positif selon les valeurs des coefficients."
    },
    {
      id: 3,
      questionText: "Développez l'expression (x + 3)²",
      questionType: 'open_ended',
      correctAnswer: "x² + 6x + 9",
      studentAnswer: "x² + 6x + 9",
      isCorrect: true,
      points: 25,
      maxPoints: 25,
      timeSpent: 120,
      explanation: "Utilisation de l'identité remarquable (a + b)² = a² + 2ab + b²"
    },
    {
      id: 4,
      questionText: "Si f(x) = 3x - 2, alors f(5) = ____",
      questionType: 'fill_blank',
      correctAnswer: "13",
      studentAnswer: "15",
      isCorrect: false,
      points: 0,
      maxPoints: 20,
      timeSpent: 60,
      explanation: "f(5) = 3(5) - 2 = 15 - 2 = 13"
    },
    {
      id: 5,
      questionText: "Quelle est la dérivée de f(x) = x³ + 2x² - 5x + 1 ?",
      questionType: 'multiple_choice',
      correctAnswer: "f'(x) = 3x² + 4x - 5",
      studentAnswer: "f'(x) = 3x² + 4x - 5",
      isCorrect: true,
      points: 25,
      maxPoints: 20,
      timeSpent: 90,
      options: [
        { text: "f'(x) = 3x² + 4x - 5", isCorrect: true, isSelected: true },
        { text: "f'(x) = x³ + 4x - 5", isCorrect: false, isSelected: false },
        { text: "f'(x) = 3x² + 2x - 5", isCorrect: false, isSelected: false },
        { text: "f'(x) = 3x + 4x - 5", isCorrect: false, isSelected: false }
      ],
      explanation: "Dérivation terme par terme : d/dx(x³) = 3x², d/dx(2x²) = 4x, d/dx(-5x) = -5, d/dx(1) = 0"
    }
  ]
};

const StudentQuizResponsesPage = () => {
  const router = useRouter();
  const [studentResponse] = useState<StudentQuizResponse>(mockStudentResponse);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const getQuestionTypeLabel = (type: string) => {
    const types = {
      multiple_choice: "QCM",
      true_false: "Vrai/Faux",
      open_ended: "Réponse libre",
      fill_blank: "Texte à trous"
    };
    return types[type as keyof typeof types] || type;
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
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

  const correctAnswers = studentResponse.responses.filter(r => r.isCorrect).length;
  const totalQuestions = studentResponse.responses.length;

  // KPIs pour le composant KPIGrid
  const kpis = [
    {
      label: "Score final",
      value: studentResponse.score,
      period: "points",
      trend: "positive" as const
    },
    {
      label: "Pourcentage",
      value: `${studentResponse.percentage}%`,
      period: "réussite",
      trend: "positive" as const
    },
    {
      label: "Temps total",
      value: `${studentResponse.timeSpent}m`,
      period: "durée",
      trend: "positive" as const
    },
    {
      label: "Bonnes réponses",
      value: `${correctAnswers}/${totalQuestions}`,
      period: "correctes",
      trend: "positive" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <TeacherPageHeader
        title={`Réponses de ${studentResponse.student.name}`}
        subtitle={`${studentResponse.quiz.title} • ${correctAnswers}/${totalQuestions} bonnes réponses`}
        backButton={{
          onClick: () => router.back()
        }}
      />

      <div className="px-8 py-8">
        <div className="w-full">
          {/* Résumé de la performance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{studentResponse.student.name}</h2>
                <p className="text-gray-600">{studentResponse.student.email}</p>
              </div>
            </div>

            {/* Métriques */}
            <KPIGrid kpis={kpis} />

            {/* Informations additionnelles */}
            <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Soumis le {formatDate(studentResponse.submittedAt)}
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Quiz #{studentResponse.quiz.id}
              </div>
            </div>
          </div>

          {/* Réponses détaillées */}
          <div className="space-y-6">
            {studentResponse.responses.map((response, index) => {
              const isSelected = selectedQuestion === response.id;
              
              return (
                <div 
                  key={response.id} 
                  className={`bg-white rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'border-blue-400 shadow-lg ring-2 ring-blue-100' 
                      : 'border-gray-200 hover:border-gray-300'
                  } p-6`}
                  onClick={() => setSelectedQuestion(isSelected ? null : response.id)}
                >
                {/* En-tête de la question */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                      response.isCorrect 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {getQuestionTypeLabel(response.questionType)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {response.points}/{response.maxPoints} points
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatTime(response.timeSpent)}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        {response.questionText}
                      </h3>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${
                    response.isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {response.isCorrect ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">
                      {response.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                </div>

                {/* Options pour QCM et Vrai/Faux */}
                {response.options && response.options.length > 0 && (
                  <div className="mb-4">
                    <div className="space-y-2">
                      {response.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center p-3 rounded-lg border ${
                            option.isSelected && option.isCorrect
                              ? 'bg-green-50 border-green-200'
                              : option.isSelected && !option.isCorrect
                              ? 'bg-red-50 border-red-200'
                              : option.isCorrect
                              ? 'bg-green-50 border-green-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              option.isSelected
                                ? option.isCorrect
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-red-500 bg-red-500'
                                : option.isCorrect
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300'
                            }`}>
                              {(option.isSelected || option.isCorrect) && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-gray-900">{option.text}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {option.isSelected && (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                Réponse étudiant
                              </span>
                            )}
                            {option.isCorrect && (
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                Bonne réponse
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Réponses texte (réponse libre et texte à trous) */}
                {(response.questionType === 'open_ended' || response.questionType === 'fill_blank') && (
                  <div className="mb-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Réponse de l'étudiant :</p>
                      <div className={`p-3 rounded-lg border ${
                        response.isCorrect 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <p className="text-gray-900">{response.studentAnswer}</p>
                      </div>
                    </div>
                    {!response.isCorrect && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Bonne réponse :</p>
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <p className="text-gray-900">{response.correctAnswer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Explication */}
                {response.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">Explication</p>
                        <p className="text-sm text-blue-800">{response.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentQuizResponsesPage;