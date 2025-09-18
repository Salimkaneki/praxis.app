import react from "react";
import TeacherPageHeader from "../../_components/page-header";

export default function CreateSessionPage() {
  return (
    <div className="min-h-screen bg-white">
        <TeacherPageHeader
          title="Créer une nouvelle session"
          subtitle="Remplissez les informations ci-dessous"
          actionButton={undefined  /* Pas de bouton d'action sur cette page */}
          backButton={{ 
            
          }}
        />
    </div>
  );
}
