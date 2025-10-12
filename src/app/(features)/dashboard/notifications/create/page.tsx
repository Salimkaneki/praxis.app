'use client';
import React, { useState } from "react";
import { ArrowLeft, Send, MessageSquare, Settings } from "lucide-react";
import { Button, Textarea, Select } from "@/components/ui";
import { sendToAllTeachers, AdminNotificationData, mapNotificationType } from "../../_services";
import { useToast } from "@/hooks/useToast";

export default function CreateNotificationPage() {
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("announcement");
  const [priority, setPriority] = useState("medium");
  const [isSending, setIsSending] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      showError("Veuillez saisir un titre et un message");
      return;
    }

    setIsSending(true);

    try {
      // Préparer les données pour l'API
      const notificationData: AdminNotificationData = {
        type: mapNotificationType(type) as AdminNotificationData['type'],
        title: title.trim(),
        message: message.trim(),
        data: {
          priority,
          created_by: 'admin_dashboard'
        }
      };

      // Envoyer la notification à tous les enseignants
      const response = await sendToAllTeachers(notificationData);

      console.log("Notification envoyée:", response);

      // Afficher le toast de succès
      showSuccess(`Notification envoyée avec succès à ${response.recipients_count} enseignant(s) !`);

      setTitle("");
      setMessage("");
      setType("announcement");
      setPriority("medium");

    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      showError(error instanceof Error ? error.message : "Erreur lors de l'envoi de la notification");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.history.back()}
                className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-poppins font-semibold text-gray-900">
                  Créer une notification
                </h1>
                <p className="text-sm font-poppins text-gray-600">
                  Formulaire de création rapide
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.href = '/dashboard/chat'}
                className="flex items-center space-x-2 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-poppins text-sm font-medium"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Mode Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-6 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Formulaire */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Titre */}
              <Textarea
                label="Titre de la notification"
                placeholder="Entrez le titre..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                rows={1}
                maxLength={100}
                showCharCount
              />

              {/* Type et Priorité côte à côte */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Type de notification"
                  placeholder="Sélectionnez un type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  options={[
                    { value: "announcement", label: "Annonce générale" },
                    { value: "educational", label: "Information pédagogique" },
                    { value: "reminder", label: "Rappel d'événement" },
                    { value: "alert", label: "Alerte importante" },
                    { value: "system", label: "Mise à jour système" }
                  ]}
                />

                <Select
                  label="Priorité"
                  placeholder="Sélectionnez une priorité"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  options={[
                    { value: "low", label: "Basse" },
                    { value: "medium", label: "Moyenne" },
                    { value: "high", label: "Haute" }
                  ]}
                />
              </div>

              {/* Message */}
              <Textarea
                label="Message de la notification"
                placeholder="Tapez votre message ici..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                maxLength={500}
                showCharCount
              />

              {/* Bouton d'envoi */}
              <div className="flex justify-end pt-3 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={isSending || !title.trim() || !message.trim()}
                  className="flex items-center space-x-2"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Envoyer la notification</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Informations */}
          <div className="mt-4 border rounded-lg p-3 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-2">
              <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0 bg-blue-400"></div>
              <div className="text-xs font-poppins leading-relaxed text-blue-800">
                La notification sera envoyée à tous les professeurs actifs de votre institution.
                Les utilisateurs recevront une notification push s'ils sont connectés.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}