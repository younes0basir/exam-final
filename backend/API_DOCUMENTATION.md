# UPF University Management System - API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication

All API endpoints (except login) require Bearer token authentication.

### Login
**POST** `/api/login`

**Request Body:**
```json
{
  "email": "admin@upf.ma",
  "password": "password"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@upf.ma",
    "role": "admin"
  },
  "token": "1|abc123..."
}
```

### Get Current User
**GET** `/api/user`

**Headers:**
```
Authorization: Bearer {token}
```

### Logout
**POST** `/api/logout`

**Headers:**
```
Authorization: Bearer {token}
```

---

## Admin Endpoints

### Dashboard Statistics
**GET** `/api/admin/dashboard/stats`

**Response:**
```json
{
  "students": 156,
  "professors": 24,
  "filieres": 8,
  "modules": 48,
  "salles": 12
}
```

### List Users
**GET** `/api/admin/users?page=1`

### Create Student
**POST** `/api/admin/users/student`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@student.upf.ma",
  "password": "password123"
}
```

### List Filieres
**GET** `/api/admin/academic/filieres`

### Timetable
**GET** `/api/admin/timetable?view=all&professor_id=1&filiere_id=2&groupe_id=3&module_id=4`

### Administrative Requests
**GET** `/api/admin/requests?page=1`

### Update Request Status
**PATCH** `/api/admin/requests/{id}`

**Request Body:**
```json
{
  "statut": "validated",
  "motif_rejet": null
}
```

### Room Reservations Management
**GET** `/api/admin/reservations?page=1`

**PATCH** `/api/admin/reservations/{id}/status`
```json
{
  "statut": "validated"
}
```

**PUT** `/api/admin/reservations/{id}`
```json
{
  "salle_id": 1,
  "date_reservation": "2026-05-15",
  "heure_debut": "14:00",
  "heure_fin": "16:00",
  "motif": "Réunion"
}
```

**DELETE** `/api/admin/reservations/{id}`

### Absences Management
**GET** `/api/admin/absences?student_id=1&module_id=2&statut=pending`

**PATCH** `/api/admin/absences/{id}/validate`
```json
{
  "statut_justification": "validated",
  "motif_rejet": null
}
```

### Classroom Management
**GET** `/api/admin/classroom/annonces?module_id=1`

**DELETE** `/api/admin/classroom/annonces/{id}`

**DELETE** `/api/admin/classroom/commentaires/{id}`

### Document Generation (PDF)
**GET** `/api/admin/documents/{demandeId}/download`

**GET** `/api/admin/documents/{demandeId}/preview`

---

## Professor Endpoints

### Dashboard Statistics
**GET** `/api/professor/dashboard/stats`

**Response:**
```json
{
  "modules_count": 5,
  "pending_notes": 12
}
```

### My Modules
**GET** `/api/professor/modules`

### Get Grades for Module
**GET** `/api/professor/grades/{moduleId}`

**Response:**
```json
{
  "module": {...},
  "students": [...],
  "existingNotes": {...}
}
```

### Save Grades
**POST** `/api/professor/grades/{moduleId}`

**Request Body:**
```json
{
  "grades": {
    "1": {
      "cc1": 15.5,
      "cc2": 16.0,
      "final": 15.75
    }
  }
}
```

### Session Log
**GET** `/api/professor/session-log?page=1`

### Room Reservations
**GET** `/api/professor/reservations`

**GET** `/api/professor/salles`

**GET** `/api/professor/salles/disponibilites?salle_id=1&date=2026-05-15`

**POST** `/api/professor/reservations`
```json
{
  "salle_id": 1,
  "date_reservation": "2026-05-15",
  "heure_debut": "14:00",
  "heure_fin": "16:00",
  "motif": "Réunion"
}
```

**DELETE** `/api/professor/reservations/{id}`

### Absences Management
**GET** `/api/professor/absences?module_id=1`

**POST** `/api/professor/absences`
```json
{
  "student_id": 1,
  "module_id": 2,
  "date_absence": "2026-05-10",
  "seance_debut": "08:30",
  "seance_fin": "10:30"
}
```

**DELETE** `/api/professor/absences/{id}`

### Classroom (Announcements & Documents)
**GET** `/api/professor/classroom/modules`

**GET** `/api/professor/classroom/annonces`

**POST** `/api/professor/classroom/annonces`
```json
{
  "module_id": 1,
  "titre": "Nouveau TP disponible",
  "contenu": "Le TP sur les API REST est maintenant disponible..."
}
```

**DELETE** `/api/professor/classroom/annonces/{id}`

**POST** `/api/professor/classroom/documents`
```json
// FormData with:
// - module_id: 1
// - titre: "Cours Laravel"
// - type: "Cours|TD|TP|Autre"
// - document: [FILE]
```

**DELETE** `/api/professor/classroom/documents/{id}`

### Administrative Requests (Professor)
**GET** `/api/professor/requests`

**POST** `/api/professor/requests`
```json
{
  "type": "Attestation de travail|Ordre de mission",
  "motif": "Pour dossier bancaire"
}
```

**GET** `/api/professor/documents/{demandeId}/download`

---

## Student Endpoints

### Dashboard Statistics
**GET** `/api/student/dashboard/stats`

**Response:**
```json
{
  "average": 14.5,
  "absences": 3,
  "modules": 6
}
```

### My Results
**GET** `/api/student/results`

### My Timetable
**GET** `/api/student/timetable`

### Course Materials
**GET** `/api/student/materials`

### My Absences
**GET** `/api/student/absences?page=1`

### My Requests
**GET** `/api/student/requests`

### Create Request
**POST** `/api/student/requests`

**Request Body:**
```json
{
  "type": "Attestation de scolarité",
  "motif": "Needed for internship application"
}
```

### Upload Absence Justificatif
**POST** `/api/student/absences/{id}/justificatif`
```json
// FormData with:
// - justificatif: [FILE] (PDF, JPG, PNG - max 2MB)
```

### Classroom (Announcements & Comments)
**GET** `/api/student/classroom/annonces`

**GET** `/api/student/classroom/annonces/{id}/commentaires`

**POST** `/api/student/classroom/annonces/{id}/commentaires`
```json
{
  "contenu": "Merci pour cette information!"
}
```

### Document Download
**GET** `/api/student/documents/{demandeId}/download`

---

## Demo Credentials

### Admin
- Email: `admin@upf.ma`
- Password: `password`

### Professor
- Email: `a.bennani@upf.ma`
- Password: `password`

### Student
- Email: `y.alami@student.upf.ma`
- Password: `password`

---

## React Frontend Setup

The frontend is built with React + Vite and communicates with the Laravel API.

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Environment Variables
Create a `.env` file in the root:
```
VITE_API_URL=http://localhost:8000/api
```

---

## Error Responses

All API errors follow this format:

```json
{
  "message": "Error message here",
  "errors": {
    "field": ["Validation error"]
  }
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error
