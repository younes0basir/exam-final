import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { professorService, SessionLog } from '../../services/professorService';
import { Toast } from '../../components/ui/Toast';

export const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await professorService.getSessionLog();
      // Handle Laravel pagination response (response.data) or direct array
      const sessionsArray = Array.isArray(response) ? response : (response as any)?.data || [];
      setSessions(sessionsArray);
    } catch (error) {
      console.error('Echoues to fetch sessions:', error);
      setToast({ message: 'Echoues to load sessions', type: 'error' });
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Cahier de texte</h1>
            <p className="text-gray-500">Historique de vos seances d'enseignement</p>
          </div>
          <button className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter une seance
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-gray-500">Total seances</p>
            <p className="text-2xl font-bold text-gray-800">{sessions.length}</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-gray-500">Cette semaine</p>
            <p className="text-2xl font-bold text-emerald-600">
              {sessions.filter(s => {
                const sessionDate = new Date(s.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return sessionDate >= weekAgo;
              }).length}
            </p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-gray-500">Heures enseignees</p>
            <p className="text-2xl font-bold text-primary-600">
              {sessions.reduce((acc, s) => {
                const start = new Date(`2000-01-01T${s.heure_debut}`);
                const end = new Date(`2000-01-01T${s.heure_fin}`);
                return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
              }, 0).toFixed(1)}h
            </p>
          </div>
        </div>

        {/* Sessions Timeline */}
        <div className="glass-card rounded-2xl p-6">
          <div className="space-y-6">
            {sessions.map((session, index) => (
              <div key={session.id} className="flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  {index < sessions.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
                  )}
                </div>

                {/* Session Content */}
                <div className="flex-1 pb-6">
                  <div className="glass-card rounded-xl p-4 hover-lift">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800 mb-1">
                        {typeof session.module === 'object' ? session.module?.nom : session.module}
                      </h3>
                        <p className="text-sm text-gray-600 mb-2">{session.sujet}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {session.heure_debut} - {session.heure_fin}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
