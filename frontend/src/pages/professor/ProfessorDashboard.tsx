import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { professorService, ProfessorStats, Module } from '../../services/professorService';

const StatCard = ({
  title,
  value,
  icon,
  color
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
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

export const ProfessorDashboard: React.FC = () => {
  const [stats, setStats] = useState<ProfessorStats | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, modulesData] = await Promise.all([
          professorService.getStats(),
          professorService.getModules(),
        ]);
        setStats(statsData);
        setModules(modulesData);
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord professeur</h1>
          <p className="text-gray-500">Bienvenue dans votre espace professeur.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Modules enseignés"
            value={stats?.modules_count || 0}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            color="blue"
          />

          <StatCard
            title="Notes en attente"
            value={stats?.pending_notes || 0}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/professor/grades" className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Gérer les notes</p>
                <p className="text-xs text-gray-500">Saisir et modifier les notes</p>
              </div>
            </a>

            <a href="/professor/absences" className="flex items-center gap-3 p-4 rounded-xl bg-success-50 hover:bg-success-100 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-success-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Gérer les absences</p>
                <p className="text-xs text-gray-500">Enregistrer les absences</p>
              </div>
            </a>

            <a href="/professor/reservations" className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Réserver une salle</p>
                <p className="text-xs text-gray-500">Gérer les réservations</p>
              </div>
            </a>
          </div>
        </div>

        {/* Modules with Students */}
        {modules.length > 0 && (
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mes modules et étudiants</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Module</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Filière</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Étudiants</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {modules.map((module) => (
                    <tr key={module.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">{module.nom}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {typeof module.filiere === 'object' ? module.filiere?.nom : module.filiere}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {module.students_count || 0} étudiants
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`/professor/grades`}
                          onClick={() => {
                            // Store selected module ID in sessionStorage
                            sessionStorage.setItem('selectedModuleId', module.id.toString());
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Voir les notes
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
