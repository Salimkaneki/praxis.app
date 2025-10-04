"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import StudentPageHeader from "../../_components/page-header";
import Button from "../../../../../components/ui/Buttons/Button";
import {
  Clock,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Flag,
  Eye,
  EyeOff,
  Timer,
  BookOpen,
  Target,
  Award,
  AlertTriangle
} from "lucide-react";

// Types pour les questions
interface Question {
  id: number;
  type: "multiple_choice" | "true_false" | "short_answer";
  question: string;
  options?: string[];
  correctAnswer: number;
  explanation: string;
  points?: number;
}

interface ExamData {
  title: string;
  duration: number; // minutes
  questions: Question[];
}

// Données mockées améliorées pour les examens
const mockExamData: Record<string, ExamData> = {
  "1": {
    title: "Mathématiques - Algèbre Linéaire",
    duration: 90,
    questions: [
      {
        id: 1,
        type: "multiple_choice",
        question: "Quelle est la valeur du déterminant de la matrice A = [[1, 2], [3, 4]] ?",
        options: ["-2", "2", "-4", "4"],
        correctAnswer: 0,
        explanation: "Le déterminant se calcule par (1×4) - (2×3) = 4 - 6 = -2",
        points: 5
      },
      {
        id: 2,
        type: "multiple_choice",
        question: "Dans un espace vectoriel de dimension 3, combien de vecteurs forment une base ?",
        options: ["2", "3", "4", "Infini"],
        correctAnswer: 1,
        explanation: "Une base doit contenir exactement n vecteurs linéairement indépendants pour un espace de dimension n.",
        points: 5
      },
      {
        id: 3,
        type: "true_false",
        question: "Deux matrices carrées de même taille sont toujours compatibles pour la multiplication.",
        options: ["Vrai", "Faux"],
        correctAnswer: 1,
        explanation: "Pour multiplier deux matrices, le nombre de colonnes de la première doit égaler le nombre de lignes de la deuxième.",
        points: 3
      },
      {
        id: 4,
        type: "short_answer",
        question: "Résoudre le système: x + y = 5, 2x - y = 1",
        correctAnswer: 0, // Pour les réponses ouvertes, on utilise 0 comme index
        explanation: "Addition: 3x = 6 ⇒ x = 2. Substitution: 2 + y = 5 ⇒ y = 3",
        points: 7
      },
      {
        id: 5,
        type: "multiple_choice",
        question: "Quelle est la dimension de l'espace nul de la matrice identité 3×3 ?",
        options: ["0", "1", "3", "Infini"],
        correctAnswer: 0,
        explanation: "L'espace nul contient les solutions de Ax = 0. Pour l'identité, seule la solution triviale existe.",
        points: 5
      }
    ]
  },
  "2": {
    title: "Physique - Mécanique",
    duration: 75,
    questions: [
      {
        id: 1,
        type: "multiple_choice",
        question: "Quelle est l'unité SI de la force ?",
        options: ["Newton", "Joule", "Watt", "Pascal"],
        correctAnswer: 0,
        explanation: "Le Newton (N) est l'unité SI de la force.",
        points: 4
      },
      {
        id: 2,
        type: "true_false",
        question: "La vitesse instantanée est le quotient de l'espace parcouru par le temps écoulé.",
        options: ["Vrai", "Faux"],
        correctAnswer: 0,
        explanation: "La vitesse instantanée est bien définie comme le quotient ds/dt.",
        points: 3
      }
    ]
  }
};

export default function StudentExamPage() {
  const params = useParams();
  const examId = params.id as string;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showTimer, setShowTimer] = useState(true);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const examData = mockExamData[examId];

  useEffect(() => {
    if (examData) {
      setTimeLeft(examData.duration * 60); // Convertir en secondes
    }
  }, [examData]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleAutoSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const toggleFlag = (questionId: number) => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId);
    } else {
      newFlagged.add(questionId);
    }
    setFlaggedQuestions(newFlagged);
  };

  const getAnsweredQuestionsCount = () => {
    return Object.keys(answers).length;
  };

  const getTotalPoints = () => {
    return examData.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  };

  const handleAutoSubmit = () => {
    handleSubmitExam(true);
  };

  const handleSubmitExam = (autoSubmit = false) => {
    if (!autoSubmit) {
      setShowConfirmSubmit(true);
      return;
    }

    // Calculer le score
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    examData.questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points || 0;
      }
      totalPoints += question.points || 0;
    });

    const finalScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    setScore(finalScore);
    setIsSubmitted(true);
    setShowConfirmSubmit(false);
  };

  const confirmSubmit = () => {
    handleSubmitExam(true);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const currentQuestion = examData?.questions[currentQuestionIndex];
  const progress = examData ? ((currentQuestionIndex + 1) / examData.questions.length) * 100 : 0;

  // Statistiques calculées
  const stats = useMemo(() => {
    if (!examData) return null;

    const answered = getAnsweredQuestionsCount();
    const total = examData.questions.length;
    const flagged = flaggedQuestions.size;
    const remaining = total - answered;

    return { answered, total, flagged, remaining };
  }, [answers, flaggedQuestions, examData]);

  if (!examData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentPageHeader
          title="Examen introuvable"
          subtitle="L'examen demandé n'existe pas"
        />
        <div className="w-full px-8 py-8 text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md mx-auto">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Examen introuvable
            </h2>
            <p className="text-gray-600 mb-6">
              L'examen que vous cherchez n'est pas disponible ou n'existe pas.
            </p>
            <Button onClick={handleGoBack} variant="primary">
              Retour aux sessions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentPageHeader
          title="Résultats de l'examen"
          subtitle={`${examData.title}`}
        />

        <div className="w-full max-w-4xl mx-auto px-8 py-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                score >= 70 ? 'bg-green-100' : score >= 50 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                {score >= 70 ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <AlertCircle className="w-10 h-10 text-yellow-600" />
                )}
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Examen terminé
              </h2>
              <p className="text-gray-600 mb-6">
                Vous avez obtenu un score de <span className="font-bold text-forest-600 text-xl">{score}/100</span>
              </p>

              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{stats?.answered}</div>
                  <div className="text-sm text-gray-600">Questions répondues</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{examData.questions.length}</div>
                  <div className="text-sm text-gray-600">Total questions</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{examData.duration}min</div>
                  <div className="text-sm text-gray-600">Durée prévue</div>
                </div>
              </div>
            </div>
          </div>

          {/* Détail des réponses */}
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Détail des réponses</h3>
            <div className="space-y-6">
              {examData.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                const isAnswered = userAnswer !== undefined;

                return (
                  <div key={question.id} className={`border rounded-lg p-6 ${
                    isCorrect ? 'border-green-200 bg-green-50' : !isAnswered ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isCorrect ? 'bg-green-100 text-green-700' : !isAnswered ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-3">{question.question}</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Votre réponse:</p>
                            <p className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                              {question.type === "short_answer"
                                ? (userAnswer || "Non répondu")
                                : question.options ? (question.options[userAnswer] || "Non répondu") : "Non répondu"
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Réponse correcte:</p>
                            <p className="font-medium text-green-700">
                              {question.type === "short_answer"
                                ? "Voir l'explication"
                                : question.options ? question.options[question.correctAnswer] : "N/A"
                              }
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-white rounded border">
                          <p className="text-sm text-gray-700">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Button onClick={handleGoBack} variant="primary" size="large">
                Retour aux sessions
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentPageHeader
        title={examData.title}
        subtitle={`Question ${currentQuestionIndex + 1} sur ${examData.questions.length}`}
      />

      <div className="w-full max-w-6xl mx-auto px-8 py-8">
        {/* TIMER ET CONTROLES */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleGoBack}
                variant="secondary"
                size="small"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Quitter
              </Button>

              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {stats?.answered}/{stats?.total} questions répondues
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowTimer(!showTimer)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
              >
                {showTimer ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>

              {showTimer && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-semibold ${
                  timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Timer className="w-5 h-5" />
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progression</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-forest-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>

              <div className="grid grid-cols-4 lg:grid-cols-2 gap-2 mb-6">
                {examData.questions.map((question, index) => {
                  const isAnswered = answers[question.id] !== undefined;
                  const isFlagged = flaggedQuestions.has(question.id);
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={question.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`relative w-12 h-12 rounded-lg border-2 text-sm font-medium transition-all ${
                        isCurrent
                          ? 'border-forest-600 bg-forest-50 text-forest-700'
                          : isAnswered
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {index + 1}
                      {isFlagged && (
                        <Flag className="w-3 h-3 text-orange-500 absolute -top-1 -right-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Statistiques */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Répondues:</span>
                  <span className="font-medium text-green-600">{stats?.answered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Restantes:</span>
                  <span className="font-medium text-orange-600">{stats?.remaining}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Marquées:</span>
                  <span className="font-medium text-blue-600">{stats?.flagged}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Points:</span>
                  <span className="font-medium">{getTotalPoints()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT - Question */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              {/* En-tête de la question */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${
                    answers[currentQuestion.id] !== undefined
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {currentQuestionIndex + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        currentQuestion.type === 'multiple_choice' ? 'bg-purple-100 text-purple-700' :
                        currentQuestion.type === 'true_false' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {currentQuestion.type === 'multiple_choice' ? 'QCM' :
                         currentQuestion.type === 'true_false' ? 'Vrai/Faux' : 'Réponse libre'}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {currentQuestion.points} points
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {currentQuestion.question}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestion.id)
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Marquer cette question"
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              {/* Options de réponse */}
              <div className="space-y-4 mb-8">
                {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
                  currentQuestion.options.map((option: string, index: number) => (
                    <label key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={index}
                        checked={answers[currentQuestion.id] === index}
                        onChange={() => handleAnswerChange(currentQuestion.id, index)}
                        className="w-5 h-5 text-forest-600 focus:ring-forest-500"
                      />
                      <span className="text-gray-700 flex-1">{option}</span>
                    </label>
                  ))
                )}

                {currentQuestion.type === "true_false" && currentQuestion.options && (
                  currentQuestion.options.map((option: string, index: number) => (
                    <label key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={index}
                        checked={answers[currentQuestion.id] === index}
                        onChange={() => handleAnswerChange(currentQuestion.id, index)}
                        className="w-5 h-5 text-forest-600 focus:ring-forest-500"
                      />
                      <span className="text-gray-700 flex-1">{option}</span>
                    </label>
                  ))
                )}

                {currentQuestion.type === "short_answer" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Votre réponse
                    </label>
                    <textarea
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      placeholder="Tapez votre réponse ici..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
                      rows={6}
                    />
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </Button>

                <div className="text-sm text-gray-500">
                  {currentQuestionIndex + 1} / {examData.questions.length}
                </div>

                {currentQuestionIndex === examData.questions.length - 1 ? (
                  <Button
                    onClick={() => setShowConfirmSubmit(true)}
                    variant="primary"
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Soumettre l'examen
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    variant="primary"
                    className="flex items-center gap-2"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de soumission */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Confirmer la soumission</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir soumettre votre examen ? Cette action est irréversible.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Questions répondues:</span>
                  <span className="font-medium">{stats?.answered}/{stats?.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Questions restantes:</span>
                  <span className="font-medium">{stats?.remaining}</span>
                </div>
                <div className="flex justify-between">
                  <span>Questions marquées:</span>
                  <span className="font-medium">{stats?.flagged}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirmSubmit(false)}
                variant="secondary"
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={confirmSubmit}
                variant="primary"
                className="flex-1"
              >
                Soumettre
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}