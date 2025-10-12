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
  ClockIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import teacherAuthService from "../_services/teacher-auth.service";
import { getNotifications, getUnreadCount, markAsRead, TeacherNotification } from "../notifications/_services/T-Notification.service";


export default function TeacherHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [teacherName, setTeacherName] = useState("Professeur");
  const [institutionName, setInstitutionName] = useState("Institution");
  const [department, setDepartment] = useState("Département");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState<TeacherNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Mise à jour de l'heure en temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Charger les notifications et le compteur
  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await getNotifications({ per_page: 5 }); // Charger seulement 5 notifications pour l'aperçu
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications dans le header:', error);
      // En cas d'erreur, garder les notifications vides
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Erreur lors du chargement du compteur:', error);
      setUnreadCount(0);
    }
  };

  // Récupération des infos professeur depuis l'API et localStorage
  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        // Essayer d'abord de récupérer depuis l'API
        const teacherData = await teacherAuthService.getCurrentTeacher();

        if (teacherData) {
          setTeacherName(teacherData.name);
          setInstitutionName(teacherData.teacher?.institution?.name || "Institution");
          setDepartment(teacherData.teacher?.department || "Département");
        } else {
          // Fallback vers les données locales si API échoue
          setTeacherName(teacherAuthService.getTeacherName());
          setInstitutionName(teacherAuthService.getInstitutionName());
          setDepartment(teacherAuthService.getTeacherDepartment());
        }
      } catch (error) {
        // Fallback vers les données locales
        setTeacherName(teacherAuthService.getTeacherName());
        setInstitutionName(teacherAuthService.getInstitutionName());
        setDepartment(teacherAuthService.getTeacherDepartment());
      }
    };

    loadTeacherData();
  }, []);

    const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
      // Mettre à jour localement
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const getNotificationIcon = (type: string): string => {
    switch (type) {
        case "admin_announcement": return "�";
        case "schedule_change": return "📅";
        case "training_required": return "🎓";
        case "maintenance_warning": return "⚠️";
        case "policy_update": return "�";
        case "system_update": return "�";
        default: return "📢";
    }
  };

  const handleLogout = () => {
    teacherAuthService.logout();
    // Redirection vers la page de connexion
    window.location.href = '/auth/sign-in/teacher';
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;

    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
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
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) {
                // Recharger les notifications quand on ouvre le dropdown
                loadNotifications();
                loadUnreadCount();
              }
            }}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <BellIcon className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-poppins font-medium text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {loadingNotifications ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-xs font-poppins text-gray-500 mt-2">Chargement...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-sm font-poppins text-gray-500">Aucune notification</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-poppins font-medium text-gray-900">{notification.title}</p>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-xs font-poppins text-gray-500 mt-1">{formatTimeAgo(notification.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 text-center border-t border-gray-100">
                <a href="/teachers-dashboard/notifications" className="text-sm font-poppins text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Voir toutes les notifications
                </a>
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
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm font-poppins text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors"
                  >
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
      {(showUserMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
}