'use client';

import React, { ReactNode } from 'react';
import { createEntityContext, BaseEntity } from '../../../../contexts/entity-context';

// Types pour les quiz
export interface QuizCard extends BaseEntity {
  title: string;
  description: string;
  duration_minutes: number;
  total_points: number;
  status: "draft" | "published" | "archived";
  allow_review: boolean;
  show_results_immediately: boolean;
}

// Importer le service quiz
import { QuizzesService } from '../quizzes/_services/quizzes.service';

// Créer le contexte quiz avec l'architecture générique
const { EntityProvider: QuizProvider, useEntityContext: useQuizContext } =
  createEntityContext<QuizCard>('Quiz', QuizzesService);

export { QuizProvider, useQuizContext };