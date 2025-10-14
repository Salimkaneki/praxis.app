import Link from "next/link";
import { UserCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="font-poppins grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gradient-to-br from-forest-50 to-white">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-pacifico text-forest-800">Praxis</h1>
        </div>

        <p className="text-lg text-gray-600 text-center sm:text-left max-w-md font-inter">
          Plateforme d&apos;évaluation et de suivi pédagogique pour les établissements éducatifs.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/auth/sign-in/student"
            className="rounded-full border border-solid border-transparent transition-smooth flex items-center justify-center bg-forest-600 text-white gap-2 hover:bg-forest-700 hover:shadow-medium font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 shadow-soft"
          >
            Connexion Étudiant
          </Link>
          <Link
            href="/auth/sign-in/teacher"
            className="rounded-full border border-solid border-forest-600 transition-smooth flex items-center justify-center bg-white text-forest-600 gap-2 hover:bg-forest-50 hover:shadow-medium font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 shadow-soft"
          >
            <UserCheck className="w-4 h-4" />
            Connexion Enseignant
          </Link>
        </div>

        <div className="text-sm text-gray-500 text-center sm:text-left font-inter">
          <p>Choisissez votre profil pour accéder à votre espace personnalisé.</p>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="font-poppins">Praxis - Plateforme éducative</span>
        </div>
      </footer>
    </div>
  );
}
