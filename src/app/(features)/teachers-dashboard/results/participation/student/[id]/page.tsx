'use client';
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import {
  User, CheckCircle, XCircle, Clock, Award,
  FileText, Target, AlertCircle,
  ThumbsUp, ThumbsDown, Calendar, Timer,
  BookOpen, Star, Eye, RotateCcw, Loader2,
  Edit3, Save, X, Check, Send, Download,
  MessageSquare, Award as AwardIcon
} from "lucide-react";
import TeacherPageHeader from "../../../../_components/page-header";
import KPIGrid from "@/components/ui/Cards/kpi-grid";
import resultService, { StudentQuizResponse } from "../../../_services/result.service";

const StudentResponsesPage = () => {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  const [studentResponse, setStudentResponse] = useState<StudentQuizResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  
  // États pour la correction
  const [editingResponse, setEditingResponse] = useState<number | null>(null);
  const [editingPoints, setEditingPoints] = useState<{[key: number]: number}>({});
  const [editingComments, setEditingComments] = useState<{[key: number]: string}>({});
  const [savingCorrection, setSavingCorrection] = useState(false);
  const [publishingResult, setPublishingResult] = useState(false);
  const [markingGraded, setMarkingGraded] = useState(false);

  // Charger les données au montage du composant
  useEffect(() => {
    if (studentId) {
      loadStudentResponses(parseInt(studentId));
    } else {
      setError('ID étudiant manquant');
      setLoading(false);
    }
  }, [studentId]);

  const loadStudentResponses = async (studentId: number) => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer le sessionId depuis les paramètres d'URL
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('sessionId');

      if (!sessionId) {
        setError('ID de session manquant dans l\'URL');
        return;
      }

      const data = await resultService.getStudentResponses(parseInt(sessionId), studentId);
      console.log('Student responses loaded:', data);
      console.log('Responses count:', data.responses?.length || 0);
      setStudentResponse(data);
    } catch (err) {
      console.error('Erreur lors du chargement des réponses:', err);
      setError('Impossible de charger les réponses de l\'étudiant');
    } finally {
      setLoading(false);
    }
  };

  // Fonctions de correction
  const startEditingResponse = (responseId: number, currentPoints: number, currentComment: string = '') => {
    setEditingResponse(responseId);
    setEditingPoints(prev => ({ ...prev, [responseId]: currentPoints }));
    setEditingComments(prev => ({ ...prev, [responseId]: currentComment }));
  };

  const cancelEditingResponse = () => {
    setEditingResponse(null);
    setEditingPoints({});
    setEditingComments({});
  };

  const saveResponseCorrection = async (responseId: number) => {
    if (!studentResponse) return;

    setSavingCorrection(true);
    try {
      // Simulation de l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour localement les données
      const updatedResponses = studentResponse.responses.map(response => {
        if (response.id === responseId) {
          return {
            ...response,
            points: editingPoints[responseId] || response.points,
            // Ici on pourrait ajouter un champ teacherComment si disponible
          };
        }
        return response;
      });

      setStudentResponse({
        ...studentResponse,
        responses: updatedResponses
      });

      setEditingResponse(null);
      setEditingPoints({});
      setEditingComments({});
      
      console.log('Correction sauvegardée pour la réponse:', responseId);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la correction');
    } finally {
      setSavingCorrection(false);
    }
  };

  const publishStudentResult = async () => {
    if (!studentResponse) return;

    setPublishingResult(true);
    try {
      // Simulation de l'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Résultat publié pour l\'étudiant:', studentResponse.student.name);
      alert('Résultat publié avec succès !');
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      alert('Erreur lors de la publication du résultat');
    } finally {
      setPublishingResult(false);
    }
  };

  const markAsGraded = async () => {
    if (!studentResponse) return;

    setMarkingGraded(true);
    try {
      // Simulation de l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Résultat marqué comme corrigé pour l\'étudiant:', studentResponse.student.name);
      alert('Résultat marqué comme corrigé !');
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
      alert('Erreur lors du marquage comme corrigé');
    } finally {
      setMarkingGraded(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Chargement des réponses...</p>
        </div>
      </div>
    );
  }

  if (error || !studentResponse) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins">
        <TeacherPageHeader
          title="Erreur de chargement"
          subtitle="Impossible de charger les réponses de l'étudiant"
          backButton={{
            onClick: () => router.back()
          }}
        />
        <div className="px-8 py-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Erreur de chargement</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{error || 'Données non disponibles'}</p>
            <button
              onClick={() => studentId && loadStudentResponses(parseInt(studentId))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        actionButton={{
          label: publishingResult ? "Publication..." : "Publier le résultat",
          icon: <Send className="w-4 h-4 mr-2" />,
          onClick: publishStudentResult,
          disabled: publishingResult
        }}
      />

      <div className="px-8 py-8">
        <div className="w-full">
          {/* Actions de correction */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Actions de correction</h3>
                <p className="text-xs text-gray-600">Gérer la correction et la publication du résultat</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={markAsGraded}
                  disabled={markingGraded}
                  className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {markingGraded ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {markingGraded ? "Marquage..." : "Marquer comme corrigé"}
                </button>
                <button
                  onClick={() => console.log("Exporter PDF")}
                  className="px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exporter PDF
                </button>
              </div>
            </div>
          </div>
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
          {studentResponse.responses.length > 0 ? (
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
                            {editingResponse === response.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  max={response.maxPoints}
                                  value={editingPoints[response.id] || response.points}
                                  onChange={(e) => setEditingPoints(prev => ({ 
                                    ...prev, 
                                    [response.id]: parseFloat(e.target.value) || 0 
                                  }))}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                                /{response.maxPoints || 0} points
                              </div>
                            ) : (
                              `${response.points || 0}/${response.maxPoints || 0} points`
                            )}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatTime(response.timeSpent || 0)}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          {response.questionText || 'Question sans texte'}
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
                    {/* Boutons d'action pour la correction */}
                    <div className="flex items-center gap-2 ml-4">
                      {editingResponse === response.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveResponseCorrection(response.id);
                            }}
                            disabled={savingCorrection}
                            className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                            title="Sauvegarder"
                          >
                            {savingCorrection ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEditingResponse();
                            }}
                            disabled={savingCorrection}
                            className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                            title="Annuler"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingResponse(response.id, response.points, '');
                          }}
                          className="p-1 text-gray-500 hover:text-blue-600"
                          title="Corriger cette réponse"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
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
                          <p className="text-gray-900">{response.studentAnswer || 'Aucune réponse'}</p>
                        </div>
                      </div>
                      {response.correctAnswer && !response.isCorrect && (
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

                  {/* Commentaire enseignant (en mode édition) */}
                  {editingResponse === response.id && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-yellow-900 mb-2">Commentaire enseignant</p>
                          <textarea
                            value={editingComments[response.id] || ''}
                            onChange={(e) => setEditingComments(prev => ({ 
                              ...prev, 
                              [response.id]: e.target.value 
                            }))}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Ajouter un commentaire pour l'étudiant..."
                            className="w-full px-3 py-2 text-sm border border-yellow-300 rounded focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 resize-none"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Réponses détaillées non disponibles</h3>
              <p className="text-gray-600 mb-4">
                Les réponses détaillées de l'étudiant ne sont pas encore disponibles. L'endpoint API `/api/teacher/results/{'{id}'}` doit être implémenté côté backend.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <p className="text-sm font-medium text-gray-900 mb-2">Endpoint à implémenter :</p>
                <code className="text-xs bg-gray-100 p-2 rounded block">
                  GET /api/teacher/results/{'{resultId}'}
                </code>
                <p className="text-xs text-gray-600 mt-2">
                  Retourner les données du quiz avec les student_responses incluant les détails de chaque question.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default StudentResponsesPage;