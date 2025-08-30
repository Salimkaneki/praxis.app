import Button from "@/components/ui/Buttons/Button";
import Input from "@/components/ui/Inputs/Input";
import React from "react";

export default function SignInForm() {
  return (
    <div className="h-screen w-full flex items-center justify-center px-4">
      <div className="w-[530px] h-[530px] flex flex-col">
        
        {/* Logo / Titre principal */}
        <h1 className="font-pacifico text-3xl font-semibold text-gray-800 mb-2">
          Praxis
        </h1>

        {/* Sous-titre */}
        <div className="mb-6 flex flex-col gap-4">
          <h2 className="text-4xl font-bold text-gray-700">
            Se connecter
          </h2>
          <p className="text-md text-gray-500">
            Accédez à votre panel&nbsp;
            <span className="font-medium text-gray-700">
              en vous connectant
            </span>
          </p>
        </div>

        {/* Formulaire */}
        <div className="flex flex-col gap-6 flex-grow">
          <Input 
            label="Email" 
            placeholder="Entrez votre email"
            width="w-full"
          />

          <Input 
            label="Mot de passe" 
            placeholder="Entrez votre mot de passe"
            width="w-full"
          />

          {/* Ligne options */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="form-checkbox rounded text-forest-600" />
              Se souvenir de moi
            </label>
            <a href="#" className="text-forest-600 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        {/* Bouton */}
        <div className="mt-6">
          <Button size="large" width="w-full">
            Se connecter
          </Button>
        </div>
      </div>
    </div>
  );
}