# Project Context - University Management System

## Snapshot
- Date: 2026-05-12
- Workspace: `C:\Users\basir\Documents\upf\PHP\exam final`
- Architecture: split app
- Backend: Laravel 13 + Sanctum + DomPDF (`backend/`)
- Frontend: React + TypeScript + Vite (`frontend/`)
- Database: university schema with migrations + seeders, plus SQL dump files at repo root.

## What Is Already Done

### 1) Core backend structure
- Role-based API auth with Sanctum is implemented:
  - Login/logout/current user endpoints.
  - Role middleware (`api.role`) for `admin`, `professor`, `student`.
- Main domain models exist: users, filieres, groupes, modules, notes, absences, timetable, reservations, classroom, requests.
- Migration for all required university tables exists:
  - `backend/database/migrations/2026_05_07_130853_create_university_tables.php`
- Seeder contains realistic demo data:
  - Admin/professors/students, modules, schedules, notes, absences, requests, classroom docs.

### 2) API endpoints are broadly implemented
- Admin endpoints:
  - Dashboard stats, users list/create student, filieres/groupes/modules, timetable, requests status update.
  - Room reservations (list/update/delete/status).
  - Absence validation.
  - Classroom moderation.
  - PDF generation/preview routes.
- Professor endpoints:
  - Dashboard stats, modules, grade read/write with final-grade formula.
  - Session log read.
  - Requests submit/list and document download.
  - Room reservation workflow.
  - Absence management.
  - Classroom announcements/doc upload/delete.
- Student endpoints:
  - Dashboard stats, results, timetable, materials, absences.
  - Upload absence justificatif.
  - Requests submit/list.
  - Classroom announcements/comments.
  - Document download.

### 3) Frontend structure
- Role-based routing and protected routes are implemented in React.
- Pages exist for admin/professor/student areas and login.
- API services exist for each role and cover most backend endpoints:
  - `frontend/src/services/adminService.ts`
  - `frontend/src/services/professorService.ts`
  - `frontend/src/services/studentService.ts`
  - `frontend/src/services/auth.ts`

## What Needs To Be Done

### A) High-priority integration fixes (blocking)
- Align backend response shapes with frontend expectations.
  - Many backend endpoints return paginated objects (`{ data, links, meta }`) while frontend types expect raw arrays.
  - Several backend actions return `{ message, entity }` while frontend expects only `entity`.
- Standardize request field names for admin/professor/student requests.
  - Frontend uses different fields (`description`, status names) than backend (`motif`, `statut=validated/rejected`).
- Fix missing PDF preview view:
  - `DocumentController::previewDocument()` loads `documents.preview`, but this blade view does not exist.

### B) Functional completeness gaps vs `exigences.md`
- Complete admin CRUD coverage:
  - Full user management (not only create student + list).
  - Full filiere/module/groupe/salle CRUD from API + UI.
  - Complete timetable management (create/update/delete), not only consultation/filtering.
- Complete professor features:
  - Session log (cahier de texte) currently read-only; add create/edit workflow with required fields.
- Complete student/professor document access:
  - Stored file paths are not yet consistently exposed as public URLs/download endpoints for course materials.

### C) Technical and quality gaps
- Add automated tests:
  - Auth, role authorization, notes formula, reservation conflict logic, request workflow, PDF generation.
- Add API documentation consistency:
  - Ensure Postman/Swagger is fully up to date with real payloads/status codes.
- Improve encoding consistency:
  - Several files show mojibake (accented text encoding issues), especially FR strings.
- Clarify single source of truth for DB setup:
  - Root SQL dumps + migrations + seeder currently overlap; define one preferred setup path.

## Known Mismatch Examples (Important)
- Student stats keys:
  - Frontend expects `moyenneGenerale`, `absencesCount`, etc.
  - Backend returns `average`, `absences`, `modules`.
- Admin stats keys:
  - Frontend expects `totalStudents`, `totalProfessors`, etc.
  - Backend returns `students`, `professors`, etc.
- Requests status enum:
  - Frontend often uses `approved`.
  - Backend validates/stores `validated`.
- Paginated endpoints:
  - Frontend services mostly type responses as `Type[]`, but backend returns paginator objects in many places.

## Recommended Next Execution Order
1. Define and freeze API contracts (DTO shapes + enum values) for all endpoints used by frontend.
2. Patch frontend services to correctly parse paginator responses and normalized payload wrappers.
3. Patch backend response transformers so all endpoints return consistent JSON shapes.
4. Implement missing `documents.preview` blade or remove preview endpoint from UI/docs.
5. Add missing CRUD/features (admin management + professor cahier de texte create flow).
6. Add integration tests for the workflows above.

## Useful Files To Start From
- API routes: `backend/routes/api.php`
- Controllers:
  - `backend/app/Http/Controllers/Api/AdminController.php`
  - `backend/app/Http/Controllers/Api/ProfessorController.php`
  - `backend/app/Http/Controllers/Api/StudentController.php`
  - `backend/app/Http/Controllers/Api/ReservationController.php`
  - `backend/app/Http/Controllers/Api/AbsenceController.php`
  - `backend/app/Http/Controllers/Api/ClassroomController.php`
  - `backend/app/Http/Controllers/Api/DocumentController.php`
- Frontend routes: `frontend/src/App.tsx`
- Frontend API clients:
  - `frontend/src/services/adminService.ts`
  - `frontend/src/services/professorService.ts`
  - `frontend/src/services/studentService.ts`
  - `frontend/src/services/auth.ts`
- Requirements baseline: `exigences.md`
