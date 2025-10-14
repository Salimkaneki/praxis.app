'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Inputs/Input";
import Button from "@/components/ui/Buttons/Button";
import { loginTeacher } from "../_services/auth.service";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";

export default function SignInTeacherForm() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation basique
    if (!email || !password) {
      showError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      console.log("Début de la soumission du formulaire");
      const res = await loginTeacher({ email, password });
      console.log("Réponse reçue du service:", res);

      if ("error" in res) {
        console.log("Erreur dans la réponse:", res.error);
        const msg = res.error.toLowerCase();
        if (msg.includes("identifiants invalides") || msg.includes("invalides")) {
          showError("Email ou mot de passe incorrect");
        } else if (msg.includes("accès refusé") || msg.includes("permissions")) {
          showError("Vous n'avez pas accès à l'espace enseignant");
        } else if (msg.includes("réseau") || msg.includes("connexion")) {
          showError("Erreur de connexion réseau. Vérifiez votre connexion internet.");
        } else if (msg.includes("serveur")) {
          showError("Erreur serveur. Réessayez dans quelques instants.");
        } else if (msg.includes("contacter")) {
          showError("Impossible de contacter le serveur. Vérifiez la configuration.");
        } else {
          showError("Une erreur technique est survenue: " + res.error);
        }
        setLoading(false);
        return;
      }

      if (res.user.account_type !== "teacher") {
        showError("Ce compte n'est pas un compte enseignant");
        setLoading(false);
        return;
      }

      localStorage.setItem("teacher_token", res.token);
      localStorage.setItem("teacher_data", JSON.stringify(res.teacher));
      
      // Stocker aussi dans les cookies pour le middleware côté serveur
      document.cookie = `teacher_token=${res.token}; path=/; max-age=86400; samesite=strict`;
      
      console.log("Connexion réussie, redirection...");
      showSuccess("Connexion réussie ! Bienvenue dans votre espace enseignant.");
      router.push("/teachers-dashboard");

    } catch (err) {
      console.error("Erreur inattendue:", err);
      showError("Une erreur inattendue est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center px-4 bg-gray-50">
      <form
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        {/* Logo / Titre */}
        <div className="text-center mb-8">
          <h1 className="font-pacifico text-4xl font-semibold text-blue-800 mb-2">
            Praxis
          </h1>
          <div className="mb-6 flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-gray-700">Espace Enseignant</h2>
            <p className="text-sm text-gray-500">
              Connectez-vous à votre espace dédié
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4 mb-6">
          <Input
            label="Email académique"
            placeholder="votre.email@etablissement.fr"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            label="Mot de passe"
            placeholder="Votre mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox rounded text-blue-600"
              disabled={loading}
            />
            Se souvenir de moi
          </label>
          <a href="#" className="text-blue-600 hover:underline">
            Mot de passe oublié ?
          </a>
        </div>

        {/* Bouton */}
        <div className="mb-4">
          <Button 
            type="submit" 
            size="large" 
            width="w-full" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </div>
        
        {/* Lien vers autres espaces */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Vous êtes administrateur ?{" "}
            <Link href="/auth/sign-in" className="text-blue-600 hover:underline">
              Accédez à l'espace admin
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}