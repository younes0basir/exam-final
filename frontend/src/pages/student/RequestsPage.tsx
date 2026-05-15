import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { studentService, Demande } from '../../services/studentService';
import { Toast } from '../../components/ui/Toast';
import { FloatingInput } from '../../components/ui/FloatingInput';

const requestTypes = [
  { value: 'certificate', label: 'Certificate of Enrollment', icon: '📜' },
  { value: 'transcript', label: 'Academic Transcript', icon: '📄' },
  { value: 'attestation', label: 'Attendance Certificate', icon: '✅' },
  { value: 'internship', label: 'Internship Certificate', icon: '💼' },
  { value: 'other', label: 'Other', icon: '📝' },
];

export const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newRequest, setNewRequest] = useState({ type: '', description: '' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await studentService.getRequests();
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
      await studentService.createRequest(newRequest);
      setToast({ message: 'Demande soumise avec succes', type: 'success' });
      setShowForm(false);
      setNewRequest({ type: '', description: '' });
      fetchRequests();
    } catch (error) {
      setToast({ message: 'Echec de soumission de la demande', type: 'error' });
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
    const found = requestTypes.find(t => t.value === type);
    return found?.icon || '📝';
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes demandes</h1>
            <p className="text-gray-500">Submit and track administrative requests</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
          >
            {showForm ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annuler
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouvelle demande
              </>
            )}
          </button>
        </div>

        {/* Nouvelle demande Form */}
        {showForm && (
          <div className="glass-card rounded-2xl p-6 mb-8 animate-slide-up">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Submit Nouvelle demande</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Demande Type</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {requestTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setNewRequest({ ...newRequest, type: type.value })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        newRequest.type === type.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{type.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  placeholder="Provide additional details about your request..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newRequest.type}
                  className="btn-primary px-8 py-3 rounded-xl text-white font-semibold disabled:opacity-50"
                >
                  Soumettre la demande
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-gray-500">Total Requests</p>
            <p className="text-2xl font-bold text-gray-800">{requests.length}</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-gray-500">Validerd</p>
            <p className="text-2xl font-bold text-emerald-600">
              {requests.filter(r => r.statut === 'approved').length}
            </p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-gray-500">En attente</p>
            <p className="text-2xl font-bold text-amber-600">
              {requests.filter(r => r.statut === 'pending').length}
            </p>
          </div>
        </div>

        {/* Liste des demandes */}
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="glass-card rounded-2xl p-6 hover-lift">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center text-3xl">
                    {getTypeIcon(request.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800 capitalize">{request.type}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatutColor(request.statut)}`}>
                        {request.statut}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                    <p className="text-xs text-gray-400">
                      Submitted on {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
