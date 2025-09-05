'use client'
import React, { useEffect, useState } from "react";
import {
  Users,
  ArrowLeft,
  Save,
  UserCheck,
  BookOpen,
  Calendar,
  School,
} from "lucide-react";
import { useRouter } from "next/navigation";
import SelectInput from "@/components/ui/Inputs/Select";
import Input from "@/components/ui/Inputs/Input";

// Types pour les options de sélection
interface Option {
  value: string;
  label: string;
}

// Type pour les données du formulaire
interface FormData {
  teacher_id: string;
  subject_id: string;
  classe_id: string;
  academic_year: string;
  is_active: boolean;
}

// Type pour les erreurs
interface FormErrors {
  teacher_id?: string;
  subject_id?: string;
  classe_id?: string;
  academic_year?: string;
}

export default function TeacherSubjectAssignment() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    teacher_id: "",
    subject_id: "",
    classe_id: "",
    academic_year: "2024-2025",
    is_active: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  
  // Options pour les enseignants
  const [teacherOptions, setTeacherOptions] = useState<Option[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  
  // Options pour les matières
  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  
  // Options pour les classes
  const [classeOptions, setClasseOptions] = useState<Option[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Options pour les années académiques
  const academicYearOptions: Option[] = [
    { value: "2023-2024", label: "2023-2024" },
    { value: "2024-2025", label: "2024-2025" },
    { value: "2025-2026", label: "2025-2026" },
  ];

  // Simulation de récupération des enseignants
  const fetchTeachers = async (): Promise<void> => {
    try {
      setLoadingTeachers(true);
      setTimeout(() => {
        const mockTeachers: Option[] = [
          { value: "1", label: "Dr. Marie DUPONT - Informatique" },
          { value: "2", label: "Prof. Jean MARTIN - Mathématiques" },
          { value: "3", label: "Dr. Sophie BERNARD - Design" },
          { value: "4", label: "Prof. Pierre DURAND - Gestion de projet" },
          { value: "5", label: "Dr. Claire MOREAU - Intelligence Artificielle" },
        ];
        setTeacherOptions(mockTeachers);
        setLoadingTeachers(false);
      }, 800);
    } catch (error) {
      console.error("Erreur récupération des enseignants :", error);
      setLoadingTeachers(false);
    }
  };

  // Simulation de récupération des matières
  const fetchSubjects = async (): Promise<void> => {
    try {
      setLoadingSubjects(true);
      setTimeout(() => {
        const mockSubjects: Option[] = [
          { value: "1", label: "UX-ERG-001 - Ergonomie et Expérience Utilisateur" },
          { value: "2", label: "INFO-ALG-001 - Algorithmique Avancée" },
          { value: "3", label: "MATH-STAT-001 - Statistiques Appliquées" },
          { value: "4", label: "DESIGN-UI-001 - Interface Utilisateur" },
          { value: "5", label: "PROJ-GEST-001 - Gestion de Projet" },
          { value: "6", label: "IA-ML-001 - Machine Learning" },
        ];
        setSubjectOptions(mockSubjects);
        setLoadingSubjects(false);
      }, 900);
    } catch (error) {
      console.error("Erreur récupération des matières :", error);
      setLoadingSubjects(false);
    }
  };

  // Simulation de récupération des classes
  const fetchClasses = async (): Promise<void> => {
    try {
      setLoadingClasses(true);
      setTimeout(() => {
        const mockClasses: Option[] = [
          { value: "1", label: "L1 Informatique - Groupe A" },
          { value: "2", label: "L1 Informatique - Groupe B" },
          { value: "3", label: "L2 Design UX/UI - Groupe A" },
          { value: "4", label: "L3 Informatique - Groupe A" },
          { value: "5", label: "M1 Intelligence Artificielle" },
          { value: "6", label: "M2 Design UX/UI" },
        ];
        setClasseOptions(mockClasses);
        setLoadingClasses(false);
      }, 700);
    } catch (error) {
      console.error("Erreur récupération des classes :", error);
      setLoadingClasses(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
    fetchClasses();
  }, []);

  // Gestion des inputs select - version compatible avec SelectInput
  const handleSelectChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string } }) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Gestion des inputs text
  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Gestion de la checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, is_active: e.target.checked }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    
    if (!formData.teacher_id) newErrors.teacher_id = "L'enseignant est requis";
    if (!formData.subject_id) newErrors.subject_id = "La matière est requise";
    if (!formData.classe_id) newErrors.classe_id = "La classe est requise";
    if (!formData.academic_year) newErrors.academic_year = "L'année académique est requise";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        const apiData = {
          teacher_id: parseInt(formData.teacher_id),
          subject_id: parseInt(formData.subject_id),
          classe_id: parseInt(formData.classe_id),
          academic_year: formData.academic_year,
          is_active: formData.is_active,
        };
        
        // Simulation d'appel API
        console.log("Données à envoyer:", apiData);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        alert("Attribution créée avec succès !");
        // Redirection vers la liste des attributions
        router.push("/dashboard/attributions");
      } catch (error) {
        console.error("Erreur création:", error);
        alert("Erreur lors de la création de l'attribution.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/attributions");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                type="button"
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-smooth"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-poppins font-semibold text-gray-900">
                  Nouvelle Attribution
                </h1>
                <p className="text-sm font-poppins text-gray-600 mt-1">
                  Attribuer une matière à un enseignant pour une classe spécifique
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-smooth"
              >
                Annuler
              </button>
              <button 
                type="submit"
                form="attribution-form"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-smooth disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Attribution..." : "Créer l'Attribution"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-8 py-8 flex-1">
        <div className="max-w-4xl mx-auto h-full">
          <form id="attribution-form" onSubmit={handleSubmit} className="h-full">
            <div className="bg-white border border-gray-200 rounded-lg p-8 h-full flex flex-col">
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-forest-600" />
                </div>
                <h2 className="text-lg font-poppins font-medium text-gray-900">
                  Informations de l'attribution
                </h2>
              </div>
              
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <SelectInput
                    label="Enseignant"
                    placeholder={loadingTeachers ? "Chargement des enseignants..." : "Sélectionner un enseignant"}
                    value={formData.teacher_id}
                    onChange={handleSelectChange("teacher_id")}
                    options={teacherOptions}
                    required
                    error={errors.teacher_id}
                    disabled={loadingTeachers}
                  />
                  
                  <SelectInput
                    label="Matière"
                    placeholder={loadingSubjects ? "Chargement des matières..." : "Sélectionner une matière"}
                    value={formData.subject_id}
                    onChange={handleSelectChange("subject_id")}
                    options={subjectOptions}
                    required
                    error={errors.subject_id}
                    disabled={loadingSubjects}
                  />
                  
                  <SelectInput
                    label="Classe"
                    placeholder={loadingClasses ? "Chargement des classes..." : "Sélectionner une classe"}
                    value={formData.classe_id}
                    onChange={handleSelectChange("classe_id")}
                    options={classeOptions}
                    required
                    error={errors.classe_id}
                    disabled={loadingClasses}
                  />
                </div>
                
                <div className="space-y-6">
                  <SelectInput
                    label="Année académique"
                    placeholder="Sélectionner l'année académique"
                    value={formData.academic_year}
                    onChange={handleSelectChange("academic_year")}
                    options={academicYearOptions}
                    required
                    error={errors.academic_year}
                  />
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-forest-600 bg-gray-100 border-gray-300 rounded focus:ring-forest-500 focus:ring-2"
                    />
                    <label htmlFor="is_active" className="ml-3 font-poppins text-sm text-gray-700">
                      Attribution active
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}