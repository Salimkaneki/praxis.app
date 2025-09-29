'use client';
import React, { useState, useEffect } from "react";
import { 
  Clock, CheckCircle, AlertCircle, Timer, Flag,
  Send, Eye, EyeOff, ArrowUp
} from "lucide-react";
import { Button, Input, Textarea, Alert } from "@/components/ui";

// Types pour les questions
interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: number;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'open_ended' | 'fill_blank';
  options?: QuizOption[];
  points: number;
  explanation?: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  timeLimit: number; // en minutes
  totalQuestions: number;
  totalPoints: number;
  questions: QuizQuestion[];
}

interface StudentAnswer {
  questionId: number;
  answer: string;
  selectedOptions?: string[];
  timeSpent: number;
}

// Données mockées pour le quiz
const mockQuiz: Quiz = {
  id: 1,
  title: "Quiz de Mathématiques - Algèbre",
  description: "Évaluation sur les concepts fondamentaux de l'algèbre",
  timeLimit: 45,
  totalQuestions: 5,
  totalPoints: 100,
  questions: [
    {
      id: 1,
      questionText: "Quelle est la solution de l'équation 2x + 5 = 13 ?",
      questionType: 'multiple_choice',
      points: 20,
      options: [
        { id: "a", text: "x = 3", isCorrect: false },
        { id: "b", text: "x = 4", isCorrect: true },
        { id: "c", text: "x = 5", isCorrect: false },
        { id: "d", text: "x = 6", isCorrect: false }
      ]
    },
    {
      id: 2,
      questionText: "Le discriminant d'une équation du second degré ax² + bx + c = 0 est toujours positif.",
      questionType: 'true_false',
      points: 15,
      options: [
        { id: "true", text: "Vrai", isCorrect: false },
        { id: "false", text: "Faux", isCorrect: true }
      ]
    },
    {
      id: 3,
      questionText: "Développez l'expression (x + 3)²",
      questionType: 'open_ended',
      points: 25
    },
    {
      id: 4,
      questionText: "Si f(x) = 3x - 2, alors f(5) = ____",
      questionType: 'fill_blank',
      points: 20
    },
    {
      id: 5,
      questionText: "Quelle est la dérivée de f(x) = x³ + 2x² - 5x + 1 ?",
      questionType: 'multiple_choice',
      points: 20,
      options: [
        { id: "a", text: "f'(x) = 3x² + 4x - 5", isCorrect: true },
        { id: "b", text: "f'(x) = x³ + 4x - 5", isCorrect: false },
        { id: "c", text: "f'(x) = 3x² + 2x - 5", isCorrect: false },
        { id: "d", text: "f'(x) = 3x + 4x - 5", isCorrect: false }
      ]
    }
  ]
};

const StudentQuizInterface = () => {
  const [quiz] = useState<Quiz>(mockQuiz);
  const [answers, setAnswers] = useState<Map<number, StudentAnswer>>(new Map());
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit * 60); // en secondes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showTimer, setShowTimer] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Timer effect
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  // Scroll effect pour le bouton retour en haut
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionTypeLabel = (type: string) => {
    const types = {
      multiple_choice: "QCM",
      true_false: "Vrai/Faux", 
      open_ended: "Réponse libre",
      fill_blank: "Texte à trous"
    };
    return types[type as keyof typeof types] || type;
  };

  const updateAnswer = (questionId: number, answer: string, selectedOptions?: string[]) => {
    const newAnswer: StudentAnswer = {
      questionId,
      answer,
      selectedOptions,
      timeSpent: 0 // Simplifier le tracking du temps
    };
    
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, newAnswer);
    setAnswers(newAnswers);
  };

  const handleMultipleChoice = (questionId: number, optionId: string) => {
    const question = quiz.questions.find(q => q.id === questionId);
    const selectedOption = question?.options?.find(opt => opt.id === optionId);
    if (selectedOption) {
      updateAnswer(questionId, selectedOption.text, [optionId]);
    }
  };

  const handleTextAnswer = (questionId: number, text: string) => {
    updateAnswer(questionId, text);
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

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    setShowConfirmSubmit(false);
    // Ici vous pourriez envoyer les réponses au serveur
    console.log('Quiz soumis:', Array.from(answers.values()));
  };

  const getAnsweredQuestions = () => {
    return quiz.questions.filter(q => answers.has(q.id)).length;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToQuestion = (questionId: number) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderQuestionContent = (question: QuizQuestion) => {
    const answer = answers.get(question.id);

    switch (question.questionType) {
      case 'multiple_choice':
      case 'true_false':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <Button
                key={option.id}
                onClick={() => handleMultipleChoice(question.id, option.id)}
                disabled={isSubmitted}
                variant={answer?.selectedOptions?.includes(option.id) ? "primary" : "secondary"}
                className={`w-full text-left justify-start p-4 h-auto ${
                  answer?.selectedOptions?.includes(option.id)
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                } ${isSubmitted ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    answer?.selectedOptions?.includes(option.id)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answer?.selectedOptions?.includes(option.id) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-gray-900">{option.text}</span>
                </div>
              </Button>
            ))}
          </div>
        );

      case 'open_ended':
        return (
          <Textarea
            value={answer?.answer || ''}
            onChange={(e) => handleTextAnswer(question.id, e.target.value)}
            disabled={isSubmitted}
            placeholder="Tapez votre réponse ici..."
            rows={4}
            className="w-full"
          />
        );

      case 'fill_blank':
        return (
          <Input
            value={answer?.answer || ''}
            onChange={(e) => handleTextAnswer(question.id, e.target.value)}
            disabled={isSubmitted}
            placeholder="Votre réponse"
            className="w-full"
          />
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Terminé!</h2>
            <p className="text-gray-600 mb-4">
              Vos réponses ont été soumises avec succès.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600">
                <p>Questions répondues: {getAnsweredQuestions()}/{quiz.totalQuestions}</p>
                <p>Temps utilisé: {formatTime(quiz.timeLimit * 60 - timeRemaining)}</p>
              </div>
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="primary"
              className="w-full"
            >
              Retour aux cours
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header fixe */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600 mt-1">{quiz.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowTimer(!showTimer)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {showTimer ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {showTimer && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Timer className="w-5 h-5" />
                  <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar navigation fixe */}
        <div className="w-80 bg-white border-r border-gray-200 sticky top-[140px] h-[calc(100vh-140px)] overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((question, index) => {
                  const isAnswered = answers.has(question.id);
                  const isFlagged = flaggedQuestions.has(question.id);
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => scrollToQuestion(question.id)}
                      className={`relative w-12 h-12 rounded-lg border-2 text-sm font-medium transition-all ${
                        isAnswered
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
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-2">
                    <span>Questions répondues:</span>
                    <span className="font-medium">{getAnsweredQuestions()}/{quiz.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Questions marquées:</span>
                    <span className="font-medium">{flaggedQuestions.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Points totaux:</span>
                    <span className="font-medium">{quiz.totalPoints}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowConfirmSubmit(true)}
                variant="primary"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4" />
                Soumettre le quiz
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Toutes les questions */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {quiz.questions.map((question, index) => {
              const isAnswered = answers.has(question.id);
              const isFlagged = flaggedQuestions.has(question.id);

              return (
                <div
                  key={question.id}
                  id={`question-${question.id}`}
                  className={`bg-white rounded-lg border-2 transition-all duration-200 ${
                    isAnswered 
                      ? 'border-green-200 bg-green-50/30' 
                      : 'border-gray-200'
                  } ${isFlagged ? 'ring-2 ring-orange-200' : ''}`}
                >
                  <div className="p-6">
                    {/* Question Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isAnswered 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            {getQuestionTypeLabel(question.questionType)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {question.points} points
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFlag(question.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isFlagged
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Flag className="w-5 h-5" />
                      </button>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      {question.questionText}
                    </h2>

                    {renderQuestionContent(question)}

                    {/* Indicateur de réponse */}
                    {isAnswered && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">
                            Question répondue
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Section de soumission finale */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Prêt à soumettre votre quiz ?
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-600">
                    <p>Questions répondues: {getAnsweredQuestions()}/{quiz.totalQuestions}</p>
                    <p>Questions non répondues: {quiz.totalQuestions - getAnsweredQuestions()}</p>
                    <p>Questions marquées: {flaggedQuestions.size}</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowConfirmSubmit(true)}
                  variant="primary"
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2 mx-auto"
                >
                  <Send className="w-4 h-4" />
                  Soumettre le quiz
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour en haut */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center z-50"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Modal de confirmation de soumission */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Confirmer la soumission</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir soumettre votre quiz? Vous ne pourrez plus modifier vos réponses après la soumission.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600">
                <p>Questions répondues: {getAnsweredQuestions()}/{quiz.totalQuestions}</p>
                <p>Questions non répondues: {quiz.totalQuestions - getAnsweredQuestions()}</p>
                <p>Questions marquées: {flaggedQuestions.size}</p>
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
                onClick={handleSubmitQuiz}
                variant="primary"
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Soumettre
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQuizInterface;