import api from './auth';

export interface Module {
  id: number;
  nom: string;
  code?: string; // Optionnel - pas dans la DB
  filiere: string | { id: number; nom: string; code?: string };
  semestre?: number; // Optionnel - pas dans la DB
}

export interface Grade {
  id: number;
  student_id: number;
  student?: { id: number; name: string };
  cc1?: number;
  cc2?: number;
  examen?: number;
  note_finale?: number;
}

export interface GradesResponse {
  module: Module;
  students: Array<{ id: number; name: string }>;
  existingNotes: Record<string, Grade>;
}

export interface SessionLog {
  id: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  sujet: string;
  module: string | { id: number; nom: string };
  groupe?: { id: number; nom: string };
}

// === RESERVATIONS ===
export interface Salle {
  id: number;
  nom: string;
  capacite: number;
}

export interface Disponibilite {
  type: 'emploi_du_temps' | 'reservation';
  heure_debut: string;
  heure_fin: string;
  module?: string;
  professeur?: string;
  groupe?: string;
  motif?: string;
}

export interface Reservation {
  id: number;
  salle_id: number;
  salle: Salle;
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
  commentaires?: Commentaire[];
}

export interface Commentaire {
  id: number;
  annonce_id: number;
  user_id: number;
  user?: { id: number; name: string };
  contenu: string;
  created_at: string;
}

export interface ClassroomDocument {
  id: number;
  module_id: number;
  module?: { id: number; nom: string };
  prof_id: number;
  professeur?: { id: number; name: string };
  titre: string;
  file_path: string;
  type: 'Cours' | 'TD' | 'TP' | 'Autre';
  created_at: string;
}

// === DEMANDES ADMINISTRATIVES ===
export interface Demande {
  id: number;
  type: string;
  motif?: string;
  statut: 'pending' | 'validated' | 'rejected';
  motif_rejet?: string;
  document_path?: string;
  created_at: string;
}

export const professorService = {
  getModules: (): Promise<Module[]> =>
    api.get('/professor/modules').then((res) => res.data),

  getGrades: (moduleId: number): Promise<GradesResponse> =>
    api.get(`/professor/grades/${moduleId}`).then((res) => res.data),

  submitGrades: (
    moduleId: number,
    grades: Record<string, { cc1?: number; cc2?: number; examen?: number }>
  ): Promise<void> =>
    api.post(`/professor/grades/${moduleId}`, { grades }),

  getSessionLog: (): Promise<SessionLog[]> =>
    api.get('/professor/session-log').then((res) => res.data),

  // === RESERVATIONS ===
  getSalles: (): Promise<Salle[]> =>
    api.get('/professor/salles').then((res) => res.data),

  getDisponibilites: (salleId: number, date: string): Promise<{ occupations: Disponibilite[] }> =>
    api.get('/professor/salles/disponibilites', { params: { salle_id: salleId, date } }).then((res) => res.data),

  getReservations: (): Promise<Reservation[]> =>
    api.get('/professor/reservations').then((res) => res.data),

  createReservation: (data: {
    salle_id: number;
    date_reservation: string;
    heure_debut: string;
    heure_fin: string;
    motif?: string;
  }): Promise<Reservation> =>
    api.post('/professor/reservations', data).then((res) => res.data),

  deleteReservation: (id: number): Promise<void> =>
    api.delete(`/professor/reservations/${id}`),

  // === ABSENCES ===
  getAbsences: (moduleId?: number): Promise<Absence[]> =>
    api.get('/professor/absences', { params: moduleId ? { module_id: moduleId } : {} }).then((res) => res.data),

  createAbsence: (data: {
    student_id: number;
    module_id: number;
    date_absence: string;
    seance_debut: string;
    seance_fin: string;
  }): Promise<Absence> =>
    api.post('/professor/absences', data).then((res) => res.data),

  deleteAbsence: (id: number): Promise<void> =>
    api.delete(`/professor/absences/${id}`),

  // === CLASSROOM ===
  getClassroomModules: (): Promise<Module[]> =>
    api.get('/professor/classroom/modules').then((res) => res.data),

  getAnnonces: (): Promise<Annonce[]> =>
    api.get('/professor/classroom/annonces').then((res) => res.data),

  createAnnonce: (data: { module_id: number; titre: string; contenu: string }): Promise<Annonce> =>
    api.post('/professor/classroom/annonces', data).then((res) => res.data),

  deleteAnnonce: (id: number): Promise<void> =>
    api.delete(`/professor/classroom/annonces/${id}`),

  getCommentaires: (annonceId: number): Promise<Commentaire[]> =>
    api.get(`/student/classroom/annonces/${annonceId}/commentaires`).then((res) => res.data),

  addCommentaire: (annonceId: number, contenu: string): Promise<Commentaire> =>
    api.post(`/student/classroom/annonces/${annonceId}/commentaires`, { contenu }).then((res) => res.data),

  uploadDocument: (formData: FormData): Promise<ClassroomDocument> =>
    api.post('/professor/classroom/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => res.data),

  deleteDocument: (id: number): Promise<void> =>
    api.delete(`/professor/classroom/documents/${id}`),

  // === DEMANDES ADMINISTRATIVES ===
  getRequests: (): Promise<Demande[]> =>
    api.get('/professor/requests').then((res) => res.data),

  createRequest: (data: { type: string; motif?: string }): Promise<Demande> =>
    api.post('/professor/requests', data).then((res) => res.data),

  downloadDocument: (demandeId: number): Promise<Blob> =>
    api.get(`/professor/documents/${demandeId}/download`, { responseType: 'blob' }).then((res) => res.data),
};
