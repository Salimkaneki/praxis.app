'use client';
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import {
  FileText, BookOpen, Clock, Star, Settings,
  Save, ArrowLeft, AlertCircle, CheckCircle,
  Users, Target, Shuffle, Eye, RotateCcw, Loader2
} from "lucide-react";

// Import de vos composants
import Input from "@/components/ui/Inputs/Input";
import Select from "@/components/ui/Inputs/Select";
import Textarea from "@/components/ui/Inputs/Textarea";
import TeacherPageHeader from "../../../_components/page-header";

// Import des services
import { SubjectService, TeacherSubject } from "../../_services/subjects.service";
import { QuizzesService, Quiz } from "../../_services/quizzes.service";
import { useQuizContext } from "../../../_contexts/quiz-context";
import { useToast } from "@/hooks/useToast";

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
  status: "draft" | "published" | "archived";
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

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = parseInt(params.id as string);

  console.log('EditQuizPage - params:', params);
  console.log('EditQuizPage - quizId:', quizId);

  const { updateEntity: updateQuiz } = useQuizContext();
  const { showSuccess, showError } = useToast();

  // Vérification que l'ID est valide
  if (!quizId || isNaN(quizId)) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">ID de quiz invalide</h2>
          <p className="text-gray-600 mb-6">L'identifiant du quiz n'est pas valide.</p>
          <button
            onClick={() => router.push('/teachers-dashboard/quizzes')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

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
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

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

  // Charger les données du quiz
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        setLoadingError(null);

        console.log('Chargement du quiz ID:', quizId);
        const quiz = await QuizzesService.getById(quizId);
        console.log('Quiz chargé:', quiz);

        // Vérifier que le quiz a bien été chargé
        if (!quiz || !quiz.id) {
          throw new Error('Quiz non trouvé ou données invalides');
        }

        // Pré-remplir le formulaire avec les données du quiz
        setFormData({
          title: quiz.title || "",
          description: quiz.description || "",
          subject_id: quiz.subject_id ? `${quiz.subject_id}-no-class` : "", // Format compatible avec le select
          duration_minutes: quiz.duration_minutes?.toString() || "",
          total_points: quiz.total_points?.toString() || "",
          shuffle_questions: quiz.shuffle_questions ?? true,
          show_results_immediately: quiz.show_results_immediately ?? false,
          allow_review: quiz.allow_review ?? true,
          status: quiz.status || "draft",
          difficulty: quiz.settings?.difficulty || "medium",
          negative_marking: quiz.settings?.negative_marking || false,
          require_all_questions: quiz.settings?.require_all_questions ?? true,
          randomize_options: quiz.settings?.randomize_options ?? true
        });

      } catch (error: any) {
        console.error('Erreur lors du chargement du quiz:', error);

        // Gestion spécifique des erreurs HTTP
        if (error.response?.status === 404) {
          setLoadingError("Quiz non trouvé. Il a peut-être été supprimé.");
        } else if (error.response?.status === 403) {
          setLoadingError("Accès refusé. Vous n'avez pas les permissions pour modifier ce quiz.");
        } else if (error.response?.status >= 500) {
          setLoadingError("Erreur serveur. Veuillez réessayer plus tard.");
        } else {
          setLoadingError("Erreur lors du chargement du quiz. Veuillez réessayer.");
        }

        showError("Impossible de charger les données du quiz");
      } finally {
        setIsLoading(false);
      }
    };

    if (quizId) {
      loadQuiz();
    }
  }, [quizId]); // ✅ Retiré showError des dépendances

  // Charger les matières du professeur
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoadingSubjects(true);
        setSubjectsError(null);
        const teacherSubjects = await SubjectService.getMySubjects();
        setSubjects(teacherSubjects);
      } catch (err) {
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
        subject_id: parseInt(formData.subject_id.split('-')[0]), // Extraire le subject_id
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

      // Utilisation du service de mise à jour
      const updatedQuiz = await QuizzesService.update(quizId, quizData);

      // Mettre à jour le quiz dans le contexte
      updateQuiz(quizId, {
        id: updatedQuiz.id,
        title: updatedQuiz.title,
        description: updatedQuiz.description ?? "",
        duration_minutes: updatedQuiz.duration_minutes ?? 0,
        total_points: updatedQuiz.total_points ?? 0,
        status: updatedQuiz.status,
        allow_review: updatedQuiz.allow_review,
        show_results_immediately: updatedQuiz.show_results_immediately,
      });

      setSubmitStatus('success');
      showSuccess("Quiz modifié avec succès !");

      // Redirection après un court délai
      setTimeout(() => {
        router.push('/teachers-dashboard/quizzes');
      }, 1500);

    } catch (error: any) {
      setSubmitStatus('error');
      showError("Une erreur est survenue lors de la modification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Afficher un loader pendant le chargement initial
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  // Afficher une erreur si le chargement a échoué
  if (loadingError) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">{loadingError}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <TeacherPageHeader
        title="Modifier le Quiz"
        subtitle="Modifiez les informations du quiz ci-dessous."
        actionButton={{
          label: isSubmitting ? "Modification..." : "Enregistrer les modifications",
          icon: isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />,
          onClick: handleSubmit,
        }}
        backButton={{
          onClick: handleCancel
        }}
      />

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
                  <p className="text-sm text-gray-600">Modifiez les informations de base du quiz</p>
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
