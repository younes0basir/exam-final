import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { adminService } from '../../services/adminService';
import { Toast } from '../../components/ui/Toast';

interface Groupe {
  id: number;
  nom: string;
  filiere_id: number;
  filiere?: {
    id: number;
    nom: string;
    code: string;
  };
  students_count?: number;
}

interface Filiere {
  id: number;
  nom: string;
  code: string;
}

export const GroupesPage: React.FC = () => {
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [creatingGroupe, setCreatingGroupe] = useState(false);
  const [editingGroupe, setEditingGroupe] = useState<Groupe | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Groupe | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupesData, filieresData] = await Promise.all([
        adminService.getGroupes(),
        adminService.getFilieres(),
      ]);
      setGroupes(groupesData);
      setFilieres(filieresData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setToast({ message: 'Erreur lors du chargement des données', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCreatingGroupe(true);
  };

  const handleEdit = (groupe: Groupe) => {
    setEditingGroupe(groupe);
  };

  const handleDelete = (groupe: Groupe) => {
    setDeleteConfirm(groupe);
  };

  const handleCreateGroupe = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      nom: (form.elements.namedItem('nom') as HTMLInputElement).value,
      filiere_id: parseInt((form.elements.namedItem('filiere_id') as HTMLSelectElement).value),
    };

    try {
      await adminService.createGroupe(data);
      setToast({ message: 'Groupe créé avec succès', type: 'success' });
      setCreatingGroupe(false);
      fetchData();
    } catch (error) {
      console.error('Error creating groupe:', error);
      setToast({ message: 'Échec de la création', type: 'error' });
    }
  };

  const handleUpdateGroupe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroupe) return;

    const form = e.target as HTMLFormElement;
    const data = {
      nom: (form.elements.namedItem('nom') as HTMLInputElement).value,
      filiere_id: parseInt((form.elements.namedItem('filiere_id') as HTMLSelectElement).value),
    };

    try {
      await adminService.updateGroupe(editingGroupe.id, data);
      setToast({ message: 'Groupe modifié avec succès', type: 'success' });
      setEditingGroupe(null);
      fetchData();
    } catch (error) {
      console.error('Error updating groupe:', error);
      setToast({ message: 'Échec de la modification', type: 'error' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await adminService.deleteGroupe(deleteConfirm.id);
      setToast({ message: 'Groupe supprimé avec succès', type: 'success' });
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting groupe:', error);
      setToast({ message: 'Échec de la suppression', type: 'error' });
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Groupes (Classes)</h1>
            <p className="text-gray-500">Gérer les classes et leurs filières</p>
          </div>
          <button onClick={handleCreate} className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un groupe
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Groupe</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Filière</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Étudiants</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {groupes.map((groupe) => (
                  <tr key={groupe.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{groupe.nom}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{groupe.filiere?.nom || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{groupe.students_count || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(groupe)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(groupe)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Groupe Modal */}
        {creatingGroupe && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ajouter un groupe</h2>
              <form onSubmit={handleCreateGroupe}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    placeholder="ex: GINFO3A"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
                  <select
                    name="filiere_id"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner une filière</option>
                    {filieres.map((filiere) => (
                      <option key={filiere.id} value={filiere.id}>
                        {filiere.nom} ({filiere.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCreatingGroupe(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Groupe Modal */}
        {editingGroupe && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Modifier le groupe</h2>
              <form onSubmit={handleUpdateGroupe}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    defaultValue={editingGroupe.nom}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
                  <select
                    name="filiere_id"
                    defaultValue={editingGroupe.filiere_id}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {filieres.map((filiere) => (
                      <option key={filiere.id} value={filiere.id}>
                        {filiere.nom} ({filiere.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingGroupe(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Confirmer la suppression</h2>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer le groupe <strong>{deleteConfirm.nom}</strong> ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
