import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { professorService, Annonce, Commentaire, Module } from '../../services/professorService';
import { Toast } from '../../components/ui/Toast';

export const ProfessorClassroomPage: React.FC = () => {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'annonces' | 'documents'>('annonces');
  const [showAnnonceModal, setShowAnnonceModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [newComment, setNewComment] = useState('');

  const [annonceForm, setAnnonceForm] = useState({
    module_id: '',
    titre: '',
    contenu: ''
  });

  const [documentForm, setDocumentForm] = useState({
    module_id: '',
    titre: '',
    type: 'Cours' as 'Cours' | 'TD' | 'TP' | 'Autre',
    file: null as File | null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [annoncesData, modulesData] = await Promise.all([
        professorService.getAnnonces(),
        professorService.getClassroomModules()
      ]);
      setAnnonces(annoncesData);
      setModules(modulesData);
    } catch (error) {
      console.error('Echoues to fetch data:', error);
      setToast({ message: 'Echoues to load data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreerAnnonce = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await professorService.createAnnonce({
        module_id: Number(annonceForm.module_id),
        titre: annonceForm.titre,
        contenu: annonceForm.contenu
      });
      setToast({ message: 'Announcement created avec succes', type: 'success' });
      setShowAnnonceModal(false);
      setAnnonceForm({ module_id: '', titre: '', contenu: '' });
      fetchData();
    } catch (error) {
      console.error('Echoues to create announcement:', error);
      setToast({ message: 'Echoues to create announcement', type: 'error' });
    }
  };

  const handleSupprimerAnnonce = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await professorService.deleteAnnonce(id);
      setToast({ message: 'Announcement deleted avec succes', type: 'success' });
      fetchData();
    } catch (error) {
      console.error('Echoues to delete announcement:', error);
      setToast({ message: 'Echoues to delete announcement', type: 'error' });
    }
  };

  const handleTeleverserDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentForm.file) {
      setToast({ message: 'Veuillez selectionner un fichier', type: 'error' });
      return;
    }
    try {
      const formData = new FormData();
      formData.append('module_id', documentForm.module_id);
      formData.append('titre', documentForm.titre);
      formData.append('type', documentForm.type);
      formData.append('document', documentForm.file);

      await professorService.uploadDocument(formData);
      setToast({ message: 'Document uploaded avec succes', type: 'success' });
      setShowDocumentModal(false);
      setDocumentForm({ module_id: '', titre: '', type: 'Cours', file: null });
    } catch (error) {
      console.error('Echoues to upload document:', error);
      setToast({ message: 'Echoues to upload document', type: 'error' });
    }
  };

  const openCommentaires = async (annonce: Annonce) => {
    setSelectedAnnonce(annonce);
    try {
      const data = await professorService.getCommentaires(annonce.id);
      setCommentaires(data);
    } catch (error) {
      console.error('Echoues to fetch comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedAnnonce) return;
    try {
      await professorService.addCommentaire(selectedAnnonce.id, newComment);
      setNewComment('');
      const data = await professorService.getCommentaires(selectedAnnonce.id);
      setCommentaires(data);
      setToast({ message: 'Comment added avec succes', type: 'success' });
    } catch (error) {
      console.error('Echoues to add comment:', error);
      setToast({ message: 'Echoues to add comment', type: 'error' });
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Classroom</h1>
          <p className="text-gray-500">Gerer les annonces et supports de cours</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('annonces')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'annonces' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'documents' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Documents
          </button>
        </div>

        {/* Actions */}
        <div className="mb-6">
          {activeTab === 'annonces' ? (
            <button
              onClick={() => setShowAnnonceModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Announcement
            </button>
          ) : (
            <button
              onClick={() => setShowDocumentModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Televerser Document
            </button>
          )}
        </div>

        {/* Content */}
        {activeTab === 'annonces' ? (
          <div className="space-y-4">
            {annonces.map((annonce) => (
              <div key={annonce.id} className="glass-card rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      {annonce.module?.nom}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mt-2">{annonce.titre}</h3>
                    <p className="text-sm text-gray-500">Publiered on {new Date(annonce.created_at).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleSupprimerAnnonce(annonce.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-700 mb-4">{annonce.contenu}</p>
                <button
                  onClick={() => openCommentaires(annonce)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  View Commentaires ({annonce.commentaires?.length || 0})
                </button>
              </div>
            ))}
            {annonces.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Aucune annonce pour le moment. Creez votre premiere annonce !
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Document management coming soon. Use the Televerser button to add documents.
          </div>
        )}
      </div>

      {/* New Announcement Modal */}
      {showAnnonceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">New Announcement</h2>
            <form onSubmit={handleCreerAnnonce} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                <select
                  required
                  value={annonceForm.module_id}
                  onChange={(e) => setAnnonceForm({ ...annonceForm, module_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selectionner un module</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>{module.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={annonceForm.titre}
                  onChange={(e) => setAnnonceForm({ ...annonceForm, titre: e.target.value })}
                  placeholder="Announcement title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  required
                  value={annonceForm.contenu}
                  onChange={(e) => setAnnonceForm({ ...annonceForm, contenu: e.target.value })}
                  placeholder="Announcement content..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAnnonceModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Publier Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Commentaires Modal */}
      {selectedAnnonce && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">Commentaires</h2>
              <button
                onClick={() => setSelectedAnnonce(null)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-4">{selectedAnnonce.titre}</p>

            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {commentaires.map((comment) => (
                <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-800">{comment.user?.name}</span>
                    <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700">{comment.contenu}</p>
                </div>
              ))}
              {commentaires.length === 0 && (
                <p className="text-center text-gray-500">Aucun commentaire pour le moment</p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Publier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Televerser Document Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Televerser Document</h2>
            <form onSubmit={handleTeleverserDocument} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                <select
                  required
                  value={documentForm.module_id}
                  onChange={(e) => setDocumentForm({ ...documentForm, module_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selectionner un module</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>{module.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={documentForm.titre}
                  onChange={(e) => setDocumentForm({ ...documentForm, titre: e.target.value })}
                  placeholder="Document title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  required
                  value={documentForm.type}
                  onChange={(e) => setDocumentForm({ ...documentForm, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cours">Cours</option>
                  <option value="TD">TD</option>
                  <option value="TP">TP</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => setDocumentForm({ ...documentForm, file: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Accepted: PDF, DOC, DOCX, PPT, PPTX (max 10MB)</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDocumentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Televerser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
