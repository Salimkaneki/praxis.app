'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Inputs/Input";
import Button from "@/components/ui/Buttons/Button";

export default function StudentSignInForm() {
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
      // TODO: Implémenter l'appel API loginStudent plus tard
      // const res = await loginStudent({ email, password });

      // Simulation temporaire de connexion réussie
      console.log("Tentative de connexion étudiant:", { email, password });

      // Simulation de redirection temporaire
      // router.push("/student/dashboard");

      // Pour l'instant, afficher un message
      setError("Connexion simulée - API à implémenter");

    } catch (err) {
      console.error(err);
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mobile Layout - Instagram style */}
      <div className="min-h-screen w-full bg-white flex flex-col px-4 md:hidden">
      {/* Mobile Layout - Instagram style */}
      {/* Logo Section - Centered at top third */}
      <div className="flex-1 flex items-end justify-center pb-4">
        <div className="w-full max-w-sm text-center space-y-4 px-4">
          <h1 className="font-pacifico text-5xl font-bold text-forest-600">
            Praxis
          </h1>

          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-gray-800">
              Connexion Étudiant
            </h2>
            <p className="text-gray-500 text-sm">
              Accédez à votre espace{' '}
              <span className="font-medium text-forest-600">étudiant</span>
            </p>
          </div>
        </div>
      </div>

      {/* Form Section - Centered in middle third */}
      <div className="flex-1 flex items-start justify-center pt-4">
        <form
          className="w-full max-w-sm space-y-4 px-4"
          onSubmit={handleSubmit}
        >
          <Input
            label=""
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 text-base"
          />

          <Input
            label=""
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 text-base"
          />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="large"
            width="w-full"
            disabled={loading}
            className="bg-forest-600 hover:bg-forest-700 focus:ring-forest-500 h-12 text-base font-semibold"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>

          {/* Links at bottom */}
          <div className="text-center space-y-4 pt-4">
            <a
              href="#"
              className="text-forest-600 text-sm font-medium block"
            >
              Mot de passe oublié ?
            </a>
          </div>
        </form>
      </div>

      {/* Bottom spacing */}
      <div className="flex-1"></div>
    </div>

    {/* Desktop Layout - Card style */}
    <div className="hidden md:block w-full">
      <form
        className="bg-white rounded-xl shadow-xl p-8 space-y-8 border border-gray-100"
        onSubmit={handleSubmit}
      >
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="font-pacifico text-4xl font-bold text-forest-600">
            Praxis
          </h1>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-800">
              Connexion Étudiant
            </h2>
            <p className="text-gray-600">
              Accédez à votre espace{' '}
              <span className="font-semibold text-forest-700">étudiant</span>
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <Input
            label="Email"
            placeholder="Entrez votre email étudiant"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Mot de passe"
            placeholder="Entrez votre mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Options Row */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-3 cursor-pointer text-sm">
              <input
                type="checkbox"
                className="form-checkbox rounded text-forest-600 focus:ring-forest-500"
              />
              <span className="text-gray-700">Se souvenir de moi</span>
            </label>

            <a
              href="#"
              className="text-forest-600 hover:text-forest-700 text-sm font-medium transition-colors"
            >
              Mot de passe oublié ?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="large"
          width="w-full"
          disabled={loading}
          className="bg-forest-600 hover:bg-forest-700 focus:ring-forest-500"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
    </>
  );
}