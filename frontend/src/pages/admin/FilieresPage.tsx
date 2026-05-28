import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { adminService, Filiere } from '../../services/adminService';
import { Toast } from '../../components/ui/Toast';

interface Groupe {
  id: number;
  nom: string;
}

interface Module {
  id: number;
  nom: string;
}

interface Professor {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface NewGroupe {
  nom: string;
}

interface NewModule {
  nom: string;
  professors: number[];
}

export const FilieresPage: React.FC = () => {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [editingFiliere, setEditingFiliere] = useState<Filiere | null>(null);
  const [creatingFiliere, setCreatingFiliere] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Filiere | null>(null);
  const [creationStep, setCreationStep] = useState(1);
  const [newFiliereData, setNewFiliereData] = useState({
    nom: '',
    code: '',
    description: '',
  });
  const [newGroupes, setNewGroupes] = useState<NewGroupe[]>([]);
  const [newModules, setNewModules] = useState<NewModule[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);

  useEffect(() => {
    fetchFilieres();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await adminService.getUsers();
      const userArray = Array.isArray(response)
        ? response
        : (response as any).data || [];
      setProfessors(userArray.filter((p: Professor) => p.role === 'professor'));
      setCreatingFiliere(true);
      setCreationStep(1);
      setNewFiliereData({ nom: '', code: '', description: '' });
      setNewGroupes([]);
      setNewModules([]);
    } catch (error) {
      console.error('Error fetching professors:', error);
      setToast({ message: 'Erreur lors du chargement des professeurs', type: 'error' });
    }
  };

  const fetchFilieres = async () => {
    try {
      setLoading(true);
      const data = await adminService.getFilieres();
      setFilieres(data);
    } catch (error) {
      console.error('Echoues to fetch filieres:', error);
      setToast({ message: 'Echec du chargement des filieres', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (filiere: Filiere) => {
    setEditingFiliere(filiere);
  };

  const handleDelete = (filiere: Filiere) => {
    setDeleteConfirm(filiere);
  };

  const handleCreateFiliere = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creationStep < 3) {
      setCreationStep(creationStep + 1);
      return;
    }

    try {
      const data = {
        ...newFiliereData,
        groupes: newGroupes,
        modules: newModules,
      };
      await adminService.createFiliere(data);
      setToast({ message: 'Filière créée avec succès', type: 'success' });
      setCreatingFiliere(false);
      setCreationStep(1);
      fetchFilieres();
    } catch (error) {
      console.error('Error creating filiere:', error);
      setToast({ message: 'Échec de la création', type: 'error' });
    }
  };

  const handlePreviousStep = () => {
    setCreationStep(creationStep - 1);
  };

  const handleAddGroupe = () => {
    const nom = prompt('Nom du groupe (ex: GINFO3A):');
    if (nom && nom.trim()) {
      setNewGroupes([...newGroupes, { nom: nom.trim() }]);
    }
  };

  const handleRemoveGroupe = (index: number) => {
    setNewGroupes(newGroupes.filter((_, i) => i !== index));
  };

  const handleAddModule = () => {
    const nom = prompt('Nom du module (ex: Algorithmique):');
    if (nom && nom.trim()) {
      setNewModules([...newModules, { nom: nom.trim(), professors: [] }]);
    }
  };

  const handleRemoveModule = (index: number) => {
    setNewModules(newNewModules => newNewModules.filter((_, i) => i !== index));
  };

  const handleToggleProfessor = (moduleIndex: number, professorId: number) => {
    const updatedModules = [...newModules];
    const module = updatedModules[moduleIndex];
    if (module.professors.includes(professorId)) {
      module.professors = module.professors.filter(id => id !== professorId);
    } else {
      module.professors = [...module.professors, professorId];
    }
    setNewModules(updatedModules);
  };

  const handleUpdateFiliere = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFiliere) return;

    const form = e.target as HTMLFormElement;
    const data = {
      nom: (form.elements.namedItem('nom') as HTMLInputElement).value,
      code: (form.elements.namedItem('code') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLInputElement).value,
    };

    try {
      await adminService.updateFiliere(editingFiliere.id, data);
      setToast({ message: 'Filière modifiée avec succès', type: 'success' });
      setEditingFiliere(null);
      fetchFilieres();
    } catch (error) {
      console.error('Error updating filiere:', error);
      setToast({ message: 'Échec de la modification', type: 'error' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await adminService.deleteFiliere(deleteConfirm.id);
      setToast({ message: 'Filière supprimée avec succès', type: 'success' });
      setDeleteConfirm(null);
      fetchFilieres();
    } catch (error) {
      console.error('Error deleting filiere:', error);
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Filieres academiques</h1>
            <p className="text-gray-500">Gerer les filieres et specialites</p>
          </div>
          <button onClick={handleCreate} className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter une filiere
          </button>
        </div>

        {/* Filieres Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filieres.map((filiere) => (
            <div key={filiere.id} className="glass-card rounded-2xl p-6 hover-lift card-3d">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">{filiere.nom.charAt(0)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(filiere)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(filiere)} className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-1">{filiere.nom}</h3>
              <p className="text-sm text-gray-500 mb-4">Code : {filiere.code}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{filiere.groupes_count || 0} Groupes</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{filiere.modules_count || 0} Modules</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Filiere Modal - Multi-step Wizard */}
        {creatingFiliere && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ajouter une filière</h2>
              
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${creationStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'} font-semibold`}>
                      {step}
                    </div>
                    {step < 3 && <div className={`w-16 h-1 mx-2 ${creationStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>

              {/* Step 1: Basic Information */}
              {creationStep === 1 && (
                <form onSubmit={handleCreateFiliere}>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Informations de base</h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                      <input
                        type="text"
                        value={newFiliereData.nom}
                        onChange={(e) => setNewFiliereData({ ...newFiliereData, nom: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                      <input
                        type="text"
                        value={newFiliereData.code}
                        onChange={(e) => setNewFiliereData({ ...newFiliereData, code: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={newFiliereData.description}
                        onChange={(e) => setNewFiliereData({ ...newFiliereData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCreatingFiliere(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Suivant
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Add Groups */}
              {creationStep === 2 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Groupes</h3>
                  <p className="text-sm text-gray-500 mb-4">Ajoutez les groupes d'étudiants pour cette filière</p>
                  
                  <button
                    type="button"
                    onClick={handleAddGroupe}
                    className="w-full mb-4 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                  >
                    + Ajouter un groupe
                  </button>

                  <div className="space-y-2 mb-6">
                    {newGroupes.map((groupe, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{groupe.nom}</span>
                        <button
                          onClick={() => handleRemoveGroupe(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={handleCreateFiliere}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Add Modules */}
              {creationStep === 3 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Modules</h3>
                  <p className="text-sm text-gray-500 mb-4">Ajoutez les modules et assignez des professeurs</p>
                  
                  <button
                    type="button"
                    onClick={handleAddModule}
                    className="w-full mb-4 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                  >
                    + Ajouter un module
                  </button>

                  <div className="space-y-4 mb-6">
                    {newModules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{module.nom}</span>
                          <button
                            onClick={() => handleRemoveModule(moduleIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {professors.map(prof => (
                            <button
                              key={prof.id}
                              type="button"
                              onClick={() => handleToggleProfessor(moduleIndex, prof.id)}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                module.professors.includes(prof.id)
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                            >
                              {prof.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={handleCreateFiliere}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Terminer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Filiere Modal */}
        {editingFiliere && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Modifier la filière</h2>
              <form onSubmit={handleUpdateFiliere}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    defaultValue={editingFiliere.nom}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    name="code"
                    defaultValue={editingFiliere.code}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingFiliere.description || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingFiliere(null)}
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
                Êtes-vous sûr de vouloir supprimer la filière <strong>{deleteConfirm.nom}</strong> ?
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
