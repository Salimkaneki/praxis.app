"use client";

import React from "react";
import Button from "@/components/ui/Buttons/Button";
import { useRouter } from "next/navigation";

interface ErrorPageProps {
  code: number;
  message?: string;
}

const defaultMessages: Record<number, string> = {
  401: "Non autorisé. Veuillez vous connecter.",
  403: "Accès refusé. Vous n'avez pas la permission.",
  404: "Page introuvable.",
  500: "Erreur serveur. Veuillez réessayer plus tard.",
};

export default function ErrorPage({ code, message }: ErrorPageProps) {
  const router = useRouter();
  const displayMessage = message || defaultMessages[code] || "Une erreur est survenue";

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">{code}</h1>
      <p className="text-xl text-gray-700 mb-6">{displayMessage}</p>
      <Button size="large" width="w-48" onClick={() => router.push("/")}>
        Retour à l'accueil
      </Button>
    </div>
  );
}
