'use client';

import {
  useStudentContext,
  useTeacherContext,
  useSubjectContext,
  useClasseContext,
} from './entities-context';

import {
  useSessionContext,
  useResultContext,
} from './session-result-context';

// Hook combiné pour accéder facilement à tous les contextes
export const useAppData = () => {
  const students = useStudentContext();
  const teachers = useTeacherContext();
  const subjects = useSubjectContext();
  const classes = useClasseContext();
  const sessions = useSessionContext();
  const results = useResultContext();

  return {
    students,
    teachers,
    subjects,
    classes,
    sessions,
    results,
  };
};

// Hook pour rafraîchir toutes les données
export const useRefreshAllData = () => {
  const { refreshEntities: refreshStudents } = useStudentContext();
  const { refreshEntities: refreshTeachers } = useTeacherContext();
  const { refreshEntities: refreshSubjects } = useSubjectContext();
  const { refreshEntities: refreshClasses } = useClasseContext();
  const { refreshEntities: refreshSessions } = useSessionContext();
  const { refreshEntities: refreshResults } = useResultContext();

  const refreshAll = async () => {
    await Promise.all([
      refreshStudents(),
      refreshTeachers(),
      refreshSubjects(),
      refreshClasses(),
      refreshSessions(),
      refreshResults(),
    ]);
  };

  return refreshAll;
};