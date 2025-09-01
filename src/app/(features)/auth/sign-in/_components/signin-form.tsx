'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Inputs/Input";
import Button from "@/components/ui/Buttons/Button";
import { loginAdmin } from "../_services/auth.service";

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAdmin({ email, password });

      // Gestion des erreurs côté backend
      if ("error" in res) {
        const msg = res.error.toLowerCase();
        if (msg.includes("identifiants invalides")) {
          router.push("/error-page?code=401");
        } else if (msg.includes("pas d’accès")) {
          router.push("/error-page?code=403");
        } else {
          router.push("/error-page?code=500");
        }
        return;
      }

      // Vérification type utilisateur
      if (res.user.account_type !== "admin") {
        router.push("/error-page?code=403");
        return;
      }

      // Stockage du token sécurisé
      localStorage.setItem("admin_token", res.token);

      // Redirection vers dashboard
      router.push("/dashboard/");
    } catch (err) {
      console.error(err);
      router.push("/error-page?code=500");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center px-4">
      <form
        className="w-[530px] h-[530px] flex flex-col"
        onSubmit={handleSubmit}
      >
        {/* Logo / Titre */}
        <h1 className="font-pacifico text-3xl font-semibold text-gray-800 mb-2">
          Praxis
        </h1>

        {/* Sous-titre */}
        <div className="mb-6 flex flex-col gap-4">
          <h2 className="text-4xl font-bold text-gray-700">Se connecter</h2>
          <p className="text-md text-gray-500">
            Accédez à votre panel&nbsp;
            <span className="font-medium text-gray-700">en vous connectant</span>
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-6 flex-grow">
          <Input
            label="Email"
            placeholder="Entrez votre email"
            width="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Mot de passe"
            placeholder="Entrez votre mot de passe"
            width="w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Options */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox rounded text-forest-600"
              />
              Se souvenir de moi
            </label>
            <a href="#" className="text-forest-600 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          {/* Message d'erreur */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Bouton */}
        <div className="mt-6">
          <Button type="submit" size="large" width="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </div>
      </form>
    </div>
  );
}
