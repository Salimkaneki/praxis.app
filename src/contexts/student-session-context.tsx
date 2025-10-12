'use client';

import React, { ReactNode, useEffect } from 'react';
import { createEntityContext, BaseEntity } from './entity-context';
import { StudentSessionsService } from '../app/(features)/student/_services/sessions.service';

// Types pour les sessions étudiants
export interface StudentSession extends BaseEntity {
  quiz_id: number;
  title: string;
  starts_at: string;
  ends_at: string;
  status: "scheduled" | "active" | "paused" | "completed" | "cancelled";
  duration_minutes?: number;
  session_code: string;
  teacher_id: number;
  max_participants?: number;
  current_participants?: number;
  join_status?: "à venir" | "disponible" | "terminée"; // Nouveau champ ajouté par l'API
  has_joined?: boolean;

  quiz?: {
    id: number;
    title: string;
    description?: string;
    subject_id?: number;
    duration_minutes?: number;
    total_points?: number;
  };
  created_at: string;
  updated_at: string;
}

// Service session étudiant
const StudentSessionService = {
  async getAll() {
    const data = await StudentSessionsService.getAvailableSessions();
    return { data };
  }
};

const { EntityProvider: StudentSessionProvider, useEntityContext: useStudentSessionContextBase } =
  createEntityContext<StudentSession>('StudentSession', StudentSessionService);

// Hook personnalisé qui écoute les événements DOM de changement de statut
const useStudentSessionContext = () => {
  const context = useStudentSessionContextBase();

  useEffect(() => {
    // Écouter les événements DOM de changement de statut de session
    const handleSessionStatusChanged = (event: CustomEvent) => {
      // Rafraîchir les sessions quand le statut change
      context.refreshEntities();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('sessionStatusChanged', handleSessionStatusChanged as EventListener);

      return () => {
        window.removeEventListener('sessionStatusChanged', handleSessionStatusChanged as EventListener);
      };
    }
  }, [context.refreshEntities]);

  return context;
};

export { StudentSessionProvider, useStudentSessionContext };

// Provider pour les sessions étudiants
interface StudentSessionProviderProps {
  children: ReactNode;
}

export const StudentSessionContextProvider: React.FC<StudentSessionProviderProps> = ({ children }) => {
  return (
    <StudentSessionProvider>
      {children}
    </StudentSessionProvider>
  );
};