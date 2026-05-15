# UPF University Management System - Backend with API Endpoints

## Overview
This is the Laravel backend-only version of the UPF University Management System. All React frontend has been removed, keeping only the traditional Blade templates and API endpoints.

## What Was Removed
- ❌ React application files (`resources/js/app.jsx`, `App.jsx`)
- ❌ React components (`resources/js/components/`)
- ❌ React pages (`resources/js/pages/`)
- ❌ React context (`resources/js/context/`)
- ❌ React config (`resources/js/config/`)
- ❌ React dependencies (react, react-dom, react-router-dom, axios, @vitejs/plugin-react)
- ❌ Vite React plugin configuration

## What Was Kept
### ✅ Backend (Laravel)
- All Controllers (Traditional + API)
  - `app/Http/Controllers/AuthController.php`
  - `app/Http/Controllers/AdminController.php`
  - `app/Http/Controllers/ProfessorController.php`
  - `app/Http/Controllers/StudentController.php`
  
- **API Controllers**
  - `app/Http/Controllers/Api/AuthController.php`
  - `app/Http/Controllers/Api/AdminController.php`
  - `app/Http/Controllers/Api/ProfessorController.php`
  - `app/Http/Controllers/Api/StudentController.php`

- All Models
- All Migrations
- All Seeders
- Middleware (Auth + Role)

### ✅ Frontend (Blade Templates)
- `resources/views/login.blade.php`
- `resources/views/layouts/dashboard.blade.php`
- `resources/views/admin/**/*.blade.php`
- `resources/views/professor/**/*.blade.php`
- `resources/views/student/**/*.blade.php`

### ✅ Routes
- **Web Routes** (`routes/web.php`) - Traditional Blade routes
- **API Routes** (`routes/api.php`) - RESTful API endpoints

### ✅ Authentication
- Laravel Sanctum for API token authentication
- Session-based auth for web routes
- Role-based middleware

## API Endpoints Available

### Authentication
- `POST /api/login` - Login and get token
- `GET /api/user` - Get current user
- `POST /api/logout` - Logout

### Admin (Requires admin role + Bearer token)
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - List users
- `POST /api/admin/users/student` - Create student
- `GET /api/admin/academic/filieres` - List filieres
- `GET /api/admin/timetable` - View timetables
- `GET /api/admin/requests` - List administrative requests
- `PATCH /api/admin/requests/{id}` - Update request status

### Professor (Requires professor role + Bearer token)
- `GET /api/professor/dashboard/stats` - Dashboard statistics
- `GET /api/professor/modules` - List assigned modules
- `GET /api/professor/grades/{moduleId}` - Get grades for module
- `POST /api/professor/grades/{moduleId}` - Save grades
- `GET /api/professor/session-log` - View session logs

### Student (Requires student role + Bearer token)
- `GET /api/student/dashboard/stats` - Dashboard statistics
- `GET /api/student/results` - View grades/results
- `GET /api/student/timetable` - View timetable
- `GET /api/student/materials` - View course materials
- `GET /api/student/absences` - View absences
- `GET /api/student/requests` - View administrative requests
- `POST /api/student/requests` - Create new request

## How to Use

### Traditional Web Interface (Blade)
1. Start Laravel server:
   ```bash
   php artisan serve
   ```
2. Open browser: http://localhost:8000
3. Login with credentials

### API Access
1. Get token via login:
   ```bash
   curl -X POST http://localhost:8000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@upf.ma","password":"password"}'
   ```
2. Use token in subsequent requests:
   ```bash
   curl http://localhost:8000/api/admin/dashboard/stats \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

## Demo Credentials

### Web Login
- **Admin**: admin@upf.ma / password
- **Professor**: a.bennani@upf.ma / password
- **Student**: y.alami@student.upf.ma / password

### API Login
Same credentials as above, use `/api/login` endpoint

## Tech Stack
- **Backend**: Laravel 13.8.0, PHP 8.4+
- **Database**: SQLite (dev) / MySQL (prod)
- **Frontend**: Blade Templates, Tailwind CSS v4
- **API Auth**: Laravel Sanctum
- **Build Tool**: Vite (for CSS/JS assets only)

## Development Commands

```bash
# Install dependencies
composer install
npm install

# Run migrations
php artisan migrate:fresh --seed

# Start development server
php artisan serve

# Build assets (if needed)
npm run build
```

## Project Structure
```
myapp/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/          # API Controllers
│   │   │   └──               # Web Controllers
│   │   └── Middleware/
│   ├── Models/
│   └── Providers/
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   ├── views/                # Blade templates
│   ├── css/
│   └── js/                   # Only vanilla JS now
├── routes/
│   ├── web.php              # Web routes
│   └── api.php              # API routes
└── ...
```

## Notes
- API endpoints are fully functional and documented in `API_DOCUMENTATION.md`
- Traditional Blade interface works independently
- Both can be used simultaneously
- API uses token-based auth (Sanctum)
- Web uses session-based auth
