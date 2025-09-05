import React, { useEffect, useState } from "react";
import {
  Users,
  ArrowLeft,
  Save,
  UserCheck,
  BookOpen,
  GraduationCap,
  Calendar,
  School,
} from "lucide-react";

// Composant SelectInput réutilisé de votre application
function SelectInput({ 
  label,
  name,
  placeholder,
  value,
  onChange,
  options,
  required = false,
  error,
  disabled = false,
  icon: Icon
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="h-[50px] px-4 py-2 rounded-xl font-medium text-base border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 text-gray-700 transition-all hover:bg-gray-100 hover:border-gray-400 w-full appearance-none pr-10"
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {Icon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function TeacherSubjectAssignment() {
  const [formData, setFormData] = useState({
    teacher_id: "",
    subject_id: "",
    classe_id: "",
    academic_year: "2024-2025",
    is_active: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Options pour les enseignants
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  
  // Options pour les matières
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  
  // Options pour les classes
  const [classeOptions, setClasseOptions] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Options pour les années académiques
  const academicYearOptions = [
    { value: "2023-2024", label: "2023-2024" },
    { value: "2024-2025", label: "2024-2025" },
    { value: "2025-2026", label: "2025-2026" },
  ];

  // Simulation de récupération des enseignants
  const fetchTeachers = async () => {
    try {
      setLoadingTeachers(true);
      setTimeout(() => {
        const mockTeachers = [
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
  const fetchSubjects = async () => {
    try {
      setLoadingSubjects(true);
      setTimeout(() => {
        const mockSubjects = [
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
  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      setTimeout(() => {
        const mockClasses = [
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

  // Gestion des inputs
  const handleSelectChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({ ...prev, is_active: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
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
        // Reset du formulaire
        setFormData({
          teacher_id: "",
          subject_id: "",
          classe_id: "",
          academic_year: "2024-2025",
          is_active: true,
        });
      } catch (error) {
        console.error("Erreur création:", error);
        alert("Erreur lors de la création de l'attribution.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    console.log("Retour à la liste des attributions");
  };

  const handleCancel = () => {
    console.log("Annulation - retour à la liste");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={handleBack} 
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Attribution des Matières</h1>
              <p className="text-sm text-gray-600 mt-1">
                Attribuer une matière à un enseignant pour une classe spécifique
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              type="button" 
              onClick={handleCancel} 
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={loading} 
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" /> 
              {loading ? "Attribution..." : "Créer l'Attribution"}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-8 py-8 flex-1">
        <div className="max-w-4xl mx-auto h-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          
          {/* Sélection de l'Enseignant */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">Sélection de l'enseignant</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <SelectInput
                label="Enseignant"
                name="teacher_id"
                placeholder={loadingTeachers ? "Chargement des enseignants..." : "Sélectionner un enseignant"}
                value={formData.teacher_id}
                onChange={handleSelectChange("teacher_id")}
                options={teacherOptions}
                required
                error={errors.teacher_id}
                disabled={loadingTeachers}
                icon={UserCheck}
              />
            </div>
          </div>

          {/* Sélection de la Matière et Classe */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">Matière et classe</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SelectInput
                label="Matière"
                name="subject_id"
                placeholder={loadingSubjects ? "Chargement des matières..." : "Sélectionner une matière"}
                value={formData.subject_id}
                onChange={handleSelectChange("subject_id")}
                options={subjectOptions}
                required
                error={errors.subject_id}
                disabled={loadingSubjects}
                icon={BookOpen}
              />
              <SelectInput
                label="Classe"
                name="classe_id"
                placeholder={loadingClasses ? "Chargement des classes..." : "Sélectionner une classe"}
                value={formData.classe_id}
                onChange={handleSelectChange("classe_id")}
                options={classeOptions}
                required
                error={errors.classe_id}
                disabled={loadingClasses}
                icon={School}
              />
            </div>
          </div>

          {/* Configuration de l'Attribution */}
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">Configuration de l'attribution</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
              <SelectInput
                label="Année académique"
                name="academic_year"
                placeholder="Sélectionner l'année académique"
                value={formData.academic_year}
                onChange={handleSelectChange("academic_year")}
                options={academicYearOptions}
                required
                error={errors.academic_year}
                icon={Calendar}
              />
              <div className="flex items-center pb-2">
                <input 
                  type="checkbox" 
                  id="is_active" 
                  checked={formData.is_active} 
                  onChange={handleCheckboxChange} 
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                />
                <label htmlFor="is_active" className="ml-3 text-sm text-gray-700 font-medium">
                  Attribution active
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}