import React from "react";
import SignInForm from "./_components/signin-form";
import PraxisCard from "../_component/Praxis-Card";

export default function SignInPage() {
  return (
    <div className="flex h-screen w-screen">
      {/* Colonne gauche */}
      <div className="w-1/2 h-full flex items-center justify-center bg-gray-50">
        <SignInForm />
      </div>

      {/* Colonne droite */}
      <div className="w-1/2 h-full flex flex-col items-center justify-center bg-forest-700">
        <PraxisCard />
      </div>
    </div>
  );
}
