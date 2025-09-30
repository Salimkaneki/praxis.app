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

import { StudentSession } from "../../_services/sessions.service";

type StudentSessionCardProps = {
  session: StudentSession;
};

const StudentSessionCard = ({ session }: StudentSessionCardProps) => {
  const router = useRouter();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "scheduled":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
          label: "Programmée",
          icon: Clock,
          canStart: false
        };
      case "active":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
          label: "Active",
          icon: Play,
          canStart: true
        };
      case "paused":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
          label: "En pause",
          icon: AlertCircle,
          canStart: false
        };
      case "completed":
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
          label: "Terminée",
          icon: CheckCircle,
          canStart: false
        };
      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
          label: "Annulée",
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
    const now = new Date();
    const startTime = new Date(session.starts_at);
    const endTime = new Date(session.ends_at);

    if (now < startTime) {
      const diff = startTime.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `Commence dans ${hours}h ${minutes}min`;
    } else if (now >= startTime && now <= endTime) {
      const diff = endTime.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `Se termine dans ${hours}h ${minutes}min`;
    } else {
      return "Session expirée";
    }
  };

  const canStartExam = () => {
    const now = new Date();
    const startTime = new Date(session.starts_at);
    const endTime = new Date(session.ends_at);

    return session.status === 'active' && now >= startTime && now <= endTime;
  };

  const getEffectiveStatus = () => {
    return session.status;
  };

  const handleStartExam = () => {
    if (canStartExam()) {
      router.push(`/student/sessions/${session.id}/details`);
    }
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
          {/* Quiz */}
          {session.quiz && (
            <div className="flex items-center gap-2 text-sm text-gray-600 font-poppins">
              <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="font-medium text-gray-700 truncate">{session.quiz.title}</span>
            </div>
          )}

          {/* Date et heure */}
          <div className="flex items-center gap-2 text-sm text-gray-600 font-poppins">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {formatDate(session.starts_at)} • {formatTime(session.starts_at)} - {formatTime(session.ends_at)}
            </span>
          </div>

          {/* Durée */}
          {session.duration_minutes && (
            <div className="flex items-center gap-2 text-sm text-gray-600 font-poppins">
              <Timer className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>Durée: {session.duration_minutes} minutes</span>
            </div>
          )}

          {/* Participants */}
          {session.max_participants && (
            <div className="flex items-center gap-2 text-sm text-gray-600 font-poppins">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{session.current_participants || 0} / {session.max_participants} participants</span>
            </div>
          )}

          {/* Temps restant */}
          <div className="text-sm font-poppins text-gray-500">
            {timeRemaining}
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
              Voir détails
            </button>
          ) : session.status === "completed" ? (
            <button
              onClick={() => router.push(`/student/results/${session.id}`)}
              className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center justify-center gap-2 transition-colors font-poppins text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Voir résultats
            </button>
          ) : (
            <div className="w-full px-4 py-2.5 bg-gray-100 text-gray-500 rounded-lg font-medium text-center font-poppins text-sm">
              {session.status === 'scheduled' ? 'Bientôt disponible' : 'Non disponible'}
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