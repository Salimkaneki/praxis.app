"use client";
import React, { useState, useEffect } from "react";
import TeacherPageHeader from "../_components/page-header";
import { Eye, Trash2, Check, Filter, Bell, AlertCircle, BookOpen, Users, Calendar, CheckCheck, Loader2 } from "lucide-react";
import { getNotifications, markAsRead, markBulkAsRead, markAllAsRead, deleteNotification, getUnreadCount, TeacherNotification } from "./_services/T-Notification.service";
import { useToast } from "@/hooks/useToast";

export default function TeacherNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [notifications, setNotifications] = useState<TeacherNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showSuccess, showError } = useToast();

  // Charger les notifications au montage du composant
  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, [currentPage, filter, typeFilter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        per_page: 15
      };

      if (typeFilter !== "all") {
        params.type = typeFilter;
      }

      if (filter === "unread") {
        params.read = false;
      } else if (filter === "read") {
        params.read = true;
      }

      console.log('🔍 Chargement des notifications avec params:', params);
      console.log('🔑 Tokens disponibles:', {
        teacher_token: !!localStorage.getItem('teacher_token'),
        admin_token: !!localStorage.getItem('admin_token'),
        student_token: !!localStorage.getItem('student_token')
      });

      const response = await getNotifications(params);
      setNotifications(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error: any) {
      console.error('Erreur lors du chargement des notifications:', error);

      // Ne pas afficher d'erreur toast pour les erreurs 401
      if (error.response?.status !== 401) {
        showError(error.message || 'Erreur lors du chargement des notifications');
      }

      // En cas d'erreur, vider la liste pour éviter l'affichage de données incorrectes
      setNotifications([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data.unread_count);
    } catch (error: any) {
      console.error('Erreur lors du chargement du compteur:', error);
      // Ne pas afficher d'erreur pour les erreurs 401
      if (error.response?.status !== 401) {
        console.warn('Impossible de charger le compteur de notifications non lues');
      }
      setUnreadCount(0);
    }
  };

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
      showSuccess('Notification marquée comme lue');
    } catch (error: any) {
      console.error('Erreur markAsRead:', error);
      if (error.response?.status !== 401) {
        showError(error.message || 'Erreur lors du marquage');
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      // Mettre à jour localement
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
      showSuccess('Toutes les notifications ont été marquées comme lues');
    } catch (error: any) {
      console.error('Erreur markAllAsRead:', error);
      if (error.response?.status !== 401) {
        showError(error.message || 'Erreur lors du marquage');
      }
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);
      // Supprimer localement
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      showSuccess('Notification supprimée');
    } catch (error: any) {
      console.error('Erreur deleteNotification:', error);
      if (error.response?.status !== 401) {
        showError(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "admin_announcement": return <Bell className="w-4 h-4 text-gray-600" />;
      case "schedule_change": return <Calendar className="w-4 h-4 text-gray-600" />;
      case "training_required": return <BookOpen className="w-4 h-4 text-gray-600" />;
      case "maintenance_warning": return <AlertCircle className="w-4 h-4 text-gray-600" />;
      case "policy_update": return <Users className="w-4 h-4 text-gray-600" />;
      case "system_update": return <Check className="w-4 h-4 text-gray-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "admin_announcement": "Annonce administrative",
      "schedule_change": "Changement d'horaire",
      "training_required": "Formation requise",
      "maintenance_warning": "Alerte maintenance",
      "policy_update": "Mise à jour politique",
      "system_update": "Mise à jour système"
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <TeacherPageHeader
        title="Notifications"
        subtitle="Gérez vos notifications et restez informé des dernières mises à jour"
      />

      <div className="px-8 py-8">
        {/* CONTROLS */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-poppins text-gray-600">
                  {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue{unreadCount !== 1 ? 's' : ''}
                </span>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm font-poppins text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* Filter by status */}
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Toutes</option>
                  <option value="unread">Non lues</option>
                  <option value="read">Lues</option>
                </select>
                <Filter className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Filter by type */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous types</option>
                  <option value="admin_announcement">Annonces admin</option>
                  <option value="schedule_change">Changements horaire</option>
                  <option value="training_required">Formations</option>
                  <option value="maintenance_warning">Alertes maintenance</option>
                  <option value="policy_update">Mises à jour politiques</option>
                  <option value="system_update">Mises à jour système</option>
                </select>
                <Filter className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-sm font-poppins text-gray-500">Chargement des notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">
                Aucune notification
              </h3>
              <p className="text-sm font-poppins text-gray-500">
                {filter === "unread" ? "Vous avez lu toutes vos notifications !" :
                 filter === "read" ? "Aucune notification lue trouvée." :
                 "Vous n'avez aucune notification pour le moment."}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {notifications.map((notification: TeacherNotification) => (
                  <div
                    key={notification.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-sm font-poppins font-semibold text-gray-900">
                              {notification.title}
                            </h3>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm font-poppins text-gray-700 mb-3">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs font-poppins text-gray-500">
                            <span>{notification.type_label}</span>
                            <span>•</span>
                            <span>{new Date(notification.created_at).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                            title="Marquer comme lu"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-poppins text-gray-700">
                      Page {currentPage} sur {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-poppins bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Précédent
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm font-poppins bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}