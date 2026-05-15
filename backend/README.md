# University Management System - UPF

A comprehensive university management platform built with Laravel 13 for managing academic operations, student records, professor schedules, and administrative tasks.

## 🎓 Overview

This is a full-featured university management system designed for Université Privée de Fès (UPF). The application provides role-based access for administrators, professors, and students, each with customized dashboards and functionality.

**Tech Stack:**
- **Framework:** Laravel 13.8.0
- **PHP Version:** 8.4.0
- **Database:** SQLite (development) / MySQL (production)
- **Frontend:** Blade Templates + Tailwind CSS
- **Icons:** Lucide Icons
- **Build Tool:** Vite

---

## 🚀 Features

### 👨‍💼 Administrator Panel

#### Dashboard
- Real-time statistics (students, professors, modules, groups)
- Quick action buttons for common tasks
- Recent activity feed
- Gradient stat cards with hover animations

#### User Management
- Create and manage student accounts
- Create and manage professor accounts
- Assign users to groups and filières
- View user details and activity

#### Academic Management
- Manage filières (academic programs)
- Create and organize groups
- Assign modules to filières
- Link professors to modules

#### Timetable Management
- **Three Dynamic Views:**
  - **Global View:** See all schedules across all groups
  - **By Professor:** View individual professor's teaching schedule
  - **By Filière:** View complete schedule for an academic program
- Visual weekly calendar grid
- Color-coded modules for easy identification
- Smart filtering by group, module, professor, or filière
- Add, edit, and delete course sessions
- Room assignment and capacity management

#### Administrative Requests
- Process student document requests
- Approve/reject attestation requests
- Track request status (pending, validated, rejected)
- View request history and details

---

### 👨‍🏫 Professor Panel

#### Dashboard
- Teaching statistics (modules, students, sessions)
- Quick access to grade entry, materials upload, announcements
- Module list with student counts
- Upcoming sessions overview

#### Module Management
- View assigned teaching modules
- See enrolled students per module
- Access module-specific tools
- Upload course materials and documents

#### Grade Entry
- Input continuous assessment grades (CC1, CC2)
- Enter exam scores
- Automatic final grade calculation
- View grade distribution
- Export grades

#### Session Log (Cahier de Textes)
- Record session objectives and content
- Log teaching activities
- Track covered topics
- Document practical work (TP)

#### Course Materials
- Upload PDFs, presentations, documents
- Organize materials by type (Cours, TP, TD)
- Share resources with students
- Version control for updates

---

### 🎓 Student Panel

#### Dashboard
- Personal academic statistics
- Average grade calculation
- Absence count tracker
- Quick links to important sections
- Recent grades display

#### My Grades (Mes Notes)
- View all module grades
- See CC1, CC2, and exam scores
- Calculate final averages
- Track academic performance
- Historical grade records

#### Timetable (Emploi du Temps)
- Personalized weekly schedule
- View by day with time slots
- See room locations
- Professor names for each session
- Color-coded by module

#### Course Materials (Supports de Cours)
- Access uploaded documents
- Download lecture notes
- View practical work guides
- Filter by module
- Search functionality

#### My Absences (Mes Absences)
- Track attendance record
- View absence history
- Submit justification documents
- Check justification status (pending/validated/rejected)
- Absence statistics

#### Administrative Requests (Demandes Administratives)
- Request official documents:
  - Attestation de scolarité
  - Relevé de notes
  - Certificat d'inscription
- Track request status
- View request history
- Add custom motifs/reasons

---

## 🗄️ Database Structure

### Core Tables

#### Users
- `id`, `name`, `email`, `password`, `role` (admin/professor/student)
- Authentication and authorization

#### Filieres (Academic Programs)
- `id`, `nom`, `code`, `description`
- Examples: Génie Informatique (GINFO), Génie Systèmes Embarqués (GSE)

#### Groupes (Student Groups)
- `id`, `nom`, `filiere_id`
- Examples: GINFO3A, GINFO3B, GSE3A

#### Modules (Courses)
- `id`, `nom`, `filiere_id`
- Examples: Technologie Web 2, Réseaux Informatiques, Intelligence Artificielle

#### Module_Professor (Pivot Table)
- Links professors to their teaching modules
- Many-to-many relationship

#### Student_Group (Pivot Table)
- Links students to their groups
- Many-to-many relationship

### Academic Tables

#### Notes (Grades)
- `id`, `student_id`, `module_id`
- `cc1`, `cc2`, `examen`, `note_finale`
- Tracks all student assessments

#### Emplois_du_Temps (Timetables)
- `id`, `groupe_id`, `module_id`, `prof_id`, `salle_id`
- `jour`, `heure_debut`, `heure_fin`
- Complete weekly schedules

#### Salles (Rooms)
- `id`, `nom`, `capacite`
- Classroom and lab information

#### Absences
- `id`, `student_id`, `module_id`
- `date_absence`, `seance_debut`, `seance_fin`
- `est_justifie`, `statut_justification`
- Attendance tracking

#### Cahier_Textes (Session Logs)
- `id`, `prof_id`, `module_id`, `groupe_id`
- `date_seance`, `heure_debut`, `heure_fin`
- `objectif`, `nature` (Cours/TP/TD)
- Teaching activity records

#### Classroom_Documents
- `id`, `module_id`, `prof_id`
- `titre`, `file_path`, `type`
- Course materials and resources

#### Demandes_Administratives
- `id`, `user_id`, `type`, `motif`
- `statut` (pending/validated/rejected)
- Administrative document requests

---

## 🎨 Design System

### UI/UX Principles
- **Modern & Clean:** Rounded corners, gradients, shadows
- **Responsive:** Works on desktop, tablet, and mobile
- **Accessible:** Clear typography, good contrast
- **Interactive:** Hover effects, smooth transitions

### Color Palette
- **Primary Blue:** `#3b82f6` (buttons, links, accents)
- **Success Green:** `#10b981` (validated, success states)
- **Warning Amber:** `#f59e0b` (pending, warnings)
- **Danger Red:** `#ef4444` (errors, rejections)
- **Purple:** `#8b5cf6` (filière view)
- **Emerald:** `#059669` (professor view)

### Component Styles
- **Cards:** `rounded-3xl`, gradient backgrounds, shadow effects
- **Buttons:** `rounded-2xl`, hover scale animations
- **Tables:** Clean borders, hover row highlighting
- **Badges:** Colored backgrounds with bold text
- **Inputs:** `rounded-xl`, focus ring effects

### Typography
- **Headers:** Font-black, uppercase tracking
- **Body:** Font-bold, slate color palette
- **Labels:** Text-xs, uppercase, wide tracking

---

## 🔐 Authentication & Authorization

### Roles
1. **Admin** - Full system access
2. **Professor** - Teaching and grading access
3. **Student** - Personal academic data access

### Middleware
Custom `RoleMiddleware` protects routes based on user roles:
```php
Route::middleware(['role:admin'])->group(function () {
    // Admin-only routes
});
```

### Login Credentials (Development)

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

## 📊 Sample Data

The application comes pre-seeded with realistic academic data:

### Statistics
- **3 Professors** with teaching assignments
- **16 Students** across 3 groups
- **4 Modules** in 2 filières
- **35 Weekly Sessions** scheduled
- **6 Classrooms/Labs** configured
- **Sample Grades** for multiple modules
- **Absence Records** with various statuses
- **Administrative Requests** in different states
- **Course Documents** uploaded
- **Session Logs** recorded

### Academic Structure
- **Génie Informatique (GINFO)**
  - Groups: GINFO3A (8 students), GINFO3B (8 students)
  - Modules: Web 2, Networks, AI
  
- **Génie Systèmes Embarqués (GSE)**
  - Groups: GSE3A
  - Modules: IoT, Web 2

---

## 🛠️ Installation & Setup

### Prerequisites
- PHP 8.4+
- Composer
- Node.js & NPM
- SQLite or MySQL

### Installation Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd myapp
```

2. **Install Dependencies**
```bash
composer install
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Database Setup**
```bash
# Using SQLite (default)
touch database/database.sqlite

# Or configure MySQL in .env
```

5. **Run Migrations & Seeders**
```bash
php artisan migrate:fresh --seed
```

6. **Build Assets**
```bash
npm run dev
# or
npm run build
```

7. **Start Development Server**
```bash
php artisan serve
```

Application will be available at: `http://127.0.0.1:8000`

---

## 📁 Project Structure

```
myapp/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AdminController.php
│   │   │   ├── AuthController.php
│   │   │   ├── ProfessorController.php
│   │   │   └── StudentController.php
│   │   └── Middleware/
│   │       └── RoleMiddleware.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Filiere.php
│   │   ├── Groupe.php
│   │   ├── Module.php
│   │   ├── Note.php
│   │   ├── Absence.php
│   │   ├── EmploiDuTemps.php
│   │   ├── Salle.php
│   │   ├── CahierTexte.php
│   │   ├── ClassroomDocument.php
│   │   ├── ClassroomAnnonce.php
│   │   ├── ClassroomCommentaire.php
│   │   ├── DemandeAdministrative.php
│   │   └── ReservationSalle.php
│   └── Providers/
├── database/
│   ├── migrations/
│   ├── seeders/
│   │   └── DatabaseSeeder.php
│   └── database.sqlite
├── resources/
│   ├── views/
│   │   ├── layouts/
│   │   │   └── dashboard.blade.php
│   │   ├── admin/
│   │   │   ├── dashboard.blade.php
│   │   │   ├── users/
│   │   │   ├── academic/
│   │   │   ├── timetable/
│   │   │   └── requests/
│   │   ├── professor/
│   │   │   ├── dashboard.blade.php
│   │   │   ├── grades/
│   │   │   ├── modules/
│   │   │   └── session-log/
│   │   ├── student/
│   │   │   ├── dashboard.blade.php
│   │   │   ├── results.blade.php
│   │   │   ├── timetable.blade.php
│   │   │   ├── materials.blade.php
│   │   │   ├── absences/
│   │   │   └── requests.blade.php
│   │   └── login.blade.php
│   ├── js/
│   └── css/
├── routes/
│   └── web.php
├── public/
├── config/
├── tests/
└── vendor/
```

---

## 🎯 Key Features Highlights

### 1. Dynamic Timetable System
- Three viewing modes (Global/Professor/Filière)
- Visual weekly calendar with color-coded modules
- Smart server-side filtering
- Real-time updates and navigation

### 2. Grade Management
- Automatic final grade calculation
- Multiple assessment types (CC1, CC2, Examen)
- Professor-friendly input interface
- Student grade tracking

### 3. Absence Tracking
- Digital absence recording
- Justification submission system
- Status tracking (pending/validated/rejected)
- Statistical reporting

### 4. Document Management
- Course material uploads
- Administrative request processing
- File organization by type
- Easy access for students

### 5. Modern UI/UX
- Gradient stat cards
- Smooth hover animations
- Responsive design
- Intuitive navigation
- Color-coded information

---

## 🔧 Development Notes

### Custom Middleware
Located at `app/Http/Middleware/RoleMiddleware.php`
- Validates user roles
- Redirects unauthorized access
- Protects role-specific routes

### Database Relationships
All models use proper Eloquent relationships:
- `belongsTo`, `hasMany`, `belongsToMany`
- Eager loading for performance
- Proper foreign key constraints

### Blade Components
Reusable layout structure:
- `@extends('layouts.dashboard')`
- `@section('content')`
- Dynamic sidebar based on role
- Active route highlighting

### JavaScript Features
- Lucide icons initialization
- Form submissions
- Dynamic filtering
- View mode switching

---

## 📈 Future Enhancements

Potential features for future development:

1. **Notifications System**
   - Email alerts for grade updates
   - Push notifications for announcements
   - SMS integration for urgent alerts

2. **Advanced Analytics**
   - Grade distribution charts
   - Attendance trends
   - Performance reports
   - Export to Excel/PDF

3. **Mobile Application**
   - React Native or Flutter app
   - Offline mode support
   - Push notifications

4. **Video Conferencing Integration**
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
   - Question bank

8. **Alumni Portal**
   - Graduate tracking
   - Job placement
   - Networking features

---

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

This project is proprietary software developed for Université Privée de Fès.

---

## 📞 Support

For technical support or questions:
- **Developer:** Basir
- **Institution:** Université Privée de Fès (UPF)
- **Email:** admin@upf.ma

---

## 🙏 Acknowledgments

Built with:
- **Laravel** - The PHP Framework for Web Artisans
- **Tailwind CSS** - A Utility-First CSS Framework
- **Lucide Icons** - Beautiful & Consistent Icons
- **Vite** - Next Generation Frontend Tooling

---

**Last Updated:** May 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
