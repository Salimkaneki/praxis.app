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
  ClockIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";

type SectionKey = 'pedagogique' | 'utilisateurs' | 'evaluations' | 'analytics' | 'administration';
type ActiveSection =
  | 'dashboard'
  | 'formations'
  | 'classes'
  | 'matieres'
  | 'professeurs'
  | 'etudiants'
  | 'liste-utilisateurs'
  | 'creer-utilisateur'
  | 'evaluations-live'
  | 'evaluations-programmees'
  | 'resultats'
  | 'statistiques'
  | 'rapports-examens'
  | 'analyses-detaillees'
  | 'gestion-utilisateurs'
  | 'parametres-systeme';

export default function AdminSideBar() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    pedagogique: true,
    utilisateurs: false,
    evaluations: false,
    analytics: false,
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
      'formations': '/dashboard/formation',
      'classes': '/dashboard/formation/classe',
      'matieres': '/dashboard/subject',
      'professeurs': '/dashboard/teacher',
      'etudiants': '/dashboard/student',
      'liste-utilisateurs': '/dashboard/user',
      'creer-utilisateur': '/dashboard/user/create',
      'evaluations-live': '/dashboard/evaluations/live',
      'evaluations-programmees': '/dashboard/evaluations/programmees',
      'resultats': '/dashboard/evaluations/resultats',
      'statistiques': '/dashboard/analytics',
      'rapports-examens': '/dashboard/analytics/examens-programmes',
      'analyses-detaillees': '/dashboard/analytics/detaillees',
      'gestion-utilisateurs': '/dashboard/user',
      'parametres-systeme': '/dashboard/administration/parametres'
    };

    const route = routes[key];
    if (route) {
      router.push(route);
    }
  };

  const menuSections = [
    {
      key: 'pedagogique' as SectionKey,
      title: 'Gestion Pédagogique',
      icon: AcademicCapIcon,
      items: [
        { key: 'formations' as ActiveSection, label: 'Formations', icon: BookOpenIcon },
        { key: 'classes' as ActiveSection, label: 'Classes', icon: AcademicCapIcon },
        { key: 'matieres' as ActiveSection, label: 'Matières', icon: DocumentChartBarIcon },
      ],
    },
    {
      key: 'utilisateurs' as SectionKey,
      title: 'Gestion des Utilisateurs',
      icon: UsersIcon,
      items: [
        { key: 'professeurs' as ActiveSection, label: 'Professeurs', icon: UserIcon },
        { key: 'etudiants' as ActiveSection, label: 'Étudiants', icon: UsersIcon },
        { key: 'liste-utilisateurs' as ActiveSection, label: 'Liste des utilisateurs', icon: UsersIcon },
        { key: 'creer-utilisateur' as ActiveSection, label: 'Créer un utilisateur', icon: UserPlusIcon },
      ],
    },
    {
      key: 'evaluations' as SectionKey,
      title: 'Évaluations & Examens',
      icon: PresentationChartLineIcon,
      items: [
        {
          key: 'evaluations-live' as ActiveSection,
          label: 'Évaluations en cours',
          icon: () => <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>,
        },
        { key: 'evaluations-programmees' as ActiveSection, label: 'Évaluations programmées', icon: ClockIcon },
        { key: 'resultats' as ActiveSection, label: 'Résultats & Corrections', icon: DocumentChartBarIcon },
      ],
    },
    {
      key: 'analytics' as SectionKey,
      title: 'Analytics & Rapports',
      icon: ChartBarIcon,
      items: [
        { key: 'statistiques' as ActiveSection, label: 'Statistiques générales', icon: ChartBarIcon },
        { key: 'rapports-examens' as ActiveSection, label: 'Rapports d\'examens', icon: PresentationChartLineIcon },
        { key: 'analyses-detaillees' as ActiveSection, label: 'Analyses détaillées', icon: DocumentChartBarIcon },
      ],
    },
    {
      key: 'administration' as SectionKey,
      title: 'Administration Système',
      icon: Cog6ToothIcon,
      items: [
        { key: 'gestion-utilisateurs' as ActiveSection, label: 'Gestion des utilisateurs', icon: UsersIcon },
        { key: 'parametres-systeme' as ActiveSection, label: 'Paramètres système', icon: Cog6ToothIcon },
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
        <div className="space-y-6">
          {menuSections.map((section) => {
            const SectionIcon = section.icon;
            const isExpanded = expandedSections[section.key];

            return (
              <div key={section.key} className="border-b border-gray-100 pb-4 last:border-b-0">
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 mb-3 group"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <SectionIcon className="w-5 h-5 text-gray-500 group-hover:text-forest-600 transition-colors flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-poppins font-semibold text-gray-900 truncate">{section.title}</div>
                    </div>
                  </div>
                  <div className="transform transition-transform duration-200 flex-shrink-0">
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