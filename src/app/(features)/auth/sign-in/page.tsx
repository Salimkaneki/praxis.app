import React from "react";
import SignInForm from "./_components/signin-form";
import PraxisCard from "../_component/Praxis-Card";

export default function SignInPage() {
  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* Colonne gauche - Formulaire */}
      <div className="w-1/2 h-full flex items-center justify-center bg-white shadow-sm">
        <SignInForm />
      </div>

      {/* Colonne droite - Présentation */}
      <div className="w-1/2 h-full">
        <PraxisCard />
      </div>
    </div>
  );
}