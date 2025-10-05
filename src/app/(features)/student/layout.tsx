import React, { ReactNode } from "react";
import type { Metadata } from "next";
import StudentHeader from "./_components/student-header";
import StudentSideBar from "./_components/student-sidebar";
import { StudentSessionContextProvider } from "../../../contexts/student-session-context";

export const metadata: Metadata = {
  title: "Praxis - Étudiant",
  description: "Accédez à vos cours et évaluations",
};

type StudentDashboardLayoutProps = {
  children: ReactNode;
};

export default function StudentDashboardLayout({ children }: StudentDashboardLayoutProps) {
  return (
    <StudentSessionContextProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <StudentSideBar />

        {/* Main Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <StudentHeader />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </StudentSessionContextProvider>
  );
}