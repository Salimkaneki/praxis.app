'use client';
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import {
  FileText, Clock, Calendar, Users, Settings,
  Save, AlertCircle, CheckCircle, Shield,
  Pause, Shuffle, Loader2
} from "lucide-react";

// Import de vos composants
import Input from "@/components/ui/Inputs/Input";
import Select from "@/components/ui/Inputs/Select";
import TeacherPageHeader from "../../../_components/page-header";

// Import des services
import { SessionsService, Session } from "../../_services/sessions.service";
import { QuizzesService, Quiz } from "../../../quizzes/_services/quizzes.service";
import { useToast } from "@/hooks/useToast";

// Types pour le formulaire
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
  const params = useParams();
  const sessionId = parseInt(params.id as string);

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
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // États pour les données externes
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [quizzesError, setQuizzesError] = useState<string | null>(null);
  const [originalSession, setOriginalSession] = useState<any>(null);

  // Vérification que l'ID est valide
  if (!sessionId || isNaN(sessionId)) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">ID de session invalide</h2>
          <p className="text-gray-600 mb-6">L'identifiant de la session n'est pas valide.</p>
          <button
            onClick={() => router.push('/teachers-dashboard/sessions')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  // Charger les données de la session
  useEffect(() => {
    console.log('useEffect déclenché pour sessionId:', sessionId);

    const loadSession = async () => {
      try {
        console.log('Début du chargement de la session...');
        setIsLoading(true);
        setLoadingError(null);

        // Test de connectivité API - utiliser une route existante
        console.log('Test de connectivité API...');
        try {
          const testResponse = await fetch('http://localhost:8000/api/teacher/sessions', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('teacher_token') || ''}`
            },
            signal: AbortSignal.timeout(3000) // 3 secondes timeout pour le test
          });
          console.log('Test API response status:', testResponse.status);
          // Accepter 200 (OK), 401 (non auth), 403 (pas autorisé) comme signes que l'API fonctionne
          if (testResponse.status >= 500) {
            console.warn('API retourne une erreur serveur, mais on continue...');
          }
        } catch (testError: any) {
          console.warn('Test de connectivité échoué, mais on continue:', testError.message);
          // Ne pas bloquer si le test échoue, continuer avec l'appel principal
        }

        console.log('Appel API: SessionsService.getById(', sessionId, ')');
        console.log('Type de sessionId:', typeof sessionId, 'Valeur:', sessionId);
        const session = await SessionsService.getById(sessionId);
        console.log('Réponse API reçue:', session);
        console.log('Session complète:', JSON.stringify(session, null, 2));

        // Vérifier que la session a bien été chargée
        if (!session || !session.id) {
          console.error('Session invalide:', session);
          throw new Error('Session non trouvée ou données invalides');
        }

        console.log('Session valide, traitement des données...');

        // Stocker la session originale pour comparer les changements
        setOriginalSession(session);

        // Convertir les dates pour le formulaire
        const startsAt = new Date(session.starts_at);
        const endsAt = new Date(session.ends_at);

        // Pré-remplir le formulaire avec les données de la session
        setFormData({
          quiz_id: session.quiz_id?.toString() || "",
          title: session.title || "",
          starts_at_date: startsAt.toISOString().split('T')[0],
          starts_at_time: startsAt.toTimeString().slice(0, 5),
          ends_at_date: endsAt.toISOString().split('T')[0],
          ends_at_time: endsAt.toTimeString().slice(0, 5),
          max_participants: session.max_participants?.toString() || "100",
          shuffle_questions: session.settings?.shuffle_questions ?? true,
          time_limit: session.settings?.time_limit?.toString() || session.duration_minutes?.toString() || "60",
          proctoring: session.settings?.proctoring ?? true,
          allow_pause: session.settings?.allow_pause ?? false
        });

      } catch (error: any) {
        console.error('Erreur lors du chargement de la session:', error);
        console.error('Type d\'erreur:', error.constructor.name);
        console.error('Message d\'erreur:', error.message);

        // Vérifier si c'est une erreur axios
        if (error.response) {
          console.error('Error response:', error.response);
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
        } else {
          console.error('Pas d\'error.response - Erreur réseau ou autre');
        }

        // Gestion spécifique des erreurs HTTP
        if (error.response?.status === 404) {
          setLoadingError("Session non trouvée. Elle a peut-être été supprimée.");
        } else if (error.response?.status === 403) {
          setLoadingError("Accès refusé. Vous n'avez pas les permissions pour modifier cette session.");
        } else if (error.response?.status >= 500) {
          setLoadingError("Erreur serveur. Veuillez réessayer plus tard.");
        } else if (error.message?.includes('API non accessible')) {
          setLoadingError(error.message);
        } else if (error.message?.includes('réseau')) {
          setLoadingError("Erreur réseau. Vérifiez votre connexion internet.");
        } else {
          setLoadingError(`Erreur lors du chargement de la session: ${error.message || 'Erreur inconnue'}`);
        }

        showError("Impossible de charger les données de la session");
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [sessionId]); // Retiré showError des dépendances

  // Charger les quiz disponibles
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoadingQuizzes(true);
        setQuizzesError(null);
        const quizzesData = await QuizzesService.getAll();
        setQuizzes(quizzesData);
      } catch (err) {
        console.error('Erreur lors du chargement des quiz:', err);
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
    label: quiz.title
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
      const now = new Date();

      if (startDateTime >= endDateTime) {
        newErrors.dateTime = "La date/heure de fin doit être postérieure à celle de début";
      }

      // Pour une session existante, permettre starts_at dans le passé seulement si elle n'a pas changé
      const originalStartsAt = originalSession ? new Date(originalSession.starts_at) : null;
      const hasStartDateChanged = originalStartsAt && Math.abs(startDateTime.getTime() - originalStartsAt.getTime()) > 60000; // 1 minute de tolérance

      if (!originalSession || hasStartDateChanged) {
        // Nouvelle session ou date changée : starts_at doit être dans le futur
        if (startDateTime <= now) {
          newErrors.dateTime = "La date/heure de début doit être dans le futur";
        }
      }

      // Vérifier que la date de fin est dans le futur (toujours obligatoire)
      if (endDateTime <= now) {
        newErrors.dateTime = "La date/heure de fin doit être dans le futur";
      }
    }

    return newErrors;
  };  // Soumission du formulaire
  const handleSubmit = async (): Promise<void> => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Validation des données avant envoi
      if (!formData.quiz_id || isNaN(parseInt(formData.quiz_id))) {
        throw new Error('Veuillez sélectionner un quiz valide');
      }

      if (!formData.title?.trim()) {
        throw new Error('Le titre de la session est requis');
      }

      if (!formData.starts_at_date || !formData.starts_at_time) {
        throw new Error('La date et heure de début sont requises');
      }

      if (!formData.ends_at_date || !formData.ends_at_time) {
        throw new Error('La date et heure de fin sont requises');
      }

      if (!formData.max_participants || isNaN(parseInt(formData.max_participants))) {
        throw new Error('Le nombre maximum de participants est requis');
      }

      if (!formData.time_limit || isNaN(parseInt(formData.time_limit))) {
        throw new Error('La durée limite est requise');
      }

      // Préparer les données pour l'API
      const sessionData: any = {
        quiz_id: parseInt(formData.quiz_id),
        title: formData.title.trim(),
        ends_at: `${formData.ends_at_date}T${formData.ends_at_time}:00`,
        max_participants: parseInt(formData.max_participants),
        settings: {
          shuffle_questions: Boolean(formData.shuffle_questions),
          time_limit: parseInt(formData.time_limit),
          proctoring: Boolean(formData.proctoring),
          allow_pause: Boolean(formData.allow_pause)
        }
      };

      // Pour starts_at : seulement l'inclure si elle a changé ou si elle est dans le futur
      const newStartsAt = `${formData.starts_at_date}T${formData.starts_at_time}:00`;
      const originalStartsAt = originalSession?.starts_at;

      if (newStartsAt !== originalStartsAt) {
        // La date a changé, l'inclure toujours
        sessionData.starts_at = newStartsAt;
      } else if (new Date(newStartsAt) > new Date()) {
        // La date n'a pas changé mais est dans le futur, l'inclure
        sessionData.starts_at = newStartsAt;
        // Si elle n'a pas changé et est dans le passé, ne pas l'inclure pour éviter la validation
      }

      console.log('📤 Données envoyées à l\'API:', sessionData);
      console.log('📋 Comparaison starts_at:', { newStartsAt, originalStartsAt, included: !!sessionData.starts_at });

      // Utilisation du service de mise à jour
      const updatedSession = await SessionsService.update(sessionId, sessionData);

      setSubmitStatus('success');
      showSuccess("Session modifiée avec succès !");

      // Redirection après un court délai
      setTimeout(() => {
        router.push('/teachers-dashboard/sessions');
      }, 1500);

    } catch (error: any) {
      console.error('❌ Erreur lors de la modification:', error);
      console.error('📋 Détails de l\'erreur:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });

      // Afficher l'erreur spécifique du serveur
      const serverError = error.response?.data?.error || error.response?.data?.message || error.message;
      showError(`Erreur: ${serverError}`);
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