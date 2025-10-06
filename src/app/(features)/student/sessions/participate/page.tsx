'use client';
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Clock, CheckCircle, AlertCircle, Timer, Flag,
  Send, Eye, EyeOff, ArrowUp, User, Calendar,
  BookOpen, Target, Award, Save
} from "lucide-react";
import { StudentSessionsService, StudentSession, ExamQuestion, ExamData } from "../../_services/sessions.service";

// Types
interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: number;
  question_text: string;
  type: 'multiple_choice' | 'true_false' | 'open_ended' | 'fill_blank';
  options?: QuizOption[];
  points: number;
  explanation?: string;
}

interface StudentAnswer {
  question_id: number;
  answer: string;
  selected_options?: string[];
  time_spent: number;
}

// Données mockées
const mockExamData = {
  session: {
    title: "Examen de Mathématiques - Niveau 3",
    duration_minutes: 60,
    quiz: {
      description: "Examen couvrant l'algèbre et la géométrie",
      total_points: 100
    }
  },
  questions: [
    {
      id: 1,
      question_text: "Quelle est la valeur de x dans l'équation 2x + 5 = 13 ?",
      type: "multiple_choice",
      points: 10,
      options: [
        { id: "a", text: "x = 3" },
        { id: "b", text: "x = 4" },
        { id: "c", text: "x = 5" },
        { id: "d", text: "x = 6" }
      ]
    },
    {
      id: 2,
      question_text: "Le théorème de Pythagore s'applique uniquement aux triangles rectangles.",
      type: "true_false",
      points: 5,
      options: [
        { id: "true", text: "Vrai" },
        { id: "false", text: "Faux" }
      ]
    },
    {
      id: 3,
      question_text: "Expliquez la différence entre une fonction linéaire et une fonction affine.",
      type: "open_ended",
      points: 20
    },
    {
      id: 4,
      question_text: "Un triangle équilatéral a ____ côtés égaux.",
      type: "fill_blank",
      points: 5
    },
    {
      id: 5,
      question_text: "Quelle est la formule de l'aire d'un cercle ?",
      type: "multiple_choice",
      points: 10,
      options: [
        { id: "a", text: "πr" },
        { id: "b", text: "πr²" },
        { id: "c", text: "2πr" },
        { id: "d", text: "πd" }
      ]
    },
    {
      id: 6,
      question_text: "La somme des angles d'un triangle est égale à 180°.",
      type: "true_false",
      points: 5,
      options: [
        { id: "true", text: "Vrai" },
        { id: "false", text: "Faux" }
      ]
    },
    {
      id: 7,
      question_text: "Résolvez le système d'équations suivant : x + y = 10 et x - y = 2",
      type: "open_ended",
      points: 15
    },
    {
      id: 8,
      question_text: "Le périmètre d'un carré de côté 5 cm est ____.",
      type: "fill_blank",
      points: 5
    }
  ]
};

const StudentQuizInterface = () => {
  const router = useRouter();
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);

  // Charger les données de l'examen
  useEffect(() => {
    const loadExamData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer l'ID de session depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const sessionIdParam = urlParams.get('sessionId');

        if (!sessionIdParam) {
          throw new Error('ID de session manquant');
        }

        const sessionIdNum = parseInt(sessionIdParam);
        setSessionId(sessionIdNum);

        // Vérifier si l'étudiant a déjà rejoint cette session
        console.log('🔍 Vérification si l\'étudiant a déjà rejoint la session:', sessionIdNum);
        const hasJoined = await StudentSessionsService.hasJoinedSession(sessionIdNum);
        console.log('🔍 Résultat de hasJoinedSession:', hasJoined);

        if (hasJoined) {
          console.log('⚠️ L\'étudiant a déjà rejoint cette session - ACCÈS BLOQUÉ');
          throw new Error('ALREADY_JOINED: Vous avez déjà participé à cette session d\'examen. Vous ne pouvez pas la rejoindre à nouveau.');
        }

        // Démarrer l'examen et récupérer les données
        console.log('🚀 Démarrage de l\'examen pour la session:', sessionIdNum);
        const data = await StudentSessionsService.startExam(sessionIdNum);
        setExamData(data);

      } catch (err: any) {
        console.error('Erreur lors du chargement de l\'examen:', err);

        // Vérifier si c'est une erreur de session déjà rejointe
        if (err.message && err.message.includes('ALREADY_JOINED')) {
          setError('Vous avez déjà participé à cette session d\'examen. Vous ne pouvez pas la rejoindre à nouveau.');
        } else {
          // En production, afficher l'erreur réelle au lieu d'utiliser des données mockées
          setError(err.response?.data?.message || err.message || 'Erreur lors du chargement de l\'examen');
        }
      } finally {
        setLoading(false);
      }
    };

    loadExamData();
  }, []);

  const [answers, setAnswers] = useState<Map<number, StudentAnswer>>(new Map());
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showTimer, setShowTimer] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [examResult, setExamResult] = useState<any>(null);
  const [examStartTime] = useState(new Date()); // Stocker l'heure de début de l'examen
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);

  // Fonction d'auto-save
  const autoSaveProgress = useCallback(async () => {
    if (!sessionId || answers.size === 0 || isSubmitted || submitting) return;

    try {
      console.log('💾 Auto-save en cours...');
      const studentAnswers: StudentAnswer[] = Array.from(answers.values());
      await StudentSessionsService.saveProgress(sessionId, studentAnswers);
      setLastAutoSave(new Date());
      console.log('✅ Auto-save réussi');
    } catch (error) {
      console.error('❌ Erreur lors de l\'auto-save:', error);
      // Ne pas afficher d'erreur à l'utilisateur pour l'auto-save
    }
  }, [sessionId, answers, isSubmitted, submitting]);

  // Auto-save effect - sauvegarde toutes les 30 secondes si des réponses ont changé
  useEffect(() => {
    if (!examData || isSubmitted || submitting) return;

    const autoSaveInterval = setInterval(() => {
      autoSaveProgress();
    }, 30000); // 30 secondes

    return () => clearInterval(autoSaveInterval);
  }, [examData, isSubmitted, submitting, autoSaveProgress]);

  // Timer effect - Optimisé pour éviter les re-renders infinis
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted && !submitting) {
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
    }
  }, [isSubmitted, submitting]); // Retiré timeRemaining des dépendances

  // Scroll effect - Nettoyage correct de l'event listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Dépendances vides car handleScroll ne dépend d'aucun state

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

  const updateAnswer = useCallback((questionId: number, answer: string, selectedOptions?: string[]) => {
    const newAnswer: StudentAnswer = {
      question_id: questionId,
      answer,
      selected_options: selectedOptions,
      time_spent: 0
    };

    setAnswers(prevAnswers => {
      const newAnswers = new Map(prevAnswers);
      newAnswers.set(questionId, newAnswer);
      return newAnswers;
    });
  }, []);

  const handleMultipleChoice = useCallback((questionId: number, optionId: string) => {
    if (!examData) return;
    const question = examData.questions.find(q => q.id === questionId);
    // Convertir l'ID en string pour la comparaison
    const selectedOption = question?.options?.find(opt => String(opt.id) === optionId);
    if (selectedOption) {
      updateAnswer(questionId, selectedOption.text, [optionId]);
    }
  }, [examData, updateAnswer]);

  const handleTextAnswer = useCallback((questionId: number, text: string) => {
    updateAnswer(questionId, text);
  }, [updateAnswer]);

  const toggleFlag = useCallback((questionId: number) => {
    setFlaggedQuestions(prev => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(questionId)) {
        newFlagged.delete(questionId);
      } else {
        newFlagged.add(questionId);
      }
      return newFlagged;
    });
  }, []);

  const handleSubmitQuiz = async () => {
    if (!examData || !sessionId) return;

    // Double vérification avant soumission
    console.log('🔍 Double vérification avant soumission pour session:', sessionId);
    const hasJoinedBeforeSubmit = await StudentSessionsService.hasJoinedSession(sessionId);
    console.log('🔍 Résultat de la double vérification:', hasJoinedBeforeSubmit);

    if (hasJoinedBeforeSubmit) {
      console.log('⚠️ Tentative de soumission pour une session déjà terminée - BLOQUÉ');
      alert('Vous avez déjà soumis cet examen. Vous ne pouvez pas le soumettre à nouveau.');
      return;
    }

    setSubmitting(true);
    setShowConfirmSubmit(false);

    try {
      console.log('🔗 Soumission de l\'examen en cours...');

      // Préparer les réponses au format attendu par le service
      const studentAnswers: StudentAnswer[] = Array.from(answers.values());

      // Utiliser le resultId (attempt.id) pour soumettre les réponses
      const resultId = examData.attempt.id;
      const result = await StudentSessionsService.submitExam(resultId, studentAnswers, examData.attempt.started_at);

      console.log('✅ Examen soumis avec succès:', result);

      // Transformer le résultat pour l'affichage
      const displayResult = {
        score: result.score,
        max_score: result.max_score,
        percentage: result.percentage,
        time_spent: result.time_spent,
        answers: [] // Les détails des réponses ne sont pas retournés par le nouveau endpoint
      };

      setExamResult(displayResult);
      setIsSubmitted(true);

    } catch (error: any) {
      console.error('❌ Erreur lors de la soumission:', error);

      // Afficher un message d'erreur à l'utilisateur
      alert(`Erreur lors de la soumission: ${error.message || 'Veuillez réessayer.'}`);

      // Réactiver la possibilité de soumettre
      setSubmitting(false);
      setShowConfirmSubmit(true);
    }
  };

  // Optimiser le calcul du nombre de questions répondues
  const answeredQuestionsCount = useMemo(() => {
    if (!examData) return 0;
    return examData.questions.filter(q => answers.has(q.id)).length;
  }, [examData?.questions, answers]);

  const getAnsweredQuestions = useCallback(() => answeredQuestionsCount, [answeredQuestionsCount]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToQuestion = (questionId: number) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderQuestionContent = useCallback((question: any) => {
    const answer = answers.get(question.id);

    switch (question.type) {
      case 'multiple_choice':
      case 'true_false':
        // Vérifier si les options existent
        if (!question.options || question.options.length === 0) {
          return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">Aucune option disponible pour cette question.</p>
            </div>
          );
        }

        return (
          <div className="space-y-2">
            {question.options.map((option: any, index: number) => {
              // Convertir l'ID en string pour assurer la compatibilité
              const optionId = String(option.id);

              return (
                <button
                  key={optionId}
                  onClick={() => handleMultipleChoice(question.id, optionId)}
                  disabled={isSubmitted || submitting}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                    answer?.selected_options?.includes(optionId)
                      ? 'bg-green-50 border-green-200 text-gray-900'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-900'
                  } ${(isSubmitted || submitting) ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answer?.selected_options?.includes(optionId)
                        ? 'border-green-500'
                        : 'border-gray-300'
                    }`}>
                      {answer?.selected_options?.includes(optionId) && (
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      )}
                    </div>
                    <span>{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        );

      case 'open_ended':
        return (
          <textarea
            value={answer?.answer || ''}
            onChange={(e) => handleTextAnswer(question.id, e.target.value)}
            disabled={isSubmitted || submitting}
            placeholder="Tapez votre réponse ici..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        );

      case 'fill_blank':
        return (
          <input
            value={answer?.answer || ''}
            onChange={(e) => handleTextAnswer(question.id, e.target.value)}
            disabled={isSubmitted || submitting}
            placeholder="Votre réponse"
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        );

      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">Type de question non reconnu: {question.type}</p>
            <p className="text-sm text-yellow-600 mt-2">Question: {question.question_text}</p>
          </div>
        );
    }
  }, [answers, handleMultipleChoice, handleTextAnswer, isSubmitted, submitting]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'examen...</p>
        </div>
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Erreur de chargement'}
          </h2>
          <p className="text-gray-600 mb-6">
            Impossible de charger l'examen. Veuillez réessayer.
          </p>
          <button
            onClick={() => router.push('/student/sessions')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux sessions
          </button>
        </div>
      </div>
    );
  }

  // Afficher l'écran de succès si l'examen est soumis
  if (isSubmitted && examResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Examen terminé !</h2>
                <p className="text-gray-600 mb-6">
                  Vos réponses ont été soumises avec succès.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Score obtenu:</span>
                      <span className="font-bold text-lg text-green-600">{examResult.score}/{examResult.max_score}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pourcentage:</span>
                      <span className="font-bold text-lg text-green-600">{examResult.percentage}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Temps utilisé:</span>
                      <span className="font-medium">{examResult.time_spent} minutes</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Détail des réponses</h3>
                  {examResult.answers.map((answer: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-left">
                      <p className="font-medium text-gray-900 mb-2">{answer.question_text}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Votre réponse:</span>
                          <span className={`ml-2 font-medium ${answer.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                            {answer.student_answer || 'Non répondu'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Points:</span>
                          <span className="ml-2 font-medium">{answer.points_earned}/{answer.max_points}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => router.push('/student/sessions')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Retour aux sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{examData.session.title}</h1>
                <p className="text-gray-600">{examData.session.quiz?.description}</p>
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
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Timer className="w-5 h-5" />
                  <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
                </div>
              )}
              {lastAutoSave && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm">
                  <Save className="w-4 h-4" />
                  <span>Sauvegardé {formatTime(Math.floor((Date.now() - lastAutoSave.getTime()) / 1000))}s</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar navigation */}
        <div className="w-80 bg-white border-r border-gray-200 sticky top-0 h-screen overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
              <div className="grid grid-cols-5 gap-2">
                {examData.questions.map((question, index) => {
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
                    <span className="font-medium">{getAnsweredQuestions()}/{examData.questions.length}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Questions marquées:</span>
                    <span className="font-medium">{flaggedQuestions.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Points totaux:</span>
                    <span className="font-medium">{examData.session.quiz?.total_points}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowConfirmSubmit(true)}
                disabled={submitting}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Soumission...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Soumettre l'examen
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="w-full mx-auto">
            <div className="space-y-8">
              {/* Questions */}
              {examData.questions.map((question, index) => {
                const isAnswered = answers.has(question.id);
                const isFlagged = flaggedQuestions.has(question.id);

                return (
                  <div
                    key={question.id}
                    id={`question-${question.id}`}
                    className={`bg-white rounded-lg border-2 transition-all duration-200 p-6 ${
                      isAnswered
                        ? 'border-green-200 bg-green-50/30'
                        : 'border-gray-200'
                    } ${isFlagged ? 'ring-2 ring-orange-200' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                          isAnswered
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                              {getQuestionTypeLabel(question.type)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {question.points} points
                            </span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {question.question_text}
                          </h3>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFlag(question.id)}
                        disabled={submitting}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          isFlagged
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Flag className="w-5 h-5" />
                      </button>
                    </div>

                    {renderQuestionContent(question)}
                  </div>
                );
              })}

              {/* Section finale */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Prêt à soumettre votre examen ?
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="text-sm text-gray-600">
                      <p>Questions répondues: {getAnsweredQuestions()}/{examData.questions.length}</p>
                      <p>Questions non répondues: {examData.questions.length - getAnsweredQuestions()}</p>
                      <p>Questions marquées: {flaggedQuestions.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowConfirmSubmit(true)}
                    disabled={submitting}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 mx-auto font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Soumission...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Soumettre l'examen
                      </>
                    )}
                  </button>
                </div>
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

      {/* Modal de confirmation */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Confirmer la soumission</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir soumettre votre examen ? Vous ne pourrez plus modifier vos réponses après la soumission.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600">
                <p>Questions répondues: {getAnsweredQuestions()}/{examData.questions.length}</p>
                <p>Questions non répondues: {examData.questions.length - getAnsweredQuestions()}</p>
                <p>Questions marquées: {flaggedQuestions.size}</p>
              </div>
            </div>
            <div className="flex gap-3"><button
                onClick={() => setShowConfirmSubmit(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Soumettre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQuizInterface;