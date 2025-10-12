"use client";
import React, { useState, useEffect } from "react";
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
  ChevronLeft
} from "lucide-react";

// Mock data pour les questions d'examen
const mockExamData = {
  1: {
    title: "Mathématiques - Algèbre Linéaire",
    duration: 120, // minutes
    questions: [
      {
        id: 1,
        type: "multiple_choice",
        question: "Quelle est la valeur du déterminant de la matrice A = [[1, 2], [3, 4]] ?",
        options: ["-2", "2", "-4", "4"],
        correctAnswer: 0,
        explanation: "Le déterminant se calcule par (1×4) - (2×3) = 4 - 6 = -2"
      },
      {
        id: 2,
        type: "multiple_choice",
        question: "Dans un espace vectoriel de dimension 3, combien de vecteurs forment une base ?",
        options: ["2", "3", "4", "Infini"],
        correctAnswer: 1,
        explanation: "Une base doit contenir exactement n vecteurs linéairement indépendants pour un espace de dimension n."
      },
      {
        id: 3,
        type: "true_false",
        question: "Deux matrices carrées de même taille sont toujours compatibles pour la multiplication.",
        options: ["Vrai", "Faux"],
        correctAnswer: 0,
        explanation: "Pour multiplier deux matrices, le nombre de colonnes de la première doit égaler le nombre de lignes de la deuxième."
      },
      {
        id: 4,
        type: "short_answer",
        question: "Résoudre le système: x + y = 5, 2x - y = 1",
        correctAnswer: "x = 2, y = 3",
        explanation: "Addition: 3x = 6 ⇒ x = 2. Substitution: 2 + y = 5 ⇒ y = 3"
      },
      {
        id: 5,
        type: "multiple_choice",
        question: "Quelle est la dimension de l'espace nul de la matrice identité 3×3 ?",
        options: ["0", "1", "3", "Infini"],
        correctAnswer: 0,
        explanation: "L'espace nul contient les solutions de Ax = 0. Pour l'identité, seule la solution triviale existe."
      }
    ]
  },
  4: {
    title: "Histoire - Révolution Française",
    duration: 120,
    questions: [
      {
        id: 1,
        type: "multiple_choice",
        question: "En quelle année a eu lieu la prise de la Bastille ?",
        options: ["1788", "1789", "1790", "1791"],
        correctAnswer: 1,
        explanation: "La prise de la Bastille a eu lieu le 14 juillet 1789."
      },
      {
        id: 2,
        type: "multiple_choice",
        question: "Qui était le roi de France au début de la Révolution ?",
        options: ["Louis XIV", "Louis XV", "Louis XVI", "Napoléon Bonaparte"],
        correctAnswer: 2,
        explanation: "Louis XVI était roi de France de 1774 à 1792."
      },
      {
        id: 3,
        type: "true_false",
        question: "La Déclaration des droits de l'homme et du citoyen a été adoptée en 1789.",
        options: ["Vrai", "Faux"],
        correctAnswer: 0,
        explanation: "La Déclaration a été adoptée par l'Assemblée constituante le 26 août 1789."
      }
    ]
  }
};

export default function StudentExamPage() {
  const params = useParams();
  const examId = params.id as string;

  // Rediriger vers les bonnes pages si l'ID correspond à une route connue
  const knownRoutes: Record<string, string> = {
    'profile': '/student/profile',
    'dashboard': '/student',
    'results': '/student/results',
    'sessions': '/student/sessions',
    'settings': '/student/settings'
  };

  if (knownRoutes[examId]) {
    React.useEffect(() => {
      window.location.href = knownRoutes[examId];
    }, []);
    return null; // Ne rien rendre pendant la redirection
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const examData = mockExamData[parseInt(examId) as keyof typeof mockExamData];
  const currentQuestion = examData?.questions[currentQuestionIndex];

  useEffect(() => {
    if (examData) {
      setTimeLeft(examData.duration * 60); // Convertir en secondes
    }
  }, [examData]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted && examData) {
      handleSubmitExam();
    }
  }, [timeLeft, isSubmitted, examData]);

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
    if (examData && examData.questions && currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = () => {
    if (!examData || !examData.questions) {
      console.error('Données d\'examen non disponibles');
      return;
    }

    // Calculer le score
    let correctAnswers = 0;
    examData.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / examData.questions.length) * 100);
    setScore(finalScore);
    setIsSubmitted(true);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (!examData) {
    return (
      <div className="min-h-screen bg-white">
        <StudentPageHeader
          title="Examen introuvable"
          subtitle="L'examen demandé n'existe pas"
        />
        <div className="w-full px-8 py-8 text-center">
          <p className="text-gray-600">L'examen que vous cherchez n'est pas disponible.</p>
          <Button onClick={handleGoBack} variant="secondary" className="mt-4">
            Retour
          </Button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <StudentPageHeader
          title="Résultats de l'examen"
          subtitle={`${examData.title}`}
        />

        <div className="w-full max-w-2xl mx-auto px-8 py-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="mb-6">
              {score >= 70 ? (
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              ) : (
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              )}
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-2">
                Examen terminé
              </h2>
              <p className="text-gray-600">
                Vous avez obtenu un score de <span className="font-bold text-forest-600">{score}/100</span>
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {examData.questions.map((question, index) => (
                <div key={question.id} className="text-left bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">
                    Question {index + 1}: {question.question}
                  </p>
                  <p className="text-sm text-gray-600">
                    Votre réponse: {
                      question.type === "short_answer"
                        ? answers[question.id] || "Non répondu"
                        : question.options ? question.options[answers[question.id]] || "Non répondu" : "Non répondu"
                    }
                  </p>
                  <p className="text-sm text-green-600">
                    Réponse correcte: {
                      question.type === "short_answer"
                        ? question.correctAnswer
                        : question.options ? question.options[question.correctAnswer] : "N/A"
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{question.explanation}</p>
                </div>
              ))}
            </div>

            <Button onClick={handleGoBack} variant="primary">
              Retour aux sessions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <StudentPageHeader
        title={examData.title}
        subtitle={`Question ${currentQuestionIndex + 1} sur ${examData.questions?.length || 0}`}
      />

      <div className="w-full max-w-4xl mx-auto px-8 py-8">
        {/* TIMER */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-800">Temps restant</span>
            </div>
            <span className="text-2xl font-mono font-bold text-red-800">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* QUESTION */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
          <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-6">
            Question {currentQuestionIndex + 1}
          </h3>

          <p className="text-lg text-gray-700 mb-6">
            {currentQuestion.question}
          </p>

          {/* OPTIONS */}
          <div className="space-y-4">
            {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
              currentQuestion.options.map((option: string, index: number) => (
                <label key={index} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => handleAnswerChange(currentQuestion.id, index)}
                    className="w-4 h-4 text-forest-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))
            )}

            {currentQuestion.type === "true_false" && currentQuestion.options && (
              currentQuestion.options.map((option: string, index: number) => (
                <label key={index} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => handleAnswerChange(currentQuestion.id, index)}
                    className="w-4 h-4 text-forest-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))
            )}

            {currentQuestion.type === "short_answer" && (
              <textarea
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Tapez votre réponse ici..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                rows={4}
              />
            )}
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Button>

          <div className="flex gap-2">
            {examData.questions?.map((question, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium ${
                  index === currentQuestionIndex
                    ? "bg-forest-600 text-white"
                    : answers[question.id] !== undefined
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === (examData.questions?.length || 0) - 1 ? (
            <Button
              onClick={handleSubmitExam}
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
  );
}