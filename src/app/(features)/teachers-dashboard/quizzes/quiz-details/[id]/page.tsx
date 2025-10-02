'use client';
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import { 
  FileText, BookOpen, Clock, Star, Settings, 
  Edit, Trash2, Users, Target, Eye, AlertCircle,
  Plus, ChevronRight, MoreVertical, Play, Copy,
  CheckCircle, XCircle, Shuffle, RotateCcw
} from "lucide-react";
import TeacherPageHeader from "../../../_components/page-header";
import QuestionDetailsModal from "../../../_components/QuestionDetailsModal"; // Import du modal
import { QuizzesService, Quiz, QuestionsService, Question } from "../../_services/quizzes.service";

// Type pour les options du modal (ajustez selon votre interface dans le modal)
interface ModalOption {
  text: string;
  is_correct: boolean;
}

// Type adapté pour le modal
interface ModalQuestion {
  id: number;
  question_text: string;
  type: Question['type'];
  points: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  options: ModalOption[];
  correct_answer: string;
  explanation: string;
  created_at: string;
  updated_at: string;
  order: number; // Propriété manquante requise par le modal
}

const QuizDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const quizId = params?.id as string;
  
  const [showActions, setShowActions] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour le modal
  const [selectedQuestion, setSelectedQuestion] = useState<ModalQuestion | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  // Récupération des données du quiz et des questions
  useEffect(() => {
    const fetchQuizAndQuestions = async () => {
      if (!quizId || isNaN(Number(quizId))) {
        setError("ID de quiz invalide");
        setLoading(false);
        return;
      }

      try {
        // Récupération du quiz et des questions en parallèle
        const [quizData, questionsData] = await Promise.all([
          QuizzesService.getById(Number(quizId)),
          QuestionsService.getAll(Number(quizId))
        ]);
        
        setQuiz(quizData);
        
        // CORRECTION: Trier les questions par ordre, puis par ID
        const sortedQuestions = questionsData.sort((a, b) => {
          // Si les deux ont un ordre défini, trier par ordre
          if (a.order != null && b.order != null) {
            return a.order - b.order;
          }
          // Si seulement a a un ordre, a vient en premier
          if (a.order != null && b.order == null) {
            return -1;
          }
          // Si seulement b a un ordre, b vient en premier
          if (a.order == null && b.order != null) {
            return 1;
          }
          // Si aucun n'a d'ordre, trier par ID (ou date de création)
          return a.id - b.id;
        });
        
        setQuestions(sortedQuestions);
      } catch (err: any) {
        console.error("Erreur lors de la récupération du quiz :", err);
        setError("Impossible de récupérer les détails du quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAndQuestions();
  }, [quizId]);

  // NOUVELLE FONCTION: Rafraîchir les questions après ajout/suppression
  const refreshQuestions = async () => {
    if (!quizId) return;
    
    try {
      const questionsData = await QuestionsService.getAll(Number(quizId));
      const sortedQuestions = questionsData.sort((a, b) => {
        if (a.order != null && b.order != null) {
          return a.order - b.order;
        }
        if (a.order != null && b.order == null) {
          return -1;
        }
        if (a.order == null && b.order != null) {
          return 1;
        }
        return a.id - b.id;
      });
      setQuestions(sortedQuestions);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des questions:", error);
    }
  };

  const getStatusConfig = (status: Quiz['status']) => {
    const configs = {
      draft: {
        label: "Brouillon",
        className: "bg-gray-100 text-gray-800 border-gray-200",
        icon: FileText
      },
      published: {
        label: "Publié",
        className: "bg-green-100 text-green-800 border-green-200", 
        icon: CheckCircle
      },
      archived: {
        label: "Archivé",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle
      }
    };
    return configs[status];
  };

  const getDifficultyConfig = (difficulty: 'easy' | 'medium' | 'hard') => {
    const configs = {
      easy: { label: "Facile", className: "bg-green-100 text-green-800" },
      medium: { label: "Moyen", className: "bg-yellow-100 text-yellow-800" },
      hard: { label: "Difficile", className: "bg-red-100 text-red-800" }
    };
    return configs[difficulty];
  };

  const getQuestionTypeLabel = (type: Question['type']) => {
    const types = {
      multiple_choice: "QCM",
      true_false: "Vrai/Faux", 
      open_ended: "Réponse libre",
      fill_blank: "Texte à trous"
    };
    return types[type];
  };

  const handleEditQuiz = () => {
    // TODO: Implémenter quand la page d'édition sera créée
    console.log("Éditer le quiz");
  };

  const handleAddQuestion = () => {
    // Chemin corrigé selon votre vraie structure de fichiers
    router.push(`/teachers-dashboard/quizzes/quiz-details/add-questions/${quiz?.id}`);
  };

  const handleEditQuestion = (questionId: number) => {
    // TODO: Implémenter quand la page d'édition de question sera créée
    console.log("Éditer la question", questionId);
  };

  // Nouvelle fonction pour voir les détails de la question
// Modifiez la fonction handleViewQuestion pour accepter l'index en paramètre
  const handleViewQuestion = (question: Question, index: number) => {
    // Adapter la question pour le modal en s'assurant du bon format
    const adaptedQuestion: ModalQuestion = {
      id: question.id,
      question_text: question.question_text,
      type: question.type,
      points: question.points || 0,
      difficulty: (question as any).difficulty || 'medium', // Utilisez un cast temporaire
      options: Array.isArray(question.options) 
        ? question.options.map((opt: any) => ({
            text: opt.text || opt.option_text || String(opt),
            is_correct: Boolean(opt.is_correct)
          }))
        : [],
      correct_answer: question.correct_answer || "",
      explanation: question.explanation || "",
      created_at: question.created_at || new Date().toISOString(),
      updated_at: question.updated_at || new Date().toISOString(),
      order: (question as any).order || index + 1 // Utilisez l'index passé en paramètre
    };
    setSelectedQuestion(adaptedQuestion);
    setShowQuestionModal(true);
  };
  // Nouvelle fonction pour fermer le modal
  const handleCloseModal = () => {
    setShowQuestionModal(false);
    setSelectedQuestion(null);
  };

  const handlePreviewQuiz = () => {
    // TODO: Implémenter quand la page de prévisualisation sera créée
    console.log("Prévisualiser le quiz");
  };

  const handleDeleteQuiz = async () => {
    if (!quiz || !window.confirm("Êtes-vous sûr de vouloir supprimer ce quiz ?")) {
      return;
    }

    try {
      await QuizzesService.delete(quiz.id);
      router.push("/teachers-dashboard/quizzes");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression du quiz");
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!quiz || !window.confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
      return;
    }

    try {
      await QuestionsService.delete(quiz.id, questionId);
      // CORRECTION: Rafraîchir depuis le serveur au lieu de filtrer localement
      await refreshQuestions();
    } catch (error) {
      console.error("Erreur lors de la suppression de la question :", error);
      alert("Erreur lors de la suppression de la question");
    }
  };

  // États de chargement et d'erreur
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins">
        <div className="px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="grid grid-cols-4 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins">
        <div className="px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Quiz non trouvé</h2>
              <p className="text-gray-600 mb-6">{error || "Ce quiz n'existe pas ou n'est plus disponible."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(quiz.status);
  const StatusIcon = statusConfig.icon;
  
  // Déterminer la difficulté basée sur les points (fallback si pas de propriété difficulty)
  const estimatedDifficulty: 'easy' | 'medium' | 'hard' = 
    (quiz.total_points || 0) < 20 ? 'easy' : 
    (quiz.total_points || 0) < 40 ? 'medium' : 'hard';
  
  const difficultyConfig = getDifficultyConfig(estimatedDifficulty);

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <TeacherPageHeader
        title={quiz.title}
        subtitle={`${questions.length} questions • Créé le ${new Date(quiz.created_at).toLocaleDateString('fr-FR')}`}
        actionButton={{
          label: "Modifier le quiz",
          icon: <Edit className="w-4 h-4 mr-2" />,
          onClick: handleEditQuiz
        }}
        backButton={{
          onClick: handleCancel
        }}
      />

      <div className="px-8 py-8">
        <div className="w-full mx-auto">
          {/* Informations générales */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <BookOpen className="w-4 h-4" />
                    Quiz #{quiz.id}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-2 ${statusConfig.className}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusConfig.label}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                  {showActions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={handlePreviewQuiz}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Prévisualiser
                      </button>
                      <button
                        onClick={() => {
                          // Logique de duplication à implémenter
                          console.log("Dupliquer le quiz");
                          setShowActions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Dupliquer
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleDeleteQuiz}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">
                {quiz.description || "Aucune description fournie pour ce quiz."}
              </p>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{quiz.duration_minutes || 'N/A'}</p>
                <p className="text-sm text-gray-600">minutes</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{quiz.total_points || 0}</p>
                <p className="text-sm text-gray-600">points</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
                <p className="text-sm text-gray-600">questions</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">tentatives</p>
              </div>
            </div>

            {/* Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuration
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Difficulté</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyConfig.className}`}>
                      {difficultyConfig.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Résultats immédiats</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${quiz.show_results_immediately ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {quiz.show_results_immediately ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Révision autorisée</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${quiz.allow_review ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {quiz.allow_review ? 'Oui' : 'Non'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Options avancées
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Questions mélangées</span>
                    <Shuffle className={`w-4 h-4 ${quiz.shuffle_questions ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Créé le</span>
                    <span className="text-sm text-gray-900">
                      {new Date(quiz.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Modifié le</span>
                    <span className="text-sm text-gray-900">
                      {new Date(quiz.updated_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Questions */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Questions du quiz</h2>
                    <p className="text-sm text-gray-600">{questions.length} question{questions.length > 1 ? 's' : ''} configurée{questions.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <button
                  onClick={handleAddQuestion}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une question
                </button>
              </div>
            </div>

            <div className="p-8">
              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune question ajoutée</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Commencez par ajouter des questions à votre quiz pour permettre aux étudiants de le passer.
                  </p>
                  <button
                    onClick={handleAddQuestion}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 mx-auto font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Créer ma première question
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {/* CORRECTION: Utiliser l'index + 1 pour l'affichage séquentiel */}
                          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {index + 1}
                          </span>
                          
                          <div className="flex-1">
                            <h4 className="text-gray-900 font-medium mb-1">
                              {question.question_text}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                {getQuestionTypeLabel(question.type)}
                              </span>
                              {question.points && (
                                <span>{question.points} point{question.points > 1 ? 's' : ''}</span>
                              )}
                              {question.time_limit && (
                                <span>{question.time_limit}s</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-4">
                          {/* NOUVEAU: Bouton œil pour voir les détails */}
                          <button
                            onClick={() => handleViewQuestion(question, index)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditQuestion(question.id)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Modifier la question"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Supprimer la question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* NOUVEAU: Modal de détails de question */}
      {selectedQuestion && (
        <QuestionDetailsModal
          question={selectedQuestion}
          quizId={quiz.id.toString()}
          isOpen={showQuestionModal}
          onClose={handleCloseModal}
          onEdit={() => {
            handleCloseModal();
            handleEditQuestion(selectedQuestion.id);
          }}
          onDelete={async () => {
            handleCloseModal();
            await handleDeleteQuestion(selectedQuestion.id);
          }}
        />
      )}
    </div>
  );
};

export default QuizDetailsPage;