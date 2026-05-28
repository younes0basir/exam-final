import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { adminService } from '../../services/adminService';
import { Toast } from '../../components/ui/Toast';

interface Salle {
  id: number;
  nom: string;
  capacite: number;
  type: string;
  equipements?: string;
}

export const SallesPage: React.FC = () => {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [creatingSalle, setCreatingSalle] = useState(false);
  const [editingSalle, setEditingSalle] = useState<Salle | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Salle | null>(null);

  useEffect(() => {
    fetchSalles();
  }, []);

  const fetchSalles = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSalles();
      setSalles(data);
    } catch (error) {
      console.error('Error fetching salles:', error);
      setToast({ message: 'Erreur lors du chargement des salles', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCreatingSalle(true);
  };

  const handleEdit = (salle: Salle) => {
    setEditingSalle(salle);
  };

  const handleDelete = (salle: Salle) => {
    setDeleteConfirm(salle);
  };

  const handleCreateSalle = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      nom: (form.elements.namedItem('nom') as HTMLInputElement).value,
      capacite: parseInt((form.elements.namedItem('capacite') as HTMLInputElement).value),
      type: (form.elements.namedItem('type') as HTMLSelectElement).value,
      equipements: (form.elements.namedItem('equipements') as HTMLInputElement).value,
    };

    try {
      await adminService.createSalle(data);
      setToast({ message: 'Salle créée avec succès', type: 'success' });
      setCreatingSalle(false);
      fetchSalles();
    } catch (error) {
      console.error('Error creating salle:', error);
      setToast({ message: 'Échec de la création', type: 'error' });
    }
  };

  const handleUpdateSalle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSalle) return;

    const form = e.target as HTMLFormElement;
    const data = {
      nom: (form.elements.namedItem('nom') as HTMLInputElement).value,
      capacite: parseInt((form.elements.namedItem('capacite') as HTMLInputElement).value),
      type: (form.elements.namedItem('type') as HTMLSelectElement).value,
      equipements: (form.elements.namedItem('equipements') as HTMLInputElement).value,
    };

    try {
      await adminService.updateSalle(editingSalle.id, data);
      setToast({ message: 'Salle modifiée avec succès', type: 'success' });
      setEditingSalle(null);
      fetchSalles();
    } catch (error) {
      console.error('Error updating salle:', error);
      setToast({ message: 'Échec de la modification', type: 'error' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await adminService.deleteSalle(deleteConfirm.id);
      setToast({ message: 'Salle supprimée avec succès', type: 'success' });
      setDeleteConfirm(null);
      fetchSalles();
    } catch (error) {
      console.error('Error deleting salle:', error);
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Salles</h1>
            <p className="text-gray-500">Gérer les salles de cours</p>
          </div>
          <button onClick={handleCreate} className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter une salle
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nom</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Capacité</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Équipements</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salles.map((salle) => (
                  <tr key={salle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{salle.nom}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{salle.capacite} places</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{salle.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{salle.equipements || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(salle)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(salle)}
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

        {/* Create Salle Modal */}
        {creatingSalle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ajouter une salle</h2>
              <form onSubmit={handleCreateSalle}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    placeholder="ex: Salle A101"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacité</label>
                  <input
                    type="number"
                    name="capacite"
                    placeholder="ex: 30"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="salle_cours">Salle de cours</option>
                    <option value="amphitheatre">Amphithéâtre</option>
                    <option value="labo">Laboratoire</option>
                    <option value="bureaux">Bureaux</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Équipements</label>
                  <input
                    type="text"
                    name="equipements"
                    placeholder="ex: Vidéoprojecteur, Tableau blanc"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCreatingSalle(false)}
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

        {/* Edit Salle Modal */}
        {editingSalle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Modifier la salle</h2>
              <form onSubmit={handleUpdateSalle}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    defaultValue={editingSalle.nom}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacité</label>
                  <input
                    type="number"
                    name="capacite"
                    defaultValue={editingSalle.capacite}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    defaultValue={editingSalle.type}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="salle_cours">Salle de cours</option>
                    <option value="amphitheatre">Amphithéâtre</option>
                    <option value="labo">Laboratoire</option>
                    <option value="bureaux">Bureaux</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Équipements</label>
                  <input
                    type="text"
                    name="equipements"
                    defaultValue={editingSalle.equipements || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingSalle(null)}
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
                Êtes-vous sûr de vouloir supprimer la salle <strong>{deleteConfirm.nom}</strong> ?
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
