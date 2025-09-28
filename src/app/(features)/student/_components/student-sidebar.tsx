'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  BookOpenIcon,
  PlayIcon,
  TrophyIcon,
  UserIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  StarIcon
} from "@heroicons/react/24/outline";

type SectionKey = 'courses' | 'quizzes' | 'results' | 'communication';
type ActiveSection =
  | 'dashboard'
  | 'mes-cours'
  | 'quiz-disponibles'
  | 'quiz-en-cours'
  | 'mes-resultats'
  | 'mon-profil'
  | 'emploi-du-temps'
  | 'messagerie'
  | 'annonces'
  | 'statistiques'
  | 'parametres';

export default function StudentSideBar() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    courses: true,
    quizzes: false,
    results: false,
    communication: false,
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
    // Navigation routes pour les étudiants
    const routes = {
      'dashboard': '/student',
      'mes-cours': '/student/courses',
      'quiz-disponibles': '/student/sessions',
      'quiz-en-cours': '/student/quizzes/live',
      'mes-resultats': '/student/results',
      'mon-profil': '/student/profile',
      'emploi-du-temps': '/student/schedule',
      'messagerie': '/student/messages',
      'annonces': '/student/announcements',
      'statistiques': '/student/statistics',
      'parametres': '/student/settings'
    };

    const route = routes[key];
    if (route) {
      router.push(route);
    }
  };

  const menuSections = [
    {
      key: 'courses' as SectionKey,
      title: 'Mes Cours',
      icon: BookOpenIcon,
      items: [
        {
          key: 'mes-cours' as ActiveSection,
          label: 'Vue d\'ensemble',
          icon: AcademicCapIcon,
          badge: '6 cours'
        },
        {
          key: 'emploi-du-temps' as ActiveSection,
          label: 'Emploi du temps',
          icon: CalendarDaysIcon
        },
      ],
    },
    {
      key: 'quizzes' as SectionKey,
      title: 'Quiz & Évaluations',
      icon: PlayIcon,
      items: [
        {
          key: 'quiz-disponibles' as ActiveSection,
          label: 'Quiz disponibles',
          icon: PlayIcon,
          badge: '3 nouveaux',
          highlight: true
        },
        {
          key: 'quiz-en-cours' as ActiveSection,
          label: 'Quiz en cours',
          icon: () => <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>,
          badge: '1 actif'
        },
      ],
    },
    {
      key: 'results' as SectionKey,
      title: 'Résultats & Progression',
      icon: TrophyIcon,
      items: [
        {
          key: 'mes-resultats' as ActiveSection,
          label: 'Mes notes & résultats',
          icon: TrophyIcon,
          badge: '87% moy.'
        },
        {
          key: 'statistiques' as ActiveSection,
          label: 'Mes statistiques',
          icon: ChartBarIcon
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
          badge: '2'
        },
        {
          key: 'annonces' as ActiveSection,
          label: 'Annonces de classe',
          icon: BellIcon,
          badge: '5'
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
            Étudiant
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
              <span className="text-gray-600">Quiz cette semaine</span>
              <span className="font-medium text-gray-900">5</span>
            </div>
            <div className="flex justify-between text-xs font-poppins">
              <span className="text-gray-600">Score moyen</span>
              <span className="font-medium text-green-600">87%</span>
            </div>
            <div className="flex justify-between text-xs font-poppins">
              <span className="text-gray-600">Messages non lus</span>
              <span className="font-medium text-forest-600">2</span>
            </div>
          </div>
        </div>

        {/* Profile & Settings */}
        <div className="mt-6 space-y-1">
          <button
            onClick={() => handleNavigation('mon-profil')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
              activeSection === 'mon-profil'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <UserIcon className="w-5 h-5 text-gray-500" />
            <span className="font-poppins">Mon profil</span>
          </button>

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