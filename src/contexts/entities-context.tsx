'use client';

import React, { ReactNode } from 'react';
import { createEntityContext, BaseEntity } from './entity-context';
import { fetchStudents } from '../app/(features)/dashboard/student/_services/student.service';
import { fetchTeachers } from '../app/(features)/dashboard/teacher/_services/teacher.service';
import { getSubjects } from '../app/(features)/dashboard/subject/_services/subject.service';
import ClasseAPIService from '../app/(features)/dashboard/formation/classe/_services/classe.service';

// Types pour les étudiants
export interface Student extends BaseEntity {
  user_id: number;
  classe_id?: number;
  registration_number: string;
  date_of_birth?: string;
  address?: string;
  phone?: string;
  emergency_contact?: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'suspended';
  user?: {
    id: number;
    name: string;
    email: string;
    account_type: string;
  };
  classe?: {
    id: number;
    name: string;
    level: string;
  };
}

// Service étudiant (à adapter selon votre API)
const StudentService = {
  async getAll() {
    const response = await fetchStudents();
    return { data: response.data };
  }
};

// Créer le contexte étudiant
const { EntityProvider: StudentProvider, useEntityContext: useStudentContext } =
  createEntityContext<Student>('Student', StudentService);

export { StudentProvider, useStudentContext };

// Types pour les enseignants
export interface Teacher extends BaseEntity {
  user_id: number;
  department: string;
  specialization?: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'retired';
  user?: {
    id: number;
    name: string;
    email: string;
    account_type: string;
  };
}

// Service enseignant
const TeacherService = {
  async getAll() {
    const response = await fetchTeachers();
    return { data: response.data };
  }
};

const { EntityProvider: TeacherProvider, useEntityContext: useTeacherContext } =
  createEntityContext<Teacher>('Teacher', TeacherService);

export { TeacherProvider, useTeacherContext };

// Types pour les matières
export interface Subject extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  coefficient: number;
  status: 'active' | 'inactive';
}

// Service matière
const SubjectService = {
  async getAll() {
    const response = await getSubjects();
    return { data: response.data };
  }
};

const { EntityProvider: SubjectProvider, useEntityContext: useSubjectContext } =
  createEntityContext<Subject>('Subject', SubjectService);

export { SubjectProvider, useSubjectContext };

// Types pour les classes
export interface Classe extends BaseEntity {
  name: string;
  level: string;
  academic_year: string;
  capacity: number;
  status: 'active' | 'inactive' | 'archived';
}

// Service classe
const ClasseService = {
  async getAll() {
    const response = await ClasseAPIService.getClasses();
    return { data: response.data };
  }
};

const { EntityProvider: ClasseProvider, useEntityContext: useClasseContext } =
  createEntityContext<Classe>('Classe', ClasseService);

export { ClasseProvider, useClasseContext };

// Provider global pour toutes les entités
interface GlobalEntityProviderProps {
  children: ReactNode;
}

export const GlobalEntityProvider: React.FC<GlobalEntityProviderProps> = ({ children }) => {
  return (
    <StudentProvider>
      <TeacherProvider>
        <SubjectProvider>
          <ClasseProvider>
            {children}
          </ClasseProvider>
        </SubjectProvider>
      </TeacherProvider>
    </StudentProvider>
  );
};