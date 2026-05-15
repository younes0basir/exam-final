import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { professorService, Demande } from '../../services/professorService';
import { Toast } from '../../components/ui/Toast';

export const ProfessorRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Attestation de travail',
    motif: ''
  });

  const requestTypes = [
    'Attestation de travail',
    'Ordre de mission'
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await professorService.getRequests();
      setRequests(data);
    } catch (error) {
      console.error('Echec de recuperation des demandes :', error);
      setToast({ message: 'Echec du chargement des demandes', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await professorService.createRequest({
        type: formData.type,
        motif: formData.motif
      });
      setToast({ message: 'Demande soumise avec succes', type: 'success' });
      setShowModal(false);
      setFormData({ type: 'Attestation de travail', motif: '' });
      fetchRequests();
    } catch (error) {
      console.error('Echoues to create request:', error);
      setToast({ message: 'Echec de soumission de la demande', type: 'error' });
    }
  };

  const handleTelecharger = async (requestId: number) => {
    try {
      const blob = await professorService.downloadDocument(requestId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document_${requestId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Echoues to download document:', error);
      setToast({ message: 'Echec du telechargement. Verifiez que la demande est validee.', type: 'error' });
    }
  };

  const getStatutBadge = (statut: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      validated: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[statut as keyof typeof styles]}`}>
        {statut.charAt(0).toUpperCase() + statut.slice(1)}
      </span>
    );
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Requests administratives</h1>
            <p className="text-gray-500">Demander des documents officiels</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle demande
          </button>
        </div>

        {/* Liste des demandes */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Motif</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{request.type}</td>
                  <td className="px-6 py-4 text-gray-600">{request.motif || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(request.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{getStatutBadge(request.statut)}</td>
                  <td className="px-6 py-4">
                    {request.statut === 'validated' && (
                      <button
                        onClick={() => handleTelecharger(request.id)}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Telecharger le PDF
                      </button>
                    )}
                    {request.statut === 'rejected' && request.motif_rejet && (
                      <span className="text-sm text-red-600" title={request.motif_rejet}>
                        Refusered: {request.motif_rejet.substring(0, 20)}...
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Aucune demande trouvee. Creez votre premiere demande !
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nouvelle demande Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Nouvelle demande</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de document</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {requestTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif (optionnel)</label>
                <textarea
                  value={formData.motif}
                  onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                  placeholder="e.g., For bank account opening"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
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
                  Soumettre la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
