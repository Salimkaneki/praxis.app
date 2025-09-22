'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { 
  FileText, Clock, Calendar, Users, Settings, 
  Save, AlertCircle, CheckCircle, Shield, 
  Pause, Shuffle, Loader2
} from "lucide-react";

// Import de vos composants
import Input from "@/components/ui/Inputs/Input";
import Select from "@/components/ui/Inputs/Select";
import TeacherPageHeader from "../../_components/page-header";

// Types pour le formulaire
interface Quiz {
  id: number;
  title: string;
  subject_name?: string;
}

interface FormData {
  quiz_id: string;
  title: string;
  starts_at_date: string;
  starts_at_time: string;
  ends_at_date: string;
  ends_at_time: string;
  max_participants: string;
  // Settings
  shuffle_questions: boolean;
  time_limit: string;
  proctoring: boolean;
  allow_pause: boolean;
}

interface FormErrors {
  quiz_id?: string;
  title?: string;
  starts_at_date?: string;
  starts_at_time?: string;
  ends_at_date?: string;
  ends_at_time?: string;
  max_participants?: string;
  time_limit?: string;
  dateTime?: string;
}

type SubmitStatus = 'success' | 'error' | null;

export default function SessionsEditPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    quiz_id: "",
    title: "",
    starts_at_date: "",
    starts_at_time: "",
    ends_at_date: "",
    ends_at_time: "",
    max_participants: "100",
    shuffle_questions: true,
    time_limit: "60",
    proctoring: true,
    allow_pause: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  // États pour les données externes
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [quizzesError, setQuizzesError] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Simulation de données (vous remplacerez par un appel API réel)
  useEffect(() => {
    // Simuler le chargement des données de la session
    const loadSessionData = () => {
      // Données exemple - remplacez par un appel API réel
      const mockSessionData = {
        quiz_id: "1",
        title: "Session 1 - Quiz UX Design - Groupe A",
        starts_at_date: "2025-09-25",
        starts_at_time: "09:00",
        ends_at_date: "2025-09-25",
        ends_at_time: "11:00",
        max_participants: "50",
        shuffle_questions: true,
        time_limit: "90",
        proctoring: false,
        allow_pause: true
      };

      setFormData(mockSessionData);
      setIsLoadingSession(false);
    };

    loadSessionData();
  }, []);

  // Simulation du chargement des quiz
  useEffect(() => {
    const loadQuizzes = () => {
      // Données exemple - remplacez par un appel API réel
      const mockQuizzes = [
        { id: 1, title: "Quiz UX Design", subject_name: "Design" },
        { id: 2, title: "Quiz React", subject_name: "Développement" },
        { id: 3, title: "Quiz Marketing", subject_name: "Marketing" }
      ];

      setQuizzes(mockQuizzes);
      setLoadingQuizzes(false);
    };

    loadQuizzes();
  }, []);

  // Options pour les selects
  const quizOptions = quizzes.map(quiz => ({
    value: quiz.id.toString(),
    label: `${quiz.title}${quiz.subject_name ? ` - ${quiz.subject_name}` : ''}`
  }));

  // Gestion des changements de formulaire
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

  // Validation du formulaire
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formData.quiz_id) newErrors.quiz_id = "Le quiz est requis";
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.starts_at_date) newErrors.starts_at_date = "La date de début est requise";
    if (!formData.starts_at_time) newErrors.starts_at_time = "L'heure de début est requise";
    if (!formData.ends_at_date) newErrors.ends_at_date = "La date de fin est requise";
    if (!formData.ends_at_time) newErrors.ends_at_time = "L'heure de fin est requise";
    
    if (!formData.max_participants || parseInt(formData.max_participants) <= 0) {
      newErrors.max_participants = "Le nombre maximum de participants doit être supérieur à 0";
    }

    if (!formData.time_limit || parseInt(formData.time_limit) <= 0) {
      newErrors.time_limit = "La durée limite doit être supérieure à 0";
    }

    // Validation des dates
    if (formData.starts_at_date && formData.starts_at_time && formData.ends_at_date && formData.ends_at_time) {
      const startDateTime = new Date(`${formData.starts_at_date}T${formData.starts_at_time}`);
      const endDateTime = new Date(`${formData.ends_at_date}T${formData.ends_at_time}`);
      
      if (startDateTime >= endDateTime) {
        newErrors.dateTime = "La date/heure de fin doit être postérieure à celle de début";
      }
    }

    return newErrors;
  };

  // Soumission du formulaire
  const handleSubmit = async (): Promise<void> => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulation d'un appel API - remplacez par votre logique réelle
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Données à envoyer:", {
        quiz_id: parseInt(formData.quiz_id),
        title: formData.title,
        starts_at: `${formData.starts_at_date} ${formData.starts_at_time}:00`,
        ends_at: `${formData.ends_at_date} ${formData.ends_at_time}:00`,
        max_participants: parseInt(formData.max_participants),
        settings: {
          shuffle_questions: formData.shuffle_questions,
          time_limit: parseInt(formData.time_limit),
          proctoring: formData.proctoring,
          allow_pause: formData.allow_pause
        }
      });
      
      setSubmitStatus('success');
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push('/teachers-dashboard/sessions');
      }, 2000);

    } catch (error: any) {
      console.error("Erreur lors de la modification:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Afficher un loader pendant le chargement initial
  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins">
        <TeacherPageHeader
          title="Modifier la Session"
          subtitle="Chargement des données de la session..."
          actionButton={undefined}
          backButton={{ onClick: handleCancel }}
        />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <TeacherPageHeader
        title="Modifier la Session"
        subtitle="Mettez à jour les informations de la session."
        actionButton={{
          label: isSubmitting ? "Modification..." : "Modifier la Session",
          icon: isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />,
          onClick: handleSubmit,
          disabled: isSubmitting || loadingQuizzes
        }}
        backButton={{
          onClick: handleCancel
        }}
      />

      {/* Status Messages */}
      {submitStatus && (
        <div className="px-8 py-4">
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-sm text-green-800">Session modifiée avec succès ! Redirection en cours...</span>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-sm text-red-800">Une erreur est survenue lors de la modification.</span>
            </div>
          )}
        </div>
      )}

      {/* Messages d'erreur */}
      {quizzesError && (
        <div className="px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-sm text-red-800">{quizzesError}</span>
          </div>
        </div>
      )}

      {/* Erreur de validation des dates */}
      {errors.dateTime && (
        <div className="px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-sm text-red-800">{errors.dateTime}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="px-8 py-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="bg-white rounded-lg border border-gray-200 p-6 lg:p-8">

            {/* Informations générales */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Informations générales</h2>
                  <p className="text-sm text-gray-600">Modifiez les informations de base de la session</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select 
                  label="Quiz à utiliser" 
                  placeholder={loadingQuizzes ? "Chargement..." : "Sélectionnez un quiz"} 
                  value={formData.quiz_id} 
                  onChange={handleInputChange('quiz_id')} 
                  options={quizOptions} 
                  leftIcon={FileText} 
                  required 
                  error={errors.quiz_id}
                  disabled={loadingQuizzes || quizzesError !== null} 
                />
                <div></div>
                <div className="md:col-span-2">
                  <Input 
                    label="Titre de la session" 
                    placeholder="Ex: Session 1 - Quiz UX Design - Groupe A" 
                    value={formData.title} 
                    onChange={handleInputChange('title')} 
                    leftIcon={FileText} 
                    required 
                    error={errors.title} 
                  />
                </div>
              </div>
            </div>

            {/* Planning */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Planning</h2>
                  <p className="text-sm text-gray-600">Modifiez les dates et heures de la session</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Input 
                  label="Date de début" 
                  type="date"
                  value={formData.starts_at_date} 
                  onChange={handleInputChange('starts_at_date')} 
                  leftIcon={Calendar} 
                  required 
                  error={errors.starts_at_date} 
                />
                <Input 
                  label="Heure de début" 
                  type="time"
                  value={formData.starts_at_time} 
                  onChange={handleInputChange('starts_at_time')} 
                  leftIcon={Clock} 
                  required 
                  error={errors.starts_at_time} 
                />
                <Input 
                  label="Date de fin" 
                  type="date"
                  value={formData.ends_at_date} 
                  onChange={handleInputChange('ends_at_date')} 
                  leftIcon={Calendar} 
                  required 
                  error={errors.ends_at_date} 
                />
                <Input 
                  label="Heure de fin" 
                  type="time"
                  value={formData.ends_at_time} 
                  onChange={handleInputChange('ends_at_time')} 
                  leftIcon={Clock} 
                  required 
                  error={errors.ends_at_time} 
                />
              </div>
            </div>

            {/* Participants */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Participants</h2>
                  <p className="text-sm text-gray-600">Nombre maximum de participants</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Nombre maximum de participants" 
                  type="number"
                  placeholder="100" 
                  value={formData.max_participants} 
                  onChange={handleInputChange('max_participants')} 
                  leftIcon={Users} 
                  required 
                  error={errors.max_participants} 
                />
                <div></div>
              </div>
            </div>

            {/* Paramètres avancés */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Paramètres de la session</h2>
                  <p className="text-sm text-gray-600">Configuration du comportement de la session</p>
                </div>
              </div>

              <div className="space-y-6">
                <Input 
                  label="Durée limite (minutes)" 
                  type="number"
                  placeholder="60" 
                  value={formData.time_limit} 
                  onChange={handleInputChange('time_limit')} 
                  leftIcon={Clock} 
                  required 
                  error={errors.time_limit} 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shuffle className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Mélanger les questions</p>
                          <p className="text-xs text-gray-500">Questions affichées dans un ordre aléatoire</p>
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
                        <Shield className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Mode surveillance</p>
                          <p className="text-xs text-gray-500">Activer la surveillance automatique</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={formData.proctoring}
                        onChange={(e) => handleCheckboxChange('proctoring')(e.target.checked)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Pause className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Autoriser les pauses</p>
                          <p className="text-xs text-gray-500">Les étudiants peuvent mettre en pause</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={formData.allow_pause}
                        onChange={(e) => handleCheckboxChange('allow_pause')(e.target.checked)}
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
    </div>
  );
}