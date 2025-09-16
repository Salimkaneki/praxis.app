'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

export type QuizCard = {
  id?: number; // Ajout de l'ID pour la navigation
  title: string;
  description: string;
  duration_minutes: number;
  total_points: number;
  status: "draft" | "published" | "archived";
  allow_review: boolean;
  show_results_immediately: boolean;
  participants?: number;
  category?: string;
};

type QuizCardProps = {
  quiz: QuizCard;
  index: number;
};

const QuizCardComponent = ({ quiz, index }: QuizCardProps) => {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "published":
        return { 
          bg: "bg-emerald-50", 
          text: "text-emerald-700", 
          label: "Publié" 
        };
      case "draft":
        return { 
          bg: "bg-amber-50", 
          text: "text-amber-700", 
          label: "Brouillon" 
        };
      case "archived":
        return { 
          bg: "bg-gray-50", 
          text: "text-gray-600", 
          label: "Archivé" 
        };
      default:
        return { 
          bg: "bg-gray-50", 
          text: "text-gray-600", 
          label: status 
        };
    }
  };

  const statusConfig = getStatusConfig(quiz.status);

  const handleCardClick = () => {
    if (quiz.id) {
      router.push(`/teachers-dashboard/quizzes/quiz-details/${quiz.id}`);
    }
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  const handleActionClick = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    setShowActions(false);
    
    switch (action) {
      case 'preview':
        if (quiz.id) {
          router.push(`/teachers-dashboard/quizzes/${quiz.id}/preview`);
        }
        break;
      case 'edit':
        if (quiz.id) {
          router.push(`/teachers-dashboard/quizzes/${quiz.id}/edit`);
        }
        break;
      case 'delete':
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le quiz "${quiz.title}" ?`)) {
          console.log("Supprimer le quiz:", quiz.id);
          // Logique de suppression à implémenter
        }
        break;
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 w-full aspect-square cursor-pointer group relative"
    >
      <div className="h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-poppins font-semibold text-gray-800 leading-tight pr-2 group-hover:text-emerald-600 transition-colors">
            {quiz.title}
          </h3>
          <div className="relative">
            <button
              onClick={handleMoreClick}
              className="w-5 h-5 text-gray-400 hover:text-gray-600 flex-shrink-0 mt-1 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {/* Menu d'actions */}
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <button
                  onClick={(e) => handleActionClick(e, 'preview')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
                >
                  <Eye className="w-4 h-4" />
                  Prévisualiser
                </button>
                <button
                  onClick={(e) => handleActionClick(e, 'edit')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <hr className="my-1" />
                <button
                  onClick={(e) => handleActionClick(e, 'delete')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats principaux */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-poppins font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
            {quiz.duration_minutes} min
          </div>
          <div className="text-xl font-poppins font-semibold text-emerald-600">
            {quiz.total_points} points
          </div>
          {quiz.participants !== undefined && (
            <div className="text-sm text-gray-500 mt-2">
              {quiz.participants} participant{quiz.participants > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Footer avec statut */}
        <div className="flex justify-between items-center">
          {quiz.id && (
            <span className="text-xs text-gray-400 font-poppins">
              Quiz #{quiz.id}
            </span>
          )}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-poppins ${statusConfig.bg} ${statusConfig.text} ml-auto`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Overlay pour indiquer que c'est cliquable */}
      <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity rounded-lg pointer-events-none"></div>
    </div>
  );
};

type QuizGridProps = {
  quizzes: QuizCard[];
};

export const QuizGrid = ({ quizzes }: QuizGridProps) => {
  const router = useRouter();

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-3">Aucun quiz créé</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto font-poppins">
          Commencez par créer votre premier quiz pour évaluer vos étudiants et suivre leurs progrès.
        </p>
        <button
          onClick={() => router.push("/teachers-dashboard/quizzes/create")}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium font-poppins inline-flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Créer mon premier quiz
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {quizzes.map((quiz, index) => (
        <QuizCardComponent key={quiz.id || index} quiz={quiz} index={index} />
      ))}
    </div>
  );
};

export default QuizGrid;