import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import i18n from './i18n';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UsersPage } from './pages/admin/UsersPage';
import { FilieresPage } from './pages/admin/FilieresPage';
import { ModulesPage as AdminModulesPage } from './pages/admin/ModulesPage';
import { GroupesPage } from './pages/admin/GroupesPage';
import { SallesPage } from './pages/admin/SallesPage';
import { TimetablePage as AdminTimetablePage } from './pages/admin/TimetablePage';
import { RequestsPage as AdminRequestsPage } from './pages/admin/RequestsPage';

// Professor Pages
import { ProfessorDashboard } from './pages/professor/ProfessorDashboard';
import { ModulesPage } from './pages/professor/ModulesPage';
import { NotesPage } from './pages/professor/GradesPage';
import { SessionsPage } from './pages/professor/SessionsPage';
import { ReservationsPage } from './pages/professor/ReservationsPage';
import { ProfessorAbsencesPage } from './pages/professor/ProfessorAbsencesPage';
import { ProfessorClassroomPage } from './pages/professor/ProfessorClassroomPage';
import { ProfessorRequestsPage } from './pages/professor/ProfessorRequestsPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ResultsPage } from './pages/student/ResultsPage';
import { TimetablePage as StudentTimetablePage } from './pages/student/TimetablePage';
import { MaterialsPage } from './pages/student/MaterialsPage';
import { AbsencesPage } from './pages/student/AbsencesPage';
import { RequestsPage as StudentRequestsPage } from './pages/student/RequestsPage';
import { StudentClassroomPage } from './pages/student/StudentClassroomPage';

import { UnauthorizedPage } from './pages/UnauthorizedPage';

function App() {
  // Ensure language persists across route changes
  useEffect(() => {
    const savedLocale = localStorage.getItem('i18nextLng') || localStorage.getItem('locale');
    if (savedLocale && savedLocale !== i18n.language) {
      i18n.changeLanguage(savedLocale);
    }
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/filieres" element={<FilieresPage />} />
                <Route path="/modules" element={<AdminModulesPage />} />
                <Route path="/groupes" element={<GroupesPage />} />
                <Route path="/salles" element={<SallesPage />} />
                <Route path="/timetable" element={<AdminTimetablePage />} />
                <Route path="/requests" element={<AdminRequestsPage />} />
              </Routes>
            </ProtectedRoute>
          }
        />
        
        {/* Professor Routes */}
        <Route
          path="/professor/*"
          element={
            <ProtectedRoute allowedRoles={['professor']}>
              <Routes>
                <Route path="/" element={<ProfessorDashboard />} />
                <Route path="/modules" element={<ModulesPage />} />
                <Route path="/grades" element={<NotesPage />} />
                <Route path="/sessions" element={<SessionsPage />} />
                <Route path="/reservations" element={<ReservationsPage />} />
                <Route path="/absences" element={<ProfessorAbsencesPage />} />
                <Route path="/classroom" element={<ProfessorClassroomPage />} />
                <Route path="/requests" element={<ProfessorRequestsPage />} />
              </Routes>
            </ProtectedRoute>
          }
        />
        
        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Routes>
                <Route path="/" element={<StudentDashboard />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/timetable" element={<StudentTimetablePage />} />
                <Route path="/materials" element={<MaterialsPage />} />
                <Route path="/absences" element={<AbsencesPage />} />
                <Route path="/requests" element={<StudentRequestsPage />} />
                <Route path="/classroom" element={<StudentClassroomPage />} />
              </Routes>
            </ProtectedRoute>
          }
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
