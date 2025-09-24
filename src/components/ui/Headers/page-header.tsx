'use client'
import React from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ActionButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

interface BackButtonProps {
  onClick?: () => void;
  label?: string;
}

interface TeacherPageHeaderProps {
  title: string;
  subtitle?: string;
  showFilters?: boolean;
  showExport?: boolean;
  showDate?: boolean;
  onFilter?: () => void;
  onExport?: () => void;
  children?: React.ReactNode;
  actionButton?: ActionButtonProps;
  backButton?: BackButtonProps; // 👈 nouvelle prop
}

export default function TeacherPageHeader({
  title,
  subtitle,
  showFilters = true,
  showExport = true,
  showDate = true,
  onFilter,
  onExport,
  children,
  actionButton,
  backButton
}: TeacherPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Partie gauche : bouton retour + titre */}
          <div className="flex items-center gap-4">
            {backButton && (
              <button
                onClick={backButton.onClick ?? (() => router.back())}
                className="inline-flex items-center p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 focus:outline-none transition-smooth"
              >
                <ArrowLeft className="w-5 h-5" />
                {backButton.label && (
                  <span className="ml-2 text-sm font-poppins">{backButton.label}</span>
                )}
              </button>
            )}
            <div>
              <h1 className="text-2xl font-poppins font-semibold text-gray-900">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm font-poppins text-gray-600 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Bouton d'action */}
          {actionButton && (
            <div className="flex items-center space-x-3">
              <button
                onClick={actionButton.onClick}
                disabled={actionButton.disabled}
                className={`inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-smooth ${
                  actionButton.disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {actionButton.icon ?? <Plus className="w-4 h-4 mr-2" />}
                {actionButton.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}