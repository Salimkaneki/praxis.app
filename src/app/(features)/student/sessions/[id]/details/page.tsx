"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import StudentPageHeader from "../../../_components/page-header";
import Button from "../../../../../../components/ui/Buttons/Button";
import {
  Clock,
  Calendar,
  User,
  BookOpen,
  Play,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Users,
  Timer,
  Info
} from "lucide-react";
import { StudentSessionsService, StudentSession } from "../../../_services/sessions.service";

export default function SessionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = parseInt(params.id as string);

  const [session, setSession] = useState<StudentSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingExam, setStartingExam] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    loadSessionDetails();
  }, [sessionId]);

  const loadSessionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionData = await StudentSessionsService.getSessionDetails(sessionId);
      setSession(sessionData);

      // Vérifier si l'étudiant a déjà rejoint cette session
      const joined = await StudentSessionsService.hasJoinedSession(sessionId);
      setHasJoined(joined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des détails de session');
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async () => {
    if (!session) return;

    // Vérifier si l'étudiant a déjà rejoint cette session
    if (hasJoined) {
      setError('Vous avez déjà participé à cette session d\'examen. Vous ne pouvez pas la rejoindre à nouveau.');
      return;
    }

    try {
      setStartingExam(true);
      setError(null);

      // Démarrer l'examen via l'API
      await StudentSessionsService.startExam(session.id);

      // Rediriger vers l'examen
      router.push(`/student/test?session=${session.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du démarrage de l\'examen');
    } finally {
      setStartingExam(false);
    }
  };

  const handleGoBack = () => {
    router.push('/student/sessions');
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'scheduled':
        return {
          label: 'Programmée',
          color: 'bg-blue-100 text-blue-800',
          icon: Calendar,
          canStart: false
        };
      case 'active':
        return {
          label: 'Active',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          canStart: true
        };
      case 'paused':
        return {
          label: 'En pause',
          color: 'bg-yellow-100 text-yellow-800',
          icon: AlertCircle,
          canStart: false
        };
      case 'completed':
        return {
          label: 'Terminée',
          color: 'bg-gray-100 text-gray-800',
          icon: CheckCircle,
          canStart: false
        };
      case 'cancelled':
        return {
          label: 'Annulée',
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle,
          canStart: false
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800',
          icon: Info,
          canStart: false
        };
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const isSessionAvailable = () => {
    if (!session) return false;

    const now = new Date();
    const startTime = new Date(session.starts_at);
    const endTime = new Date(session.ends_at);

    return session.status === 'active' && now >= startTime && now <= endTime;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <StudentPageHeader
          title="Chargement..."
          subtitle="Récupération des détails de la session"
        />
        <div className="w-full px-8 py-16 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-white">
        <StudentPageHeader
          title="Erreur"
          subtitle="Impossible de charger les détails de la session"
        />
        <div className="w-full px-8 py-16">
          <div className="max-w-md mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || 'Session introuvable'}
            </h2>
            <p className="text-gray-600 mb-6">
              La session demandée n'existe pas ou vous n'y avez pas accès.
            </p>
            <Button onClick={handleGoBack} variant="primary">
              Retour aux sessions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(session.status);
  const startDateTime = formatDateTime(session.starts_at);
  const endDateTime = formatDateTime(session.ends_at);
  const canStartExam = isSessionAvailable() && statusInfo.canStart && !hasJoined;

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentPageHeader
        title={session.title}
        subtitle={`Session ${session.id}`}
      />

      <div className="w-full max-w-4xl mx-auto px-8 py-8">
        {/* Bouton retour */}
        <div className="mb-6">
          <Button
            onClick={handleGoBack}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux sessions
          </Button>
        </div>

        {/* Carte principale avec les détails */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          {/* En-tête avec statut */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <statusInfo.icon className="w-6 h-6 text-gray-600" />
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
            {canStartExam && (
              <Button
                onClick={handleStartExam}
                disabled={startingExam}
                className="flex items-center gap-2"
              >
                {startingExam ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Démarrage...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Commencer l'examen
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Informations temporelles */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Début</p>
                  <p className="font-medium text-gray-900">
                    {startDateTime.date} à {startDateTime.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Fin</p>
                  <p className="font-medium text-gray-900">
                    {endDateTime.date} à {endDateTime.time}
                  </p>
                </div>
              </div>

              {session.duration_minutes && (
                <div className="flex items-center gap-3">
                  <Timer className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Durée</p>
                    <p className="font-medium text-gray-900">
                      {session.duration_minutes} minutes
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Informations sur le quiz */}
            <div className="space-y-4">
              {session.quiz && (
                <>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Quiz</p>
                      <p className="font-medium text-gray-900">{session.quiz.title}</p>
                    </div>
                  </div>

                  {session.quiz.total_points && (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Points totaux</p>
                        <p className="font-medium text-gray-900">{session.quiz.total_points} points</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {session.max_participants && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Participants max</p>
                    <p className="font-medium text-gray-900">
                      {session.current_participants || 0} / {session.max_participants}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description du quiz */}
          {session.quiz?.description && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{session.quiz.description}</p>
            </div>
          )}
        </div>

        {/* Message d'état */}
        {hasJoined ? (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-orange-800 mb-1">
                  Déjà participé
                </h3>
                <p className="text-sm text-orange-700">
                  Vous avez déjà participé à cette session d'examen. Vous ne pouvez pas la rejoindre à nouveau.
                </p>
              </div>
            </div>
          </div>
        ) : !canStartExam && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800 mb-1">
                  {session.status === 'scheduled' ? 'Session programmée' :
                   session.status === 'paused' ? 'Session en pause' :
                   session.status === 'completed' ? 'Session terminée' :
                   session.status === 'cancelled' ? 'Session annulée' :
                   'Session non disponible'}
                </h3>
                <p className="text-sm text-blue-700">
                  {session.status === 'scheduled' ? 'L\'examen n\'est pas encore disponible. Revenez plus tard.' :
                   session.status === 'paused' ? 'L\'examen est temporairement suspendu.' :
                   session.status === 'completed' ? 'Cette session d\'examen est terminée.' :
                   session.status === 'cancelled' ? 'Cette session a été annulée.' :
                   'Vous ne pouvez pas commencer cet examen pour le moment.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}