'use client'
import React from "react";
import { Filter, Download } from "lucide-react";

interface TeacherPageHeaderProps {
  title: string;
  subtitle?: string;
  showFilters?: boolean;
  showExport?: boolean;
  showDate?: boolean;
  onFilter?: () => void;
  onExport?: () => void;
  children?: React.ReactNode;
}

export default function TeacherPageHeader({
  title,
  subtitle,
  showFilters = true,
  showExport = true,
  showDate = true,
  onFilter,
  onExport,
  children
}: TeacherPageHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
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
          
          {/* <div className="flex items-center space-x-3">
            {showFilters && (
              <button 
                onClick={onFilter}
                className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </button>
            )}
            
            {showExport && (
              <button 
                onClick={onExport}
                className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
            )}
            
            {children}
            
            {showDate && (
              <div className="text-sm font-poppins text-gray-500">
                {new Date().toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}