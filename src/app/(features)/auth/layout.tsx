import React from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Praxis - Connexion",
  description: "Accédez à votre espace d'évaluation universitaire",
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main
      suppressHydrationWarning
      suppressContentEditableWarning
      className="min-h-screen bg-white-change flex flex-col justify-center items-center w-full"
    >
      {children}
    </main>
  );
}
