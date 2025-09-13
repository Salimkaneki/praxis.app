"use client";

import React, { ReactNode } from "react";
import TeacherHeader from "./_components/teacher-header";
import TeacherSideBar from "./_components/teacher-sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
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
  );
}
