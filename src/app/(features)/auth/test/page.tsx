import React from "react";
import SignInForm from "../sign-in/_components/signin-form";
import PraxisCard from "../_component/Praxis-Card";
import SideBar from "../../dashboard/_components/sidebar";
import DashboardHeader from "../../dashboard/_components/header";

export default function SignInPage() {
  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar fixe à gauche */}
      <SideBar />
      
      {/* Zone principale avec header + contenu */}
      <div className="flex-1 flex flex-col">
        {/* Header en haut */}
        <DashboardHeader />
        
        {/* Contenu principal */}
        <main className="flex-1 flex">
          {/* Colonne gauche - Formulaire */}
          {/* <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <SignInForm />
            </div>
          </div> */}
          
          {/* Colonne droite - Carte Praxis */}
          {/* <div className="flex-1 flex items-center justify-center">
            <PraxisCard />
          </div> */}
        </main>
      </div>
    </div>
  );
}