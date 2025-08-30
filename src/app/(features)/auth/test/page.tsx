import React from "react";
import SignInForm from "../sign-in/_components/signin-form";
import PraxisCard from "../_component/Praxis-Card";
import SideBar from "../../(dashboard)/_components/sidebar";

export default function SignInPage() {
  return (
    <div className="flex h-screen w-screen">
      {/* Colonne gauche */}
      <SideBar />
    </div>
  );
}
