import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { professorService, Reservation, Salle, Disponibilite } from '../../services/professorService';
import { Toast } from '../../components/ui/Toast';

export const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSalle, setSelectedSalle] = useState<number | ''>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([]);
  const [formData, setFormData] = useState({
    salle_id: '',
    date_reservation: '',
    heure_debut: '',
    heure_fin: '',
    motif: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reservData, sallesData] = await Promise.all([
        professorService.getReservations(),
        professorService.getSalles()
      ]);
      setReservations(reservData);
      setSalles(sallesData);
    } catch (error) {
      console.error('Echoues to fetch data:', error);
      setToast({ message: 'Echoues to load data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const checkDisponibilites = async () => {
    if (!selectedSalle || !selectedDate) {
      setToast({ message: 'Veuillez selectionner une salle et une date', type: 'error' });
      return;
    }
    try {
      const data = await professorService.getDisponibilites(Number(selectedSalle), selectedDate);
      setDisponibilites(data.occupations);
    } catch (error) {
      console.error('Echoues to fetch disponibilites:', error);
      setToast({ message: 'Echoues to load availabilities', type: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await professorService.createReservation({
        salle_id: Number(formData.salle_id),
        date_reservation: formData.date_reservation,
        heure_debut: formData.heure_debut,
        heure_fin: formData.heure_fin,
        motif: formData.motif
      });
      setToast({ message: 'Reservation request submitted avec succes', type: 'success' });
      setShowModal(false);
      setFormData({ salle_id: '', date_reservation: '', heure_debut: '', heure_fin: '', motif: '' });
      fetchData();
    } catch (error: any) {
      console.error('Echoues to create reservation:', error);
      setToast({ message: error.response?.data?.message || 'Echoues to create reservation', type: 'error' });
    }
  };

  const handleSupprimer = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await professorService.deleteReservation(id);
      setToast({ message: 'Reservation cancelled avec succes', type: 'success' });
      fetchData();
    } catch (error) {
      console.error('Echoues to delete reservation:', error);
      setToast({ message: 'Echoues to cancel reservation', type: 'error' });
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Room Reservations</h1>
            <p className="text-gray-500">Gerer vos demandes de reservation de salle</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Reservation
          </button>
        </div>

        {/* Room Availability Checker */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Check Room Availability</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
              <select
                value={selectedSalle}
                onChange={(e) => setSelectedSalle(e.target.value ? Number(e.target.value) : '')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selectionner une salle</option>
                {salles.map((salle) => (
                  <option key={salle.id} value={salle.id}>{salle.nom} (Capacity: {salle.capacite})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={checkDisponibilites}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium"
            >
              Check Availability
            </button>
          </div>

          {disponibilites.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Occupied Time Slots:</h4>
              <div className="space-y-2">
                {disponibilites.map((disp, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className={`w-2 h-2 rounded-full ${disp.type === 'emploi_du_temps' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                    <span className="text-sm font-medium">{disp.heure_debut} - {disp.heure_fin}</span>
                    <span className="text-sm text-gray-600">
                      {disp.type === 'emploi_du_temps' ? `Course: ${disp.module} (${disp.groupe})` : `Reservation: ${disp.motif || 'Reserved'}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reservations List */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Room</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Motif</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{reservation.salle?.nom}</td>
                  <td className="px-6 py-4 text-gray-600">{reservation.date_reservation}</td>
                  <td className="px-6 py-4 text-gray-600">{reservation.heure_debut} - {reservation.heure_fin}</td>
                  <td className="px-6 py-4 text-gray-600">{reservation.motif || '-'}</td>
                  <td className="px-6 py-4">{getStatutBadge(reservation.statut)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSupprimer(reservation.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Annuler reservation"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Aucune reservation trouvee. Creez votre premiere reservation !
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Reservation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">New Reservation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                <select
                  required
                  value={formData.salle_id}
                  onChange={(e) => setFormData({ ...formData, salle_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selectionner une salle</option>
                  {salles.map((salle) => (
                    <option key={salle.id} value={salle.id}>{salle.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date_reservation}
                  onChange={(e) => setFormData({ ...formData, date_reservation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formData.heure_debut}
                    onChange={(e) => setFormData({ ...formData, heure_debut: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={formData.heure_fin}
                    onChange={(e) => setFormData({ ...formData, heure_fin: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
                <input
                  type="text"
                  value={formData.motif}
                  onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                  placeholder="e.g., Team meeting, Examen supervision"
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
