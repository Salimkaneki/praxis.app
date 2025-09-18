import React from "react";
import TeacherPageHeader from "../../_components/page-header";

export default function SessionsEditPage() {
  return (
    <div className="min-h-screen bg-white">
      <TeacherPageHeader
        title="Modifier la session"
        subtitle="Mettez à jour les informations de la session"
        actionButton={undefined}
        backButton={{
        //   label: "Retour aux sessions",
                //   href: "/teachers-dashboard/sessions",
        }}
      />
    </div>
  );
}