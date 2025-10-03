'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  HomeIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UsersIcon,
  PresentationChartLineIcon,
  DocumentChartBarIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

type SectionKey = 'gestion' | 'evaluations' | 'rapports' | 'administration';
type ActiveSection =
  | 'dashboard'
  | 'professeurs'
  | 'etudiant'
  | 'formation' 
  | 'formation-classes'
  | 'subject'
  | 'evaluations-live'
  | 'evaluations-programmees'
  | 'resultats'
  | 'analytics'
  | 'examens-programmes'
  | 'utilisateurs'
  | 'parametres';

export default function AdminSideBar() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    gestion: true,
    evaluations: false,
    rapports: false,
    administration: false,
  });

  const router = useRouter();

  const toggleSection = (sectionKey: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleNavigation = (key: ActiveSection) => {
    setActiveSection(key);

    // Routes de navigation
    const routes = {
      'dashboard': '/dashboard',
      'professeurs': '/dashboard/teacher',
      'etudiant': '/dashboard/student', 
      'formation': '/dashboard/formation',
      'formation-classes': '/dashboard/formation/classe',
      'subject': '/dashboard/subject',
      'evaluations-live': '/dashboard/evaluations/live',
      'evaluations-programmees': '/dashboard/evaluations/programmees',
      'resultats': '/dashboard/evaluations/resultats',
      'analytics': '/dashboard/analytics',
      'examens-programmes': '/dashboard/analytics/examens-programmes',
      'utilisateurs': '/dashboard/administration/utilisateurs',
      'parametres': '/dashboard/administration/parametres'
    };

    const route = routes[key];
    if (route) {
      router.push(route);
    }
  };

  const menuSections = [
    {
      key: 'gestion' as SectionKey,
      title: 'Gestion Académique',
      icon: AcademicCapIcon,
      items: [
        { key: 'professeurs' as ActiveSection, label: 'Professeurs', icon: UserIcon },
        { key: 'etudiant' as ActiveSection, label: 'Étudiants', icon: UsersIcon },
        { key: 'formation' as ActiveSection, label: 'Formations', icon: BookOpenIcon },
        { key: 'formation-classes' as ActiveSection, label: 'Classes', icon: AcademicCapIcon },
        { key: 'subject' as ActiveSection, label: 'Matières', icon: DocumentChartBarIcon },
      ],
    },
    {
      key: 'evaluations' as SectionKey,
      title: 'Évaluations',
      icon: PresentationChartLineIcon,
      items: [
        {
          key: 'evaluations-live' as ActiveSection,
          label: 'En cours',
          icon: () => <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>,
        },
        { key: 'evaluations-programmees' as ActiveSection, label: 'Programmées', icon: ClockIcon },
        { key: 'resultats' as ActiveSection, label: 'Résultats', icon: DocumentChartBarIcon },
      ],
    },
    {
      key: 'rapports' as SectionKey,
      title: 'Analytics & Rapports',
      icon: ChartBarIcon,
      items: [
        { key: 'analytics' as ActiveSection, label: 'Statistiques & Analyses', icon: ChartBarIcon },
        { key: 'examens-programmes' as ActiveSection, label: 'Examens Programmés', icon: ClockIcon },
      ],
    },
    {
      key: 'administration' as SectionKey,
      title: 'Administration Système',
      icon: Cog6ToothIcon,
      items: [
        { key: 'utilisateurs' as ActiveSection, label: 'Gestion des Utilisateurs', icon: UsersIcon },
        { key: 'parametres' as ActiveSection, label: 'Paramètres Système', icon: Cog6ToothIcon },
      ],
    },
  ];

  const renderMenuItem = (item: any) => {
    const IconComponent = item.icon;
    const isActive = activeSection === item.key;

    return (
      <button
        key={item.key}
        onClick={() => handleNavigation(item.key)}
        className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all duration-200 flex items-center space-x-3 ${
          isActive
            ? 'bg-forest-50 text-forest-700 border border-forest-200 shadow-sm'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
        }`}
      >
        {typeof IconComponent === 'function' ? (
          <IconComponent />
        ) : (
          <IconComponent className="w-4 h-4 flex-shrink-0" />
        )}
        <span className="font-poppins font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-forest-50 to-white">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-pacifico font-semibold text-forest-700">Praxis</span>
          <span className="text-xs bg-forest-100 text-forest-600 px-2 py-1 rounded-full font-medium">
            Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {/* Dashboard */}
        <div className="mb-6">
          <button
            onClick={() => handleNavigation('dashboard')}
            className={`w-full flex items-center space-x-3 px-3 py-3 text-sm rounded-lg transition-all duration-200 ${
              activeSection === 'dashboard'
                ? 'bg-forest-50 text-forest-700 border border-forest-200 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="font-poppins font-semibold">Tableau de bord</span>
          </button>
        </div>

        {/* Menu Sections */}
        <div className="space-y-4">
          {menuSections.map((section) => {
            const SectionIcon = section.icon;
            const isExpanded = expandedSections[section.key];

            return (
              <div key={section.key} className="border-b border-gray-50 pb-4 last:border-b-0">
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 mb-3 group"
                >
                  <div className="flex items-center space-x-3">
                    <SectionIcon className="w-5 h-5 text-gray-500 group-hover:text-forest-600 transition-colors" />
                    <span className="font-poppins font-semibold">{section.title}</span>
                  </div>
                  <div className="transform transition-transform duration-200">
                    {isExpanded ? (
                      <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="ml-4 space-y-1 animate-fadeIn">
                    {section.items.map(renderMenuItem)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>



      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}