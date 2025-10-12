"use client";
import React, { useState, useEffect } from "react";
import StudentPageHeader from "../_components/page-header";
import { Eye, Trash2, Check, Filter, Bell, BookOpen, Clock, Trophy, AlertTriangle, Calendar, Loader2 } from "lucide-react";
import { StudentNotificationService, StudentNotification, NotificationFilters } from "./_services/S-Notification.service";

export default function StudentNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Charger les notifications
  const fetchNotifications = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const filters: NotificationFilters = {
        page,
        per_page: 20
      };

      if (filter !== "all") {
        filters.read = filter === "read";
      }

      if (typeFilter !== "all") {
        filters.type = typeFilter;
      }

      const response = await StudentNotificationService.getNotifications(filters);

      setNotifications(response.notifications);
      setUnreadCount(response.unread_count);
      setCurrentPage(response.pagination.current_page);
      setTotalPages(response.pagination.last_page);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Marquer une notification comme lue
  const markAsRead = async (id: number) => {
    try {
      await StudentNotificationService.markAsRead(id);

      // Mettre à jour localement
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read_at: new Date().toISOString() } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      await StudentNotificationService.markAllAsRead();

      // Mettre à jour localement
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  // Supprimer une notification
  const deleteNotification = async (id: number) => {
    try {
      await StudentNotificationService.deleteNotification(id);

      // Mettre à jour localement
      setNotifications(prev => prev.filter(notif => notif.id !== id));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  // Effet pour charger les notifications au montage et quand les filtres changent
  useEffect(() => {
    fetchNotifications(1);
  }, [filter, typeFilter]);

  // Fonction utilitaire pour vérifier si une notification est lue
  const isRead = (notification: StudentNotification) => {
    return notification.read_at !== null;
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesStatus = filter === "all" ||
      (filter === "unread" && !isRead(notification)) ||
      (filter === "read" && isRead(notification));

    const matchesType = typeFilter === "all" || notification.type === typeFilter;

    return matchesStatus && matchesType;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "quiz": return <BookOpen className="w-4 h-4 text-gray-600" />;
      case "reminder": return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      case "grades": return <Trophy className="w-4 h-4 text-gray-600" />;
      case "announcement": return <Bell className="w-4 h-4 text-gray-600" />;
      case "deadline": return <Clock className="w-4 h-4 text-gray-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "quiz": return "Quiz";
      case "reminder": return "Rappel";
      case "grades": return "Notes";
      case "announcement": return "Annonce";
      case "deadline": return "Échéance";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* HEADER */}
      <StudentPageHeader
        title="Notifications"
        subtitle="Restez informé de vos cours, quiz et résultats"
      />

      <div className="px-8 py-8">
        {/* CONTROLS */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {loading ? (
                  <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                ) : (
                  <Bell className="w-5 h-5 text-gray-600" />
                )}
                <span className="text-sm font-poppins text-gray-600">
                  {loading ? 'Chargement...' : `${unreadCount} notification${unreadCount !== 1 ? 's' : ''} non lue${unreadCount !== 1 ? 's' : ''}`}
                </span>
              </div>
              {unreadCount > 0 && !loading && (
                <button
                  onClick={markAllAsRead}
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
                  className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  disabled={loading}
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
                  className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="all">Tous types</option>
                  <option value="quiz">Quiz</option>
                  <option value="reminder">Rappels</option>
                  <option value="grades">Notes</option>
                  <option value="announcement">Annonces</option>
                  <option value="deadline">Échéances</option>
                </select>
                <Filter className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-poppins text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Loader2 className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-spin" />
              <p className="text-sm font-poppins text-gray-500">Chargement des notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
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
                {filteredNotifications.map((notification) => (
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
                            {!isRead(notification) && (
                              <div className="w-2 h-2 bg-forest-600 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm font-poppins text-gray-700 mb-3">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs font-poppins text-gray-500">
                              <span className="capitalize">{getTypeLabel(notification.type)}</span>
                              <span>•</span>
                              <span>{new Date(notification.created_at).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}</span>
                            </div>
                            {notification.action_url && (
                              <button className="text-xs font-poppins text-forest-600 hover:text-forest-700 font-medium transition-colors">
                                Voir détails →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!isRead(notification) && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-forest-600 hover:text-forest-700 hover:bg-forest-50 rounded-md transition-colors"
                            title="Marquer comme lu"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
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
                    <button
                      onClick={() => fetchNotifications(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="px-3 py-1 text-sm font-poppins text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    <span className="text-sm font-poppins text-gray-600">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <button
                      onClick={() => fetchNotifications(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className="px-3 py-1 text-sm font-poppins text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </button>
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