import api from '@/lib/server/interceptor/axios';

export interface KPI {
  label: string;
  value: string | number;
  period: string;
  trend: 'positive' | 'negative' | 'stable';
}

export interface Metric {
  label: string;
  value: string;
  change: string;
  unit: string;
}

export interface Event {
  date: string;
  time: string;
  title: string;
  location: string;
  status: string;
}

export interface Administrator {
  id: number;
  user_id: number;
  institution_id: number;
  type: 'pedagogique' | 'scolarite' | 'direction';
  permissions?: string[];
  user?: {
    id: number;
    name: string;
    email: string;
  };
  institution?: {
    id: number;
    name: string;
  };
}

export interface DashboardData {
  kpis?: KPI[];
  metrics?: Metric[];
  recentEvents?: Event[];
}

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChartData = async (chartType: string): Promise<any> => {
  try {
    const response = await api.get(`/admin/dashboard/charts/${chartType}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdministrators = async (params?: { type?: string; institution_id?: number }): Promise<Administrator[]> => {
  try {
    const response = await api.get('/administrators', { params });
    return response.data.data || response.data; // Assuming paginated or direct array
  } catch (error) {
    throw error;
  }
};