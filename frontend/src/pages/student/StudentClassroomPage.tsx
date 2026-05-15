import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { studentService, Annonce, Commentaire } from '../../services/studentService';
import { Toast } from '../../components/ui/Toast';

export const StudentClassroomPage: React.FC = () => {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAnnonces();
      setAnnonces(data);
    } catch (error) {
      console.error('Echoues to fetch announcements:', error);
      setToast({ message: 'Echoues to load announcements', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const openCommentaires = async (annonce: Annonce) => {
    setSelectedAnnonce(annonce);
    try {
      const data = await studentService.getCommentaires(annonce.id);
      setCommentaires(data);
    } catch (error) {
      console.error('Echoues to fetch comments:', error);
      setToast({ message: 'Echoues to load comments', type: 'error' });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedAnnonce) return;
    try {
      await studentService.addCommentaire(selectedAnnonce.id, newComment);
      setNewComment('');
      const data = await studentService.getCommentaires(selectedAnnonce.id);
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
          <p className="text-gray-500">Consultez les annonces et interagissez avec vos professeurs</p>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {annonces.map((annonce) => (
            <div key={annonce.id} className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {annonce.professeur?.name?.charAt(0) || 'P'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{annonce.professeur?.name}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{new Date(annonce.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    {annonce.module?.nom}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{annonce.titre}</h3>
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{annonce.contenu}</p>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => openCommentaires(annonce)}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {annonce.commentaires?.length || 0} Commentaires
                </button>
              </div>
            </div>
          ))}
          {annonces.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucune annonce pour vos modules pour le moment.
            </div>
          )}
        </div>
      </div>

      {/* Commentaires Modal */}
      {selectedAnnonce && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Commentaires</h2>
                <p className="text-sm text-gray-500">{selectedAnnonce.titre}</p>
              </div>
              <button
                onClick={() => setSelectedAnnonce(null)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {commentaires.map((comment) => (
                <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                        {comment.user?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="font-semibold text-gray-800">{comment.user?.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700 ml-10">{comment.contenu}</p>
                </div>
              ))}
              {commentaires.length === 0 && (
                <p className="text-center text-gray-500 py-4">Aucun commentaire. Soyez le premier a commenter !</p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
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
    </Layout>
  );
};
