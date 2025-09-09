import React from "react";
import TeacherPageHeader from "./_components/page-header";
import KPIGrid from "./_components/kpi-grid";

export default function TeacherDashboardPage() {



  return (
    <div className="min-h-screen bg-white">

        <TeacherPageHeader 
            title="Tableau de bord" 
            subtitle="Vue d'ensemble de vos classes et évaluations"
        />

              <div className="px-8 py-8">
                <KPIGrid 
                  kpis={[
                    { label: "Nombre d'élèves", value: 120, trend: "positive", period: "Depuis le mois dernier" },
                    { label: "Évaluations complétées", value: 45, trend: "negative", period: "Cette semaine" },
                    { label: "Taux de réussite", value: "86%", trend: "positive", period: "Ce trimestre" },
                    { label: "Nouvelles inscriptions", value: 15, trend: "positive", period: "Aujourd'hui" },
                  ]}
                />
              </div>


        {/* Page des classes */}
        {/* <TeacherPageHeader 
            title="Mes Classes" 
            subtitle="Gérez vos classes et élèves"
            showFilters={true}
            //   onFilter={() => setShowFilters(!showFilters)}
        /> */}

        {/* Page d'évaluations */}
        {/* <TeacherPageHeader 
            title="Évaluations en cours" 
            subtitle="2 évaluations actives"
            showExport={true}
            //   onExport={() => exportEvaluations()}
        /> */}
    </div>
  );
}