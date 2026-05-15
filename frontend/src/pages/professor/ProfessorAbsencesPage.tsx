import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { professorService, Absence, Module } from '../../services/professorService';
import { Toast } from '../../components/ui/Toast';

export const ProfessorAbsencesPage: React.FC = () => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<number | ''>('');
  const [formData, setFormData] = useState({
    student_id: '',
    module_id: '',
    date_absence: '',
    seance_debut: '',
    seance_fin: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [absencesData, modulesData] = await Promise.all([
        professorService.getAbsences(),
        professorService.getModules()
      ]);
      setAbsences(absencesData);
      setModules(modulesData);
    } catch (error) {
      console.error('Echoues to fetch data:', error);
      setToast({ message: 'Echoues to load data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await professorService.createAbsence({
        student_id: Number(formData.student_id),
        module_id: Number(formData.module_id),
        date_absence: formData.date_absence,
        seance_debut: formData.seance_debut,
        seance_fin: formData.seance_fin
      });
      setToast({ message: 'Absence recorded avec succes', type: 'success' });
      setShowModal(false);
      setFormData({ student_id: '', module_id: '', date_absence: '', seance_debut: '', seance_fin: '' });
      fetchData();
    } catch (error) {
      console.error('Echoues to create absence:', error);
      setToast({ message: 'Echoues to record absence', type: 'error' });
    }
  };

  const handleSupprimer = async (id: number) => {
    if (!confirm('Are you sure you want to delete this absence?')) return;
    try {
      await professorService.deleteAbsence(id);
      setToast({ message: 'Absence deleted avec succes', type: 'success' });
      fetchData();
    } catch (error) {
      console.error('Echoues to delete absence:', error);
      setToast({ message: 'Echoues to delete absence', type: 'error' });
    }
  };

  const getJustificationBadge = (absence: Absence) => {
    if (absence.est_justifie) {
      return <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Justified</span>;
    }
    if (absence.statut_justification === 'pending' && absence.justification_file) {
      return <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">En attente</span>;
    }
    return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Not Justified</span>;
  };

  const filteredAbsences = selectedModule
    ? absences.filter(a => a.module_id === selectedModule)
    : absences;

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
        <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Absences Management</h1>
            <p className="text-gray-500">Track and manage student absences</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Record Absence
          </button>
        </div>

        {/* Filtrer */}
        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filtrer by Module:</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value ? Number(e.target.value) : '')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Modules</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>{module.nom}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Absences List */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Etudiant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Module</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAbsences.map((absence) => (
                <tr key={absence.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{absence.student?.name}</td>
                  <td className="px-6 py-4 text-gray-600">{absence.module?.nom}</td>
                  <td className="px-6 py-4 text-gray-600">{absence.date_absence}</td>
                  <td className="px-6 py-4 text-gray-600">{absence.seance_debut} - {absence.seance_fin}</td>
                  <td className="px-6 py-4">{getJustificationBadge(absence)}</td>
                  <td className="px-6 py-4">
                    {!absence.est_justifie && (
                      <button
                        onClick={() => handleSupprimer(absence.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer absence"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredAbsences.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Aucune absence trouvee pour le module selectionne.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Absence Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Record Absence</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                <select
                  required
                  value={formData.module_id}
                  onChange={(e) => setFormData({ ...formData, module_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selectionner un module</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>{module.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Etudiant ID</label>
                <input
                  type="number"
                  required
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  placeholder="Enter student ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date_absence}
                  onChange={(e) => setFormData({ ...formData, date_absence: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formData.seance_debut}
                    onChange={(e) => setFormData({ ...formData, seance_debut: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={formData.seance_fin}
                    onChange={(e) => setFormData({ ...formData, seance_fin: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Record Absence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
