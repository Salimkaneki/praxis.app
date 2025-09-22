// teachers-dashboard/sessions/_components/SessionInfoCard.tsx
'use client';
import React from "react";
import { 
  Calendar, Clock, Lock, Shield, FileText,
  CheckCircle, XCircle, Play, Pause
} from "lucide-react";
import { Session } from "../_services/sessions.service";

interface SessionInfoCardProps {
  session: Session;
  className?: string;
}

const SessionInfoCard: React.FC<SessionInfoCardProps> = ({
  session,
  className = ""
}) => {
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
  const timeLimit = session.settings?.time_limit || session.duration_minutes || 60;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-8 ${className}`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{session.title}</h1>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <FileText className="w-4 h-4" />
              {session.quiz?.title || "Quiz non défini"}
            </p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-2 ${statusConfig.className}`}>
          <StatusIcon className="w-4 h-4" />
          {statusConfig.label}
        </div>
      </div>

      {session.quiz?.description && (
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{session.quiz.description}</p>
        </div>
      )}

      {/* Code de session */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Code de session</h3>
            <p className="text-blue-700 text-sm">Partagez ce code avec vos étudiants</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white border border-blue-300 rounded-lg px-6 py-3">
              <span className="font-mono text-2xl font-bold text-blue-600 tracking-wider">
                {session.session_code}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informations de planification et accès */}
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
              <span className="text-sm text-gray-600">Tentatives</span>
              <span className="text-sm font-medium text-gray-900">{session.attempts_allowed || 1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionInfoCard;