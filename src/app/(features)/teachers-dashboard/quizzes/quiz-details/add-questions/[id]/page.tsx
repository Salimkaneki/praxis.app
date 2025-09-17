'use client';
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import TeacherPageHeader from "../../../../_components/page-header";
import Input from "@/components/ui/Inputs/Input";
import Select from "@/components/ui/Inputs/Select";
import Textarea from "@/components/ui/Inputs/Textarea";
import { 
  Plus, 
  Save, 
  X, 
  HelpCircle, 
  CheckCircle2, 
  Type, 
  AlignLeft, 
  ToggleLeft, 
  List,
  ArrowLeft,
  Hash,
  AlertCircle,
  FileText
} from "lucide-react";
import { QuizzesService, QuestionsService, Quiz } from "../../../_services/quizzes.service";

type QuestionType = 'multiple_choice' | 'true_false' | 'open_ended' | 'fill_blank';

interface Option {
  text: string;
  is_correct: boolean;
}

interface QuestionFormData {
  question_text: string;
  type: QuestionType;
  options: Option[];
  correct_answer: string;
  points: number;
  explanation: string;
  order?: number;
}

const AddQuestionPage = () => {
  const router = useRouter();
  const params = useParams();
  const quizId = params?.id as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<QuestionFormData>({
    question_text: '',
    type: 'multiple_choice',
    options: [
      { text: '', is_correct: false },
      { text: '', is_correct: false }
    ],
    correct_answer: '',
    points: 1,
    explanation: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Récupération des données du quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId || isNaN(Number(quizId))) {
        setError("ID de quiz invalide");
        setLoading(false);
        return;
      }

      try {
        const quizData = await QuizzesService.getById(Number(quizId));
        setQuiz(quizData);
      } catch (err: any) {
        console.error("Erreur lors de la récupération du quiz :", err);
        setError("Impossible de récupérer les informations du quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const questionTypes = [
    {
      value: 'multiple_choice' as const,
      label: 'QCM (Choix multiples)',
      icon: List,
      description: 'Question avec plusieurs options de réponse'
    },
    {
      value: 'true_false' as const,
      label: 'Vrai/Faux',
      icon: ToggleLeft,
      description: 'Question avec réponse vrai ou faux'
    },
    {
      value: 'open_ended' as const,
      label: 'Réponse ouverte',
      icon: AlignLeft,
      description: 'Question nécessitant une réponse rédigée'
    },
    {
      value: 'fill_blank' as const,
      label: 'Texte à trous',
      icon: Type,
      description: 'Question avec un mot ou phrase à compléter'
    }
  ];

  // Options pour le Select des points
  const pointsOptions = [
    { value: '1', label: '1 point' },
    { value: '2', label: '2 points' },
    { value: '3', label: '3 points' },
    { value: '4', label: '4 points' },
    { value: '5', label: '5 points' },
    { value: '6', label: '6 points' },
    { value: '7', label: '7 points' },
    { value: '8', label: '8 points' },
    { value: '9', label: '9 points' },
    { value: '10', label: '10 points' }
  ];

  const handleQuestionTypeChange = (type: QuestionType) => {
    let newFormData = { ...formData, type };
    
    // Réinitialiser les options selon le type
    if (type === 'multiple_choice') {
      newFormData.options = [
        { text: '', is_correct: false },
        { text: '', is_correct: false }
      ];
      newFormData.correct_answer = '';
    } else if (type === 'true_false') {
      newFormData.options = [];
      newFormData.correct_answer = '';
    } else {
      newFormData.options = [];
      newFormData.correct_answer = '';
    }
    
    setFormData(newFormData);
    // Nettoyer les erreurs
    setErrors({});
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData({
        ...formData,
        options: [...formData.options, { text: '', is_correct: false }]
      });
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const updateOption = (index: number, field: 'text' | 'is_correct', value: string | boolean) => {
    const newOptions = [...formData.options];
    if (field === 'is_correct' && value === true) {
      // Pour QCM, une seule bonne réponse
      newOptions.forEach((opt, i) => {
        opt.is_correct = i === index;
      });
    } else {
      newOptions[index] = { ...newOptions[index], [field]: value };
    }
    setFormData({ ...formData, options: newOptions });
  };

const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string } }) => {
  const value = e.target.value;
  setFormData({ ...formData, points: parseInt(value) || 1 });
};

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.question_text.trim()) {
      newErrors.question_text = 'Le texte de la question est requis';
    }

    if (formData.points < 1 || formData.points > 10) {
      newErrors.points = 'Les points doivent être entre 1 et 10';
    }

    if (formData.type === 'multiple_choice') {
      if (formData.options.some(opt => !opt.text.trim())) {
        newErrors.options = 'Toutes les options doivent avoir du texte';
      }
      if (!formData.options.some(opt => opt.is_correct)) {
        newErrors.correct_answer = 'Au moins une option doit être correcte';
      }
    }

    if (formData.type === 'true_false' && !formData.correct_answer) {
      newErrors.correct_answer = 'Sélectionnez la bonne réponse';
    }

    if (formData.type === 'fill_blank' && !formData.correct_answer.trim()) {
      newErrors.correct_answer = 'La réponse correcte est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async () => {
  if (!validateForm() || !quiz) return;

  setSaving(true);
  try {
    // Préparer les données pour l'API
    const questionData = {
      question_text: formData.question_text.trim(),
      type: formData.type,
      points: formData.points,
      explanation: formData.explanation.trim() || undefined, // Changé de null à undefined
      correct_answer: formData.correct_answer || undefined, // Changé de null à undefined
      options: formData.type === 'multiple_choice' ? formData.options : [],
    };

    await QuestionsService.create(quiz.id, questionData);
    
    // Retour à la page de détails du quiz
    router.back();
  } catch (error) {
    console.error("Erreur lors de la sauvegarde :", error);
    setError("Erreur lors de la sauvegarde de la question");
  } finally {
    setSaving(false);
  }
};

  const handleCancel = () => {
    router.back();
  };

  // États de chargement et d'erreur
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins">
        <div className="px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins">
        <div className="px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Quiz non trouvé</h2>
              <p className="text-gray-600 mb-6">{error || "Ce quiz n'existe pas ou n'est plus disponible."}</p>
              <button
                onClick={() => router.push("/teachers-dashboard/quizzes")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retour aux quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <TeacherPageHeader
        title="Ajouter une question"
        subtitle={`Créez une nouvelle question pour le quiz "${quiz.title}"`}
        actionButton={{
          label: saving ? "Enregistrement..." : "Enregistrer la question",
          icon: <Save className="w-4 h-4 mr-2" />,
          onClick: handleSubmit,
          disabled: saving
        }}
        backButton={{ 
          onClick: handleCancel
        }}
      />

      <div className="px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Bouton retour */}
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au quiz
          </button>

          {/* Formulaire principal */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            
            {/* Question text */}
            <div className="mb-8">
              <Textarea
                label="Texte de la question"
                placeholder="Saisissez votre question ici..."
                value={formData.question_text}
                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                required
                error={errors.question_text}
                rows={3}
                maxLength={500}
                showCharCount
              />
            </div>

            {/* Type de question */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Type de question *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questionTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = formData.type === type.value;
                  return (
                    <button
                      key={type.value}
                      onClick={() => handleQuestionTypeChange(type.value)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`w-4 h-4 ${
                            isSelected ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <p className={`font-medium ${
                            isSelected ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {type.label}
                          </p>
                          <p className="text-sm text-gray-500">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Configuration spécifique au type */}
            {formData.type === 'multiple_choice' && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Options de réponse * ({formData.options.length}/6)
                  </label>
                  <button
                    onClick={addOption}
                    disabled={formData.options.length >= 6}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter option
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="correct_answer"
                          checked={option.is_correct}
                          onChange={() => updateOption(index, 'is_correct', true)}
                          className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-500 font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + index)} - Saisissez le texte de l'option`}
                          value={option.text}
                          onChange={(e) => updateOption(index, 'text', e.target.value)}
                          className={option.is_correct ? 'border-green-300 bg-green-50' : ''}
                        />
                      </div>
                      {formData.options.length > 2 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer cette option"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.options && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {errors.options}
                  </p>
                )}
                {errors.correct_answer && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {errors.correct_answer}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <HelpCircle className="w-4 h-4" />
                  Sélectionnez le bouton radio à côté de la bonne réponse
                </p>
              </div>
            )}

            {formData.type === 'true_false' && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Réponse correcte *
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, correct_answer: 'true' })}
                    className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.correct_answer === 'true'
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 inline mr-2" />
                    Vrai
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, correct_answer: 'false' })}
                    className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.correct_answer === 'false'
                        ? 'border-red-500 bg-red-50 text-red-700 shadow-sm'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <X className="w-5 h-5 inline mr-2" />
                    Faux
                  </button>
                </div>
                {errors.correct_answer && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {errors.correct_answer}
                  </p>
                )}
              </div>
            )}

            {(formData.type === 'fill_blank' || formData.type === 'open_ended') && (
              <div className="mb-8">
                {formData.type === 'open_ended' ? (
                  <>
                    <Textarea
                      label="Éléments de réponse attendus (optionnel)"
                      placeholder="Décrivez les éléments clés que vous attendez dans la réponse des étudiants..."
                      value={formData.correct_answer}
                      onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                      error={errors.correct_answer}
                      rows={4}
                      maxLength={1000}
                      showCharCount
                    />
                    <p className="text-sm text-gray-500 mt-1 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Conseil :</strong> Ces éléments vous aideront lors de la correction manuelle. 
                        Les étudiants ne les verront pas.
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <Input
                      label="Réponse correcte"
                      placeholder="Saisissez la réponse correcte"
                      value={formData.correct_answer}
                      onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                      required
                      error={errors.correct_answer}
                    />
                    <p className="text-sm text-gray-500 mt-1 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        Utilisez des underscores (_____) dans votre question pour indiquer où placer la réponse
                      </span>
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <Select
                  label="Points attribués"
                  placeholder="Sélectionner les points"
                  value={formData.points.toString()}
                  onChange={handleSelectChange}
                  options={pointsOptions}
                  leftIcon={Hash}
                  required
                  error={errors.points}
                />
              </div>
              <div></div>
            </div>

            {/* Explication */}
            <div className="mb-8">
              <Textarea
                label="Explication (optionnelle)"
                placeholder="Expliquez pourquoi cette réponse est correcte..."
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                leftIcon={HelpCircle}
                rows={3}
                maxLength={300}
                showCharCount
              />
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <HelpCircle className="w-4 h-4" />
                Cette explication sera affichée aux étudiants après leur réponse
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Enregistrement...' : 'Enregistrer la question'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionPage;