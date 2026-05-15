import api from './auth';

export interface DashboardStats {
  students: number;
  professors: number;
  filieres: number;
  modules: number;
  salles: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Filiere {
  id: number;
  nom: string;
  code: string;
}

export interface TimetableEntry {
  id: number;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  salle: string;
  module: string;
  professeur: string;
}

export interface TimetableFilters {
  view?: 'all' | 'professor' | 'filiere';
  professor_id?: number;
  filiere_id?: number;
  groupe_id?: number;
  module_id?: number;
}

export interface AdministrativeRequest {
  id: number;
  etudiant_id: number;
  etudiant_nom: string;
  type: string;
  description: string;
  statut: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// === RESERVATIONS ===
export interface Salle {
  id: number;
  nom: string;
  capacite: number;
}

export interface Reservation {
  id: number;
  salle_id: number;
  salle: Salle;
  prof_id: number;
  professeur?: { id: number; name: string };
  date_reservation: string;
  heure_debut: string;
  heure_fin: string;
  motif: string;
  statut: 'pending' | 'validated' | 'rejected';
  created_at: string;
}

// === ABSENCES ===
export interface Absence {
  id: number;
  student_id: number;
  student?: { id: number; name: string };
  module_id: number;
  module?: { id: number; nom: string };
  date_absence: string;
  seance_debut: string;
  seance_fin: string;
  est_justifie: boolean;
  justification_file?: string;
  statut_justification: 'pending' | 'validated' | 'rejected';
  motif_rejet?: string;
}

// === CLASSROOM ===
export interface Annonce {
  id: number;
  module_id: number;
  module?: { id: number; nom: string };
  prof_id: number;
  professeur?: { id: number; name: string };
  titre: string;
  contenu: string;
  created_at: string;
}

export interface Commentaire {
  id: number;
  annonce_id: number;
  user_id: number;
  user?: { id: number; name: string };
  contenu: string;
  created_at: string;
}

export const adminService = {
  getStats: (): Promise<DashboardStats> =>
    api.get('/admin/dashboard/stats').then((res) => res.data),

  getUsers: (): Promise<User[]> =>
    api.get('/admin/users').then((res) => res.data),

  createStudent: (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> =>
    api.post('/admin/users/student', data).then((res) => res.data),

  getFilieres: (): Promise<Filiere[]> =>
    api.get('/admin/academic/filieres').then((res) => res.data),

  getTimetable: (filters?: TimetableFilters): Promise<TimetableEntry[]> => {
    const params = new URLSearchParams();
    if (filters?.view) params.append('view', filters.view);
    if (filters?.professor_id) params.append('professor_id', filters.professor_id.toString());
    if (filters?.filiere_id) params.append('filiere_id', filters.filiere_id.toString());
    if (filters?.groupe_id) params.append('groupe_id', filters.groupe_id.toString());
    if (filters?.module_id) params.append('module_id', filters.module_id.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get(`/admin/timetable${query}`).then((res) => res.data);
  },

  getRequests: (): Promise<AdministrativeRequest[]> =>
    api.get('/admin/requests').then((res) => res.data),

  updateRequestStatus: (
    id: number,
    statut: 'approved' | 'rejected'
  ): Promise<AdministrativeRequest> =>
    api.patch(`/admin/requests/${id}`, { statut }).then((res) => res.data),

  // === RESERVATIONS ===
  getReservations: (): Promise<Reservation[]> =>
    api.get('/admin/reservations').then((res) => res.data),

  updateReservationStatus: (id: number, statut: 'validated' | 'rejected'): Promise<Reservation> =>
    api.patch(`/admin/reservations/${id}/status`, { statut }).then((res) => res.data),

  updateReservation: (id: number, data: {
    salle_id?: number;
    date_reservation?: string;
    heure_debut?: string;
    heure_fin?: string;
    motif?: string;
  }): Promise<Reservation> =>
    api.put(`/admin/reservations/${id}`, data).then((res) => res.data),

  deleteReservation: (id: number): Promise<void> =>
    api.delete(`/admin/reservations/${id}`),

  // === ABSENCES ===
  getAbsences: (filters?: {
    student_id?: number;
    module_id?: number;
    statut?: string;
  }): Promise<Absence[]> =>
    api.get('/admin/absences', { params: filters }).then((res) => res.data),

  validateAbsence: (id: number, statut_justification: 'validated' | 'rejected', motif_rejet?: string): Promise<Absence> =>
    api.patch(`/admin/absences/${id}/validate`, { statut_justification, motif_rejet }).then((res) => res.data),

  // === CLASSROOM ===
  getAnnonces: (moduleId?: number): Promise<Annonce[]> =>
    api.get('/admin/classroom/annonces', { params: moduleId ? { module_id: moduleId } : {} }).then((res) => res.data),

  deleteAnnonce: (id: number): Promise<void> =>
    api.delete(`/admin/classroom/annonces/${id}`),

  deleteCommentaire: (id: number): Promise<void> =>
    api.delete(`/admin/classroom/commentaires/${id}`),

  // === DOCUMENTS PDF ===
  downloadDocument: (demandeId: number): Promise<Blob> =>
    api.get(`/admin/documents/${demandeId}/download`, { responseType: 'blob' }).then((res) => res.data),

  previewDocument: (demandeId: number): Promise<Blob> =>
    api.get(`/admin/documents/${demandeId}/preview`, { responseType: 'blob' }).then((res) => res.data),
};
