'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  UserGroupIcon,
  PresentationChartLineIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  EyeIcon,
  DocumentChartBarIcon,
  UsersIcon,
  BellIcon,
  StarIcon
} from "@heroicons/react/24/outline";

type SectionKey = 'matieres' | 'evaluations' | 'communication' | 'ressources';
type ActiveSection = 
  | 'dashboard'
  | 'mes-matieres'
  | 'creation-evaluation'
  | 'mes-quiz'
  | 'evaluation-en-cours'
  | 'resultats-notes'
  | 'banque-questions'
  | 'cours-lecons'
  | 'ressources'
  | 'devoirs-maison'
  | 'cahier-texte'
  | 'notifications'
  | 'archivage'
  | 'parametres';

export default function TeacherSideBar() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    matieres: true,
    evaluations: false,
    communication: false,
    ressources: false,
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
    // Navigation routes pour les professeurs
    const routes = {
      'dashboard': '/teachers-dashboard',
      'mes-matieres': '/teachers-dashboard/matieres',
      'creation-evaluation': '/teachers-dashboard/quizzes/create',
      'mes-quiz': '/teachers-dashboard/quizzes',
      'evaluation-en-cours': '/teachers-dashboard/sessions',
      'resultats-notes': '/teachers-dashboard/results',
      'banque-questions': '/teachers-dashboard/quizzes/banque-questions',
      'cours-lecons': '/teachers-dashboard/cours',
      'ressources': '/teachers-dashboard/ressources',
      'devoirs-maison': '/teachers-dashboard/devoirs',
      'cahier-texte': '/teachers-dashboard/cahier-texte',
      'messagerie': '/teachers-dashboard/messagerie',
      'annonces': '/teachers-dashboard/annonces',
      'reunions-parents': '/teachers-dashboard/reunions',
      'parametres': '/teachers-dashboard/parametres',
      'notifications': '/teachers-dashboard/notifications',
      'archivage': '/teachers-dashboard/archivage'
    };

    const route = routes[key];
    if (route) {
      router.push(route);
    }
  };

  const menuSections = [
    {
      key: 'matieres' as SectionKey,
      title: 'Mes Matières',
      icon: BookOpenIcon,
      items: [
        { 
          key: 'mes-matieres' as ActiveSection, 
          label: 'Matières assignées', 
          icon: AcademicCapIcon
        },
      ],
    },
    {
      key: 'evaluations' as SectionKey,
      title: 'Évaluations & Quiz',
      icon: PresentationChartLineIcon,
      items: [
        { 
          key: 'creation-evaluation' as ActiveSection, 
          label: 'Créer un quiz', 
          icon: PlusIcon,
          highlight: true
        },
        {
          key: 'mes-quiz' as ActiveSection,
          label: 'Mes quiz',
          icon: DocumentTextIcon
        },
        {
          key: 'evaluation-en-cours' as ActiveSection,
          label: 'Sessions d\'examen',
          icon: () => <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        },
        { 
          key: 'resultats-notes' as ActiveSection, 
          label: 'Résultats & Notes', 
          icon: DocumentChartBarIcon
        },
      ],
    },
    {
      key: 'communication' as SectionKey,
      title: 'Communication',
      icon: ChatBubbleLeftRightIcon,
      items: [
        { 
          key: 'messagerie' as ActiveSection, 
          label: 'Messagerie', 
          icon: ChatBubbleLeftRightIcon
        },
        { 
          key: 'annonces' as ActiveSection, 
          label: 'Annonces de classe', 
          icon: BellIcon 
        },
        { 
          key: 'reunions-parents' as ActiveSection, 
          label: 'Rendez-vous parents', 
          icon: CalendarDaysIcon
        },
      ],
    },
    {
      key: 'ressources' as SectionKey,
      title: 'Outils & Ressources',
      icon: Cog6ToothIcon,
      items: [
        { 
          key: 'banque-questions' as ActiveSection, 
          label: 'Banque de questions', 
          icon: DocumentDuplicateIcon 
        },
        { 
          key: 'ressources' as ActiveSection, 
          label: 'Ressources pédagogiques', 
          icon: StarIcon 
        },
        { 
          key: 'devoirs-maison' as ActiveSection, 
          label: 'Devoirs maison', 
          icon: DocumentTextIcon 
        },
        { 
          key: 'archivage' as ActiveSection, 
          label: 'Archivage', 
          icon: ClockIcon 
        },
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
        className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all duration-200 flex items-center space-x-3 group ${
          isActive
            ? 'bg-forest-50 text-forest-700 border border-forest-200 shadow-sm'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        {typeof IconComponent === 'function' ? (
          <IconComponent />
        ) : (
          <IconComponent className={`w-4 h-4 ${isActive ? 'text-forest-600' : 'text-gray-500'} group-hover:text-gray-700`} />
        )}
        <span className={`font-poppins ${item.highlight ? 'font-medium' : ''}`}>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-pacifico font-semibold text-gray-900">Praxis</span>
          <span className="px-2 py-1 bg-forest-100 text-forest-700 text-xs font-medium rounded-full">
            Prof
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
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <HomeIcon className={`w-5 h-5 ${activeSection === 'dashboard' ? 'text-forest-600' : 'text-gray-500'}`} />
            <span className="font-poppins font-medium">Tableau de bord</span>
          </button>
        </div>

        {/* Menu Sections */}
        <div className="space-y-6">
          {menuSections.map((section) => {
            const SectionIcon = section.icon;
            const isExpanded = expandedSections[section.key];

            return (
              <div key={section.key}>
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mb-2"
                >
                  <div className="flex items-center space-x-3">
                    <SectionIcon className="w-5 h-5 text-gray-500" />
                    <span className="font-poppins font-medium">{section.title}</span>
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
        </div>

        {/* Settings */}
        <div className="mt-6">
          <button
            onClick={() => handleNavigation('parametres')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
              activeSection === 'parametres'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Cog6ToothIcon className="w-5 h-5 text-gray-500" />
            <span className="font-poppins">Paramètres</span>
          </button>
        </div>
      </nav>
    </div>
  );
}