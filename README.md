# 🎓 UPF University Management System

A comprehensive, modern university management platform built with **Laravel 13** (backend API) and **React + TypeScript** (frontend), designed for Université Privée de Fès (UPF). The system provides role-based access for administrators, professors, and students with complete academic management capabilities.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
  - [Administrator Panel](#administrator-panel)
  - [Professor Panel](#professor-panel)
  - [Student Panel](#student-panel)
- [API Endpoints](#api-endpoints)
- [Installation & Setup](#installation--setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [CLI Setup](#cli-setup)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Grade Calculation Formula](#grade-calculation-formula)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

This project is a full-featured university management system that handles all aspects of academic operations including:

- **User Management**: Role-based authentication and authorization
- **Academic Management**: Filières, modules, groups, and course scheduling
- **Grade Management**: Automated grade calculation and tracking
- **Attendance Tracking**: Absence recording and justification workflow
- **Document Management**: Course materials and administrative document generation
- **Classroom System**: Announcements, comments, and resource sharing
- **Room Reservations**: Conflict-free classroom booking system
- **Administrative Requests**: PDF document generation workflow

The system follows strict MVC architecture with RESTful API design principles and includes three interfaces:
1. **Web Application** (React SPA)
2. **REST API** (Laravel Backend)
3. **Command-Line Interface** (Node.js CLI)

---

## 💻 Tech Stack

### Backend
- **Framework**: Laravel 13.8.0
- **PHP Version**: 8.4+
- **Database**: MySQL / SQLite (development)
- **Authentication**: Laravel Sanctum (Token-based)
- **PDF Generation**: DomPDF (barryvdh/laravel-dompdf)
- **Architecture**: RESTful API with MVC pattern

### Frontend (Web)
- **Framework**: React 18.2
- **Language**: TypeScript 5.2
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 4.3
- **State Management**: Zustand 5.0
- **Data Fetching**: TanStack Query (React Query) 5.100
- **Routing**: React Router DOM 6.22
- **Animations**: Framer Motion 12.38
- **HTTP Client**: Axios 1.6

### CLI Interface
- **Runtime**: Node.js (ES Modules)
- **CLI Framework**: Commander 14.0
- **Interactive Prompts**: Inquirer 12.6
- **HTTP Client**: Axios 1.8
- **Terminal UI**: Chalk, Ora, CLI-Table3
- **Configuration**: Conf 14.0

---

## 📁 Project Structure

```
exam final/
├── backend/                    # Laravel API Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/    # API Controllers
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── AdminController.php
│   │   │   │   ├── ProfessorController.php
│   │   │   │   ├── StudentController.php
│   │   │   │   ├── ReservationController.php
│   │   │   │   ├── ClassroomController.php
│   │   │   │   ├── AbsenceController.php
│   │   │   │   └── DocumentController.php
│   │   │   └── Middleware/
│   │   │       └── ApiRoleMiddleware.php
│   │   ├── Models/                 # Eloquent Models
│   │   │   ├── User.php
│   │   │   ├── Filiere.php
│   │   │   ├── Groupe.php
│   │   │   ├── Module.php
│   │   │   ├── Note.php
│   │   │   ├── Absence.php
│   │   │   ├── EmploiDuTemps.php
│   │   │   ├── Salle.php
│   │   │   ├── CahierTexte.php
│   │   │   ├── ClassroomAnnonce.php
│   │   │   ├── ClassroomCommentaire.php
│   │   │   ├── ClassroomDocument.php
│   │   │   ├── DemandeAdministrative.php
│   │   │   └── ReservationSalle.php
│   │   └── Providers/
│   ├── database/
│   │   ├── migrations/             # Database Migrations
│   │   └── seeders/                # Database Seeders
│   ├── routes/
│   │   └── api.php                 # API Routes
│   ├── resources/views/documents/  # PDF Templates (Blade)
│   ├── config/                     # Configuration Files
│   ├── public/
│   │   └── api-docs.html           # API Documentation
│   └── tests/                      # Test Suite
│
├── frontend/                   # React Web Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/             # Layout Components
│   │   │   ├── ui/                 # Reusable UI Components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts          # Authentication Hook
│   │   ├── pages/
│   │   │   ├── admin/              # Admin Pages (5)
│   │   │   ├── professor/          # Professor Pages (8)
│   │   │   ├── student/            # Student Pages (7)
│   │   │   └── auth/               # Login Page
│   │   ├── services/               # API Service Layer
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── adminService.ts
│   │   │   ├── professorService.ts
│   │   │   └── studentService.ts
│   │   ├── store/
│   │   │   └── authStore.ts        # Zustand Auth Store
│   │   ├── types/                  # TypeScript Types
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── frontend-cli/               # Command-Line Interface
│   ├── src/
│   │   ├── commands/
│   │   │   ├── auth.js
│   │   │   ├── admin.js
│   │   │   ├── professor.js
│   │   │   └── student.js
│   │   ├── lib/
│   │   │   ├── http.js
│   │   │   └── output.js
│   │   ├── cli.js
│   │   └── config.js
│   └── package.json
│
├── g_universitaire.sql         # Database SQL Dump
├── enhanced_database.sql       # Enhanced Schema
├── additional_data.sql         # Additional Seed Data
└── exigences.md                # Project Requirements
```

---

## ✨ Features

### 👨‍💼 Administrator Panel

#### Dashboard
- Real-time statistics overview (students, professors, modules, groups)
- Quick action buttons for common tasks
- Recent activity monitoring
- Visual analytics cards

#### User Management
- Create and manage student accounts
- Create and manage professor accounts
- Assign users to groups and filières
- View detailed user profiles
- Role-based access control

#### Academic Management
- Manage filières (academic programs): GINFO, GSE, etc.
- Create and organize student groups
- Configure modules/courses per filière
- Assign professors to teaching modules
- Link students to groups

#### Timetable Management
- **Three Dynamic Views:**
  - Global view (all schedules)
  - By professor view
  - By filière view
- Visual weekly calendar grid
- Color-coded modules
- Smart filtering (group, module, professor, filière)
- Add, edit, delete course sessions
- Room assignment with capacity validation

#### Administrative Requests
- Process document requests from students/professors
- Approve/reject attestation requests
- Track request status (pending → validated/rejected)
- Generate PDF documents automatically:
  - Attestation de scolarité
  - Relevé de notes
  - Certificat d'inscription
  - Attestation de travail
  - Ordre de mission
- Preview documents before download

#### Room Reservations
- View all reservation requests
- Approve/reject reservations
- Resolve scheduling conflicts
- Modify or cancel reservations
- Monitor room utilization

#### Absence Management
- View all absences across the university
- Validate absence justifications
- Monitor attendance statistics
- Filter by student, module, or date

#### Classroom Moderation
- View all announcements
- Delete inappropriate content
- Moderate comments
- Manage uploaded documents

---

### 👨‍🏫 Professor Panel

#### Dashboard
- Teaching statistics (modules, students, sessions)
- Quick access to grade entry and materials
- Module list with student counts
- Upcoming sessions overview

#### Module Management
- View assigned teaching modules
- See enrolled students per module
- Access module-specific tools
- Upload course materials (PDF, presentations, docs)
- Organize materials by type (Cours, TD, TP)

#### Grade Entry
- Input continuous assessment grades (CC1, CC2)
- Enter exam scores
- **Automatic final grade calculation** using formula:
  ```
  Note finale = ((CC1 + CC2) / 2) × 0.4 + Examen × 0.6
  ```
- View grade distribution per module
- Edit existing grades
- Export grade reports

#### Session Log (Cahier de Textes)
- Record session objectives and content
- Log teaching activities with timestamps
- Track covered topics
- Document practical work (TP/TD/Cours)
- Automatic date/time recording

#### Course Materials & Announcements
- Upload documents and resources
- Post announcements to students
- Organize materials by module
- Version control for updates
- Delete outdated content

#### Absence Management
- Record student absences
- Review absence justifications
- Validate or reject justifications
- View absence history per module
- Generate absence reports

#### Room Reservations
- Check room availability
- Submit reservation requests
- View personal reservations
- Cancel pending reservations
- Receive approval notifications

#### Administrative Requests
- Submit work certificates (attestation de travail)
- Request mission orders (ordre de mission)
- Track request status
- Download generated PDF documents

---

### 🎓 Student Panel

#### Dashboard
- Personal academic statistics
- Average grade calculation
- Absence count tracker
- Quick links to important sections
- Recent grades display
- Upcoming sessions preview

#### My Grades (Mes Notes)
- View all module grades
- See detailed breakdown (CC1, CC2, Examen)
- Calculate final averages automatically
- Track academic performance over time
- Historical grade records
- Pass/fail indicators

#### Timetable (Emploi du Temps)
- Personalized weekly schedule
- View by day with time slots
- See room locations and professor names
- Color-coded by module
- Real-time updates when changes occur

#### Course Materials (Supports de Cours)
- Access uploaded documents per module
- Download lecture notes and presentations
- View practical work guides (TP/TD)
- Filter materials by module
- Search functionality

#### My Absences (Mes Absences)
- Track attendance record
- View absence history with dates
- Submit justification documents (PDF/Image upload)
- Check justification status:
  - Pending review
  - Validated (approved)
  - Rejected
- Absence statistics and trends

#### Classroom System
- View announcements from professors
- Read module-specific communications
- Comment on announcements
- Participate in discussions
- Access shared resources

#### Administrative Requests
- Request official documents:
  - **Attestation de scolarité** (Enrollment certificate)
  - **Relevé de notes** (Grade transcript)
  - **Certificat d'inscription** (Registration certificate)
- Track request status in real-time
- View request history
- Add custom motifs/reasons
- Download approved PDF documents

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8000/api
```

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | User login | No |
| GET | `/user` | Get current user | Yes |
| POST | `/logout` | User logout | Yes |

### Admin Endpoints (`/api/admin/*`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Dashboard statistics |
| GET | `/users` | List all users |
| POST | `/users/student` | Create student account |
| GET | `/academic/filieres` | List filières |
| GET | `/academic/groupes` | List groups |
| GET | `/academic/modules` | List modules |
| GET | `/timetable` | View timetable |
| GET | `/requests` | List administrative requests |
| PATCH | `/requests/{id}` | Update request status |
| GET | `/reservations` | List all reservations |
| PATCH | `/reservations/{id}/status` | Update reservation status |
| PUT | `/reservations/{id}` | Update reservation details |
| DELETE | `/reservations/{id}` | Delete reservation |
| GET | `/absences` | List all absences |
| PATCH | `/absences/{id}/validate` | Validate absence |
| GET | `/classroom/annonces` | List all announcements |
| DELETE | `/classroom/annonces/{id}` | Delete announcement |
| DELETE | `/classroom/commentaires/{id}` | Delete comment |
| GET | `/documents/{demandeId}/download` | Generate/download PDF |
| GET | `/documents/{demandeId}/preview` | Preview PDF document |

### Professor Endpoints (`/api/professor/*`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Dashboard statistics |
| GET | `/modules` | List assigned modules |
| GET | `/grades/{moduleId}` | Get grades for module |
| POST | `/grades/{moduleId}` | Submit/update grades |
| GET | `/session-log` | View session logs |
| GET | `/requests` | List personal requests |
| POST | `/requests` | Submit new request |
| GET | `/documents/{demandeId}/download` | Download document |
| GET | `/reservations` | List personal reservations |
| GET | `/salles/disponibilites` | Check room availability |
| GET | `/salles` | List all rooms |
| POST | `/reservations` | Create reservation |
| DELETE | `/reservations/{id}` | Cancel reservation |
| GET | `/absences` | List module absences |
| POST | `/absences` | Record absence |
| DELETE | `/absences/{id}` | Delete absence |
| GET | `/classroom/modules` | List teachable modules |
| GET | `/classroom/annonces` | List announcements |
| POST | `/classroom/annonces` | Create announcement |
| DELETE | `/classroom/annonces/{id}` | Delete announcement |
| POST | `/classroom/documents` | Upload document |
| DELETE | `/classroom/documents/{id}` | Delete document |

### Student Endpoints (`/api/student/*`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Dashboard statistics |
| GET | `/results` | View grades/results |
| GET | `/timetable` | View personal timetable |
| GET | `/materials` | View course materials |
| GET | `/absences` | View personal absences |
| POST | `/absences/{id}/justificatif` | Upload justification |
| GET | `/requests` | List personal requests |
| POST | `/requests` | Submit new request |
| GET | `/classroom/annonces` | View announcements |
| GET | `/classroom/annonces/{id}/commentaires` | Get comments |
| POST | `/classroom/annonces/{id}/commentaires` | Add comment |
| GET | `/documents/{demandeId}/download` | Download document |

### Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": { ... }
}
```

---

## 🚀 Installation & Setup

### Prerequisites
- **PHP 8.4+** with Composer
- **Node.js 18+** with npm
- **MySQL 8.0+** or SQLite
- **Git**

---

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install PHP dependencies**
```bash
composer install
```

3. **Setup environment**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure database** (`.env` file)
```env
# For MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=g_universitaire
DB_USERNAME=root
DB_PASSWORD=your_password

# OR for SQLite (development)
DB_CONNECTION=sqlite
# DB_DATABASE=/absolute/path/to/database.sqlite
```

5. **Create database** (if using MySQL)
```bash
mysql -u root -p -e "CREATE DATABASE g_universitaire CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

6. **Run migrations and seeders**
```bash
php artisan migrate:fresh --seed
```

7. **Start development server**
```bash
php artisan serve
```
Backend will be available at: `http://localhost:8000`

---

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment** (`.env` file)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

4. **Start development server**
```bash
npm run dev
```
Frontend will be available at: `http://localhost:5173`

5. **Build for production**
```bash
npm run build
```

---

### CLI Setup

1. **Navigate to CLI directory**
```bash
cd frontend-cli
```

2. **Install dependencies**
```bash
npm install
```

3. **Link globally** (optional)
```bash
npm link
```

4. **Usage**
```bash
# Interactive mode
upf-cli
# or
upf

# Direct commands
upf-cli auth login
upf-cli student dashboard
upf-cli professor modules
upf-cli admin users
```

---

## 🗄️ Database Schema

### Core Tables

#### Users
```sql
- id (bigint, primary key)
- name (string)
- email (string, unique)
- password (string, hashed)
- role (enum: 'admin', 'professor', 'student')
- created_at, updated_at
```

#### Filieres (Academic Programs)
```sql
- id (bigint, primary key)
- nom (string)
- code (string, unique)
- description (text)
- created_at, updated_at
```

#### Groupes (Student Groups)
```sql
- id (bigint, primary key)
- nom (string)
- filiere_id (foreign key → filieres.id)
- created_at, updated_at
```

#### Modules (Courses)
```sql
- id (bigint, primary key)
- nom (string)
- filiere_id (foreign key → filieres.id)
- created_at, updated_at
```

#### Module_Professor (Pivot)
```sql
- module_id (foreign key → modules.id)
- prof_id (foreign key → users.id)
```

#### Student_Group (Pivot)
```sql
- student_id (foreign key → users.id)
- groupe_id (foreign key → groupes.id)
```

### Academic Tables

#### Notes (Grades)
```sql
- id (bigint, primary key)
- student_id (foreign key → users.id)
- module_id (foreign key → modules.id)
- cc1 (decimal 5,2)
- cc2 (decimal 5,2)
- examen (decimal 5,2)
- note_finale (decimal 5,2, calculated)
- created_at, updated_at
```

#### Emplois_du_Temps (Timetables)
```sql
- id (bigint, primary key)
- groupe_id (foreign key → groupes.id)
- module_id (foreign key → modules.id)
- prof_id (foreign key → users.id)
- salle_id (foreign key → salles.id)
- jour (enum: 'lundi', 'mardi', ...)
- heure_debut (time)
- heure_fin (time)
- created_at, updated_at
```

#### Salles (Rooms)
```sql
- id (bigint, primary key)
- nom (string)
- capacite (integer)
- created_at, updated_at
```

#### Absences
```sql
- id (bigint, primary key)
- student_id (foreign key → users.id)
- module_id (foreign key → modules.id)
- date_absence (date)
- seance_debut (time)
- seance_fin (time)
- est_justifie (boolean)
- statut_justification (enum: 'pending', 'validated', 'rejected')
- justificatif_path (string, nullable)
- created_at, updated_at
```

#### Cahier_Textes (Session Logs)
```sql
- id (bigint, primary key)
- prof_id (foreign key → users.id)
- module_id (foreign key → modules.id)
- groupe_id (foreign key → groupes.id)
- date_seance (date)
- heure_debut (time)
- heure_fin (time)
- objectif (text)
- nature (enum: 'Cours', 'TD', 'TP')
- created_at, updated_at
```

#### Classroom_Documents
```sql
- id (bigint, primary key)
- module_id (foreign key → modules.id)
- prof_id (foreign key → users.id)
- titre (string)
- file_path (string)
- type (enum: 'cours', 'td', 'tp', 'autre')
- created_at, updated_at
```

#### Classroom_Annonces
```sql
- id (bigint, primary key)
- module_id (foreign key → modules.id)
- prof_id (foreign key → users.id)
- titre (string)
- contenu (text)
- created_at, updated_at
```

#### Classroom_Commentaires
```sql
- id (bigint, primary key)
- annonce_id (foreign key → classroom_annonces.id)
- user_id (foreign key → users.id)
- contenu (text)
- created_at, updated_at
```

#### Demandes_Administratives
```sql
- id (bigint, primary key)
- user_id (foreign key → users.id)
- type (enum: 'attestation_scolarite', 'releve_notes', 
        'certificat_inscription', 'attestation_travail', 
        'ordre_mission')
- motif (text)
- statut (enum: 'pending', 'validated', 'rejected')
- created_at, updated_at
```

#### Reservation_Salles
```sql
- id (bigint, primary key)
- prof_id (foreign key → users.id)
- salle_id (foreign key → salles.id)
- date_reservation (date)
- heure_debut (time)
- heure_fin (time)
- motif (text)
- statut (enum: 'pending', 'approved', 'rejected')
- created_at, updated_at
```

---

## 🔐 Authentication

### Roles & Permissions

1. **Admin** (`role: 'admin'`)
   - Full system access
   - Manage users, academic structure
   - Approve requests and reservations
   - Generate official documents

2. **Professor** (`role: 'professor'`)
   - Manage assigned modules
   - Enter grades and track attendance
   - Upload materials and post announcements
   - Reserve classrooms
   - Submit administrative requests

3. **Student** (`role: 'student'`)
   - View personal grades and timetable
   - Access course materials
   - Submit absence justifications
   - Request administrative documents
   - Participate in classroom discussions

### Security Features
- **Password Hashing**: bcrypt
- **Token-based Auth**: Laravel Sanctum
- **CSRF Protection**: Enabled
- **XSS Protection**: Input sanitization
- **SQL Injection Prevention**: Eloquent ORM with parameterized queries
- **Role-based Middleware**: Route protection
- **Input Validation**: Laravel validation rules

### Default Credentials (Development)

**Administrator:**
- Email: `admin@upf.ma`
- Password: `password`

**Professors:**
- Dr. Ahmed Bennani: `a.bennani@upf.ma` / `password`
- Prof. Fatima Zahra Idrissi: `f.idrissi@upf.ma` / `password`
- Dr. Karim Tazi: `k.tazi@upf.ma` / `password`

**Students (Sample):**
- Youssef Alami (GINFO3A): `y.alami@student.upf.ma` / `password`
- Rachid Kabbaj (GINFO3B): `r.kabbaj@student.upf.ma` / `password`

---

## 📊 Grade Calculation Formula

The system uses the following mandatory formula for final grade calculation:

```
Note finale = ((CC1 + CC2) / 2) × 0.4 + Examen × 0.6
```

Where:
- **CC1**: Continuous Control 1 (20% weight)
- **CC2**: Continuous Control 2 (20% weight)
- **Examen**: Final Exam (60% weight)
- **Note finale**: Calculated automatically upon grade submission

**Example:**
```
CC1 = 14/20
CC2 = 16/20
Examen = 15/20

Moyenne CC = (14 + 16) / 2 = 15
Note finale = (15 × 0.4) + (15 × 0.6) = 6 + 9 = 15/20
```

---

## 🛠️ Development

### Running Both Frontend & Backend

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Using Laravel Concurrent (Recommended)
```bash
cd backend
composer run dev
```
This runs:
- Laravel server
- Queue worker
- Log viewer (Pail)
- Vite dev server

### Code Style
```bash
# Backend (Laravel Pint)
cd backend
./vendor/bin/pint

# Frontend (ESLint)
cd frontend
npm run lint
```

### Database Operations
```bash
# Create new migration
php artisan make:migration create_table_name

# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Fresh migration with seeding
php artisan migrate:fresh --seed

# Create seeder
php artisan make:seeder TableNameSeeder
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/ExampleTest.php

# Run with coverage
php artisan test --coverage
```

### Frontend Testing
```bash
cd frontend

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

### API Testing
Use the included API documentation:
```
http://localhost:8000/api-docs.html
```

Or test with curl:
```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@upf.ma","password":"password"}'

# Get user info
curl http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📦 Sample Data

The database comes pre-seeded with realistic data:

- **3 Professors** with teaching assignments
- **16 Students** across 3 groups
- **4 Modules** in 2 filières (GINFO, GSE)
- **35+ Weekly Sessions** scheduled
- **6 Classrooms/Labs** configured
- **Sample Grades** for multiple modules
- **Absence Records** with various statuses
- **Administrative Requests** in different states
- **Course Documents** and announcements
- **Session Logs** recorded

### Academic Structure
- **Génie Informatique (GINFO)**
  - Groups: GINFO3A (8 students), GINFO3B (8 students)
  - Modules: Technologie Web 2, Réseaux Informatiques, Intelligence Artificielle
  
- **Génie Systèmes Embarqués (GSE)**
  - Groups: GSE3A
  - Modules: IoT, Technologie Web 2

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PSR-12 coding standards (PHP)
- Use TypeScript strict mode (Frontend)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is proprietary software developed for Université Privée de Fès (UPF).

---

## 📞 Support

For technical support or questions:
- **Developer**: Basir
- **Institution**: Université Privée de Fès (UPF)
- **Email**: admin@upf.ma

---

## 🙏 Acknowledgments

Built with amazing open-source technologies:
- **[Laravel](https://laravel.com)** - The PHP Framework for Web Artisans
- **[React](https://react.dev)** - A JavaScript library for building user interfaces
- **[TypeScript](https://www.typescriptlang.org)** - Typed JavaScript at Any Scale
- **[Tailwind CSS](https://tailwindcss.com)** - A Utility-First CSS Framework
- **[Vite](https://vitejs.dev)** - Next Generation Frontend Tooling
- **[Zustand](https://zustand-demo.pmnd.rs)** - A small, fast state management solution
- **[TanStack Query](https://tanstack.com/query)** - Powerful asynchronous state management
- **[Lucide Icons](https://lucide.dev)** - Beautiful & consistent icons
- **[DomPDF](https://github.com/barryvdh/laravel-dompdf)** - PDF generation for Laravel

---

## 📈 Future Enhancements

Potential features for future development:

1. **Real-time Notifications**
   - WebSocket integration
   - Push notifications
   - Email alerts

2. **Advanced Analytics**
   - Grade distribution charts
   - Attendance trends
   - Performance dashboards
   - Export to Excel/PDF

3. **Mobile Application**
   - React Native or Flutter app
   - Offline mode support
   - Biometric authentication

4. **Video Conferencing**
   - Online class scheduling
   - Zoom/Teams integration
   - Recording management

5. **Payment Gateway**
   - Tuition fee payments
   - Online payment processing
   - Payment history

6. **Library Management**
   - Book catalog
   - Borrowing system
   - Digital resources

7. **Examination System**
   - Online quizzes
   - Automated grading
   - Question bank management

8. **Alumni Portal**
   - Graduate tracking
   - Job placement
   - Networking features

---

**Last Updated**: May 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Project Type**: University Management System  
**Developed For**: Université Privée de Fès (UPF)
