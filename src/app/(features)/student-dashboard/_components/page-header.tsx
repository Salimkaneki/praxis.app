import React from "react";
import { GraduationCap } from "lucide-react";

interface StudentPageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function StudentPageHeader({ title, subtitle }: StudentPageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 bg-forest-100 rounded-lg">
          <GraduationCap className="w-6 h-6 text-forest-600" />
        </div>
        <div>
          <h1 className="text-2xl font-poppins font-semibold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}