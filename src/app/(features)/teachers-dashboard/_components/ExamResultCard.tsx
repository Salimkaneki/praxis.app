'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  MoreHorizontal, 
  Eye, 
  Download, 
  Trash2, 
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Loader2
} from "lucide-react";

// Type pour les résultats d'examen
export type ExamResult = {
  id: number;
  session_id: number;
  session_title: string;
  exam_date: string;
  total_participants: number;
  completed_participants: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  pass_rate: number; // Pourcentage de réussite
  duration_minutes: number;
  quiz_title: string;
  status: "completed" | "in_progress" | "draft";
  created_at: string;
};

type ExamResultCardProps = {
  result: ExamResult;
  index: number;
  onDelete?: (resultId: number) => void;
};

const ExamResultCard = ({ result, index, onDelete }: ExamResultCardProps) => {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getScoreTrend = (score: number) => {
    if (score >= 80) {
      return { 
        icon: TrendingUp, 
        color: "text-green-600", 
        bg: "bg-green-50",
        label: "Excellent"
      };
    } else if (score >= 60) {
      return { 
        icon: Minus, 
        color: "text-yellow-600", 
        bg: "bg-yellow-50",
        label: "Moyen"
      };
    } else {
      return { 
        icon: TrendingDown, 
        color: "text-red-600", 
        bg: "bg-red-50",
        label: "Faible"
      };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return { 
          bg: "bg-green-100", 
          text: "text-green-800", 
          border: "border-green-200",
          label: "Terminé"
        };
      case "in_progress":
        return { 
          bg: "bg-blue-100", 
          text: "text-blue-800", 
          border: "border-blue-200",
          label: "En cours"
        };
      default:
        return { 
          bg: "bg-gray-100", 
          text: "text-gray-800", 
          border: "border-gray-200",
          label: "Brouillon"
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

  const scoreTrend = getScoreTrend(result.average_score);
  const statusConfig = getStatusConfig(result.status);
  const ScoreTrendIcon = scoreTrend.icon;

  // Navigation vers la page de participation des étudiants
  const handleCardClick = () => {
    if (isDeleting) return;
    router.push(`/teachers-dashboard/results/participation?sessionId=${result.id}`);
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
        router.push(`/teachers-dashboard/results/participation?sessionId=${result.id}`);
        break;
      case 'download':
        handleDownload();
        break;
      case 'delete':
        handleDelete();
        break;
    }
  };

  const handleDownload = async () => {
    try {
      console.log(`Téléchargement des résultats pour: ${result.session_title}`);
      // Logique de téléchargement
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmMessage = `Êtes-vous sûr de vouloir supprimer les résultats de "${result.session_title}" ?\n\nCette action est irréversible.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);

    try {
      // Simuler l'appel API de suppression
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Résultats "${result.session_title}" supprimés avec succès`);
      onDelete(result.id);
      
    } catch (error: any) {
      console.error("Erreur lors de la suppression des résultats:", error);
      alert(`Erreur: Une erreur est survenue lors de la suppression`);
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
            {result.session_title}
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
                  onClick={(e) => handleActionClick(e, 'download')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 font-poppins"
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
                {onDelete && (
                  <>
                    <hr className="my-1" />
                    <button
                      onClick={(e) => handleActionClick(e, 'delete')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 rounded-b-lg font-poppins"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Métriques principales */}
        <div className="space-y-3">
          {/* Score moyen avec tendance */}
          <div className={`flex items-center gap-2 text-sm font-poppins ${
            isDeleting ? 'text-gray-400' : ''
          }`}>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              isDeleting ? 'bg-gray-100' : scoreTrend.bg
            }`}>
              <ScoreTrendIcon className={`w-3 h-3 ${
                isDeleting ? 'text-gray-400' : scoreTrend.color
              }`} />
              <span className={`font-medium text-xs ${
                isDeleting ? 'text-gray-400' : scoreTrend.color
              }`}>
                {result.average_score.toFixed(1)}%
              </span>
            </div>
            <span className={`text-xs ${isDeleting ? 'text-gray-400' : 'text-gray-600'}`}>
              moyenne
            </span>
          </div>

          {/* Date d'examen */}
          <div className={`flex items-center gap-2 text-sm font-poppins ${
            isDeleting ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{formatDate(result.exam_date)}</span>
          </div>

          {/* Participants */}
          <div className={`flex items-center gap-2 text-sm font-poppins ${
            isDeleting ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Users className="w-4 h-4 text-gray-400" />
            <span>
              {result.completed_participants}/{result.total_participants} participants
            </span>
          </div>

          {/* Quiz associé */}
          <div className={`text-xs font-poppins ${isDeleting ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="font-medium">Quiz:</span> {result.quiz_title}
          </div>
        </div>

        {/* Footer avec statut */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className={`flex items-center gap-2 text-xs font-poppins ${
            isDeleting ? 'text-gray-300' : 'text-gray-400'
          }`}>
            <BarChart3 className="w-3 h-3" />
            <span>Résultat #{result.id}</span>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ml-auto font-poppins ${
            isDeleting 
              ? 'bg-gray-100 text-gray-400 border-gray-200'
              : `${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`
          }`}>
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

export default ExamResultCard;