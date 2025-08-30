import React from "react";

export default function PraxisCard() {
  return (
    <div className="h-screen w-full bg-emerald-800 flex flex-col items-center justify-end text-white relative overflow-hidden">
      {/* Cercles décoratifs améliorés */}
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-white/20 to-white/5 blur-2xl"></div>
      <div className="absolute -top-20 -right-20 w-[200px] h-[200px] rounded-full bg-white/10 blur-xl"></div>

      {/* Contenu */}
      <div className="w-full px-8 pb-12 text-center max-w-lg z-10 relative">
        {/* Logo / Titre avec une petite amélioration */}
        <div className="mb-6">
          <h2 className="text-4xl font-pacifico font- mb-2">Praxis</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto"></div>
        </div>

        {/* Description avec quelques améliorations typographiques */}
        <p className="text-base leading-relaxed text-gray-100 mb-8">
          Pensé pour les universités et écoles, <span className="font-semibold text-white">PRAXIS</span> 
          simplifie la gestion des évaluations et garantit une transparence totale des résultats.  
          Une solution innovante qui allie <span className="font-medium text-emerald-200">performance technique </span> 
          et <span className="font-medium text-emerald-200">conformité académique</span>.
        </p>

        {/* Carrousel Dots légèrement améliorés */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <span className="w-2 h-2 rounded-full bg-white/40 transition-all duration-300 hover:bg-white/70"></span>
          <span className="w-8 h-2 rounded-full bg-white transition-all duration-300"></span>
          <span className="w-2 h-2 rounded-full bg-white/40 transition-all duration-300 hover:bg-white/70"></span>
        </div>
      </div>
    </div>
  );
}