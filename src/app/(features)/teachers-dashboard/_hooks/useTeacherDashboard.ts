import { useState, useEffect } from 'react';
import { teacherDashboardService, type TeacherDashboardData, type KPI, type Quiz, type UpcomingEvaluation } from '../_services/TeacherDashboard.service';

export const useTeacherDashboard = () => {
  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await teacherDashboardService.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      console.error('Erreur lors du chargement du dashboard:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    data,
    loading,
    error,
    refreshData,
    kpis: data?.kpis || [],
    quizzes: data?.quizzes || [],
    upcomingEvaluations: data?.upcoming_evaluations || []
  };
};