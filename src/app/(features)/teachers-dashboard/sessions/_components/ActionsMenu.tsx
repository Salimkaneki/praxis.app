// teachers-dashboard/sessions/_components/ActionMenu.tsx
'use client';
import React, { useState } from "react";
import { 
  Play, Pause, RotateCcw, XCircle, MoreVertical,
  Copy, Share2, Trash2, Edit, LucideIcon
} from "lucide-react";
import { Session } from "../_services/sessions.service";

interface ActionMenuProps {
  session: Session;
  onActivate: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopyCode: () => void;
  onShareCode: () => void;
}

interface ActionItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  className: string;
  type?: never;
}

interface SeparatorItem {
  type: 'separator';
  label?: never;
  icon?: never;
  onClick?: never;
  className?: never;
}

type MenuItem = ActionItem | SeparatorItem;

const ActionMenu: React.FC<ActionMenuProps> = ({
  session,
  onActivate,
  onPause,
  onResume,
  onCancel,
  onEdit,
  onDelete,
  onCopyCode,
  onShareCode
}) => {
  const [showActions, setShowActions] = useState(false);

  const getAvailableActions = (): MenuItem[] => {
    const actions: MenuItem[] = [];

    switch (session.status) {
      case 'scheduled':
        actions.push({
          label: "Activer la session",
          icon: Play,
          onClick: onActivate,
          className: "text-green-600 hover:bg-green-50"
        });
        break;
      case 'active':
        actions.push({
          label: "Mettre en pause",
          icon: Pause,
          onClick: onPause,
          className: "text-yellow-600 hover:bg-yellow-50"
        });
        actions.push({
          label: "Terminer la session",
          icon: XCircle,
          onClick: onCancel,
          className: "text-red-600 hover:bg-red-50"
        });
        break;
      case 'paused':
        actions.push({
          label: "Reprendre",
          icon: Play,
          onClick: onResume,
          className: "text-green-600 hover:bg-green-50"
        });
        actions.push({
          label: "Terminer la session",
          icon: XCircle,
          onClick: onCancel,
          className: "text-red-600 hover:bg-red-50"
        });
        break;
      case 'completed':
        actions.push({
          label: "Relancer la session",
          icon: RotateCcw,
          onClick: onActivate,
          className: "text-blue-600 hover:bg-blue-50"
        });
        break;
    }

    // Actions toujours disponibles
    actions.push(
      { type: 'separator' },
      {
        label: "Partager le code",
        icon: Share2,
        onClick: onShareCode,
        className: "hover:bg-gray-50"
      },
      {
        label: "Copier le code",
        icon: Copy,
        onClick: onCopyCode,
        className: "hover:bg-gray-50"
      },
      { type: 'separator' },
      {
        label: "Modifier",
        icon: Edit,
        onClick: onEdit,
        className: "hover:bg-gray-50"
      },
      {
        label: "Supprimer",
        icon: Trash2,
        onClick: onDelete,
        className: "text-red-600 hover:bg-red-50"
      }
    );

    return actions;
  };

  const actions = getAvailableActions();

  return (
    <div className="relative">
      <button
        onClick={() => setShowActions(!showActions)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Actions"
      >
        <MoreVertical className="w-5 h-5 text-gray-500" />
      </button>
      
      {showActions && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowActions(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {actions.map((action, index) => {
              if (action.type === 'separator') {
                return <hr key={`separator-${index}`} className="my-1 border-gray-200" />;
              }

              const IconComponent = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => {
                    action.onClick();
                    setShowActions(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-colors ${action.className}`}
                >
                  <IconComponent className="w-4 h-4" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ActionMenu;