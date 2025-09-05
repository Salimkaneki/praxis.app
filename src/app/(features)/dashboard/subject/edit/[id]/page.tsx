'use client';
import React from "react";
import SubjectEditForm from "./SubjectEditForm";
import { use } from 'react';

export default function EditSubjectPage({ params }: { params: Promise<{ id: string }> }) {
  // Déballer la Promise params avec React.use()
  const unwrappedParams = use(params);
  
  // Vérifier que l'ID est un nombre valide
  const subjectId = parseInt(unwrappedParams.id);
  
  if (isNaN(subjectId) || subjectId <= 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-poppins font-semibold text-red-600">
            Erreur
          </h1>
          <p className="text-gray-600 mt-2">
            ID de matière invalide
          </p>
        </div>
      </div>
    );
  }

  return <SubjectEditForm subjectId={unwrappedParams.id} />;
}