import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { studentService, Resultat } from '../../services/studentService';
import { Toast } from '../../components/ui/Toast';

export const ResultsPage: React.FC = () => {
  const [results, setResults] = useState<Resultat[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await studentService.getResults();
      // Handle Laravel pagination response (response.data) or direct array
      const resultsArray = Array.isArray(response) ? response : (response as any)?.data || [];
      setResults(resultsArray);
    } catch (error) {
      console.error('Echoues to fetch results:', error);
      setToast({ message: 'Echoues to load results', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getNoteColor = (note: number) => {
    if (note >= 16) return 'text-emerald-600 bg-emerald-50';
    if (note >= 14) return 'text-blue-600 bg-blue-50';
    if (note >= 12) return 'text-primary-600 bg-primary-50';
    if (note >= 10) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getNoteLabel = (note: number) => {
    if (note >= 16) return 'Excellent';
    if (note >= 14) return 'Bien';
    if (note >= 12) return 'Assez bien';
    if (note >= 10) return 'Passable';
    return 'Insuffisant';
  };

  const average = results.length > 0
    ? (results.reduce((acc, r) => acc + (r.note ?? 0), 0) / results.length).toFixed(2)
    : '0.00';

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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes resultats</h1>
          <p className="text-gray-500">View your academic performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-gray-500">Moyenne</p>
            <p className="text-2xl font-bold text-primary-600">{average}</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-gray-500">Modules</p>
            <p className="text-2xl font-bold text-gray-800">{results.length}</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-gray-500">Admis</p>
            <p className="text-2xl font-bold text-emerald-600">
              {results.filter(r => (r.note ?? 0) >= 10).length}
            </p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-gray-500">Echoues</p>
            <p className="text-2xl font-bold text-red-600">
              {results.filter(r => (r.note ?? 0) < 10).length}
            </p>
          </div>
        </div>

        {/* Results Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Module</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Note</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Semester</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center text-primary-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-800">{result.module_nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold ${getNoteColor(result.note ?? 0)}`}>
                        {(result.note ?? 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-medium ${(result.note ?? 0) >= 10 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {getNoteLabel(result.note ?? 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      Semester {result.semestre}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {result.annee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-gray-600">Excellent (16-20)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-600">Bien (14-15)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary-500" />
            <span className="text-gray-600">Assez bien (12-13)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-gray-600">Passable (10-11)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-600">Insuffisant (0-9)</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};
