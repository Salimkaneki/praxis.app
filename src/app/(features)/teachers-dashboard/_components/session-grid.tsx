'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  Calendar,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  PauseCircle,
  Loader2
} from "lucide-react";

// Import du service
import { SessionsService } from "../sessions/_services/sessions.service";

// Type SessionCard mis à jour pour correspondre à l'API
export type SessionCard = {
  id: number;
  quiz_id: number;
  title: string;
  starts_at: string;
  ends_at: string;
  max_participants?: number;
  current_participants?: number;
  status: "scheduled" | "active" | "paused" | "completed" | "cancelled";
  duration_minutes?: number;
  session_code?: string;
  teacher_id?: number;
  quiz?: {
    id: number;
    title: string;
    description?: string;
  };
};

type SessionCardProps = {
  session: SessionCard;
  index: number;
  onDelete: (sessionId: number) => void; // Callback pour rafraîchir la liste
};

const SessionCardComponent = ({ session, index, onDelete }: SessionCardProps) => {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusConfig = (status: string = "scheduled") => {
    switch (status) {
      case "active":
        return { 
          bg: "bg-blue-100", 
          text: "text-blue-800", 
          border: "border-blue-200",
          label: "Active",
          icon: Play
        };
      case "paused":
        return { 
          bg: "bg-yellow-100", 
          text: "text-yellow-800", 
          border: "border-yellow-200",
          label: "En pause",
          icon: PauseCircle
        };
      case "completed":
        return { 
          bg: "bg-green-100", 
          text: "text-green-800", 
          border: "border-green-200",
          label: "Terminé",
          icon: CheckCircle
        };
      case "cancelled":
        return { 
          bg: "bg-red-100", 
          text: "text-red-800", 
          border: "border-red-200",
          label: "Annulé",
          icon: XCircle
        };
      default:
        return { 
          bg: "bg-amber-100", 
          text: "text-amber-800", 
          border: "border-amber-200",
          label: "Planifié",
          icon: AlertCircle
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

  const calculateDuration = () => {
    const start = new Date(session.starts_at);
    const end = new Date(session.ends_at);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    return durationMinutes;
  };

  const statusConfig = getStatusConfig(session.status);
  const duration = session.duration_minutes || calculateDuration();
  const StatusIcon = statusConfig.icon;

  // Navigation vers la page de détails avec le bon chemin
  const handleCardClick = () => {
    if (isDeleting) return; // Empêcher le clic pendant la suppression
    router.push(`/teachers-dashboard/sessions/session-details/${session.id}`);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting) return;
    setShowActions(!showActions);
  };

  const handleActionClick = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    setShowActions(false);
    
    if (isDeleting) return;
    
    switch (action) {
      case 'view':
        router.push(`/teachers-dashboard/sessions/session-details/${session.id}`);
        break;
      case 'edit':
        router.push(`/teachers-dashboard/sessions/${session.id}/edit`);
        break;
      case 'delete':
        handleDelete();
        break;
    }
  };

  const handleDelete = async () => {
    const confirmMessage = `Êtes-vous sûr de vouloir supprimer la session "${session.title}" ?\n\nCette action est irréversible.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);

    try {
      await SessionsService.delete(session.id);
      
      // Afficher un message de succès (optionnel)
      console.log(`Session "${session.title}" supprimée avec succès`);
      
      // Appeler le callback pour rafraîchir la liste
      onDelete(session.id);
      
    } catch (error: any) {
      console.error("Erreur lors de la suppression de la session:", error);
      
      // Afficher un message d'erreur à l'utilisateur
      const errorMessage = error?.response?.data?.message || "Une erreur est survenue lors de la suppression";
      alert(`Erreur: ${errorMessage}`);
      
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white border border-gray-200 rounded-lg p-6 transition-all duration-300 w-full aspect-square cursor-pointer group relative font-poppins ${
        isDeleting 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:border-blue-300 hover:shadow-lg'
      }`}
    >
      {/* Overlay de chargement pendant la suppression */}
      {isDeleting && (
        <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            <span className="text-sm text-red-600 font-medium">Suppression...</span>
          </div>
        </div>
      )}

      <div className="h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className={`text-lg font-semibold leading-tight pr-2 transition-colors line-clamp-2 font-poppins ${
            isDeleting ? 'text-gray-500' : 'text-gray-800 group-hover:text-blue-600'
          }`}>
            {session.title}
          </h3>
          <div className="relative">
            <button
              onClick={handleMoreClick}
              disabled={isDeleting}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isDeleting 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {/* Menu d'actions */}
            {showActions && !isDeleting && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 font-poppins">
                <button
                  onClick={(e) => handleActionClick(e, 'view')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 rounded-t-lg font-poppins"
                >
                  <Eye className="w-4 h-4" />
                  Voir détails
                </button>
                <button
                  onClick={(e) => handleActionClick(e, 'edit')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 font-poppins"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <hr className="my-1" />
                <button
                  onClick={(e) => handleActionClick(e, 'delete')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 rounded-b-lg font-poppins"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Informations de session */}
        <div className="space-y-3">
          {/* Code de session */}
          {session.session_code && (
            <div className="flex items-center gap-2 text-sm font-mono">
              <span className={`font-medium ${isDeleting ? 'text-gray-400' : 'text-blue-600'}`}>
                Code: {session.session_code}
              </span>
            </div>
          )}

          {/* Date et heure sur la même ligne */}
          <div className={`flex items-center gap-2 text-sm font-poppins ${
            isDeleting ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>
              {formatDate(session.starts_at)} • {formatTime(session.starts_at)} - {formatTime(session.ends_at)}
            </span>
          </div>

          {/* Durée */}
          <div className={`flex items-center gap-2 text-sm font-poppins ${
            isDeleting ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={`font-medium ${isDeleting ? 'text-gray-400' : 'text-gray-700'}`}>Durée:</span>
            <span>{duration} minutes</span>
          </div>

          {/* Quiz associé */}
          {session.quiz && (
            <div className={`text-xs font-poppins ${isDeleting ? 'text-gray-400' : 'text-gray-500'}`}>
              <span className="font-medium">Quiz:</span> {session.quiz.title}
            </div>
          )}
        </div>

        {/* Footer avec statut */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className={`text-xs font-poppins ${isDeleting ? 'text-gray-300' : 'text-gray-400'}`}>
            Session #{session.id}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ml-auto font-poppins ${
            isDeleting 
              ? 'bg-gray-100 text-gray-400 border-gray-200'
              : `${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`
          }`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Overlay pour indiquer que c'est cliquable */}
      {!isDeleting && (
        <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity rounded-lg pointer-events-none"></div>
      )}
    </div>
  );
};

type SessionGridProps = {
  sessions: SessionCard[];
  onSessionDeleted?: (sessionId: number) => void; // Callback optionnel pour le parent
};

export const SessionGrid = ({ sessions, onSessionDeleted }: SessionGridProps) => {
  const router = useRouter();
  const [localSessions, setLocalSessions] = useState<SessionCard[]>([]);

  // Synchroniser les sessions locales avec les props
  React.useEffect(() => {
    setLocalSessions(Array.isArray(sessions) ? sessions : []);
  }, [sessions]);

  const handleSessionDelete = (sessionId: number) => {
    // Supprimer la session de l'état local pour un feedback immédiat
    setLocalSessions(prevSessions => 
      prevSessions.filter(session => session.id !== sessionId)
    );

    // Appeler le callback du parent si fourni
    if (onSessionDeleted) {
      onSessionDeleted(sessionId);
    }
  };

  if (localSessions.length === 0) {
    return (
      <div className="text-center py-16 font-poppins">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 font-poppins">Aucune session planifiée</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto font-poppins">
          Créez votre première session pour organiser un quiz avec vos étudiants à une date spécifique.
        </p>
        <button
          onClick={() => router.push("/teachers-dashboard/sessions/create")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center gap-2 transition-colors font-poppins"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Créer une session
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 font-poppins">
      {localSessions.map((session, index) => (
        <SessionCardComponent 
          key={session.id} 
          session={session} 
          index={index}
          onDelete={handleSessionDelete}
        />
      ))}
    </div>
  );
};

export default SessionGrid;