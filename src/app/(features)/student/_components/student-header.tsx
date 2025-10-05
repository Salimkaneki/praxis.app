'use client';
import React, { useState, useEffect } from "react";
import {
  BellIcon,
  UserIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  TrophyIcon,
  PlayIcon
} from "@heroicons/react/24/outline";
import { getStudentProfile, logoutStudent, StudentProfile } from "../../auth/sign-in/student/_services/auth.service";

export default function StudentHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [currentTimeString, setCurrentTimeString] = useState<string>("--:--");
  const [isClient, setIsClient] = useState(false);

  // Mise à jour de l'heure en temps réel - seulement côté client
  useEffect(() => {
    setIsClient(true);

    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      setCurrentTimeString(timeString);
    };

    updateTime(); // Update immediately
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Notifications adaptées pour les étudiants
  const notifications = [
    { id: 1, title: "Nouveau quiz disponible", time: "Il y a 5 min", unread: true, type: "quiz" },
    { id: 2, title: "Rappel: Devoir à rendre demain", time: "Il y a 1h", unread: true, type: "reminder" },
    { id: 3, title: "Notes du dernier quiz publiées", time: "Il y a 3h", unread: false, type: "grades" },
    { id: 4, title: "Cours annulé demain", time: "Hier", unread: false, type: "announcement" }
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  // Actions rapides pour le menu d'accès rapide
  const quickActions = [
    { icon: PlayIcon, label: "Commencer un quiz", color: "text-blue-600" },
    { icon: BookOpenIcon, label: "Mes cours", color: "text-green-600" },
    { icon: ChartBarIcon, label: "Mes résultats", color: "text-purple-600" },
    { icon: CalendarDaysIcon, label: "Mon emploi du temps", color: "text-orange-600" }
  ];

  // Récupération du profil étudiant depuis l'API
  useEffect(() => {
    const loadStudentProfile = async () => {
      try {
        setLoading(true);
        const profile = await getStudentProfile();
        setStudentProfile(profile);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        // En cas d'erreur, garder les données du localStorage si elles existent
      } finally {
        setLoading(false);
      }
    };

    loadStudentProfile();
  }, []);

  // Gestionnaire de déconnexion
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutStudent();
      // La redirection est gérée dans la fonction logoutStudent
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, forcer la déconnexion
      localStorage.removeItem('student_token');
      localStorage.removeItem('student_data');
      window.location.href = '/auth/sign-in/student';
    } finally {
      setLoggingOut(false);
    }
  };

  const getNotificationIcon = (type: "quiz" | "reminder" | "grades" | "announcement" | string): string => {
    switch (type) {
        case "quiz": return "📝";
        case "reminder": return "⏰";
        case "grades": return "📊";
        case "announcement": return "📢";
        default: return "📢";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">

      {/* Left side */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-poppins font-medium text-gray-900">Espace Étudiant</span>
          <div className="hidden lg:flex items-center space-x-1 px-2 py-1 bg-gray-50 rounded-md">
            <ClockIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-poppins text-gray-600">
              {isClient ? currentTimeString : '--:--'}
            </span>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Quick Access Menu */}
        <div className="relative">
          <button
            onClick={() => setShowQuickAccess(!showQuickAccess)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <PlayIcon className="w-5 h-5" />
          </button>
          {showQuickAccess && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-poppins font-medium text-gray-500 uppercase tracking-wide">
                  Accès rapide
                </div>
                {quickActions.map((action, index) => (
                  <button key={index} className="w-full px-3 py-2 text-left text-sm font-poppins text-gray-700 hover:bg-gray-50 flex items-center space-x-3 rounded-md transition-colors">
                    <action.icon className={`w-4 h-4 ${action.color}`} />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Messages/Communications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <BellIcon className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-poppins font-medium text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-poppins font-medium text-gray-900">{notification.title}</p>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs font-poppins text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-gray-100">
                <button className="text-sm font-poppins text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-forest-600 to-forest-700 rounded-full flex items-center justify-center">
              <span className="text-sm text-white font-poppins font-semibold">
                {(studentProfile?.name || "Étudiant").split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-poppins font-medium text-gray-900">{studentProfile?.name || "Étudiant"}</p>
              <p className="text-xs font-poppins text-gray-500">{studentProfile?.account_type || "Étudiant"}</p>
            </div>
            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-poppins font-medium text-gray-900">{studentProfile?.name || "Étudiant"}</p>
                  <p className="text-xs font-poppins text-gray-500">{studentProfile?.email || ""}</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      studentProfile?.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {studentProfile?.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>

                <button className="w-full px-4 py-2 text-left text-sm font-poppins text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                  <UserIcon className="w-4 h-4" />
                  <span>Mon profil</span>
                </button>

                <button className="w-full px-4 py-2 text-left text-sm font-poppins text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                  <AcademicCapIcon className="w-4 h-4" />
                  <span>Mes cours</span>
                </button>

                <button className="w-full px-4 py-2 text-left text-sm font-poppins text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                  <TrophyIcon className="w-4 h-4" />
                  <span>Mes résultats</span>
                </button>

                <button className="w-full px-4 py-2 text-left text-sm font-poppins text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                  <ChartBarIcon className="w-4 h-4" />
                  <span>Mes statistiques</span>
                </button>

                <button className="w-full px-4 py-2 text-left text-sm font-poppins text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                  <Cog6ToothIcon className="w-4 h-4" />
                  <span>Préférences</span>
                </button>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full px-4 py-2 text-left text-sm font-poppins text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors disabled:opacity-50"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>{loggingOut ? 'Déconnexion...' : 'Se déconnecter'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside handler */}
      {(showUserMenu || showNotifications || showQuickAccess) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
            setShowQuickAccess(false);
          }}
        />
      )}
    </header>
  );
}