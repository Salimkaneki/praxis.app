'use client';

import React from "react";
import { MoreHorizontal } from "lucide-react";

export type QuizCard = {
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
};

const QuizCard = ({ quiz }: QuizCardProps) => {
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 w-full aspect-square">
      <div className="h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-poppins font-semibold text-gray-800 leading-tight pr-2">
            {quiz.title}
          </h3>
          <MoreHorizontal className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
        </div>

        {/* Stats principaux */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-poppins font-bold text-gray-900 mb-2">
            {quiz.duration_minutes} min
          </div>
          <div className="text-xl font-poppins font-semibold text-emerald-600">
            {quiz.total_points} points
          </div>
        </div>

        {/* Footer avec statut */}
        <div className="flex justify-end">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-poppins ${statusConfig.bg} ${statusConfig.text}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>
    </div>
  );
};

type QuizGridProps = {
  quizzes: QuizCard[];
};

export const QuizGrid = ({ quizzes }: QuizGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {quizzes.map((quiz, index) => (
        <QuizCard key={index} quiz={quiz} />
      ))}
    </div>
  );
};

export default QuizGrid;