import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { adminService, TimetableEntry } from '../../services/adminService';
import { Toast } from '../../components/ui/Toast';

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const timeSlots = ['08:30:00', '10:30:00', '12:30:00', '14:00:00', '16:00:00'];

export const TimetablePage: React.FC = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await adminService.getTimetable();
      // Handle Laravel pagination response (response.data) or direct array
      const entriesArray = Array.isArray(response) ? response : (response as any)?.data || [];
      setEntries(entriesArray);
    } catch (error) {
      console.error('Echoues to fetch timetable:', error);
      setToast({ message: 'Echec du chargement de l\'emploi du temps', type: 'error' });
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Emploi du Temps</h1>
            <p className="text-gray-500">Gestion des emplois du temps</p>
          </div>
          <button className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un creneau
          </button>
        </div>

        {/* Timetable Grid */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Heure</th>
                  {days.map(day => (
                    <th key={day} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {timeSlots.map(time => (
                  <tr key={time}>
                    <td className="px-4 py-4 font-semibold text-gray-700 bg-gray-50/50">{time.substring(0, 5)}</td>
                    {days.map(day => {
                      const entry = entries.find(e => e.jour === day && e.heure_debut === time);
                      return (
                        <td key={`${day}-${time}`} className="px-2 py-2">
                          {entry ? (
                            <div className="bg-gradient-to-br from-primary-500 to-purple-600 text-white rounded-xl p-3 shadow-lg">
                              <p className="font-semibold text-sm">{entry.module}</p>
                              <p className="text-xs opacity-90">{entry.salle}</p>
                              <p className="text-xs opacity-75">{entry.professeur}</p>
                            </div>
                          ) : (
                            <div className="h-full min-h-[80px] rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-gray-300 hover:text-gray-400 transition-colors cursor-pointer">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};
