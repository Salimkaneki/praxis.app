'use client';
import React, { useState } from "react";
import {
  Bell,
  Eye,
  Trash2,
  Check,
  Filter,
  AlertTriangle,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Shield,
  Settings,
  Plus
} from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "system" | "security" | "maintenance" | "user" | "report" | "announcement";
  unread: boolean;
  createdAt: string;
  priority: "high" | "medium" | "low";
  actionUrl?: string;
}

export default function AdminNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Notifications simulées pour les administrateurs
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Maintenance programmée",
      message: "Une maintenance du système est prévue ce soir de 22h à 2h. Le système sera indisponible pendant cette période.",
      type: "maintenance",
      unread: true,
      createdAt: "2025-10-09T08:30:00",
      priority: "high"
    },
    {
      id: 2,
      title: "Nouveau rapport disponible",
      message: "Le rapport mensuel des statistiques d'utilisation a été généré et est disponible dans la section Rapports.",
      type: "report",
      unread: true,
      createdAt: "2025-10-08T14:00:00",
      priority: "medium",
      actionUrl: "/dashboard/reports/monthly"
    },
    {
      id: 3,
      title: "Alerte sécurité",
      message: "Tentative de connexion suspecte détectée depuis une adresse IP inconnue. Vérifiez les logs de sécurité.",
      type: "security",
      unread: false,
      createdAt: "2025-10-07T23:15:00",
      priority: "high",
      actionUrl: "/dashboard/security/logs"
    },
    {
      id: 4,
      title: "Nouveaux utilisateurs inscrits",
      message: "15 nouveaux étudiants et 2 nouveaux enseignants se sont inscrits cette semaine.",
      type: "user",
      unread: false,
      createdAt: "2025-10-06T10:45:00",
      priority: "low",
      actionUrl: "/dashboard/users/recent"
    },
    {
      id: 5,
      title: "Mise à jour système disponible",
      message: "Une nouvelle version du système est disponible. Planifiez la mise à jour pour minimiser les interruptions.",
      type: "system",
      unread: false,
      createdAt: "2025-10-05T09:20:00",
      priority: "medium",
      actionUrl: "/dashboard/system/updates"
    },
    {
      id: 6,
      title: "Annonce importante",
      message: "Rappel : La période d'inscription pour le semestre prochain commence dans 2 semaines.",
      type: "announcement",
      unread: false,
      createdAt: "2025-10-04T16:30:00",
      priority: "medium"
    },
    {
      id: 7,
      title: "Sauvegarde terminée",
      message: "La sauvegarde automatique des données s'est terminée avec succès. Toutes les données sont sécurisées.",
      type: "system",
      unread: false,
      createdAt: "2025-10-03T02:00:00",
      priority: "low"
    }
  ]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesStatus = filter === "all" ||
      (filter === "unread" && notification.unread) ||
      (filter === "read" && !notification.unread);

    const matchesType = typeFilter === "all" || notification.type === typeFilter;

    return matchesStatus && matchesType;
  });

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, unread: false }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "system": return <Settings className="w-4 h-4 text-gray-600" />;
      case "security": return <Shield className="w-4 h-4 text-gray-600" />;
      case "maintenance": return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      case "user": return <Users className="w-4 h-4 text-gray-600" />;
      case "report": return <TrendingUp className="w-4 h-4 text-gray-600" />;
      case "announcement": return <Bell className="w-4 h-4 text-gray-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "system": return "Système";
      case "security": return "Sécurité";
      case "maintenance": return "Maintenance";
      case "user": return "Utilisateurs";
      case "report": return "Rapports";
      case "announcement": return "Annonces";
      default: return type;
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-poppins font-semibold text-gray-900">Notifications</h1>
              <p className="text-sm font-poppins text-gray-600 mt-1">
                Gérez les notifications système et administratives
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.href = '/dashboard/notifications/create'}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-poppins font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Créer une notification</span>
              </button>
              <div className="text-sm font-poppins text-gray-500">
                {new Date().toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Compteur et bouton marquer tout comme lu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-poppins text-gray-600">
                {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue{unreadCount !== 1 ? 's' : ''}
              </span>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm font-poppins text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Filtres */}
          <div className="flex items-center space-x-3 ml-auto">
            {/* Filter by status */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="all">Tous types</option>
                <option value="system">Système</option>
                <option value="security">Sécurité</option>
                <option value="maintenance">Maintenance</option>
                <option value="user">Utilisateurs</option>
                <option value="report">Rapports</option>
                <option value="announcement">Annonces</option>
              </select>
              <Filter className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-8 py-6">
        {/* NOTIFICATIONS LIST */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
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
                            {notification.unread && (
                              <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm font-poppins text-gray-700 mb-3">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs font-poppins text-gray-500">
                              <span className="capitalize">{getTypeLabel(notification.type)}</span>
                              <span>•</span>
                              <span>{new Date(notification.createdAt).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}</span>
                            </div>
                            {notification.actionUrl && (
                              <button className="text-xs font-poppins text-gray-900 hover:text-gray-700 font-medium transition-colors">
                                Voir détails →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {notification.unread && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}