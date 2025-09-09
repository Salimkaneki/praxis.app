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

type SectionKey = 'classes' | 'evaluations' | 'pedagogie' | 'communication' | 'analyses';
type ActiveSection = 
  | 'dashboard'
  | 'mes-classes'
  | 'gestion-eleves'
  | 'creation-evaluation'
  | 'evaluation-en-cours'
  | 'resultats-notes'
  | 'banque-questions'
  | 'cours-lecons'
  | 'ressources'
  | 'devoirs-maison'
  | 'cahier-texte'
  | 'statistiques-classe'
  | 'progression-eleves'
  | 'comparaisons'
  | 'export-notes'
  | 'notifications'
  | 'archivage'
  | 'parametres';

export default function TeacherSideBar() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    classes: true,
    evaluations: false,
    pedagogie: false,
    communication: false,
    analyses: false,
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
      'dashboard': '/teacher',
      'mes-classes': '/teacher/classes',
      'gestion-eleves': '/teacher/eleves',
      'creation-evaluation': '/teacher/evaluations/create',
      'evaluation-en-cours': '/teacher/evaluations/live',
      'resultats-notes': '/teacher/evaluations/resultats',
      'banque-questions': '/teacher/evaluations/banque-questions',
      'cours-lecons': '/teacher/cours',
      'ressources': '/teacher/ressources',
      'devoirs-maison': '/teacher/devoirs',
      'cahier-texte': '/teacher/cahier-texte',
      'messagerie': '/teacher/messagerie',
      'annonces': '/teacher/annonces',
      'reunions-parents': '/teacher/reunions',
      'statistiques-classe': '/teacher/statistiques',
      'progression-eleves': '/teacher/progression',
      'parametres': '/teacher/parametres',
      'comparaisons': '/teacher/comparaisons',
      'export-notes': '/teacher/export-notes',
      'notifications': '/teacher/notifications',
      'archivage': '/teacher/archivage'
    };

    const route = routes[key];
    if (route) {
      router.push(route);
    }
  };

  const menuSections = [
    {
      key: 'classes' as SectionKey,
      title: 'Mes Classes',
      icon: UserGroupIcon,
      items: [
        { 
          key: 'mes-classes' as ActiveSection, 
          label: 'Vue d\'ensemble', 
          icon: UsersIcon,
          badge: '5 classes'
        },
        { 
          key: 'gestion-eleves' as ActiveSection, 
          label: 'Gestion des élèves', 
          icon: UserGroupIcon,
          badge: '156 élèves'
        },
      ],
    },
    {
      key: 'evaluations' as SectionKey,
      title: 'Évaluations & Notes',
      icon: PresentationChartLineIcon,
      items: [
        { 
          key: 'creation-evaluation' as ActiveSection, 
          label: 'Créer une évaluation', 
          icon: PlusIcon,
          highlight: true
        },
        {
          key: 'evaluation-en-cours' as ActiveSection,
          label: 'Évaluations en cours',
          icon: () => <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>,
          badge: '2 actives'
        },
        { 
          key: 'resultats-notes' as ActiveSection, 
          label: 'Notes & Résultats', 
          icon: DocumentChartBarIcon,
          badge: '12 à corriger'
        },
        { 
          key: 'banque-questions' as ActiveSection, 
          label: 'Banque de questions', 
          icon: DocumentDuplicateIcon 
        },
      ],
    },
    {
      key: 'pedagogie' as SectionKey,
      title: 'Pédagogie',
      icon: AcademicCapIcon,
      items: [
        { 
          key: 'cours-lecons' as ActiveSection, 
          label: 'Mes cours & leçons', 
          icon: BookOpenIcon 
        },
        { 
          key: 'ressources' as ActiveSection, 
          label: 'Ressources pédagogiques', 
          icon: DocumentTextIcon 
        },
        { 
          key: 'devoirs-maison' as ActiveSection, 
          label: 'Devoirs & Exercices', 
          icon: ClipboardDocumentListIcon,
          badge: '8 en attente'
        },
        { 
          key: 'cahier-texte' as ActiveSection, 
          label: 'Cahier de texte', 
          icon: CalendarDaysIcon 
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
          icon: ChatBubbleLeftRightIcon,
          badge: '3'
        },
        { 
          key: 'annonces' as ActiveSection, 
          label: 'Annonces de classe', 
          icon: BellIcon 
        },
        { 
          key: 'reunions-parents' as ActiveSection, 
          label: 'Rendez-vous parents', 
          icon: CalendarDaysIcon,
          badge: '5 programmés'
        },
      ],
    },
    {
      key: 'analyses' as SectionKey,
      title: 'Analyses & Suivi',
      icon: ChartBarIcon,
      items: [
        { 
          key: 'statistiques-classe' as ActiveSection, 
          label: 'Statistiques de classe', 
          icon: ChartBarIcon 
        },
        { 
          key: 'progression-eleves' as ActiveSection, 
          label: 'Progression des élèves', 
          icon: StarIcon 
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
        className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all duration-200 flex items-center justify-between group ${
          isActive
            ? 'bg-forest-50 text-forest-700 border border-forest-200 shadow-sm'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <div className="flex items-center space-x-3">
          {typeof IconComponent === 'function' ? (
            <IconComponent />
          ) : (
            <IconComponent className={`w-4 h-4 ${isActive ? 'text-forest-600' : 'text-gray-500'} group-hover:text-gray-700`} />
          )}
          <span className={`font-poppins ${item.highlight ? 'font-medium' : ''}`}>{item.label}</span>
        </div>
        
        {item.badge && (
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            isActive 
              ? 'bg-forest-100 text-forest-700' 
              : item.highlight
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
          }`}>
            {item.badge}
          </span>
        )}
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

        {/* Footer - Quick Stats */}
        <div className="mt-8 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs font-poppins text-gray-500 mb-2">Statistiques rapides</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-poppins">
              <span className="text-gray-600">Évaluations cette semaine</span>
              <span className="font-medium text-gray-900">8</span>
            </div>
            <div className="flex justify-between text-xs font-poppins">
              <span className="text-gray-600">Notes à saisir</span>
              <span className="font-medium text-orange-600">12</span>
            </div>
            <div className="flex justify-between text-xs font-poppins">
              <span className="text-gray-600">Messages non lus</span>
              <span className="font-medium text-forest-600">3</span>
            </div>
          </div>
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