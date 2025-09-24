import React from 'react';
import type { Metadata } from "next";
import SideBar from "./_components/sidebar";
import DashboardHeader from "./_components/header";

export const metadata: Metadata = {
  title: "Praxis - Administration",
  description: "Gestion des classes, matières et résultats d'évaluation",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}