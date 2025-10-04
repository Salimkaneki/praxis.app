'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { 
  FileText, BookOpen, Clock, Star, Settings, 
  Save, ArrowLeft, AlertCircle, CheckCircle,
  Users, Target, Shuffle, Eye, RotateCcw, Loader2
} from "lucide-react";

// Import de vos composants
import Input from "@/components/ui/Inputs/Input";
import Select from "@/components/ui/Inputs/Select";
import Textarea from "@/components/ui/Inputs/Textarea";
import TeacherPageHeader from "../../_components/page-header";

// Import des services - CORRECTION ICI
import { SubjectService, TeacherSubject } from "../../quizzes/_services/subjects.service";
import { QuizzesService } from "../../quizzes/_services/quizzes.service";
import { useQuizContext } from "../../_contexts/quiz-context";

// Types pour le formulaire
interface FormData {
  title: string;
  description: string;
  subject_id: string;
  duration_minutes: string;
  total_points: string;
  shuffle_questions: boolean;
  show_results_immediately: boolean;
  allow_review: boolean;
  status: "draft" | "published" | "archived"; // CORRECTION ICI
  difficulty: string;
  negative_marking: boolean;
  require_all_questions: boolean;
  randomize_options: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  subject_id?: string;
  duration_minutes?: string;
  total_points?: string;
}

type SubmitStatus = 'success' | 'error' | null;

export default function CreateQuizPage() {
  const router = useRouter();
  const { addQuiz } = useQuizContext();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    subject_id: "",
    duration_minutes: "",
    total_points: "",
    shuffle_questions: true,
    show_results_immediately: false,
    allow_review: true,
    status: "draft",
    difficulty: "medium",
    negative_marking: false,
    require_all_questions: true,
    randomize_options: true
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);

  const statusOptions = [
    { value: "draft", label: "Brouillon" },
    { value: "published", label: "Publié" },
    { value: "archived", label: "Archivé" }
  ];

  const difficultyOptions = [
    { value: "easy", label: "Facile" },
    { value: "medium", label: "Moyen" },
    { value: "hard", label: "Difficile" }
  ];

  // Charger les matières du professeur - CORRECTION ICI
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoadingSubjects(true);
        setSubjectsError(null);
        const teacherSubjects = await SubjectService.getMySubjects(); // CORRECTION ICI
        setSubjects(teacherSubjects);
      } catch (err) {
        console.error("Erreur lors du chargement des matières", err);
        setSubjectsError("Erreur lors du chargement des matières. Veuillez réessayer.");
      } finally {
        setLoadingSubjects(false);
      }
    };
    loadSubjects();
  }, []);

  const subjectOptions = subjects.map(subject => ({
    value: `${subject.subject_id}-${subject.classe_id || 'no-class'}`,
    label: `${subject.subject_name}${subject.classe_name ? ` - ${subject.classe_name}` : ''}`
  }));

  const handleInputChange = (field: keyof FormData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { value: string | boolean } }) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [field]: "" }));
      }
    };

  const handleCheckboxChange = (field: keyof FormData) => 
    (checked: boolean) => {
      setFormData(prev => ({ ...prev, [field]: checked }));
    };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    if (!formData.subject_id) newErrors.subject_id = "La matière est requise";
    if (!formData.duration_minutes || parseInt(formData.duration_minutes) <= 0) {
      newErrors.duration_minutes = "La durée doit être supérieure à 0";
    }
    if (!formData.total_points || parseInt(formData.total_points) <= 0) {
      newErrors.total_points = "Le total des points doit être supérieur à 0";
    }

    return newErrors;
  };

  const handleSubmit = async (): Promise<void> => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const quizData = {
        title: formData.title,
        description: formData.description,
        subject_id: parseInt(formData.subject_id.split('-')[0]), // Extraire le subject_id de la valeur composée
        duration_minutes: parseInt(formData.duration_minutes),
        total_points: parseInt(formData.total_points),
        shuffle_questions: formData.shuffle_questions,
        show_results_immediately: formData.show_results_immediately,
        allow_review: formData.allow_review,
        status: formData.status,
        settings: {
          difficulty: formData.difficulty,
          negative_marking: formData.negative_marking,
          require_all_questions: formData.require_all_questions,
          randomize_options: formData.randomize_options
        }
      };

      // Utilisation du service de création de quiz
      const createdQuiz = await QuizzesService.create(quizData);
      
      // Ajouter le quiz au contexte pour mettre à jour la liste immédiatement
      addQuiz({
        id: createdQuiz.id,
        title: createdQuiz.title,
        description: createdQuiz.description ?? "",
        duration_minutes: createdQuiz.duration_minutes ?? 0,
        total_points: createdQuiz.total_points ?? 0,
        status: createdQuiz.status,
        allow_review: createdQuiz.allow_review,
        show_results_immediately: createdQuiz.show_results_immediately,
      });
      
      setSubmitStatus('success');
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push('/teachers-dashboard/quizzes');
      }, 2000);

    } catch (error: any) {
      console.error("Erreur lors de la création:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header - RETIRER backButton SI NÉCESSAIRE */}
      <TeacherPageHeader
        title="Créer un Quiz"
        subtitle="Remplissez les informations ci-dessous pour créer un nouveau quiz."
        actionButton={{
          label: isSubmitting ? "Création..." : "Créer le Quiz",
          icon: isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />,
          onClick: handleSubmit,
          // disabled: isSubmitting || loadingSubjects
        }}
        backButton={{ // RETIRER CETTE LIGNE SI TeacherPageHeader N'A PAS CETTE PROP
          onClick: handleCancel
        }}
      />

      {/* Status Messages */}
      {submitStatus && (
        <div className="px-8 py-4">
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-sm text-green-800">Quiz créé avec succès ! Redirection en cours...</span>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-sm text-red-800">Une erreur est survenue lors de la création.</span>
            </div>
          )}
        </div>
      )}

      {/* Message d'erreur pour le chargement des matières */}
      {subjectsError && (
        <div className="px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-sm text-red-800">{subjectsError}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="px-8 py-8">
        <div className="w-full mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-8">

            {/* Informations générales */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Informations générales</h2>
                  <p className="text-sm text-gray-600">Définissez les informations de base du quiz</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input 
                    label="Titre du quiz" 
                    placeholder="Ex: Quiz UX Design - Méthodologies et Prototypage" 
                    value={formData.title} 
                    onChange={handleInputChange('title')} 
                    leftIcon={FileText} 
                    required 
                    error={errors.title} 
                  />
                </div>
                <div className="md:col-span-2">
                  <Textarea 
                    label="Description" 
                    placeholder="Décrivez le contenu et les objectifs du quiz..." 
                    value={formData.description} 
                    onChange={handleInputChange('description')} 
                    rows={3}
                    required 
                    error={errors.description} 
                  />
                </div>
                <Select 
                  label="Matière" 
                  placeholder={loadingSubjects ? "Chargement..." : "Sélectionnez une matière"} 
                  value={formData.subject_id} 
                  onChange={handleInputChange('subject_id')} 
                  options={subjectOptions} 
                  leftIcon={BookOpen} 
                  required 
                  error={errors.subject_id}
                  disabled={loadingSubjects || subjectsError !== null} 
                />
                <Select 
                  label="Statut" 
                  placeholder="Sélectionnez le statut" 
                  value={formData.status} 
                  onChange={handleInputChange('status')} 
                  options={statusOptions} 
                  leftIcon={Target} 
                  required 
                />
              </div>
            </div>

            {/* Configuration du quiz */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Configuration</h2>
                  <p className="text-sm text-gray-600">Paramètres de durée, points et difficulté</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input 
                  label="Durée (minutes)" 
                  type="number"
                  placeholder="60" 
                  value={formData.duration_minutes} 
                  onChange={handleInputChange('duration_minutes')} 
                  leftIcon={Clock} 
                  required 
                  error={errors.duration_minutes} 
                />
                <Input 
                  label="Total des points" 
                  type="number"
                  placeholder="30" 
                  value={formData.total_points} 
                  onChange={handleInputChange('total_points')} 
                  leftIcon={Star} 
                  required 
                  error={errors.total_points} 
                />
                <Select 
                  label="Difficulté" 
                  placeholder="Sélectionnez la difficulté" 
                  value={formData.difficulty} 
                  onChange={handleInputChange('difficulty')} 
                  options={difficultyOptions} 
                  leftIcon={Target} 
                  required 
                />
              </div>
            </div>

            {/* Options avancées */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Options avancées</h2>
                  <p className="text-sm text-gray-600">Paramètres de comportement du quiz</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shuffle className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Mélanger les questions</p>
                        <p className="text-xs text-gray-500">Afficher les questions dans un ordre aléatoire</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.shuffle_questions}
                      onChange={(e) => handleCheckboxChange('shuffle_questions')(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Résultats immédiats</p>
                        <p className="text-xs text-gray-500">Afficher les résultats après soumission</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.show_results_immediately}
                      onChange={(e) => handleCheckboxChange('show_results_immediately')(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <RotateCcw className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Permettre la révision</p>
                        <p className="text-xs text-gray-500">Les étudiants peuvent revoir leurs réponses</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.allow_review}
                      onChange={(e) => handleCheckboxChange('allow_review')(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Points négatifs</p>
                        <p className="text-xs text-gray-500">Déduire des points pour les mauvaises réponses</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.negative_marking}
                      onChange={(e) => handleCheckboxChange('negative_marking')(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Toutes les questions obligatoires</p>
                        <p className="text-xs text-gray-500">Exiger une réponse à toutes les questions</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.require_all_questions}
                      onChange={(e) => handleCheckboxChange('require_all_questions')(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shuffle className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Mélanger les options</p>
                        <p className="text-xs text-gray-500">Afficher les choix dans un ordre aléatoire</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.randomize_options}
                      onChange={(e) => handleCheckboxChange('randomize_options')(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}