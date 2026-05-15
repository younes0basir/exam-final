import api from './auth';

export interface StudentStats {
  moyenneGenerale: number;
  absencesCount: number;
  modulesEnCours: number;
  prochainsExamens: number;
}

export interface Resultat {
  id: number;
  module_nom: string;
  note: number;
  semestre: number;
  annee: string;
}

export interface EmploiDuTemps {
  id: number;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  salle: string;
  module: string;
  professeur: string;
}

export interface Document {
  id: number;
  titre: string;
  description: string;
  fichier_url: string;
  uploaded_at: string;
  professeur_nom: string;
}

export interface Absence {
  id: number;
  date: string;
  module: string;
  justification?: string;
  statut: 'justified' | 'unjustified';
}

export interface Demande {
  id: number;
  type: string;
  description: string;
  statut: 'pending' | 'approved' | 'rejected';
  created_at: string;
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

export const studentService = {
  getStats: (): Promise<StudentStats> =>
    api.get('/student/dashboard/stats').then((res) => res.data),

  getResults: (): Promise<Resultat[]> =>
    api.get('/student/results').then((res) => res.data),

  getTimetable: (): Promise<EmploiDuTemps[]> =>
    api.get('/student/timetable').then((res) => res.data),

  getMaterials: (): Promise<Document[]> =>
    api.get('/student/materials').then((res) => res.data),

  getAbsences: (): Promise<Absence[]> =>
    api.get('/student/absences').then((res) => res.data),

  // Upload justificatif d'absence
  uploadJustificatif: (absenceId: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('justificatif', file);
    return api.post(`/student/absences/${absenceId}/justificatif`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => res.data);
  },

  getRequests: (): Promise<Demande[]> =>
    api.get('/student/requests').then((res) => res.data),

  createRequest: (data: {
    type: string;
    description: string;
  }): Promise<Demande> =>
    api.post('/student/requests', data).then((res) => res.data),

  // Téléchargement PDF document
  downloadDocument: (demandeId: number): Promise<Blob> =>
    api.get(`/student/documents/${demandeId}/download`, { responseType: 'blob' }).then((res) => res.data),

  // === CLASSROOM ===
  getAnnonces: (): Promise<Annonce[]> =>
    api.get('/student/classroom/annonces').then((res) => res.data),

  getCommentaires: (annonceId: number): Promise<Commentaire[]> =>
    api.get(`/student/classroom/annonces/${annonceId}/commentaires`).then((res) => res.data),

  addCommentaire: (annonceId: number, contenu: string): Promise<Commentaire> =>
    api.post(`/student/classroom/annonces/${annonceId}/commentaires`, { contenu }).then((res) => res.data),
};
