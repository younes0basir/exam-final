import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { studentService, EmploiDuTemps } from '../../services/studentService';
import { Toast } from '../../components/ui/Toast';

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const timeSlots = ['08:30:00', '10:30:00', '12:30:00', '14:00:00', '16:00:00'];

export const TimetablePage: React.FC = () => {
  const [entries, setEntries] = useState<EmploiDuTemps[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await studentService.getTimetable();
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mon Emploi du Temps</h1>
          <p className="text-gray-500">Votre emploi du temps hebdomadaire</p>
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
                              <p className="text-xs opacity-90 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {entry.salle}
                              </p>
                              <p className="text-xs opacity-75 mt-1">{entry.professeur}</p>
                            </div>
                          ) : (
                            <div className="h-full min-h-[80px] rounded-xl border-2 border-dashed border-gray-200" />
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

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-primary-500 to-purple-600" />
            <span className="text-sm text-gray-600">Seance de cours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-dashed border-gray-300" />
            <span className="text-sm text-gray-600">Free Time</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};
