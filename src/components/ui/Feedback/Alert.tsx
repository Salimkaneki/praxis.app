'use client'
import React from "react";
import { AlertCircle, CheckCircle, X, RefreshCw } from "lucide-react";

interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  onRetry?: () => void;
  className?: string;
}

export default function Alert({
  type,
  message,
  onClose,
  onRetry,
  className = ""
}: AlertProps) {
  const getAlertStyles = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: <AlertCircle className="w-5 h-5 text-red-400" />
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: <CheckCircle className="w-5 h-5 text-green-400" />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: <AlertCircle className="w-5 h-5 text-yellow-400" />
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: <AlertCircle className="w-5 h-5 text-blue-400" />
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: <AlertCircle className="w-5 h-5 text-gray-400" />
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className={`p-4 border rounded-lg ${styles.bg} ${styles.border} ${className}`}>
      <div className="flex items-center">
        {styles.icon}
        <div className={`ml-3 ${styles.text} font-poppins text-sm flex-1`}>
          {message}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className={`text-sm font-medium hover:opacity-75 transition-opacity ${styles.text}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className={`text-sm font-medium hover:opacity-75 transition-opacity ${styles.text}`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}