import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '../../components/layout/Layout';
import { adminService, DashboardStats, AnalyticsData } from '../../services/adminService';
import {
  GradeDistributionChart,
  AbsencesByMonthChart,
  AttendanceTrendChart,
  ModuleAveragesChart,
  AbsenceStatusChart,
  StudentsPerFiliereChart,
} from '../../components/DashboardCharts';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color, 
  trend 
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  color: string;
  trend?: string;
}) => {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/30',
    green: 'from-emerald-500 to-emerald-600 shadow-emerald-500/30',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/30',
    orange: 'from-orange-500 to-orange-600 shadow-orange-500/30',
  };

  return (
    <div className="stat-card glass-card rounded-2xl p-6 hover-lift">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          {trend && (
            <p className="text-xs text-gray-400 mt-1">{trend}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full bg-gradient-to-r ${colorClasses[color]}`} style={{ width: '70%' }} />
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, requestsData, analyticsData] = await Promise.all([
          adminService.getStats(),
          adminService.getRequests(),
          adminService.getAnalytics(),
        ]);
        setStats(statsData);
        setAnalytics(analyticsData);
        // Count pending requests from the paginated response
        const requests = Array.isArray(requestsData) ? requestsData : (requestsData as any)?.data || [];
        const pending = requests.filter((req: any) => req.statut === 'pending').length;
        setPendingRequests(pending);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('dashboard.title')}</h1>
          <p className="text-gray-500">{t('common.welcome')}. {t('dashboard.subtitle')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={t('stats.totalStudents')}
            value={stats?.students || 0}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            color="blue"
          />
          
          <StatCard
            title={t('stats.totalProfessors')}
            value={stats?.professors || 0}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            color="green"
          />
          
          <StatCard
            title={t('stats.totalFilieres')}
            value={stats?.filieres || 0}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            color="purple"
          />
          
          <StatCard
            title={t('stats.pendingRequests')}
            value={pendingRequests}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{t('users.addUser')}</p>
                <p className="text-xs text-gray-500">{t('navigation.students')}</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 rounded-xl bg-success-50 hover:bg-success-100 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-success-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{t('requests.title')}</p>
                <p className="text-xs text-gray-500">{pendingRequests} {t('common.pending').toLowerCase()}</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{t('timetable.title')}</p>
                <p className="text-xs text-gray-500">{t('dashboard.quickActions')}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Charts Section */}
        {analytics && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{t('dashboard.analytics')}</h2>
              <p className="text-gray-500">{t('dashboard.trends')}</p>
            </div>

            {/* First Row - Grade Distribution & Absence Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <GradeDistributionChart data={analytics.grade_distribution} />
              <AbsenceStatusChart data={analytics.absence_status} />
            </div>

            {/* Second Row - Absences by Month & Attendance Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <AbsencesByMonthChart data={analytics.absences_by_month} />
              <AttendanceTrendChart data={analytics.attendance_trend} />
            </div>

            {/* Third Row - Module Averages & Students per Filiere */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ModuleAveragesChart data={analytics.module_averages} />
              <StudentsPerFiliereChart data={analytics.students_per_filiere} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
