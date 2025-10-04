import React, { ReactNode } from "react";
import type { Metadata } from "next";
import TeacherHeader from "./_components/teacher-header";
import TeacherSideBar from "./_components/teacher-sidebar";
import { QuizProvider } from "./_contexts/quiz-context";

export const metadata: Metadata = {
  title: "Praxis - Enseignant",
  description: "Créez et gérez vos évaluations interactives",
};

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <QuizProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <TeacherSideBar />

        {/* Main Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <TeacherHeader />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
              {children}</main>
        </div>
      </div>
    </QuizProvider>
  );
}
