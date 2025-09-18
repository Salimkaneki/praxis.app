'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { 
  Calendar, Clock, Users, Code, BookOpen, Settings,
  Edit, Trash2, MoreVertical, Play, Copy, CheckCircle,
  XCircle, AlertCircle, Plus, ChevronRight, Shield,
  FileText, Target, Eye, Download, Share2, UserCheck,
  Pause, Shuffle, RotateCcw, Timer, Lock, Unlock
} from "lucide-react";
import TeacherPageHeader from "../../_components/page-header";

// Types
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

interface QuizSession {
  id: number;
  quiz_id: number;
  teacher_id: number;
  session_code: string;
  title: string;
  starts_at: string;
  ends_at: string;
  status: 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  allowed_students: number[];
  max_participants: number;
  require_student_list: boolean;
  settings: {
    shuffle_questions: boolean;
    time_limit: number;
    proctoring: boolean;
    allow_pause: boolean;
  };
  activated_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  access_type: 'public_code' | 'student_list' | 'open';
  duration_override: number | null;
  attempts_allowed: number;
  quiz: {
    id: number;
    title: string;
    description: string;
    subject_id: number;
    teacher_id: number;
    duration_minutes: number;
    total_points: number;
    shuffle_questions: boolean;
    show_results_immediately: boolean;
    allow_review: boolean;
    status: 'draft' | 'published' | 'archived';
    settings: {
      difficulty: 'easy' | 'medium' | 'hard';
      negative_marking: boolean;
      require_all_questions: boolean;
      randomize_options: boolean;
    };
    created_at: string;
    updated_at: string;
  };
}

const SessionDetailsPage = () => {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Données de la session basées sur votre structure
  const session: QuizSession = {
    id: 1,
    quiz_id: 1,
    teacher_id: 1,
    session_code: "LOKXOI",
    title: "Session 1 - Quiz UX Design",
    starts_at: "2025-09-05T09:00:00.000000Z",
    ends_at: "2025-09-05T11:00:00.000000Z",
    status: "scheduled",
    allowed_students: [1, 2, 3, 4, 5],
    max_participants: 100,
    require_student_list: false,
    settings: {
      shuffle_questions: true,
      time_limit: 60,
      proctoring: true,
      allow_pause: false
    },
    activated_at: null,
    completed_at: null,
    created_at: "2025-08-26T17:23:01.000000Z",
    updated_at: "2025-08-26T17:23:01.000000Z",
    access_type: "public_code",
    duration_override: null,
    attempts_allowed: 1,
    quiz: {
      id: 1,
      title: "Quiz UX Design - Méthodologies et Prototypage",
      description: "Évaluation des connaissances sur les principes UX/UI, méthodologies de recherche utilisateur et techniques de prototypage",
      subject_id: 1,
      teacher_id: 1,
      duration_minutes: 60,
      total_points: 30,
      shuffle_questions: true,
      show_results_immediately: false,
      allow_review: true,
      status: "draft",
      settings: {
        difficulty: "medium",
        negative_marking: false,
        require_all_questions: true,
        randomize_options: true
      },
      created_at: "2025-08-26T12:15:51.000000Z",
      updated_at: "2025-08-26T12:15:51.000000Z"
    }
  };

  // Données simulées des étudiants
  const students: Student[] = [
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
    },
    {
      id: 4,
      name: "Pierre Moreau",
      email: "pierre.moreau@email.com",
      status: "not_started"
    },
    {
      id: 5,
      name: "Emma Bernard",
      email: "emma.bernard@email.com",
      status: "completed",
      started_at: "2025-09-05T09:08:00Z",
      submitted_at: "2025-09-05T09:58:00Z",
      score: 78,
      time_spent: 50
    }
  ];

  const getStatusConfig = (status: QuizSession['status']) => {
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

  const getAccessTypeLabel = (type: QuizSession['access_type']) => {
    const types = {
      public_code: "Code d'accès public",
      student_list: "Liste d'étudiants",
      open: "Accès libre"
    };
    return types[type];
  };

  const getDifficultyConfig = (difficulty: QuizSession['quiz']['settings']['difficulty']) => {
    const configs = {
      easy: { label: "Facile", className: "bg-green-100 text-green-800" },
      medium: { label: "Moyen", className: "bg-yellow-100 text-yellow-800" },
      hard: { label: "Difficile", className: "bg-red-100 text-red-800" }
    };
    return configs[difficulty];
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

  const handleEditSession = () => {
    router.push(`/dashboard/teacher/sessions/${session.id}/edit`);
  };

  const handleActivateSession = () => {
    // Logique d'activation de session
    alert("Activer la session - fonctionnalité à implémenter");
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

  const statusConfig = getStatusConfig(session.status);
  const StatusIcon = statusConfig.icon;
  const difficultyConfig = getDifficultyConfig(session.quiz.settings.difficulty);
  
  const completedStudents = students.filter(s => s.status === 'completed').length;
  const inProgressStudents = students.filter(s => s.status === 'in_progress').length;
  const averageScore = students.filter(s => s.score !== undefined).reduce((acc, s) => acc + (s.score || 0), 0) / completedStudents || 0;

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Eye },
    { id: 'participants', label: 'Participants', icon: UserCheck },
    { id: 'settings', label: 'Configuration', icon: Settings },
    { id: 'results', label: 'Résultats', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <TeacherPageHeader
        title={session.title}
        subtitle={`Code: ${session.session_code} • ${formatDateTime(session.starts_at)} • ${completedStudents}/${session.allowed_students.length} terminés`}
        actionButton={{
          label: session.status === 'scheduled' ? "Activer la session" : "Modifier",
          icon: session.status === 'scheduled' ? <Play className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />,
          onClick: session.status === 'scheduled' ? handleActivateSession : handleEditSession
        }}
        backButton={{
          label: "Retour aux sessions",
          onClick: () => router.push('/dashboard/teacher/sessions')
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
                  <h1 className="text-2xl font-bold text-gray-900">{session.title}</h1>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <BookOpen className="w-4 h-4" />
                    {session.quiz.title}
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
                      <button
                        onClick={() => {/* Logique de partage du code */}}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Partager le code
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
              <p className="text-gray-700 leading-relaxed">{session.quiz.description}</p>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Timer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{session.settings.time_limit}</p>
                <p className="text-sm text-gray-600">minutes</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{completedStudents}/{session.allowed_students.length}</p>
                <p className="text-sm text-gray-600">terminés</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{Math.round(averageScore)}%</p>
                <p className="text-sm text-gray-600">score moyen</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{session.quiz.total_points}</p>
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
                      {formatDuration(session.settings.time_limit)}
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
                    <Shield className={`w-4 h-4 ${session.settings.proctoring ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tentatives autorisées</span>
                    <span className="text-sm font-medium text-gray-900">{session.attempts_allowed}</span>
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
                      <p className="text-blue-800 text-sm">{session.quiz.title}</p>
                      <div className="mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyConfig.className}`}>
                          {difficultyConfig.label}
                        </span>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Progression</h4>
                      <p className="text-green-800 text-sm">
                        {completedStudents} terminés, {inProgressStudents} en cours
                      </p>
                      <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{width: `${(completedStudents / session.allowed_students.length) * 100}%`}}
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
                  
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      Cette session de quiz permet aux étudiants de valider leurs connaissances sur {session.quiz.title.toLowerCase()}. 
                      La session est configurée avec un temps limite de {session.settings.time_limit} minutes et 
                      {session.settings.proctoring ? ' inclut la surveillance automatique' : ' fonctionne en mode libre'}.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'participants' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Participants à la session</h3>
                      <p className="text-sm text-gray-600">
                        {session.allowed_students.length} étudiants autorisés
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
                          <Shuffle className={`w-4 h-4 ${session.settings.shuffle_questions ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Surveillance activée</span>
                            <p className="text-xs text-gray-500">Proctoring automatique</p>
                          </div>
                          <Shield className={`w-4 h-4 ${session.settings.proctoring ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Pause autorisée</span>
                            <p className="text-xs text-gray-500">Possibilité de mettre en pause</p>
                          </div>
                          <Pause className={`w-4 h-4 ${session.settings.allow_pause ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Temps limite</span>
                            <p className="text-xs text-gray-500">Durée maximale autorisée</p>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{session.settings.time_limit} min</span>
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
                          <CheckCircle className={`w-4 h-4 ${session.quiz.show_results_immediately ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Révision autorisée</span>
                            <p className="text-xs text-gray-500">Possibilité de revoir les réponses</p>
                          </div>
                          <Eye className={`w-4 h-4 ${session.quiz.allow_review ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Options mélangées</span>
                            <p className="text-xs text-gray-500">Ordre des réponses randomisé</p>
                          </div>
                          <RotateCcw className={`w-4 h-4 ${session.quiz.settings.randomize_options ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Points négatifs</span>
                            <p className="text-xs text-gray-500">Pénalité pour mauvaises réponses</p>
                          </div>
                          <AlertCircle className={`w-4 h-4 ${session.quiz.settings.negative_marking ? 'text-red-600' : 'text-gray-400'}`} />
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
                          <p className="text-2xl font-bold text-green-600">{Math.max(...students.filter(s => s.score).map(s => s.score || 0))}%</p>
                          <p className="text-sm text-green-800">Meilleur score</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-red-600">{Math.min(...students.filter(s => s.score).map(s => s.score || 0))}%</p>
                          <p className="text-sm text-red-800">Score le plus bas</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {Math.round(students.filter(s => s.time_spent).reduce((acc, s) => acc + (s.time_spent || 0), 0) / completedStudents)}
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
                                  style={{width: `${(item.count / completedStudents) * 100}%`}}
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
                                    {Math.round((student.score || 0) * session.quiz.total_points / 100)}/{session.quiz.total_points} pts
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