"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, SessionCodeInput } from "@/components/ui";
import { StudentSessionsService } from "../_services/sessions.service";
import {
  Key,
  ArrowRight,
  CheckCircle
} from "lucide-react";

interface SessionCodeForm {
  code: string;
}

export default function JoinSessionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SessionCodeForm>({ code: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCodeChange = (code: string) => {
    setFormData(prev => ({
      ...prev,
      code: code
    }));
    setError(null); // Effacer l'erreur quand l'utilisateur tape
  };

  const validateCode = (code: string): boolean => {
    // Validation basique: code doit faire au moins 6 caractères
    return code.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      setError("Veuillez entrer un code de session");
      return;
    }

    if (!validateCode(formData.code)) {
      setError("Le code de session doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Utiliser le vrai service API pour rejoindre la session
      const session = await StudentSessionsService.joinSession(formData.code.toUpperCase());

      setSuccess(true);

      // Rediriger vers la page de participation avec l'ID de session
      setTimeout(() => {
        router.push(`/student/sessions/participate?sessionId=${session.id}`);
      }, 2000);
    } catch (err: any) {
      console.error('Erreur lors de la jonction de session:', err);
      setError(err.response?.data?.message || "Code de session invalide. Vérifiez le code et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-8 py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Code validé !
              </h2>
              <p className="text-gray-600 mb-6">
                Redirection vers votre session d'examen...
              </p>
              <div className="animate-pulse flex justify-center">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <div className="px-8 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {/* Icône et titre */}
            <div className="text-center mb-8">

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Accès à l'examen
              </h2>
              <p className="text-gray-600">
                Entrez le code de session fourni par votre enseignant
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <SessionCodeInput
                  label="Code de session"
                  value={formData.code}
                  onChange={handleCodeChange}
                  length={6}
                  required
                  disabled={loading}
                  error={error || undefined}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Le code est généralement composé de lettres et chiffres
                </p>
              </div>

              {/* Bouton de soumission */}
              <Button
                type="submit"
                disabled={loading || !formData.code.trim()}
                className="w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Vérification...
                  </>
                ) : (
                  <>
                    Rejoindre la session
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Lien vers les sessions disponibles */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Vous connaissez déjà vos sessions disponibles ?{" "}
                <button
                  onClick={() => router.push("/student/sessions")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Voir toutes les sessions
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}