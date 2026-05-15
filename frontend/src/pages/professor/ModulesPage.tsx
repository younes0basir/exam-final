import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout } from '../../components/layout/Layout';
import { professorService, Module } from '../../services/professorService';
import { Toast } from '../../components/ui/Toast';

export const ModulesPage: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await professorService.getModules();
      setModules(data);
    } catch (error: unknown) {
      console.error('Echec de recuperation des modules :', error);

      if (axios.isAxiosError(error)) {
        // ERR_NETWORK => backend unreachable / internet disconnected / server down
        if (error.code === 'ERR_NETWORK') {
          setToast({
            message: 'Connexion impossible au serveur. Verifiez internet et que le backend Laravel tourne sur http://localhost:8000.',
            type: 'error',
          });
          return;
        }

        if (error.response?.status === 401) {
          setToast({ message: 'Session expiree. Reconnectez-vous.', type: 'error' });
          return;
        }
      }

      setToast({ message: 'Echec du chargement des modules', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onFermer={() => setToast(null)}
        />
      )}
      
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes modules</h1>
          <p className="text-gray-500">Modules que vous enseignez actuellement</p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div key={module.id} className="glass-card rounded-2xl p-6 hover-lift">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                {module.semestre && (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    Semestre {module.semestre}
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-1">{module.nom}</h3>
              {module.code && <p className="text-sm text-gray-500 mb-4">Code : {module.code}</p>}
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{typeof module.filiere === 'object' ? module.filiere?.nom : module.filiere}</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Gerer les notes
                </button>
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
