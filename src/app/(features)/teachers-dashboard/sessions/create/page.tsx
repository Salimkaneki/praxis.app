'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { 
  FileText, Clock, Calendar, Users, Settings, 
  Save, AlertCircle, CheckCircle, Shield, 
  UserCheck, Pause, Shuffle, Loader2, Eye
} from "lucide-react";

// Import de vos composants
import Input from "@/components/ui/Inputs/Input";
import Select from "@/components/ui/Inputs/Select";
import Textarea from "@/components/ui/Inputs/Textarea";
import TeacherPageHeader from "../../_components/page-header";

// Import des services
import { QuizzesService } from "../../quizzes/_services/quizzes.service";
// import { StudentsService } from "../../dashboard/students/_services/students.service";
import { SessionsService } from "../_services/sessions.service";
import { useToast } from "@/hooks/useToast";

// Types pour le formulaire
interface Quiz {
  id: number;
  title: string;
  subject_name?: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
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

export default function CreateSessionPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
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
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>('');

  // États pour les données externes
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [quizzesError, setQuizzesError] = useState<string | null>(null);

  // Charger les quiz disponibles
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoadingQuizzes(true);
        setQuizzesError(null);
        const quizzesData = await QuizzesService.getAll(); // Utilise la méthode getAll du service
        setQuizzes(quizzesData);
      } catch (err) {
        setQuizzesError("Erreur lors du chargement des quiz. Veuillez réessayer.");
      } finally {
        setLoadingQuizzes(false);
      }
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
    
    if (!formData.quiz_id) {
      newErrors.quiz_id = "Le quiz est requis";
    } else {
      // Vérifier que le quiz existe dans la liste chargée
      const selectedQuiz = quizzes.find(q => q.id.toString() === formData.quiz_id);
      if (!selectedQuiz) {
        newErrors.quiz_id = "Le quiz sélectionné n'existe pas";
      }
    }
    
    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Le titre doit contenir au moins 3 caractères";
    } else if (formData.title.trim().length > 255) {
      newErrors.title = "Le titre ne peut pas dépasser 255 caractères";
    }
    
    if (!formData.starts_at_date) newErrors.starts_at_date = "La date de début est requise";
    if (!formData.starts_at_time) newErrors.starts_at_time = "L'heure de début est requise";
    if (!formData.ends_at_date) newErrors.ends_at_date = "La date de fin est requise";
    if (!formData.ends_at_time) newErrors.ends_at_time = "L'heure de fin est requise";
    
    if (!formData.max_participants || parseInt(formData.max_participants) <= 0) {
      newErrors.max_participants = "Le nombre maximum de participants doit être supérieur à 0";
    } else if (parseInt(formData.max_participants) > 1000) {
      newErrors.max_participants = "Le nombre maximum de participants ne peut pas dépasser 1000";
    }

    if (!formData.time_limit || parseInt(formData.time_limit) <= 0) {
      newErrors.time_limit = "La durée limite doit être supérieure à 0";
    } else if (parseInt(formData.time_limit) > 480) { // 8 heures max
      newErrors.time_limit = "La durée limite ne peut pas dépasser 480 minutes (8 heures)";
    }

    // Validation des dates
    if (formData.starts_at_date && formData.starts_at_time && formData.ends_at_date && formData.ends_at_time) {
      const startDateTime = new Date(`${formData.starts_at_date}T${formData.starts_at_time}`);
      const endDateTime = new Date(`${formData.ends_at_date}T${formData.ends_at_time}`);
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 0 * 60 * 1000); // +0 minutes
      
      if (startDateTime <= fiveMinutesFromNow) {
        newErrors.dateTime = "La date/heure de début doit être dans le futur";
      } else if (startDateTime >= endDateTime) {
        newErrors.dateTime = "La date/heure de fin doit être postérieure à celle de début";
      } else {
        // Vérifier que la durée n'est pas trop longue (max 24h)
        const durationMs = endDateTime.getTime() - startDateTime.getTime();
        const maxDurationMs = 24 * 60 * 60 * 1000; // 24 heures
        if (durationMs > maxDurationMs) {
          newErrors.dateTime = "La durée de la session ne peut pas dépasser 24 heures";
        }
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
    setSubmitErrorMessage('');

    try {
      // Formater les dates au format attendu par Laravel (Y-m-d H:i:s)
      const startDateTime = new Date(`${formData.starts_at_date}T${formData.starts_at_time}`);
      const endDateTime = new Date(`${formData.ends_at_date}T${formData.ends_at_time}`);

      const sessionData = {
        quiz_id: parseInt(formData.quiz_id),
        title: formData.title.trim(),
        starts_at: startDateTime.toISOString(), // Format ISO complet
        ends_at: endDateTime.toISOString(),     // Format ISO complet
        max_participants: parseInt(formData.max_participants)
        // Test temporaire : envoyer seulement les champs essentiels
        // settings: {
        //   shuffle_questions: formData.shuffle_questions,
        //   time_limit: parseInt(formData.time_limit),
        //   proctoring: formData.proctoring,
        //   allow_pause: formData.allow_pause
        // }
      };

      console.log('🚀 CreateSession - Données envoyées:', sessionData);
      console.log('📅 Dates formatées:', {
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        starts_at_formatted: sessionData.starts_at,
        ends_at_formatted: sessionData.ends_at
      });

      await SessionsService.create(sessionData);
      
      setSubmitStatus('success');
      showSuccess("Session créée avec succès !");
      // Redirection après un court délai
      setTimeout(() => {
        router.push('/teachers-dashboard/sessions');
      }, 1500);

    } catch (error: any) {
      console.error('❌ CreateSession - Erreur complète:', error);
      console.error('📋 CreateSession - Détails de la réponse:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      // Vérifier si la session a été créée malgré l'erreur 422
      if (error.response?.status === 422) {
        console.log('🔍 Erreur 422 détectée - vérification si session créée...');
        
        // Essayer de récupérer la liste des sessions pour voir si la nouvelle session existe
        try {
          const sessions = await SessionsService.getAll();
          const latestSession = sessions.find(s => 
            s.title === formData.title && 
            s.quiz_id === parseInt(formData.quiz_id)
          );
          
          if (latestSession) {
            console.log('✅ Session trouvée malgré l\'erreur:', latestSession);
            setSubmitStatus('success');
            showSuccess("Session créée avec succès !");
            setTimeout(() => {
              router.push('/teachers-dashboard/sessions');
            }, 1500);
            return;
          }
        } catch (checkError) {
          console.log('❌ Impossible de vérifier si la session a été créée');
        }
      }
      
      // Afficher les erreurs de validation spécifiques si disponibles
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat() as string[];
        setSubmitErrorMessage(errorMessages.join(', '));
        setSubmitStatus('error');
        console.log('🔍 Erreurs de validation 422:', validationErrors);
      } else if (error.response?.status === 400 && error.response?.data?.error) {
        setSubmitErrorMessage(error.response.data.error);
        setSubmitStatus('error');
        showError(error.response.data.error);
        console.log('🔍 Erreur 400:', error.response.data.error);
      } else if (error.response?.data?.error) {
        setSubmitErrorMessage(error.response.data.error);
        setSubmitStatus('error');
        showError(error.response.data.error);
        console.log('🔍 Erreur générique:', error.response.data.error);
      } else {
        const genericError = 'Une erreur est survenue lors de la création.';
        setSubmitErrorMessage(genericError);
        setSubmitStatus('error');
        showError(genericError);
        console.log('🔍 Erreur sans détails spécifiques');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Fonction pour pré-remplir les dates (aujourd'hui + 1 heure pour le début)
  const setDefaultDates = () => {
    const now = new Date();
    const startDate = new Date(now.getTime() + 60 * 60 * 1000); // +1 heure
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // +2 heures depuis le début

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const formatTime = (date: Date) => date.toTimeString().slice(0, 5);

    setFormData(prev => ({
      ...prev,
      starts_at_date: formatDate(startDate),
      starts_at_time: formatTime(startDate),
      ends_at_date: formatDate(endDate),
      ends_at_time: formatTime(endDate)
    }));
  };

  // Pré-remplir les dates au premier chargement
  useEffect(() => {
    if (!formData.starts_at_date && !formData.starts_at_time) {
      setDefaultDates();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <TeacherPageHeader
        title="Créer une Session"
        subtitle="Configurez une nouvelle session de quiz pour vos étudiants."
        actionButton={{
          label: isSubmitting ? "Création..." : "Créer la Session",
          icon: isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />,
          onClick: handleSubmit,
          disabled: isSubmitting || loadingQuizzes
        }}
        backButton={{
          onClick: handleCancel
        }}
      />

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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-8">

            {/* Informations générales */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Informations générales</h2>
                  <p className="text-sm text-gray-600">Définissez les informations de base de la session</p>
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
                  <p className="text-sm text-gray-600">Définissez les dates et heures de la session</p>
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

                    {/* Vous pouvez ajouter d'autres paramètres ici */}
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