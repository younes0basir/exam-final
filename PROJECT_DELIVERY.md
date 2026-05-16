# 🎓 UPF University Management System - Project Delivery

## 📦 Project Overview

A complete university management system built with **Laravel 13** (backend) and **React + TypeScript** (frontend) for Université Privée de Fès (UPF).

### Key Features
- ✅ **Multi-language Support**: French, English, Arabic with RTL
- ✅ **Role-based Access**: Admin, Professor, Student
- ✅ **Dashboard Analytics**: Interactive charts and statistics
- ✅ **Grade Management**: Automated calculations
- ✅ **Attendance Tracking**: Absence monitoring
- ✅ **Classroom System**: Announcements and materials
- ✅ **Timetable Management**: Course scheduling
- ✅ **Document Generation**: PDF certificates and attestations

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+ with Composer
- Node.js 18+ with npm
- MySQL 8.0+ (WAMP/XAMPP recommended)

### Installation

#### 1. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### 3. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

---

## 👥 Demo Accounts

All demo accounts use password: **`password`**

| Role | Email | Password |
|------|-------|----------|
| Administrator | `admin@upf.ma` | `password` |
| Professor | `l.benali@upf.ma` | `password` |
| Student | `a.bennani2@student.upf.ma` | `password` |

**Quick Login**: Click any demo button on the login page to auto-fill credentials!

---

## 📁 Project Structure

```
exam final/
├── backend/              # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   └── Providers/
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── resources/lang/   # Translation files
│       ├── fr/common.php
│       ├── en/common.php
│       └── ar/common.php
├── frontend/             # React Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── professor/
│   │   │   └── student/
│   │   ├── services/
│   │   ├── locales/      # i18n translations
│   │   │   ├── fr.json
│   │   │   ├── en.json
│   │   │   └── ar.json
│   │   └── i18n.ts
│   └── package.json
├── frontend-cli/         # Command-line interface
├── *.sql                 # Database schemas
├── *.png                 # UML diagrams
├── logo-upf.jpg          # University logo
├── README.md             # Full documentation
└── exigences.md          # Project requirements
```

---

## 🌍 Multi-Language Support

The system supports three languages with instant switching:

### Supported Languages
- 🇫🇷 **French** (Default)
- 🇬🇧 **English**
- 🇸🇦 **Arabic** (with RTL layout)

### How to Switch Language
1. Look for the flag icon in the top-right header
2. Click to open language selector
3. Choose your preferred language
4. Interface updates instantly (no reload needed)
5. Preference is saved automatically

---

## 📊 Technology Stack

### Backend
- **Framework**: Laravel 13.8
- **Database**: MySQL 9.1
- **Authentication**: Laravel Sanctum
- **PDF Generation**: barryvdh/laravel-dompdf
- **Excel Export**: maatwebsite/excel
- **Real-time**: Pusher (configured)

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Internationalization**: i18next

---

## 🗄️ Database

### Main Tables
- `users` - User accounts (admins, professors, students)
- `filieres` - Academic programs
- `modules` - Course modules
- `groupes` - Student groups
- `notes` - Student grades
- `absences` - Attendance records
- `seances` - Class sessions
- `salles` - Classrooms
- `reservations_salles` - Room bookings
- `demandes_administratives` - Document requests
- `classroom_annonces` - Classroom announcements
- `cahier_textes` - Course logs

### SQL Files
- `g_universitaire.sql` - Complete database schema
- `enhanced_database.sql` - Enhanced schema with sample data
- `additional_data.sql` - Additional test data

---

## 🔐 Authentication

The system uses **Laravel Sanctum** for token-based authentication:

1. Users login with email and password
2. Backend returns JWT token
3. Token stored in localStorage
4. All API requests include Bearer token
5. Automatic session management

### Security Features
- Password hashing (bcrypt)
- CSRF protection
- CORS configuration
- Role-based authorization middleware
- API rate limiting

---

## 📈 Dashboard Features

### Admin Dashboard
- Total students, professors, modules count
- Pending administrative requests
- Grade distribution charts
- Absence analytics
- Module performance metrics
- Student enrollment by filière

### Professor Dashboard
- Assigned modules overview
- Upcoming sessions
- Recent grade submissions
- Absence reports

### Student Dashboard
- Current grades and averages
- Upcoming classes
- Recent absences
- Available course materials

---

## 📝 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/dashboard/analytics` - Chart data
- `GET /api/admin/requests` - Administrative requests
- `POST /api/language` - Change language

### Professor
- `GET /api/professor/modules` - Assigned modules
- `POST /api/professor/grades` - Submit grades
- `GET /api/professor/sessions` - Class sessions

### Student
- `GET /api/student/results` - View grades
- `GET /api/student/absences` - View absences
- `GET /api/student/materials` - Course materials

See `README.md` for complete API documentation.

---

## 🎨 UI/UX Features

### Design System
- Modern glass-morphism design
- Responsive layout (mobile-first)
- Smooth animations and transitions
- Consistent color scheme
- Professional typography

### Accessibility
- Keyboard navigation support
- Screen reader compatible
- High contrast mode ready
- RTL support for Arabic

---

## 🧪 Testing

### Manual Testing Checklist

1. **Login System**
   - [ ] Test all 3 demo accounts
   - [ ] Verify role-based redirects
   - [ ] Test language switching on login page

2. **Admin Panel**
   - [ ] Dashboard statistics display correctly
   - [ ] Charts render properly
   - [ ] Language switching works
   - [ ] User management functions

3. **Professor Panel**
   - [ ] Module list displays
   - [ ] Grade entry works
   - [ ] Session management
   - [ ] Absence marking

4. **Student Panel**
   - [ ] Grades visible
   - [ ] Timetable displays
   - [ ] Materials accessible
   - [ ] Absence history

5. **Multi-language**
   - [ ] Switch between FR/EN/AR
   - [ ] Verify all text translates
   - [ ] Check RTL layout for Arabic
   - [ ] Confirm persistence after refresh

---

## 📋 Project Deliverables

### Source Code
✅ Complete Laravel backend  
✅ React frontend with TypeScript  
✅ CLI tool for administration  

### Documentation
✅ README.md - Comprehensive guide  
✅ exigences.md - Requirements specification  
✅ API documentation (in README)  

### Database
✅ SQL schema files  
✅ Sample data for testing  
✅ Migration files  

### Diagrams
✅ Class diagram (class-diagram.png)  
✅ Use case diagram (usecase-diagram.png)  
✅ Sequence diagram (sequence-diagram.png)  

### Assets
✅ UPF logo (logo-upf.jpg)  

---

## 🔧 Configuration Files

### Backend (.env)
```env
APP_NAME="UPF University"
APP_ENV=local
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=g_universitaire
DB_USERNAME=root
DB_PASSWORD=
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

---

## 🚦 Common Issues & Solutions

### Issue: Database connection error
**Solution**: Ensure WAMP/XAMPP is running and MySQL service is active

### Issue: CORS errors
**Solution**: Check `backend/config/cors.php` allows your frontend URL

### Issue: Language not persisting
**Solution**: Clear browser cache and localStorage

### Issue: Charts not displaying
**Solution**: Verify analytics endpoint returns data: `GET /api/admin/dashboard/analytics`

---

## 📞 Support

For questions or issues:
1. Check `README.md` for detailed documentation
2. Review `exigences.md` for requirements
3. Examine database schema in SQL files
4. Check browser console for frontend errors
5. Check `storage/logs/laravel.log` for backend errors

---

## ✅ Quality Assurance

### Code Quality
- ✅ TypeScript for type safety
- ✅ MVC architecture
- ✅ RESTful API design
- ✅ Component-based React
- ✅ Separation of concerns

### Performance
- ✅ Lazy loading where applicable
- ✅ Optimized database queries
- ✅ Efficient state management
- ✅ Responsive design

### Security
- ✅ Password hashing
- ✅ SQL injection prevention (Eloquent ORM)
- ✅ XSS protection
- ✅ CSRF tokens
- ✅ Input validation

---

## 🎯 Future Enhancements

Potential improvements for future versions:
- Real-time notifications (Pusher integration ready)
- Excel export functionality (package installed)
- Mobile application
- Advanced analytics dashboard
- Email notifications
- File upload for assignments
- Online exam system
- Video conferencing integration

---

## 📄 License

This project includes a LICENSE file. Please review for usage terms.

---

## 🙏 Acknowledgments

- Université Privée de Fès (UPF)
- Laravel Framework
- React Community
- All contributors

---

**Project Status**: ✅ Complete and Ready for Delivery

**Last Updated**: May 2026

**Version**: 1.0.0

---

For detailed technical documentation, please refer to `README.md`.
