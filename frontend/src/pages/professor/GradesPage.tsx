import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { professorService, Module, NotesResponse } from '../../services/professorService';
import { Toast } from '../../components/ui/Toast';

interface EtudiantNote {
  studentId: number;
  studentNom: string;
  cc1: string;
  cc2: string;
  examen: string;
  noteFinalee: number | null;
}

export const NotesPage: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<number | ''>('');
  const [studentNotes, setEtudiantNotes] = useState<EtudiantNote[]>([]);
  const [moduleInfo, setModuleInfo] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      fetchNotes();
    } else {
      setEtudiantNotes([]);
      setModuleInfo(null);
    }
  }, [selectedModule]);

  const fetchModules = async () => {
    try {
      const data = await professorService.getModules();
      setModules(data);
    } catch (error) {
      console.error('Echoues to fetch modules:', error);
      setToast({ message: 'Echec du chargement des modules', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    if (!selectedModule) return;
    try {
      setLoading(true);
      const data: NotesResponse = await professorService.getNotes(selectedModule);
      setModuleInfo(data.module);

      const grades: EtudiantNote[] = data.students.map((student) => {
        const existingNote = data.existingNotes[student.id];
        const cc1 = existingNote?.cc1?.toString() || '';
        const cc2 = existingNote?.cc2?.toString() || '';
        const examen = existingNote?.examen?.toString() || '';
        return {
          studentId: student.id,
          studentNom: student.name,
          cc1,
          cc2,
          examen,
          noteFinalee: existingNote?.note_finale || null,
        };
      });
      setEtudiantNotes(grades);
    } catch (error: any) {
      console.error('Echoues to fetch grades:', error);
      setToast({ message: error.response?.data?.message || 'Echec du chargement des notes', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const calculateFinaleNote = (cc1: number, cc2: number, examen: number): number => {
    return Math.round(((cc1 + cc2) / 2) * 0.4 + examen * 0.6 * 100) / 100;
  };

  const handleNoteChange = (studentId: number, field: 'cc1' | 'cc2' | 'examen', value: string) => {
    setEtudiantNotes((prev) =>
      prev.map((g) => {
        if (g.studentId !== studentId) return g;
        const updated = { ...g, [field]: value };
        const cc1Num = parseFloat(updated.cc1) || 0;
        const cc2Num = parseFloat(updated.cc2) || 0;
        const examenNum = parseFloat(updated.examen) || 0;
        if (updated.cc1 && updated.cc2 && updated.examen) {
          updated.noteFinalee = calculateFinaleNote(cc1Num, cc2Num, examenNum);
        }
        return updated;
      })
    );
  };

  const handleSubmitNotes = async () => {
    if (!selectedModule) return;
    try {
      setSaving(true);
      const gradesData: Record<string, { cc1?: number; cc2?: number; examen?: number }> = {};
      studentNotes.forEach((g) => {
        gradesData[g.studentId] = {
          cc1: g.cc1 ? parseFloat(g.cc1) : undefined,
          cc2: g.cc2 ? parseFloat(g.cc2) : undefined,
          examen: g.examen ? parseFloat(g.examen) : undefined,
        };
      });
      await professorService.submitNotes(selectedModule, gradesData);
      setToast({ message: 'Notes saved avec succes', type: 'success' });
      fetchNotes();
    } catch (error) {
      console.error('Echoues to submit grades:', error);
      setToast({ message: 'Echoues to save grades', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getNoteColor = (grade: number | null) => {
    if (grade === null) return 'text-gray-500 bg-gray-100';
    if (grade >= 16) return 'text-emerald-600 bg-emerald-50';
    if (grade >= 12) return 'text-blue-600 bg-blue-50';
    if (grade >= 10) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const validNotes = studentNotes.filter((g) => g.noteFinalee !== null);
  const average = validNotes.length > 0
    ? validNotes.reduce((acc, g) => acc + (g.noteFinalee || 0), 0) / validNotes.length
    : 0;
  const passed = validNotes.filter((g) => (g.noteFinalee || 0) >= 10).length;
  const failed = validNotes.filter((g) => (g.noteFinalee || 0) < 10).length;

  if (loading && modules.length === 0) {
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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des notes</h1>
            <p className="text-gray-500">Saisir les notes CC1, CC2 et Examenen</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value ? Number(e.target.value) : '')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selectionner un module</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>{m.nom}</option>
              ))}
            </select>
            <button
              onClick={handleSubmitNotes}
              disabled={!selectedModule || saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium flex items-center gap-2"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              Enregistrer Notes
            </button>
          </div>
        </div>

        {selectedModule && moduleInfo && (
          <>
            {/* Module Info */}
            <div className="glass-card rounded-xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{moduleInfo.nom}</h2>
                  <p className="text-sm text-gray-500">
                    Code : {moduleInfo.code} | Semestre : {moduleInfo.semestre} |
                    Filiere: {typeof moduleInfo.filiere === 'object' ? moduleInfo.filiere?.nom : moduleInfo.filiere}
                  </p>
                </div>
              </div>
            </div>

            {/* Formula Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800">
                <strong>Formule :</strong> Note finale = ((CC1 + CC2) / 2) x 0.4 + Examenen x 0.6
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-card rounded-xl p-4">
                <p className="text-sm text-gray-500">Etudiants</p>
                <p className="text-2xl font-bold text-gray-800">{studentNotes.length}</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-sm text-gray-500">Moyenne</p>
                <p className="text-2xl font-bold text-blue-600">{average.toFixed(2)}</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-sm text-gray-500">Admis</p>
                <p className="text-2xl font-bold text-emerald-600">{passed}</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-sm text-gray-500">Echoues</p>
                <p className="text-2xl font-bold text-red-600">{failed}</p>
              </div>
            </div>

            {/* Notes Table */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Etudiant</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">CC1</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">CC2</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Examen</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Finale</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {studentNotes.map((grade) => (
                      <tr key={grade.studentId} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-800">{grade.studentNom}</span>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            value={grade.cc1}
                            onChange={(e) => handleNoteChange(grade.studentId, 'cc1', e.target.value)}
                            className="w-20 text-center py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="-"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            value={grade.cc2}
                            onChange={(e) => handleNoteChange(grade.studentId, 'cc2', e.target.value)}
                            className="w-20 text-center py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="-"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            value={grade.examen}
                            onChange={(e) => handleNoteChange(grade.studentId, 'examen', e.target.value)}
                            className="w-20 text-center py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="-"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-gray-800">
                            {grade.noteFinalee !== null && grade.noteFinalee !== undefined && !isNaN(Number(grade.noteFinalee))
                              ? Number(grade.noteFinalee).toFixed(2)
                              : '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {grade.noteFinalee !== null && grade.noteFinalee !== undefined && !isNaN(Number(grade.noteFinalee)) && (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getNoteColor(Number(grade.noteFinalee))}`}>
                              {Number(grade.noteFinalee) >= 10 ? 'Admis' : 'Echoues'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {!selectedModule && (
          <div className="text-center py-12 text-gray-500">
            Veuillez selectionner un module pour consulter et gerer les notes.
          </div>
        )}
      </div>
    </Layout>
  );
};
