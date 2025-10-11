'use client';
import React, { useState, useEffect } from "react";
import { 
  BellIcon,
  UserIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  UsersIcon,
  DocumentArrowUpIcon
} from "@heroicons/react/24/outline";
import { logoutAdmin } from "../../auth/sign-in/_services/auth.service";


export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [adminName, setAdminName] = useState("Administrateur");
  const [institutionSlug, setInstitutionSlug] = useState("université");

  // Notifications simulées
  const notifications = [
    { id: 1, title: "Nouvelle évaluation programmée", time: "Il y a 5 min", unread: true },
    { id: 2, title: "Rapport mensuel disponible", time: "Il y a 1h", unread: true },
    { id: 3, title: "Maintenance prévue ce soir", time: "Il y a 3h", unread: false }
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  // Actions rapides pour l'admin
  const quickActions = [
    { 
      icon: UserIcon, 
      label: "Enregistrer un professeur", 
      color: "text-blue-600",
      action: () => {}
    },
    { 
      icon: UsersIcon, 
      label: "Enregistrer des étudiants", 
      color: "text-green-600",
      action: () => {}
    },
    { 
      icon: DocumentArrowUpIcon, 
      label: "Importer des étudiants", 
      color: "text-purple-600",
      action: () => {}
    }
  ];

  // Récupération des infos admin depuis localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("admin_data");
    if (!storedData) return;

    try {
      const data = JSON.parse(storedData);
      setAdminName(data?.user?.name || "Administrateur");
      setInstitutionSlug(data?.institution?.slug || "université");
    } catch (err) {
    }
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      
      {/* Left side */}
      <div className="flex items-center">
        <span className="text-sm font-poppins font-medium text-gray-900">Tableau de bord</span>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Quick Actions */}
        <div className="relative">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-forest-200"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="text-sm font-poppins font-medium">Actions</span>
            <ChevronDownIcon className="w-3 h-3" />
          </button>
          {showQuickActions && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 mb-2">
                  Actions rapides
                </div>
                {quickActions.map((action, index) => (
                  <button 
                    key={index} 
                    onClick={() => {
                      action.action();
                      setShowQuickActions(false);
                    }}
                    className="w-full px-3 py-2.5 text-left text-sm font-poppins text-gray-700 hover:bg-gray-50 flex items-center space-x-3 rounded-md transition-colors"
                  >
                    <action.icon className={`w-4 h-4 ${action.color}`} />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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
                      <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-forest-500' : 'bg-gray-300'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-poppins font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs font-poppins text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-gray-100">
                <button className="text-sm font-poppins text-forest-600 hover:text-forest-700 font-medium transition-colors">
                  <a href="/dashboard/notifications">Voir toutes les notifications</a>
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
                {adminName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-poppins font-medium text-gray-900">{adminName}</p>
              <p className="text-xs font-poppins text-gray-500">{institutionSlug}</p>
            </div>
            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-poppins font-medium text-gray-900">{adminName}</p>
                  <p className="text-xs font-poppins text-gray-500">{institutionSlug}</p>
                </div>

                <button className="w-full px-4 py-2 text-left text-sm font-poppins text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                  <UserIcon className="w-4 h-4" />
                  <span>Mon profil</span>
                </button>

                <button className="w-full px-4 py-2 text-left text-sm font-poppins text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                  <Cog6ToothIcon className="w-4 h-4" />
                  <span>Préférences</span>
                </button>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button onClick={logoutAdmin} className="w-full px-4 py-2 text-left text-sm font-poppins text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors">
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
      {(showUserMenu || showNotifications || showQuickActions) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
            setShowQuickActions(false);
          }}
        />
      )}
    </header>
  );
}