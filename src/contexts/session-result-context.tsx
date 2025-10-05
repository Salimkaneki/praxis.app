'use client';

import React, { ReactNode } from 'react';
import { createEntityContext, BaseEntity } from './entity-context';
import { SessionsService } from '../app/(features)/teachers-dashboard/sessions/_services/sessions.service';
import ResultAPIService from '../app/(features)/teachers-dashboard/results/_services/result.service';

// Types pour les sessions
export interface Session extends BaseEntity {
  quiz_id: number;
  teacher_id: number;
  classe_id?: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  access_code?: string;
  allow_late_join: boolean;
  show_results_immediately: boolean;
  quiz?: {
    id: number;
    title: string;
    duration_minutes: number;
    total_points: number;
  };
  teacher?: {
    id: number;
    user?: {
      name: string;
    };
  };
  classe?: {
    id: number;
    name: string;
  };
  participants_count?: number;
}

// Service session
const SessionService = {
  async getAll() {
    const data = await SessionsService.getAll();
    return { data };
  }
};

const { EntityProvider: SessionProvider, useEntityContext: useSessionContext } =
  createEntityContext<Session>('Session', SessionService);

export { SessionProvider, useSessionContext };

// Types pour les résultats
export interface Result extends BaseEntity {
  session_id: number;
  student_id: number;
  quiz_id: number;
  score: number;
  total_points: number;
  percentage: number;
  grade?: string;
  started_at: string;
  completed_at?: string;
  time_taken_minutes?: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  answers?: any[];
  session?: {
    id: number;
    title: string;
    quiz?: {
      title: string;
    };
  };
  student?: {
    id: number;
    user?: {
      name: string;
    };
  };
}

// Service résultat
const ResultService = {
  async getAll() {
    const data = await ResultAPIService.getExamResults();
    return { data };
  }
};

const { EntityProvider: ResultProvider, useEntityContext: useResultContext } =
  createEntityContext<Result>('Result', ResultService);

export { ResultProvider, useResultContext };

// Provider pour les sessions et résultats
interface SessionResultProviderProps {
  children: ReactNode;
}

export const SessionResultProvider: React.FC<SessionResultProviderProps> = ({ children }) => {
  return (
    <SessionProvider>
      <ResultProvider>
        {children}
      </ResultProvider>
    </SessionProvider>
  );
};