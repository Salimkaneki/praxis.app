'use client';

import React from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Calendar,
  Play,
  CheckCircle,
  AlertCircle,
  Lock,
  BookOpen,
  User,
  Timer
} from "lucide-react";

import { StudentSession, StudentSessionsService } from "../_services/sessions.service";

type StudentSessionCardProps = {
  session: StudentSession;
};

const StudentSessionCard = ({ session }: StudentSessionCardProps) => {
  const router = useRouter();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "available":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
          label: "Disponible",
          icon: Play,
          canStart: true
        };
      case "upcoming":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
          label: "À venir",
          icon: Clock,
          canStart: false
        };
      case "completed":
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
          label: "Terminé",
          icon: CheckCircle,
          canStart: false
        };
      case "expired":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
          label: "Expiré",
          icon: Lock,
          canStart: false
        };
      default:
        return {
          bg: "bg-amber-100",
          text: "text-amber-800",
          border: "border-amber-200",
          label: "Statut inconnu",
          icon: AlertCircle,
          canStart: false
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = () => {
    // Utiliser la nouvelle méthode du service
    const timeInfo = StudentSessionsService.getTimeRemaining(session);
    return timeInfo.formattedTime;
  };

  const canStartExam = () => {
    // Utiliser la nouvelle méthode du service
    return StudentSessionsService.canStartSession(session);
  };

  const handleStartExam = () => {
    if (canStartExam()) {
      router.push(`/student/sessions/${session.id}`);
    }
  };

  const getEffectiveStatus = () => {
    const now = new Date();
    const startTime = new Date(session.starts_at);
    const endTime = new Date(session.ends_at);

    // Si la session est terminée ou expirée, garder ce statut
    if (session.status === "completed") return "completed";
    if (session.status === "expired") return "expired";

    // Si l'heure actuelle est avant le début de la session
    if (now < startTime) {
      return "upcoming";
    }

    // Si l'heure actuelle est après la fin de la session
    if (now > endTime) {
      return "expired";
    }

    // Si on est dans la période active et le statut est available/active
    if (session.status === "available" || session.status === "active") {
      return "available";
    }

    // Par défaut, upcoming
    return "upcoming";
  };

  const statusConfig = getStatusConfig(getEffectiveStatus());
  const StatusIcon = statusConfig.icon;
  const timeRemaining = getTimeRemaining();

  return (
    <div className="bg-white border border-gray-200 rounded-lg transition-all duration-300 w-full hover:shadow-lg group font-poppins overflow-hidden">
      {/* Container avec hauteur fixe et padding */}
      <div className="h-80 p-6 flex flex-col">
        {/* Header - Hauteur fixe */}
        <div className="flex items-start justify-between mb-4 min-h-[60px]">
          <h3 className="text-lg font-semibold leading-tight pr-2 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 font-poppins">
            {session.title}
          </h3>
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border font-poppins ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Contenu principal - Flex-grow pour occuper l'espace */}
        <div className="flex-1 space-y-3 min-h-0">
          {/* Matière */}
          <div className="flex items-center gap-2 text-sm text-gray-600 font-poppins">
            <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="font-medium text-gray-700 truncate">{session.subject}</span>
          </div>

          {/* Enseignant */}
          {session.teacher && (
            <div className="flex items-center gap-2 text-sm text-gray-600 font-poppins">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{session.teacher.name}</span>
            </div>
          )}

          {/* Date et heure */}
          <div className="flex items-center gap-2 text-sm text-gray-600 font-poppins">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {formatDate(session.starts_at)} • {formatTime(session.starts_at)} - {formatTime(session.ends_at)}
            </span>
          </div>

          {/* Durée et nombre de questions */}
          <div className="flex items-center justify-between text-sm text-gray-600 font-poppins">
            <div className="flex items-center gap-1">
              <Timer className="w-4 h-4 text-gray-400" />
              <span>{session.duration_minutes}min</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <span>{session.total_questions}q</span>
            </div>
          </div>

          {/* Temps restant ou score */}
          <div className="text-sm font-poppins">
            {session.status === "completed" && session.score !== undefined && session.max_score ? (
              <div>
                <span className="font-medium text-gray-700">Score: </span>
                <span className="text-green-600 font-semibold">
                  {session.score}/{session.max_score} ({Math.round((session.score / session.max_score) * 100)}%)
                </span>
              </div>
            ) : (
              <div className="text-gray-500">
                {timeRemaining}
              </div>
            )}
          </div>
        </div>

        {/* Bouton d'action - Toujours en bas */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          {canStartExam() ? (
            <button
              onClick={handleStartExam}
              className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center justify-center gap-2 transition-colors font-poppins text-sm"
            >
              <Play className="w-4 h-4" />
              Commencer
            </button>
          ) : getEffectiveStatus() === "upcoming" ? (
            <div className="w-full px-4 py-2.5 bg-gray-100 text-gray-500 rounded-lg font-medium text-center font-poppins text-sm">
              Bientôt disponible
            </div>
          ) : getEffectiveStatus() === "completed" ? (
            <button
              onClick={() => router.push(`/student/sessions/${session.id}/results`)}
              className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center justify-center gap-2 transition-colors font-poppins text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Voir résultats
            </button>
          ) : (
            <div className="w-full px-4 py-2.5 bg-gray-100 text-gray-500 rounded-lg font-medium text-center font-poppins text-sm">
              Non disponible
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type StudentSessionGridProps = {
  sessions: StudentSession[];
};

export const StudentSessionGrid = ({ sessions }: StudentSessionGridProps) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 font-poppins">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 font-poppins">Aucun examen disponible</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto font-poppins">
          Aucun examen n'est actuellement disponible. Revenez plus tard ou contactez votre enseignant.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 font-poppins">
      {sessions.map((session) => (
        <StudentSessionCard
          key={session.id}
          session={session}
        />
      ))}
    </div>
  );
};

export default StudentSessionGrid;