import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { studentService, Absence } from '../../services/studentService';
import { Toast } from '../../components/ui/Toast';

export const AbsencesPage: React.FC = () => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchAbsences();
  }, []);

  const fetchAbsences = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAbsences();
      // Handle Laravel pagination response (response.data) or direct array
      const absencesArray = Array.isArray(response) ? response : (response as any)?.data || [];
      setAbsences(absencesArray);
    } catch (error) {
      console.error('Echoues to fetch absences:', error);
      setToast({ message: 'Echoues to load absences', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'justified': return 'bg-emerald-100 text-emerald-700';
      case 'unjustified': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  const justifiedCount = absences.filter(a => a.statut === 'justified').length;
  const unjustifiedCount = absences.filter(a => a.statut === 'unjustified').length;

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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Absences</h1>
          <p className="text-gray-500">Track your attendance record</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-gray-500">Total Absences</p>
            <p className="text-2xl font-bold text-gray-800">{absences.length}</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-gray-500">Justified</p>
            <p className="text-2xl font-bold text-emerald-600">{justifiedCount}</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-gray-500">Unjustified</p>
            <p className="text-2xl font-bold text-red-600">{unjustifiedCount}</p>
          </div>
        </div>

        {/* Absences List */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Module</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Justification</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {absences.map((absence) => (
                  <tr key={absence.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-800">
                          {new Date(absence.date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{absence.module}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {absence.justification || (
                        <span className="text-gray-400 italic">Aucun justificatif fourni</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatutColor(absence.statut)}`}>
                        {absence.statut === 'justified' && (
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {absence.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {absences.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500">Parfait ! Aucune absence enregistree</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
