'use client'
import React from "react";
import { Edit3, Trash2, Eye, MoreVertical } from "lucide-react";

interface ActionButton {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onMore?: () => void;
  customActions?: ActionButton[];
  className?: string;
}

export default function TableActions({
  onEdit,
  onDelete,
  onView,
  onMore,
  customActions = [],
  className = ""
}: TableActionsProps) {
  const defaultActions: ActionButton[] = [
    onView && {
      icon: <Eye className="w-4 h-4" />,
      label: "Voir les détails",
      onClick: onView,
      className: "text-blue-600 hover:bg-blue-50"
    },
    onEdit && {
      icon: <Edit3 className="w-4 h-4" />,
      label: "Modifier",
      onClick: onEdit,
      className: "text-forest-600 hover:bg-forest-50"
    },
    onDelete && {
      icon: <Trash2 className="w-4 h-4" />,
      label: "Supprimer",
      onClick: onDelete,
      className: "text-red-600 hover:bg-red-50"
    },
    onMore && {
      icon: <MoreVertical className="w-4 h-4" />,
      label: "Plus d'options",
      onClick: onMore,
      className: "text-gray-600 hover:bg-gray-50"
    }
  ].filter(Boolean) as ActionButton[];

  const allActions = [...defaultActions, ...customActions];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {allActions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          disabled={action.disabled}
          className={`p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-smooth ${action.className || ''} ${
            action.disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title={action.label}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}