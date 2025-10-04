'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { QuizzesService, Quiz } from '../quizzes/_services/quizzes.service';

export interface QuizCard {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  total_points: number;
  status: "draft" | "published" | "archived";
  allow_review: boolean;
  show_results_immediately: boolean;
}

interface QuizContextType {
  quizzes: QuizCard[];
  loading: boolean;
  error: string | null;
  refreshQuizzes: () => Promise<void>;
  addQuiz: (quiz: QuizCard) => void;
  updateQuiz: (id: number, updatedQuiz: Partial<QuizCard>) => void;
  removeQuiz: (id: number) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<QuizCard[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data: Quiz[] = await QuizzesService.getAll();

      // Adapter le format API vers QuizCard
      const formatted: QuizCard[] = data.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description ?? "",
        duration_minutes: q.duration_minutes ?? 0,
        total_points: q.total_points ?? 0,
        status: q.status,
        allow_review: q.allow_review,
        show_results_immediately: q.show_results_immediately,
      }));

      setQuizzes(formatted);
    } catch (err: any) {
      console.error('Erreur lors du chargement des quiz:', err);
      setError("Impossible de récupérer les quiz.");
    } finally {
      setLoading(false);
    }
  }, []);

  const addQuiz = useCallback((quiz: QuizCard) => {
    setQuizzes(prev => [quiz, ...prev]);
  }, []);

  const updateQuiz = useCallback((id: number, updatedQuiz: Partial<QuizCard>) => {
    setQuizzes(prev => prev.map(quiz =>
      quiz.id === id ? { ...quiz, ...updatedQuiz } : quiz
    ));
  }, []);

  const removeQuiz = useCallback((id: number) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
  }, []);

  const value: QuizContextType = {
    quizzes,
    loading,
    error,
    refreshQuizzes,
    addQuiz,
    updateQuiz,
    removeQuiz,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};