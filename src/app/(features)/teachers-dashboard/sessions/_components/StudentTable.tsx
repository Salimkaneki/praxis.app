// teachers-dashboard/sessions/_components/StudentTable.tsx
'use client';
import React from "react";
import { 
  Clock, Play, CheckCircle, Download, 
  ChevronRight, Eye
} from "lucide-react";

export interface Student {
  id: number;
  name: string;
  email: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'submitted';
  started_at?: string;
  submitted_at?: string;
  score?: number;
  time_spent?: number;
}

interface StudentTableProps {
  students: Student[];
  onExport?: () => void;
  onViewDetails?: (student: Student) => void;
  className?: string;
}

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onExport,
  onViewDetails,
  className = ""
}) => {
  const getStudentStatusConfig = (status: Student['status']) => {
    const configs = {
      not_started: {
        label: "Non commencé",
        className: "bg-gray-100 text-gray-800",
        icon: Clock
      },
      in_progress: {
        label: "En cours", 
        className: "bg-blue-100 text-blue-800",
        icon: Play
      },
      completed: {
        label: "Terminé",
        className: "bg-green-100 text-green-800",
        icon: CheckCircle
      },
      submitted: {
        label: "Soumis",
        className: "bg-purple-100 text-purple-800",
        icon: CheckCircle
      }
    };
    return configs[status];
  };

  const formatTimeSpent = (minutes?: number) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? mins.toString().padStart(2, '0') : ''}`;
    }
    return `${mins} min`;
  };

  const formatSubmittedTime = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Participants à la session</h3>
          <p className="text-sm text-gray-600">
            {students.length} étudiant(s)
          </p>
        </div>
        {onExport && (
          <button
            onClick={onExport}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        )}
      </div>

      <div className="space-y-2">
        {students.length === 0 ? (
          <div className="text-center py-12 border border-gray-200 rounded-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun participant</h4>
            <p className="text-gray-600">Les participants apparaîtront ici une fois qu'ils auront rejoint la session.</p>
          </div>
        ) : (
          students.map((student) => {
            const statusConfig = getStudentStatusConfig(student.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {student.score !== undefined && (
                    <span className="text-sm font-medium text-gray-900 min-w-[40px] text-right">
                      {student.score}%
                    </span>
                  )}
                  {student.time_spent && (
                    <span className="text-sm text-gray-600 min-w-[60px] text-right">
                      {formatTimeSpent(student.time_spent)}
                    </span>
                  )}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${statusConfig.className}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig.label}
                  </div>
                  {onViewDetails && (
                    <button 
                      onClick={() => onViewDetails(student)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentTable;