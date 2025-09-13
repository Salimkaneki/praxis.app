'use client';
import React, { useState, useEffect } from "react";
import { 
  BellIcon,
  UserIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  BookOpenIcon,
  PlusIcon
} from "@heroicons/react/24/outline";


export default function TeacherHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [teacherName, setTeacherName] = useState("Professeur");
  const [institutionName, setInstitutionName] = useState("Institution");
  const [department, setDepartment] = useState("Département");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mise à jour de l'heure en temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Notifications adaptées pour les professeurs
  const notifications = [
    { id: 1, title: "Nouvelle évaluation à corriger", time: "Il y a 10 min", unread: true, type: "evaluation" },
    { id: 2, title: "Rappel: Cours de demain à 14h", time: "Il y a 2h", unread: true, type: "reminder" },
    { id: 3, title: "Notes du semestre à valider", time: "Il y a 5h", unread: false, type: "grades" },
    { id: 4, title: "Réunion pédagogique vendredi", time: "Hier", unread: false, type: "meeting" }
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  // Actions rapides pour le menu "+"
  const quickActions = [
    { icon: DocumentTextIcon, label: "Nouvelle évaluation", color: "text-blue-600" },
    { icon: BookOpenIcon, label: "Nouveau cours", color: "text-green-600" },
    { icon: CalendarDaysIcon, label: "Programmer un examen", color: "text-purple-600" },
    { icon: ChatBubbleLeftRightIcon, label: "Envoyer un message", color: "text-orange-600" }
  ];

  // Récupération des infos professeur depuis localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("teacher_data");
    if (!storedData) return;

    try {
      const data = JSON.parse(storedData);
      setTeacherName(data?.user?.name || "Professeur");
      setInstitutionName(data?.institution?.name || "Institution");
      setDepartment(data?.user?.department || "Département");
    } catch (err) {
      console.error("Impossible de parser teacher_data :", err);
    }
  }, []);

    const getNotificationIcon = (type: "evaluation" | "reminder" | "grades" | "meeting" | string): string => {
    switch (type) {
        case "evaluation": return "📝";
        case "reminder": return "⏰";
        case "grades": return "📊";
        case "meeting": return "👥";
        default: return "📢";
    }
    };


  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      
      {/* Left side */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-poppins font-medium text-gray-900">Espace Professeur</span>
          <div className="hidden lg:flex items-center space-x-1 px-2 py-1 bg-gray-50 rounded-md">
            <ClockIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-poppins text-gray-600">
              {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Quick Add Menu */}
        <div className="relative">
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
          {showQuickAdd && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-poppins font-medium text-gray-500 uppercase tracking-wide">
                  Actions rapides
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
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
              <span className="text-sm text-white font-poppins font-semibold">
                {teacherName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-poppins font-medium text-gray-900">{teacherName}</p>
              <p className="text-xs font-poppins text-gray-500">{department}</p>
            </div>
            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-poppins font-medium text-gray-900">{teacherName}</p>
                  <p className="text-xs font-poppins text-gray-500">{department}</p>
                  <p className="text-xs font-poppins text-gray-400">{institutionName}</p>
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
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>Mes évaluations</span>
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
                  <button className="w-full px-4 py-2 text-left text-sm font-poppins text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors">
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside handler */}
      {(showUserMenu || showNotifications || showQuickAdd) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
            setShowQuickAdd(false);
          }}
        />
      )}
    </header>
  );
}