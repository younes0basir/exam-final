# Frontend Integration Guide - React + TypeScript + Vite

## 📋 Overview

This guide helps frontend engineers build a modern React application with TypeScript and Vite that integrates with the **UPF University Management System API**.

**API Base URL:** `http://localhost:8000/api`  
**API Documentation:** `http://localhost:8000/api-docs.html`  
**Backend Repository:** Laravel 13.8 with Sanctum Authentication

---

## 🚀 Quick Start

### 1. Initialize Project

```bash


# Install additional packages
npm install axios react-router-dom @tanstack/react-query zustand
npm install -D @types/node
```

### 2. Project Structure

```
upf-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (Button, Input, etc.)
│   │   ├── layout/         # Layout components (Header, Sidebar)
│   │   └── features/       # Feature-specific components
│   ├── pages/              # Page components
│   │   ├── auth/           # Login page
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── professor/      # Professor dashboard pages
│   │   └── student/        # Student dashboard pages
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service layer
│   ├── store/              # State management (Zustand)
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── vite-env.d.ts       # Vite type declarations
├── .env                    # Environment variables
├── vite.config.ts          # Vite configuration
└── package.json
```

### 3. Environment Configuration

Create `.env` file in project root:

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🔐 Authentication Setup

### Auth Service (`src/services/auth.ts`)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'professor' | 'student';
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
    localStorage.removeItem('auth_token');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/user');
    return response.data;
  },
};

export default api;
```

### Auth Store (`src/store/authStore.ts`)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, User } from '../services/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const { user, token } = await authService.login(email, password);
        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true });
      },

      logout: async () => {
        try {
          await authService.logout();
        } finally {
          localStorage.removeItem('auth_token');
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      setUser: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### Protected Route Component (`src/components/ProtectedRoute.tsx`)

```typescript
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'professor' | 'student'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

---

## 📡 API Services

### Admin Service (`src/services/adminService.ts`)

```typescript
import api from './auth';

export interface DashboardStats {
  totalStudents: number;
  totalProfessors: number;
  totalFilieres: number;
  pendingRequests: number;
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

export interface AdministrativeRequest {
  id: number;
  etudiant_id: number;
  etudiant_nom: string;
  type: string;
  description: string;
  statut: 'pending' | 'approved' | 'rejected';
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

  getTimetable: (): Promise<TimetableEntry[]> =>
    api.get('/admin/timetable').then((res) => res.data),

  getRequests: (): Promise<AdministrativeRequest[]> =>
    api.get('/admin/requests').then((res) => res.data),

  updateRequestStatus: (
    id: number,
    statut: 'approved' | 'rejected'
  ): Promise<AdministrativeRequest> =>
    api.patch(`/admin/requests/${id}`, { statut }).then((res) => res.data),
};
```

### Professor Service (`src/services/professorService.ts`)

```typescript
import api from './auth';

export interface Module {
  id: number;
  nom: string;
  code: string;
  filiere: string;
  semestre: number;
}

export interface Grade {
  id: number;
  etudiant_id: number;
  etudiant_nom: string;
  note: number;
  commentaire?: string;
}

export interface SessionLog {
  id: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  sujet: string;
  module: string;
}

export const professorService = {
  getModules: (): Promise<Module[]> =>
    api.get('/professor/modules').then((res) => res.data),

  getGrades: (moduleId: number): Promise<Grade[]> =>
    api.get(`/professor/grades/${moduleId}`).then((res) => res.data),

  submitGrades: (
    moduleId: number,
    grades: Array<{ etudiant_id: number; note: number; commentaire?: string }>
  ): Promise<void> =>
    api.post(`/professor/grades/${moduleId}`, { grades }),

  getSessionLog: (): Promise<SessionLog[]> =>
    api.get('/professor/session-log').then((res) => res.data),
};
```

### Student Service (`src/services/studentService.ts`)

```typescript
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

  getRequests: (): Promise<Demande[]> =>
    api.get('/student/requests').then((res) => res.data),

  createRequest: (data: {
    type: string;
    description: string;
  }): Promise<Demande> =>
    api.post('/student/requests', data).then((res) => res.data),
};
```

---

## 🎨 Example Pages

### Login Page (`src/pages/auth/LoginPage.tsx`)

```typescript
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            UPF University
          </h2>
          <p className="mt-2 text-center text-gray-600">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <p className="font-semibold">Demo Credentials:</p>
          <ul className="mt-2 space-y-1">
            <li>Admin: admin@upf.ma / password</li>
            <li>Professor: prof@upf.ma / password</li>
            <li>Student: student@upf.ma / password</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
```

### Admin Dashboard (`src/pages/admin/AdminDashboard.tsx`)

```typescript
import { useEffect, useState } from 'react';
import { adminService, DashboardStats } from '../../services/adminService';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Students</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats?.totalStudents}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Professors</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.totalProfessors}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Programs</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalFilieres}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending Requests</h3>
          <p className="text-3xl font-bold text-orange-600">{stats?.pendingRequests}</p>
        </div>
      </div>
    </div>
  );
};
```

---

## 🔄 Routing Setup (`src/App.tsx`)

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
// Import other pages...

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                {/* Add more admin routes */}
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
                {/* Add professor routes */}
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
                {/* Add student routes */}
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

export default App;
```

---

## 📝 API Endpoints Reference

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/login` | Login with credentials | No |
| GET | `/api/user` | Get current user info | Yes |
| POST | `/api/logout` | Logout and invalidate token | Yes |

### Admin Endpoints
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/admin/dashboard/stats` | Get dashboard statistics | Admin |
| GET | `/api/admin/users` | List all users | Admin |
| POST | `/api/admin/users/student` | Create new student | Admin |
| GET | `/api/admin/academic/filieres` | List academic programs | Admin |
| GET | `/api/admin/timetable` | View timetable | Admin |
| GET | `/api/admin/requests` | List administrative requests | Admin |
| PATCH | `/api/admin/requests/{id}` | Update request status | Admin |

### Professor Endpoints
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/professor/dashboard/stats` | Get dashboard statistics | Professor |
| GET | `/api/professor/modules` | List assigned modules | Professor |
| GET | `/api/professor/grades/{moduleId}` | Get grades for module | Professor |
| POST | `/api/professor/grades/{moduleId}` | Submit grades | Professor |
| GET | `/api/professor/session-log` | View session logs | Professor |

### Student Endpoints
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/student/dashboard/stats` | Get dashboard statistics | Student |
| GET | `/api/student/results` | View grades/results | Student |
| GET | `/api/student/timetable` | View timetable | Student |
| GET | `/api/student/materials` | View course materials | Student |
| GET | `/api/student/absences` | View absences | Student |
| GET | `/api/student/requests` | View requests | Student |
| POST | `/api/student/requests` | Create new request | Student |

---

## 🔧 Development Tips

### 1. CORS Configuration
The Laravel backend should have CORS enabled. If you encounter CORS issues, check `config/cors.php`:

```php
'supports_credentials' => true,
'allowed_origins' => ['http://localhost:5173'], // Vite dev server
```

### 2. Error Handling Pattern

```typescript
try {
  const data = await someApiCall();
  // Handle success
} catch (error: any) {
  if (error.response) {
    // Server responded with error status
    console.error('API Error:', error.response.data);
    // Show user-friendly message
  } else if (error.request) {
    // Request was made but no response
    console.error('Network Error:', error.message);
  } else {
    // Something else happened
    console.error('Error:', error.message);
  }
}
```

### 3. Loading States

```typescript
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await apiCall();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);

if (loading) return <LoadingSpinner />;
if (!data) return <NoData />;
return <DataDisplay data={data} />;
```

### 4. Form Validation

Use libraries like:
- **React Hook Form** + **Zod** for robust form handling
- **Yup** for schema validation

Example:
```typescript
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
  resolver: zodResolver(loginSchema),
});
```

---

## 🎨 Recommended UI Libraries

Choose one based on your preference:

1. **Tailwind CSS** (Recommended)
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Material-UI**
   ```bash
   npm install @mui/material @emotion/react @emotion/styled
   ```

3. **Chakra UI**
   ```bash
   npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
   ```

4. **Ant Design**
   ```bash
   npm install antd
   ```

---

## 🧪 Testing

### Setup Jest + React Testing Library

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

### Example Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginPage } from '../pages/auth/LoginPage';

test('renders login form', () => {
  render(<LoginPage />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
```

---

## 📦 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 🔗 Useful Resources

- **Laravel Sanctum Docs**: https://laravel.com/docs/sanctum
- **React Router Docs**: https://reactrouter.com
- **TanStack Query Docs**: https://tanstack.com/query/latest
- **Zustand Docs**: https://docs.pmnd.rs/zustand
- **Axios Docs**: https://axios-http.com

---

## ❓ Common Issues & Solutions

### Issue: 401 Unauthorized after login
**Solution**: Ensure token is stored and sent in Authorization header:
```typescript
localStorage.setItem('auth_token', token);
// Axios interceptor will automatically add it
```

### Issue: CORS errors
**Solution**: Configure Laravel CORS in `config/cors.php` to allow your frontend origin.

### Issue: Token expiration
**Solution**: Implement token refresh logic or re-authentication flow.

### Issue: Role-based access not working
**Solution**: Check that the user's role matches the allowed roles in ProtectedRoute.

---

## 📞 Support

For API-related questions, refer to:
- API Documentation: `http://localhost:8000/api-docs.html`
- Backend README: Check the Laravel project documentation
- API Routes: `routes/api.php` in the backend

---

**Happy Coding! 🚀**
