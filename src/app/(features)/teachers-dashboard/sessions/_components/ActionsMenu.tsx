// teachers-dashboard/sessions/_components/ActionMenu.tsx
'use client';
import React, { useState } from "react";
import { 
  Play, Pause, RotateCcw, XCircle, MoreVertical,
  Copy, Share2, Trash2, Edit, LucideIcon, CheckCircle,
  AlertCircle, RefreshCw, Eye, Download, Settings,
  Users, BarChart3, QrCode, FileText
} from "lucide-react";
import { Session } from "../_services/sessions.service";

interface ActionMenuProps {
  session: Session;
  onActivate: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopyCode: () => void;
  onShareCode: () => void;
  onRefresh?: () => void;
}

interface ActionItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  className: string;
  type?: never;
  disabled?: boolean;
  description?: string;
}

interface SeparatorItem {
  type: 'separator';
  label?: never;
  icon?: never;
  onClick?: never;
  className?: never;
  disabled?: never;
  description?: never;
}

type MenuItem = ActionItem | SeparatorItem;

const ActionMenu: React.FC<ActionMenuProps> = ({
  session,
  onActivate,
  onComplete,
  onCancel,
  onEdit,
  onDelete,
  onCopyCode,
  onShareCode,
  onRefresh
}) => {
  const [showActions, setShowActions] = useState(false);

  const getAvailableActions = (): MenuItem[] => {
    const actions: MenuItem[] = [];

    // Actions principales selon le statut
    switch (session.status) {
      case 'scheduled':
        actions.push({
          label: "Activer la session",
          icon: Play,
          onClick: onActivate,
          className: "text-green-600 hover:bg-green-50",
          description: "Démarrer la session maintenant"
        });
        break;
        
      case 'active':
        actions.push({
          label: "Terminer la session",
          icon: CheckCircle,
          onClick: onComplete,
          className: "text-blue-600 hover:bg-blue-50",
          description: "Clôturer la session"
        });
        break;
        
      case 'completed':
        actions.push({
          label: "Session terminée",
          icon: CheckCircle,
          onClick: () => {},
          className: "text-gray-400 cursor-not-allowed",
          disabled: true,
          description: "Session clôturée"
        });
        break;
        
      case 'cancelled':
        actions.push({
          label: "Session annulée",
          icon: XCircle,
          onClick: () => {},
          className: "text-gray-400 cursor-not-allowed",
          disabled: true,
          description: "Session annulée"
        });
        break;
    }

    // Actions de gestion du statut
    if (session.status !== 'completed' && session.status !== 'cancelled') {
      actions.push({
        label: "Annuler la session",
        icon: XCircle,
        onClick: onCancel,
        className: "text-red-600 hover:bg-red-50",
        description: "Annuler définitivement"
      });
    }

    actions.push({ type: 'separator' });

    // Actions de partage et code
    actions.push(
      {
        label: "Partager le code",
        icon: Share2,
        onClick: onShareCode,
        className: "text-purple-600 hover:bg-purple-50",
        description: "Partager avec les étudiants"
      },
      {
        label: "Copier le code",
        icon: Copy,
        onClick: onCopyCode,
        className: "text-indigo-600 hover:bg-indigo-50",
        description: "Copier dans le presse-papier"
      }
    );

    actions.push({ type: 'separator' });

    // Actions d'édition
    if (session.status === 'scheduled') {
      actions.push({
        label: "Modifier la session",
        icon: Edit,
        onClick: onEdit,
        className: "text-gray-700 hover:bg-gray-50",
        description: "Modifier les paramètres"
      });
    } else {
      actions.push({
        label: "Modifier la session",
        icon: Edit,
        onClick: onEdit,
        className: "text-gray-400 cursor-not-allowed",
        disabled: true,
        description: "Non disponible pour ce statut"
      });
    }

    // Action rafraîchissement
    if (onRefresh) {
      actions.push({
        label: "Rafraîchir les données",
        icon: RefreshCw,
        onClick: onRefresh,
        className: "text-gray-700 hover:bg-gray-50",
        description: "Actualiser les informations"
      });
    }

    actions.push({ type: 'separator' });

    // Action suppression
    if (['scheduled', 'cancelled', 'completed'].includes(session.status)) {
      actions.push({
        label: "Supprimer la session",
        icon: Trash2,
        onClick: onDelete,
        className: "text-red-600 hover:bg-red-50",
        description: "Supprimer définitivement"
      });
    } else {
      actions.push({
        label: "Supprimer la session",
        icon: Trash2,
        onClick: onDelete,
        className: "text-gray-400 cursor-not-allowed",
        disabled: true,
        description: "Non disponible pour ce statut"
      });
    }

    return actions;
  };

  const actions = getAvailableActions();

  // Obtenir la configuration du statut pour l'affichage
  const getStatusConfig = (status: Session['status']) => {
    const configs = {
      scheduled: { label: "Programmée", color: "text-blue-800 bg-blue-100 border-blue-200" },
      active: { label: "En cours", color: "text-green-800 bg-green-100 border-green-200" },
      completed: { label: "Terminée", color: "text-gray-800 bg-gray-100 border-gray-200" },
      cancelled: { label: "Annulée", color: "text-red-800 bg-red-100 border-red-200" }
    };

    if (status in configs) {
      return configs[status as keyof typeof configs];
    }
    return configs.scheduled;
  };

  const statusConfig = getStatusConfig(session.status);

  return (
    <div className="relative">
      <button
        onClick={() => setShowActions(!showActions)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Actions de session"
      >
        <MoreVertical className="w-5 h-5 text-gray-500" />
      </button>
      
      {showActions && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowActions(false)}
          />
          
          {/* Menu d'actions */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
            {/* En-tête simplifié */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {session.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {session.session_code}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des actions */}
            <div className="max-h-96 overflow-y-auto">
              {actions.map((action, index) => {
                if (action.type === 'separator') {
                  return (
                    <div key={`separator-${index}`} className="my-1">
                      <hr className="border-gray-200" />
                    </div>
                  );
                }

                const IconComponent = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => {
                      if (!action.disabled) {
                        action.onClick();
                        setShowActions(false);
                      }
                    }}
                    disabled={action.disabled}
                    className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-3 ${
                      action.disabled 
                        ? 'cursor-not-allowed opacity-60' 
                        : 'hover:bg-gray-50'
                    } ${action.className}`}
                  >
                    <IconComponent className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {action.label}
                        </span>
                        {action.disabled && (
                          <AlertCircle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      {action.description && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {action.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pied de page simplifié */}
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>ID: {session.id}</span>
                <span>{new Date(session.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActionMenu;