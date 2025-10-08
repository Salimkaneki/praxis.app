'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  PlayIcon,
  TrophyIcon,
  UserIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  StarIcon,
  KeyIcon
} from "@heroicons/react/24/outline";

type SectionKey = 'evaluations' | 'resultats' | 'communication' | 'profil';
type ActiveSection =
  | 'dashboard'
  | 'quiz-disponibles'
  | 'rejoindre-quiz'
  | 'quiz-en-cours'
  | 'mes-resultats'
  | 'statistiques'
  | 'messagerie'
  | 'annonces'
  | 'mon-profil'
  | 'parametres';

export default function StudentSideBar() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    evaluations: true,
    resultats: false,
    communication: false,
    profil: false,
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
      'quiz-disponibles': '/student/sessions',
      'rejoindre-quiz': '/student/join-session',
      'quiz-en-cours': '/student/quizzes/live',
      'mes-resultats': '/student/results',
      'mon-profil': '/student/profile',
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
      key: 'evaluations' as SectionKey,
      title: 'Évaluations',
      icon: PlayIcon,
      items: [
        {
          key: 'quiz-disponibles' as ActiveSection,
          label: 'Quiz disponibles',
          icon: PlayIcon,
          highlight: true
        },
        {
          key: 'rejoindre-quiz' as ActiveSection,
          label: 'Rejoindre un quiz',
          icon: KeyIcon
        },
        {
          key: 'quiz-en-cours' as ActiveSection,
          label: 'Quiz en cours',
          icon: () => <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        },
      ],
    },
    {
      key: 'resultats' as SectionKey,
      title: 'Résultats & Progression',
      icon: TrophyIcon,
      items: [
        {
          key: 'mes-resultats' as ActiveSection,
          label: 'Mes notes & résultats',
          icon: TrophyIcon
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
          icon: ChatBubbleLeftRightIcon
        },
        {
          key: 'annonces' as ActiveSection,
          label: 'Annonces de classe',
          icon: BellIcon
        },
      ],
    },
    {
      key: 'profil' as SectionKey,
      title: 'Mon Profil',
      icon: UserIcon,
      items: [
        {
          key: 'mon-profil' as ActiveSection,
          label: 'Informations personnelles',
          icon: UserIcon
        },
        {
          key: 'parametres' as ActiveSection,
          label: 'Paramètres',
          icon: Cog6ToothIcon
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
      </nav>
    </div>
  );
}