'use client'
import React, { useState } from "react";
import { 
  HomeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  DocumentChartBarIcon,
  BellAlertIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UsersIcon,
  PresentationChartLineIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

type SectionKey = 'pedagogie' | 'evaluations' | 'rapports' | 'administration';
type ActiveSection = 'dashboard' | 'professeurs' | 'etudiants' | 'formations' | 'planning' |
  'evaluations-live' | 'evaluations-programmees' | 'resultats' | 
  'analytics' | 'utilisateurs' | 'parametres';

export default function SimplifiedSideBar() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    pedagogie: true,
    evaluations: false,
    rapports: false,
    administration: false
  });

  const toggleSection = (sectionKey: SectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const menuSections = [
    {
      key: 'pedagogie' as SectionKey,
      title: 'Pédagogie',
      icon: AcademicCapIcon,
      items: [
        { key: 'professeurs' as ActiveSection, label: 'Professeurs', icon: UserIcon },
        { key: 'etudiants' as ActiveSection, label: 'Étudiants', icon: UsersIcon },
        { key: 'formations' as ActiveSection, label: 'Formations', icon: BookOpenIcon },
        { key: 'planning' as ActiveSection, label: 'Planning', icon: CalendarDaysIcon }
      ]
    },
    {
      key: 'evaluations' as SectionKey,
      title: 'Évaluations',
      icon: PresentationChartLineIcon,
      items: [
        { 
          key: 'evaluations-live' as ActiveSection, 
          label: 'En cours', 
          icon: () => <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        },
        { key: 'evaluations-programmees' as ActiveSection, label: 'Programmées', icon: ClockIcon },
        { key: 'resultats' as ActiveSection, label: 'Résultats', icon: DocumentChartBarIcon }
      ]
    },
    {
      key: 'rapports' as SectionKey,
      title: 'Analytics',
      icon: ChartBarIcon,
      items: [
        { key: 'analytics' as ActiveSection, label: 'Rapports & Statistiques', icon: ChartBarIcon }
      ]
    },
    {
      key: 'administration' as SectionKey,
      title: 'Administration',
      icon: Cog6ToothIcon,
      items: [
        { key: 'utilisateurs' as ActiveSection, label: 'Utilisateurs', icon: UsersIcon },
        { key: 'parametres' as ActiveSection, label: 'Paramètres', icon: Cog6ToothIcon }
      ]
    }
  ];

  const renderMenuItem = (item: any) => {
    const IconComponent = item.icon;
    const isActive = activeSection === item.key;
    
    return (
      <button
        key={item.key}
        onClick={() => setActiveSection(item.key)}
        className={`w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center space-x-2 ${
          isActive 
            ? 'bg-forest-50 text-forest-700' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        {typeof IconComponent === 'function' ? 
          <IconComponent /> : 
          <IconComponent className="w-4 h-4" />
        }
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <span className="font-pacifico text-4xl font-semibold text-gray-900">Praxis</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {/* Dashboard */}
        <div className="mb-6">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
              activeSection === 'dashboard' 
                ? 'bg-forest-50 text-forest-700 border border-forest-200' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="font-medium">Tableau de bord</span>
          </button>
        </div>

        {/* Menu Sections */}
        {menuSections.map((section) => {
          const SectionIcon = section.icon;
          const isExpanded = expandedSections[section.key];
          
          return (
            <div key={section.key} className="mb-6">
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mb-2"
              >
                <div className="flex items-center space-x-3">
                  <SectionIcon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{section.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              {isExpanded && (
                <div className="ml-8 space-y-1">
                  {section.items.map(renderMenuItem)}
                </div>
              )}
            </div>
          );
        })}

        {/* Footer */}
        {/* <div className="border-t border-gray-100 pt-4 mt-8">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50">
            <div className="w-8 h-8 bg-gradient-to-r from-forest-500 to-forest-700 rounded-full flex items-center justify-center">
              <span className="text-sm text-white font-semibold">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Administrateur</p>
              <p className="text-xs text-gray-500 truncate">Université de Lomé</p>
            </div>
          </div>
        </div> */}
      </nav>
    </div>
  );
}