'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { 
  Edit, 
  Trash2, 
  X,
  HelpCircle, 
  CheckCircle2, 
  Type, 
  AlignLeft, 
  ToggleLeft, 
  List,
  Hash,
  Award,
  Clock,
  Eye
} from "lucide-react";

type QuestionType = 'multiple_choice' | 'true_false' | 'open_ended' | 'fill_blank';

interface Option {
  text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  question_text: string;
  type: QuestionType;
  options: Option[];
  correct_answer: string;
  points: number;
  explanation: string;
  order: number;
  created_at: string;
  updated_at: string;
}

interface QuestionDetailsModalProps {
  question: Question;
  quizId: string | number;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const QuestionDetailsModal: React.FC<QuestionDetailsModalProps> = ({
  question,
  quizId,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!isOpen) return null;

  const questionTypes = {
    'multiple_choice': {
      label: 'QCM (Choix multiples)',
      icon: List,
      description: 'Question avec plusieurs options de réponse'
    },
    'true_false': {
      label: 'Vrai/Faux',
      icon: ToggleLeft,
      description: 'Question avec réponse vrai ou faux'
    },
    'open_ended': {
      label: 'Réponse ouverte',
      icon: AlignLeft,
      description: 'Question nécessitant une réponse rédigée'
    },
    'fill_blank': {
      label: 'Texte à trous',
      icon: Type,
      description: 'Question avec un mot ou phrase à compléter'
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      router.push(`/teachers-dashboard/quizzes/${quizId}/questions/${question.id}/edit`);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (onDelete) {
      setDeleting(true);
      try {
        await onDelete();
        onClose();
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      } finally {
        setDeleting(false);
        setShowDeleteConfirm(false);
      }
    }
  };

  const currentQuestionType = questionTypes[question.type];
  const IconComponent = currentQuestionType.icon;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* En-tête */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Détails de la question
                </h2>
                <p className="text-sm text-gray-500">
                  {currentQuestionType.label} • {question.points} point{question.points > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenu scrollable */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="p-6">
              {/* Texte de la question */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Question
                </label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900 leading-relaxed">
                    {question.question_text}
                  </p>
                </div>
              </div>

              {/* Configuration spécifique au type */}
              {question.type === 'multiple_choice' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Options de réponse
                  </label>
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex items-center min-w-[60px]">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            option.is_correct 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-300 bg-white'
                          }`}>
                            {option.is_correct && (
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                            )}
                          </div>
                          <span className="ml-2 text-sm text-gray-500 font-medium">
                            {String.fromCharCode(65 + index)}
                          </span>
                        </div>
                        <div className={`flex-1 p-3 rounded-lg border text-sm ${
                          option.is_correct 
                            ? 'border-green-200 bg-green-50 text-green-900' 
                            : 'border-gray-200 bg-white text-gray-900'
                        }`}>
                          {option.text}
                          {option.is_correct && (
                            <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                              Correct
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {question.type === 'true_false' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Réponse correcte
                  </label>
                  <div className="flex gap-3">
                    <div className={`px-4 py-2 rounded-lg border-2 font-medium text-sm ${
                      question.correct_answer === 'true'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 inline mr-1" />
                      Vrai
                      {question.correct_answer === 'true' && (
                        <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                          Correct
                        </span>
                      )}
                    </div>
                    <div className={`px-4 py-2 rounded-lg border-2 font-medium text-sm ${
                      question.correct_answer === 'false'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                    }`}>
                      <X className="w-4 h-4 inline mr-1" />
                      Faux
                      {question.correct_answer === 'false' && (
                        <span className="ml-2 text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                          Correct
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {(question.type === 'fill_blank' || question.type === 'open_ended') && question.correct_answer && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {question.type === 'open_ended' ? 'Éléments de réponse attendus' : 'Réponse correcte'}
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 leading-relaxed text-sm">
                      {question.correct_answer}
                    </p>
                  </div>
                </div>
              )}

              {/* Explication */}
              {question.explanation && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Explication
                  </label>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-900 leading-relaxed text-sm">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Informations supplémentaires */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">Points</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {question.points}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">Position</p>
                    <p className="text-sm font-semibold text-gray-900">
                      #{question.order}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">Créée le</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(question.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            {onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium flex items-center gap-2 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            )}
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors text-sm"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Supprimer la question
              </h3>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
              Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 transition-colors disabled:opacity-50 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionDetailsModal;