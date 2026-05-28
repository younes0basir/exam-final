import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { adminService } from '../../services/adminService';
import { Toast } from '../../components/ui/Toast';

interface Module {
  id: number;
  nom: string;
  filiere_id: number;
  filiere?: {
    id: number;
    nom: string;
    code: string;
  };
  professors?: Professor[];
}

interface Professor {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Filiere {
  id: number;
  nom: string;
  code: string;
}

export const ModulesPage: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [creatingModule, setCreatingModule] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Module | null>(null);
  const [assigningProfessors, setAssigningProfessors] = useState<Module | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [modulesData, filieresData, usersData] = await Promise.all([
        adminService.getModules(),
        adminService.getFilieres(),
        adminService.getUsers(),
      ]);

      const userArray = Array.isArray(usersData)
        ? usersData
        : (usersData as any).data || [];
      setModules(modulesData);
      setFilieres(filieresData);
      setProfessors(userArray.filter((p: Professor) => p.role === 'professor'));
    } catch (error) {
      console.error('Error fetching data:', error);
      setToast({ message: 'Erreur lors du chargement des données', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCreatingModule(true);
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
  };

  const handleDelete = (module: Module) => {
    setDeleteConfirm(module);
  };

  const handleAssignProfessors = (module: Module) => {
    setAssigningProfessors(module);
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      nom: (form.elements.namedItem('nom') as HTMLInputElement).value,
      filiere_id: parseInt((form.elements.namedItem('filiere_id') as HTMLSelectElement).value),
    };

    try {
      await adminService.createModule(data);
      setToast({ message: 'Module créé avec succès', type: 'success' });
      setCreatingModule(false);
      fetchData();
    } catch (error) {
      console.error('Error creating module:', error);
      setToast({ message: 'Échec de la création', type: 'error' });
    }
  };

  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;

    const form = e.target as HTMLFormElement;
    const data = {
      nom: (form.elements.namedItem('nom') as HTMLInputElement).value,
      filiere_id: parseInt((form.elements.namedItem('filiere_id') as HTMLSelectElement).value),
    };

    try {
      await adminService.updateModule(editingModule.id, data);
      setToast({ message: 'Module modifié avec succès', type: 'success' });
      setEditingModule(null);
      fetchData();
    } catch (error) {
      console.error('Error updating module:', error);
      setToast({ message: 'Échec de la modification', type: 'error' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await adminService.deleteModule(deleteConfirm.id);
      setToast({ message: 'Module supprimé avec succès', type: 'success' });
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting module:', error);
      setToast({ message: 'Échec de la suppression', type: 'error' });
    }
  };

  const handleToggleProfessor = async (moduleId: number, professorId: number) => {
    try {
      await adminService.toggleProfessor(moduleId, professorId);
      fetchData();
      setToast({ message: 'Professeur assigné avec succès', type: 'success' });
    } catch (error) {
      console.error('Error toggling professor:', error);
      setToast({ message: 'Échec de l\'assignation', type: 'error' });
    }
  };

  const isProfessorAssigned = (module: Module, professorId: number) => {
    return module.professors?.some(p => p.id === professorId);
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Modules</h1>
            <p className="text-gray-500">Gérer les modules et leurs professeurs</p>
          </div>
          <button onClick={handleCreate} className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un module
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Module</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Filière</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Professeurs</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {modules.map((module) => (
                  <tr key={module.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{module.nom}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{module.filiere?.nom || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {module.professors?.map((prof) => (
                          <span key={prof.id} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {prof.name}
                          </span>
                        ))}
                        {(!module.professors || module.professors.length === 0) && (
                          <span className="text-gray-400 text-sm">Aucun</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAssignProfessors(module)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Assigner des professeurs"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(module)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(module)}
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

        {/* Create Module Modal */}
        {creatingModule && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ajouter un module</h2>
              <form onSubmit={handleCreateModule}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="nom"
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
                    onClick={() => setCreatingModule(false)}
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

        {/* Edit Module Modal */}
        {editingModule && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Modifier le module</h2>
              <form onSubmit={handleUpdateModule}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    defaultValue={editingModule.nom}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
                  <select
                    name="filiere_id"
                    defaultValue={editingModule.filiere_id}
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
                    onClick={() => setEditingModule(null)}
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
                Êtes-vous sûr de vouloir supprimer le module <strong>{deleteConfirm.nom}</strong> ?
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

        {/* Assign Professors Modal */}
        {assigningProfessors && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Assigner des professeurs à {assigningProfessors.nom}
              </h2>
              <div className="space-y-2 mb-6">
                {professors.map((prof) => (
                  <div
                    key={prof.id}
                    onClick={() => handleToggleProfessor(assigningProfessors.id, prof.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      isProfessorAssigned(assigningProfessors, prof.id)
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div>
                      <span className="font-medium text-gray-900">{prof.name}</span>
                      <p className="text-sm text-gray-500">{prof.email}</p>
                    </div>
                    {isProfessorAssigned(assigningProfessors, prof.id) && (
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setAssigningProfessors(null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
