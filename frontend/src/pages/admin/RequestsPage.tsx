import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { adminService, AdministrativeDemande } from '../../services/adminService';
import { Toast } from '../../components/ui/Toast';

export const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<AdministrativeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await adminService.getRequests();
      const requestsArray = Array.isArray(data) ? data : (data as any)?.requests;
      setRequests(Array.isArray(requestsArray) ? requestsArray : []);
    } catch (error) {
      console.error('Echec de recuperation des demandes :', error);
      setToast({ message: 'Echec du chargement des demandes', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatut = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await adminService.updateRequestStatus(id, status);
      setToast({ message: `Demande ${status} avec succes`, type: 'success' });
      fetchRequests();
    } catch (error) {
      setToast({ message: 'Echec de mise a jour de la demande', type: 'error' });
    }
  };

  const getStatutColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'certificate':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'transcript':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Demandes administratives</h1>
            <p className="text-gray-500">Gerer les demandes et validations</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass-card rounded-xl px-4 py-2">
              <span className="text-sm text-gray-500">En attente : </span>
              <span className="font-bold text-amber-600">
                {requests.filter(r => r.statut === 'pending').length}
              </span>
            </div>
          </div>
        </div>

        {/* Liste des demandes */}
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="glass-card rounded-2xl p-6 hover-lift">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center text-primary-600">
                    {getTypeIcon(request.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800">{request.type}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatutColor(request.statut)}`}>
                        {request.statut}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {request.etudiant_nom}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(request.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {request.statut === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatut(request.id, 'approved')}
                      className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Valider
                    </button>
                    <button
                      onClick={() => handleUpdateStatut(request.id, 'rejected')}
                      className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Refuser
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
