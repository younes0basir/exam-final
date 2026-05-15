# UPF University Management System - API Only

## Overview
This is a **pure API backend** with no frontend. All Blade templates, React files, and web routes have been removed. The application now serves only as a RESTful API.

## What Was Removed

### ❌ Frontend Files
- All Blade templates (`resources/views/`)
  - Login page
  - Admin dashboards
  - Professor dashboards  
  - Student dashboards
  - Layouts
  
- All React files (previously added)
  - `resources/js/pages/`
  - `resources/js/components/`
  - `resources/js/context/`
  - `resources/js/config/`
  - `resources/js/App.jsx`, `app.jsx`

### ❌ Web Routes & Controllers
- Traditional web controllers:
  - `AuthController.php`
  - `AdminController.php`
  - `ProfessorController.php`
  - `StudentController.php`
  
- All web routes from `routes/web.php`

### ❌ Middleware
- Old `RoleMiddleware.php` (web-based)

## What Remains

### ✅ Backend Core
- All Models (`app/Models/`)
- All Migrations (`database/migrations/`)
- All Seeders (`database/seeders/`)
- Configuration files

### ✅ API Controllers
Located in `app/Http/Controllers/Api/`:
- `AuthController.php` - Authentication
- `AdminController.php` - Admin operations
- `ProfessorController.php` - Professor operations
- `StudentController.php` - Student operations

### ✅ API Routes
All routes in `routes/api.php`:
- Authentication endpoints
- Admin endpoints
- Professor endpoints
- Student endpoints

### ✅ API Middleware
- `ApiRoleMiddleware.php` - Role-based access control for API

### ✅ Authentication
- Laravel Sanctum for token-based API authentication

## API Endpoints

### Base URL
```
http://localhost:8000/api
```

### Authentication (Public)
- `POST /api/login` - Login and receive token
- `GET /api/user` - Get current user info (requires token)
- `POST /api/logout` - Logout (requires token)

### Admin Endpoints (Requires admin role + token)
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - List all users (paginated)
- `POST /api/admin/users/student` - Create new student
- `GET /api/admin/academic/filieres` - List academic programs
- `GET /api/admin/timetable` - View timetables (with filters)
- `GET /api/admin/requests` - List administrative requests
- `PATCH /api/admin/requests/{id}` - Update request status

### Professor Endpoints (Requires professor role + token)
- `GET /api/professor/dashboard/stats` - Dashboard statistics
- `GET /api/professor/modules` - List assigned modules
- `GET /api/professor/grades/{moduleId}` - Get grades for module
- `POST /api/professor/grades/{moduleId}` - Save/update grades
- `GET /api/professor/session-log` - View session logs

### Student Endpoints (Requires student role + token)
- `GET /api/student/dashboard/stats` - Dashboard statistics
- `GET /api/student/results` - View grades/results
- `GET /api/student/timetable` - View personal timetable
- `GET /api/student/materials` - View course materials
- `GET /api/student/absences` - View absence records
- `GET /api/student/requests` - View administrative requests
- `POST /api/student/requests` - Create new request

## Usage Examples

### 1. Login to Get Token
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@upf.ma",
    "password": "password"
  }'
```

Response:
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@upf.ma",
    "role": "admin"
  },
  "token": "1|abc123xyz..."
}
```

### 2. Use Token for API Calls
```bash
curl http://localhost:8000/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Create Student (Admin Only)
```bash
curl -X POST http://localhost:8000/api/admin/users/student \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@student.upf.ma",
    "password": "password123"
  }'
```

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

## Setup & Running

### Installation
```bash
# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Run migrations and seeders
php artisan migrate:fresh --seed
```

### Start Server
```bash
php artisan serve
```

Server will run at: `http://localhost:8000`

### Test API
Visit `http://localhost:8000` in browser to see API welcome message.

Use tools like Postman, Insomnia, or curl to test API endpoints.

## Project Structure

```
myapp/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/              # API Controllers only
│   │   └── Middleware/
│   │       └── ApiRoleMiddleware.php
│   ├── Models/                   # All Eloquent models
│   └── Providers/
├── database/
│   ├── migrations/               # Database schema
│   └── seeders/                  # Sample data
├── routes/
│   ├── web.php                  # Minimal (API info only)
│   └── api.php                  # All API routes
├── config/
├── resources/
│   └── views/                   # Empty (no frontend)
└── ...
```

## Authentication Flow

1. **Login**: POST to `/api/login` with email/password
2. **Receive Token**: Get Bearer token in response
3. **Include Token**: Add `Authorization: Bearer {token}` header to all requests
4. **Automatic Validation**: Sanctum validates token on each request
5. **Role Checking**: ApiRoleMiddleware checks user role for protected routes
6. **Logout**: POST to `/api/logout` to invalidate token

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden (Wrong Role)
```json
{
  "message": "Unauthorized. Insufficient permissions."
}
```

### 422 Validation Error
```json
{
  "message": "The email field is required.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

## Tech Stack

- **Framework**: Laravel 13.8.0
- **PHP**: 8.4+
- **Database**: SQLite (dev) / MySQL (prod)
- **API Auth**: Laravel Sanctum
- **Architecture**: RESTful API

## Notes

- ✅ No frontend - pure API backend
- ✅ Token-based authentication (Sanctum)
- ✅ Role-based access control
- ✅ RESTful API design
- ✅ Ready for any frontend (React, Vue, Angular, Mobile Apps)
- ✅ CORS can be enabled if needed for external frontends

## Next Steps

To connect a frontend:
1. Build your frontend (React, Vue, etc.)
2. Configure it to call `http://localhost:8000/api`
3. Implement login to get token
4. Store token (localStorage/cookies)
5. Include token in all API requests
6. Handle token expiration and refresh
