'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { 
  FileText, BookOpen, Clock, Star, Settings, 
  Edit, Trash2, Users, Target, Eye, AlertCircle,
  Plus, ChevronRight, MoreVertical, Play, Copy,
  CheckCircle, XCircle, Shuffle, RotateCcw
} from "lucide-react";
import TeacherPageHeader from "../../_components/page-header";

// Types
interface Question {
  id: string;
  question_text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  options_count?: number;
  order: number;
}

const QuizDetailsPage = () => {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);

  // Données statiques du quiz
  const quiz = {
    id: "1",
    title: "Quiz UX Design - Méthodologies et Prototypage",
    description: "Évaluation des connaissances sur les principes UX/UI, méthodologies de recherche utilisateur et techniques de prototypage. Ce quiz couvre les aspects essentiels du design centré utilisateur.",
    subject: {
      id: 1,
      name: "UX/UI Design",
      code: "UX101"
    },
    duration_minutes: 60,
    total_points: 30,
    status: "published" as const,
    difficulty: "medium" as const,
    shuffle_questions: true,
    show_results_immediately: false,
    allow_review: true,
    negative_marking: false,
    require_all_questions: true,
    randomize_options: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-16T14:30:00Z",
    questions_count: 5,
    attempts_count: 12
  };

  // Données statiques des questions
  const questions: Question[] = [
    {
      id: "1",
      question_text: "Quelle est la première étape du processus de Design Thinking ?",
      type: "multiple_choice",
      points: 3,
      difficulty: "easy",
      options_count: 4,
      order: 1
    },
    {
      id: "2", 
      question_text: "Les personas sont-ils basés sur des données réelles d'utilisateurs ?",
      type: "true_false",
      points: 2,
      difficulty: "medium",
      order: 2
    },
    {
      id: "3",
      question_text: "Qu'est-ce qu'un wireframe et à quoi sert-il dans le processus de design ?",
      type: "short_answer",
      points: 5,
      difficulty: "medium",
      order: 3
    },
    {
      id: "4",
      question_text: "Parmi ces méthodes, lesquelles sont utilisées pour la recherche utilisateur ?",
      type: "multiple_choice",
      points: 4,
      difficulty: "hard",
      options_count: 6,
      order: 4
    },
    {
      id: "5",
      question_text: "Définissez le concept d'affordance en UX Design",
      type: "short_answer", 
      points: 6,
      difficulty: "hard",
      order: 5
    }
  ];

  const getStatusConfig = (status: typeof quiz.status) => {
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

  // CORRECTION: Changer le type du paramètre pour accepter tous les niveaux de difficulté
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
      short_answer: "Réponse courte"
    };
    return types[type];
  };

  const handleEditQuiz = () => {
    router.push(`/dashboard/teacher/quizzes/${quiz.id}/edit`);
  };

  const handleAddQuestion = () => {
    router.push(`/dashboard/teacher/quizzes/${quiz.id}/questions/create`);
  };

  const handleEditQuestion = (questionId: string) => {
    router.push(`/dashboard/teacher/quizzes/${quiz.id}/questions/${questionId}/edit`);
  };

  const handlePreviewQuiz = () => {
    router.push(`/dashboard/teacher/quizzes/${quiz.id}/preview`);
  };

  const statusConfig = getStatusConfig(quiz.status);
  const difficultyConfig = getDifficultyConfig(quiz.difficulty);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <TeacherPageHeader
        title={quiz.title}
        subtitle={`${quiz.questions_count} questions • ${quiz.attempts_count} tentatives`}
        actionButton={{
          label: "Modifier le quiz",
          icon: <Edit className="w-4 h-4 mr-2" />,
          onClick: handleEditQuiz
        }}
      />

      <div className="px-8 py-8">
        <div className="max-w-6xl mx-auto">
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
                    {quiz.subject.name} {quiz.subject.code && `(${quiz.subject.code})`}
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
                        onClick={() => {/* Logique de duplication */}}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Dupliquer
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => {/* Logique de suppression */}}
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
              <p className="text-gray-700 leading-relaxed">{quiz.description}</p>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{quiz.duration_minutes}</p>
                <p className="text-sm text-gray-600">minutes</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{quiz.total_points}</p>
                <p className="text-sm text-gray-600">points</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{quiz.questions_count}</p>
                <p className="text-sm text-gray-600">questions</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{quiz.attempts_count}</p>
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
                    <span className="text-sm text-gray-600">Points négatifs</span>
                    <AlertCircle className={`w-4 h-4 ${quiz.negative_marking ? 'text-red-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Options mélangées</span>
                    <RotateCcw className={`w-4 h-4 ${quiz.randomize_options ? 'text-green-600' : 'text-gray-400'}`} />
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
                // État vide - Pour tester, changez questions.length en 0
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
                // Liste des questions
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Numéro de la question */}
                          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {index + 1}
                          </span>
                          
                          {/* Libellé de la question */}
                          <h4 className="text-gray-900 font-medium flex-1 truncate">
                            {question.question_text}
                          </h4>
                          
                          {/* Type de question */}
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium flex-shrink-0">
                            {getQuestionTypeLabel(question.type)}
                          </span>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1 ml-4">
                          <button
                            onClick={() => handleEditQuestion(question.id)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
    </div>
  );
};

export default QuizDetailsPage;