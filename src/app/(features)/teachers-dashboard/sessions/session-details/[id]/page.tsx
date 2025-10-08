'use client';
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import { 
  Calendar, Clock, Users, Code, BookOpen, Settings,
  Edit, Trash2, MoreVertical, Play, Copy, CheckCircle,
  XCircle, AlertCircle, Plus, ChevronRight, Shield,
  FileText, Target, Eye, Download, Share2, UserCheck,
  Pause, Shuffle, RotateCcw, Timer, Lock, Unlock,
  RefreshCw
} from "lucide-react";
import TeacherPageHeader from "../../../_components/page-header";
import { SessionsService, Session } from "../../_services/sessions.service";
import { QuestionsService, Question } from "../../../quizzes/_services/quizzes.service";

// Types pour les étudiants (données simulées)
interface Student {
  id: number;
  name: string;
  email: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'submitted';
  started_at?: string;
  submitted_at?: string;
  score?: number;
  time_spent?: number;
}

const SessionDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;
  
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  
  // États pour les questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Données simulées des étudiants (à remplacer par de vraies données plus tard)
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Marie Dubois",
      email: "marie.dubois@email.com",
      status: "completed",
      started_at: "2025-09-05T09:05:00Z",
      submitted_at: "2025-09-05T09:45:00Z",
      score: 85,
      time_spent: 40
    },
    {
      id: 2,
      name: "Jean Martin",
      email: "jean.martin@email.com", 
      status: "in_progress",
      started_at: "2025-09-05T09:10:00Z",
      time_spent: 25
    },
    {
      id: 3,
      name: "Sophie Laurent",
      email: "sophie.laurent@email.com",
      status: "completed",
      started_at: "2025-09-05T09:02:00Z",
      submitted_at: "2025-09-05T09:52:00Z",
      score: 92,
      time_spent: 50
    }
  ]);

  // Fonction pour charger les données de la session
  const fetchSession = async () => {
    try {
      setError(null);
      const sessionData = await SessionsService.getById(parseInt(sessionId));
      setSession(sessionData);
      
      // Charger les questions du quiz associé si la session a un quiz
      if (sessionData.quiz_id) {
        await fetchQuestions(sessionData.quiz_id);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Votre session a expiré. Veuillez vous reconnecter.');
      } else if (err.response?.status === 403) {
        setError('Accès non autorisé. Cette session ne vous appartient pas.');
      } else if (err.response?.status === 404) {
        setError('Session non trouvée.');
      } else {
        setError(err.response?.data?.error || err.message || 'Une erreur est survenue lors du chargement de la session');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fonction pour charger les questions du quiz
  const fetchQuestions = async (quizId: number) => {
    try {
      setLoadingQuestions(true);
      const questionsData = await QuestionsService.getAll(quizId);
      
      // Trier les questions par ordre, puis par ID
      const sortedQuestions = questionsData.sort((a: Question, b: Question) => {
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
    } catch (err: any) {
      // Ne pas afficher d'erreur pour les questions, juste les laisser vides
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  // Fonction de rafraîchissement
  const handleRefresh = () => {
    setRefreshing(true);
    fetchSession().finally(() => {
      setRefreshing(false);
    });
  };

  // Fonction pour activer une session
  const handleActivateSession = async () => {
    if (!session) return;

    try {
      await SessionsService.changeStatus(session.id, 'activate');
      await fetchSession(); // Recharger les données
    } catch (error: any) {
    }
  };

  // Fonction pour éditer une session
  const handleEditSession = () => {
    if (!session) return;
    router.push(`/teachers-dashboard/sessions/${session.id}/edit`);
  };

  // Fonction pour supprimer une session
  const handleDeleteSession = async () => {
    if (!session) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette session ? Cette action est irréversible.')) {
      return;
    }

    try {
      await SessionsService.delete(session.id);
      router.push('/teachers-dashboard/sessions');
    } catch (error: any) {
    }
  };

  // Fonctions utilitaires avec valeurs par défaut
  const getStatusConfig = (status: Session['status']) => {
    const configs = {
      scheduled: {
        label: "Programmée",
        className: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock
      },
      active: {
        label: "En cours",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: Play
      },
      paused: {
        label: "En pause",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Pause
      },
      completed: {
        label: "Terminée",
        className: "bg-gray-100 text-gray-800 border-gray-200", 
        icon: CheckCircle
      },
      cancelled: {
        label: "Annulée",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle
      }
    };
    return configs[status];
  };

  const getAccessTypeLabel = (type?: string) => {
    const types = {
      public_code: "Code d'accès public",
      student_list: "Liste d'étudiants",
      open: "Accès libre"
    };
    return types[type as keyof typeof types] || "Non défini";
  };

  const getDifficultyConfig = (difficulty?: string) => {
    const configs = {
      easy: { label: "Facile", className: "bg-green-100 text-green-800" },
      medium: { label: "Moyen", className: "bg-yellow-100 text-yellow-800" },
      hard: { label: "Difficile", className: "bg-red-100 text-red-800" }
    };
    return configs[difficulty as keyof typeof configs] || { label: "Moyen", className: "bg-yellow-100 text-yellow-800" };
  };

  const getStudentStatusConfig = (status: Student['status']) => {
    const configs = {
      not_started: {
        label: "Non commencé",
        className: "bg-gray-100 text-gray-800",
        icon: Clock
      },
      in_progress: {
        label: "En cours", 
        className: "bg-blue-100 text-blue-800",
        icon: Play
      },
      completed: {
        label: "Terminé",
        className: "bg-green-100 text-green-800",
        icon: CheckCircle
      },
      submitted: {
        label: "Soumis",
        className: "bg-purple-100 text-purple-800",
        icon: CheckCircle
      }
    };
    return configs[status];
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? mins.toString().padStart(2, '0') : ''}`;
    }
    return `${mins} min`;
  };

  const getQuestionTypeLabel = (type: Question['type']) => {
    const types: Record<Question['type'], string> = {
      multiple_choice: "QCM",
      true_false: "Vrai/Faux", 
      open_ended: "Réponse libre",
      fill_blank: "Texte à trous"
    };
    return types[type];
  };

  // États de chargement et d'erreur
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-8 py-8">
          <div className="w-full mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="animate-pulse">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div>
                      <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                      <div className="h-5 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isAuthError = error.includes('expiré') || error.includes('non autorisé');
    
    return (
      <div className="min-h-screen bg-gray-50">
        <TeacherPageHeader
          title="Erreur"
          subtitle="Impossible de charger la session"
          backButton={{
            onClick: () => router.back(),
          }}
        />
        <div className="px-8 py-8">
          <div className="w-full mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {isAuthError ? 'Erreur d\'authentification' : 'Erreur de chargement'}
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {!isAuthError && (
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Réessayer
                  </button>
                )}
                
                {isAuthError && (
                  <button
                    onClick={() => {
                      localStorage.removeItem("teacher_token");
                      localStorage.removeItem("teacher_data");
                      window.location.href = "/auth/sign-in/teacher";
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                  >
                    Se reconnecter
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Calculs des statistiques avec valeurs par défaut
  const completedStudents = students.filter(s => s.status === 'completed').length;
  const inProgressStudents = students.filter(s => s.status === 'in_progress').length;
  const averageScore = students.filter(s => s.score !== undefined).reduce((acc, s) => acc + (s.score || 0), 0) / completedStudents || 0;

  const statusConfig = getStatusConfig(session.status);
  const StatusIcon = statusConfig.icon;
  const difficultyConfig = getDifficultyConfig(session.quiz?.settings?.difficulty);
  
  // Valeurs par défaut pour éviter les erreurs
  const allowedStudentsCount = session.allowed_students?.length || 0;
  const timeLimit = session.settings?.time_limit || session.duration_minutes || 60;
  const totalPoints = session.quiz?.total_points || 0;

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Eye },
    { id: 'participants', label: 'Participants', icon: UserCheck },
    { id: 'settings', label: 'Configuration', icon: Settings },
    { id: 'results', label: 'Résultats', icon: Target }
  ];

  // Fonction pour terminer une session
  const handleCompleteSession = async () => {
    if (!session) return;

    if (!confirm('Êtes-vous sûr de vouloir terminer cette session ? Cette action est irréversible.')) {
      return;
    }

    try {
      const updatedSession = await SessionsService.complete(session.id);
      setSession(updatedSession);
    } catch (error: any) {
    }
  };

  // Fonction pour annuler une session
  const handleCancelSession = async () => {
    if (!session) return;

    if (!confirm('Êtes-vous sûr de vouloir annuler cette session ? Cette action est irréversible.')) {
      return;
    }

    try {
      const updatedSession = await SessionsService.cancel(session.id);
      setSession(updatedSession);
    } catch (error: any) {
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header avec navigation */}
      <TeacherPageHeader
        title={session.title}
        subtitle={`Code: ${session.session_code} • ${formatDateTime(session.starts_at)} • ${completedStudents}/${allowedStudentsCount} terminés`}
        actionButton={{
          label: session.status === 'scheduled' ? "Activer la session" : "Modifier",
          icon: session.status === 'scheduled' ? <Play className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />,
          onClick: session.status === 'scheduled' ? handleActivateSession : handleEditSession
        }}
        backButton={{
          onClick: () => router.back()
        }}
      />

      <div className="px-8 py-8">
        <div className="w-full mx-auto">
          {/* Bouton de rafraîchissement */}
          <div className="mb-6">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium inline-flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? "Rafraîchissement..." : "Rafraîchir"}
            </button>
          </div>

          {/* Informations générales */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{session.title}</h1>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <BookOpen className="w-4 h-4" />
                    {session.quiz?.title || "Quiz non défini"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Code className="w-4 h-4 text-gray-500" />
                    <span className="font-mono text-lg font-bold text-blue-600">{session.session_code}</span>
                  </div>
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
                        {session.status === 'scheduled' && (
                          <button
                            onClick={() => {
                              setShowActions(false);
                              handleActivateSession();
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-green-50 text-green-600 flex items-center gap-2"
                          >
                            <Play className="w-4 h-4" />
                            Activer
                          </button>
                        )}
                        
                        {session.status === 'active' && (
                          <button
                            onClick={() => {
                              setShowActions(false);
                              handleCompleteSession();
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 text-blue-600 flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Terminer
                          </button>
                        )}
                        
                        {['scheduled', 'active'].includes(session.status) && (
                          <button
                            onClick={() => {
                              setShowActions(false);
                              handleCancelSession();
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Annuler
                          </button>
                        )}
                        
                        <hr className="my-1" />
                        
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(session.session_code);
                            setShowActions(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Share2 className="w-4 h-4" />
                          Partager le code
                        </button>
                        
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(session.session_code);
                            setShowActions(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copier le code
                        </button>
                        
                        <hr className="my-1" />
                        
                        {!['active'].includes(session.status) && (
                          <button
                            onClick={() => {
                              setShowActions(false);
                              handleDeleteSession();
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </button>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {session.quiz?.description && (
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{session.quiz.description}</p>
              </div>
            )}

            {/* Code de session en évidence */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Code de session</h3>
                  <p className="text-blue-700 text-sm">Partagez ce code avec vos étudiants pour qu'ils puissent rejoindre la session</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white border border-blue-300 rounded-lg px-6 py-3">
                    <span className="font-mono text-2xl font-bold text-blue-600 tracking-wider">
                      {session.session_code}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(session.session_code);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copier
                  </button>
                </div>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Timer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{timeLimit}</p>
                <p className="text-sm text-gray-600">minutes</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{completedStudents}/{allowedStudentsCount}</p>
                <p className="text-sm text-gray-600">terminés</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{Math.round(averageScore)}%</p>
                <p className="text-sm text-gray-600">score moyen</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
                <p className="text-sm text-gray-600">points total</p>
              </div>
            </div>

            {/* Informations de planification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Planification
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Début</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDateTime(session.starts_at)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Fin</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDateTime(session.ends_at)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Durée</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDuration(timeLimit)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Accès et sécurité
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type d'accès</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {getAccessTypeLabel(session.access_type)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Surveillance</span>
                    <Shield className={`w-4 h-4 ${session.settings?.proctoring ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tentatives autorisées</span>
                    <span className="text-sm font-medium text-gray-900">{session.attempts_allowed || 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Onglets de contenu */}
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Navigation des onglets */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8 pt-6">
                {tabs.map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <TabIcon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Contenu des onglets */}
            <div className="p-8">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vue d'ensemble de la session</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Quiz associé</h4>
                      <p className="text-blue-800 text-sm">{session.quiz?.title || "Quiz non défini"}</p>
                      {session.quiz?.settings?.difficulty && (
                        <div className="mt-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyConfig.className}`}>
                            {difficultyConfig.label}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Progression</h4>
                      <p className="text-green-800 text-sm">
                        {completedStudents} terminés, {inProgressStudents} en cours
                      </p>
                      <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{width: allowedStudentsCount > 0 ? `${(completedStudents / allowedStudentsCount) * 100}%` : '0%'}}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Performance</h4>
                      <p className="text-purple-800 text-sm">Score moyen: {Math.round(averageScore)}%</p>
                      <p className="text-purple-700 text-xs mt-1">
                        Basé sur {completedStudents} résultats
                      </p>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none mb-8">
                    <p className="text-gray-700 leading-relaxed">
                      Cette session de quiz permet aux étudiants de valider leurs connaissances sur {session.quiz?.title?.toLowerCase() || "le sujet défini"}. 
                      La session est configurée avec un temps limite de {timeLimit} minutes et 
                      {session.settings?.proctoring ? ' inclut la surveillance automatique' : ' fonctionne en mode libre'}.
                    </p>
                  </div>

                  {/* Section Questions du quiz */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Questions du quiz</h4>
                          <p className="text-sm text-gray-600">
                            {loadingQuestions ? 'Chargement...' : `${questions.length} question${questions.length > 1 ? 's' : ''} dans ce quiz`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {loadingQuestions ? (
                        <div className="space-y-3">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-4">
                              <div className="animate-pulse">
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                  <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : questions.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">Aucune question trouvée</h4>
                          <p className="text-gray-600 max-w-md mx-auto">
                            Le quiz associé à cette session ne contient pas encore de questions.
                          </p>
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
                                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                    {index + 1}
                                  </span>
                                  
                                  <div className="flex-1">
                                    <h5 className="text-gray-900 font-medium mb-1">
                                      {question.question_text}
                                    </h5>
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
                                  {/* Bouton pour voir le quiz complet */}
                                  <button
                                    onClick={() => router.push(`/teachers-dashboard/quizzes/quiz-details/${session?.quiz_id}`)}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Voir le quiz complet"
                                  >
                                    <Eye className="w-4 h-4" />
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
              )}

              {activeTab === 'participants' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Participants à la session</h3>
                      <p className="text-sm text-gray-600">
                        {allowedStudentsCount} étudiants autorisés
                      </p>
                    </div>
                    <button
                      onClick={() => {/* Logique d'export */}}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Exporter
                    </button>
                  </div>

                  <div className="space-y-2">
                    {students.map((student) => {
                      const statusConfig = getStudentStatusConfig(student.status);
                      const StatusIcon = statusConfig.icon;
                      
                      return (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{student.name}</h4>
                              <p className="text-sm text-gray-600">{student.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {student.score !== undefined && (
                              <span className="text-sm font-medium text-gray-900">
                                {student.score}%
                              </span>
                            )}
                            {student.time_spent && (
                              <span className="text-sm text-gray-600">
                                {student.time_spent} min
                              </span>
                            )}
                            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${statusConfig.className}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuration de la session</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Paramètres de session</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Questions mélangées</span>
                            <p className="text-xs text-gray-500">Ordre des questions randomisé</p>
                          </div>
                          <Shuffle className={`w-4 h-4 ${session.settings?.shuffle_questions ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Surveillance activée</span>
                            <p className="text-xs text-gray-500">Proctoring automatique</p>
                          </div>
                          <Shield className={`w-4 h-4 ${session.settings?.proctoring ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Pause autorisée</span>
                            <p className="text-xs text-gray-500">Possibilité de mettre en pause</p>
                          </div>
                          <Pause className={`w-4 h-4 ${session.settings?.allow_pause ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Temps limite</span>
                            <p className="text-xs text-gray-500">Durée maximale autorisée</p>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{timeLimit} min</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Paramètres du quiz</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Résultats immédiats</span>
                            <p className="text-xs text-gray-500">Affichage direct du score</p>
                          </div>
                          <CheckCircle className={`w-4 h-4 ${session.quiz?.show_results_immediately ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Révision autorisée</span>
                            <p className="text-xs text-gray-500">Possibilité de revoir les réponses</p>
                          </div>
                          <Eye className={`w-4 h-4 ${session.quiz?.allow_review ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Options mélangées</span>
                            <p className="text-xs text-gray-500">Ordre des réponses randomisé</p>
                          </div>
                          <RotateCcw className={`w-4 h-4 ${session.quiz?.settings?.randomize_options ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Points négatifs</span>
                            <p className="text-xs text-gray-500">Pénalité pour mauvaises réponses</p>
                          </div>
                          <AlertCircle className={`w-4 h-4 ${session.quiz?.settings?.negative_marking ? 'text-red-600' : 'text-gray-400'}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'results' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Résultats de la session</h3>
                      <p className="text-sm text-gray-600">
                        Analyse des performances et statistiques détaillées
                      </p>
                    </div>
                    <button
                      onClick={() => {/* Logique d'export des résultats */}}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Exporter les résultats
                    </button>
                  </div>

                  {completedStudents === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat disponible</h4>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Les résultats apparaîtront ici une fois que les étudiants auront terminé le quiz.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Statistiques globales */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-blue-600">{Math.round(averageScore)}%</p>
                          <p className="text-sm text-blue-800">Score moyen</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {students.filter(s => s.score).length > 0 ? Math.max(...students.filter(s => s.score).map(s => s.score || 0)) : 0}%
                          </p>
                          <p className="text-sm text-green-800">Meilleur score</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-red-600">
                            {students.filter(s => s.score).length > 0 ? Math.min(...students.filter(s => s.score).map(s => s.score || 0)) : 0}%
                          </p>
                          <p className="text-sm text-red-800">Score le plus bas</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {students.filter(s => s.time_spent).length > 0 ? 
                              Math.round(students.filter(s => s.time_spent).reduce((acc, s) => acc + (s.time_spent || 0), 0) / completedStudents) : 0
                            }
                          </p>
                          <p className="text-sm text-purple-800">Temps moyen (min)</p>
                        </div>
                      </div>

                      {/* Distribution des scores */}
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-4">Distribution des scores</h4>
                        <div className="space-y-2">
                          {[
                            { range: '90-100%', count: students.filter(s => s.score && s.score >= 90).length, color: 'bg-green-500' },
                            { range: '80-89%', count: students.filter(s => s.score && s.score >= 80 && s.score < 90).length, color: 'bg-blue-500' },
                            { range: '70-79%', count: students.filter(s => s.score && s.score >= 70 && s.score < 80).length, color: 'bg-yellow-500' },
                            { range: '60-69%', count: students.filter(s => s.score && s.score >= 60 && s.score < 70).length, color: 'bg-orange-500' },
                            { range: '0-59%', count: students.filter(s => s.score && s.score < 60).length, color: 'bg-red-500' }
                          ].map(item => (
                            <div key={item.range} className="flex items-center gap-4">
                              <span className="text-sm font-medium text-gray-700 w-16">{item.range}</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                                <div 
                                  className={`${item.color} h-4 rounded-full transition-all duration-500`}
                                  style={{width: completedStudents > 0 ? `${(item.count / completedStudents) * 100}%` : '0%'}}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-8">{item.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Détail des résultats par étudiant */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Résultats détaillés</h4>
                        <div className="space-y-2">
                          {students
                            .filter(s => s.status === 'completed')
                            .sort((a, b) => (b.score || 0) - (a.score || 0))
                            .map((student, index) => (
                            <div
                              key={student.id}
                              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-700">#{index + 1}</span>
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900">{student.name}</h5>
                                  <p className="text-sm text-gray-600">
                                    Terminé en {student.time_spent} min • 
                                    Soumis à {student.submitted_at ? new Date(student.submitted_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}) : ''}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-lg font-bold text-gray-900">{student.score}%</p>
                                  <p className="text-sm text-gray-600">
                                    {Math.round((student.score || 0) * totalPoints / 100)}/{totalPoints} pts
                                  </p>
                                </div>
                                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsPage;