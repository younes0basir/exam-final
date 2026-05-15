# Changelog

All notable changes to the UPF CLI project.

## [0.2.0] - 2026-05-12

### Added
- **Student Commands** (6 new commands)
  - `student dashboard` - View personal statistics
  - `student grades` - Check all grades
  - `student timetable` - View weekly schedule
  - `student absences` - Track attendance
  - `student materials` - Access course documents
  - `student requests` - Manage administrative requests

- **Professor Commands** (5 new commands, 1 enhanced)
  - `professor dashboard` - View teaching statistics
  - `professor grades` - Interactive grade management
  - `professor absences` - Validate absence justifications
  - `professor sessions` - View course sessions
  - `professor reservations` - Manage room reservations
  - Enhanced `professor modules` with better formatting

- **Admin Commands** (7 new commands)
  - `admin dashboard` - University-wide statistics
  - `admin users` - List and filter users
  - `admin filieres` - Browse academic programs
  - `admin requests` - Process requests interactively
  - `admin timetable` - View global schedule
  - `admin reservations` - Manage reservations interactively
  - `admin absences` - Monitor all absences

- **Interactive Features**
  - Role-based submenu navigation
  - Interactive request processing (approve/reject)
  - Interactive absence validation workflow
  - Interactive module selection for professors
  - Dynamic dashboard based on user role

- **Documentation**
  - Comprehensive README.md with usage examples
  - QUICK_REFERENCE.md for fast lookup
  - IMPROVEMENTS.md detailing all enhancements
  - This CHANGELOG.md

- **Developer Experience**
  - Better error messages with context
  - Consistent code structure across commands
  - Reusable helper functions
  - Dynamic imports for better performance

### Changed
- Enhanced main menu with role-based options
- Improved error handling across all commands
- Better formatted output tables
- More informative loading spinners
- Updated command descriptions in French

### Fixed
- Apostrophe escaping in French text
- Proper API response handling
- Consistent field name mapping
- Error recovery in interactive menus

### Technical Improvements
- Modular architecture with separate command files
- Proper async/await patterns
- Type-safe data handling
- Efficient API calls with error boundaries
- JSON output support for all commands

---

## [0.1.0] - 2026-05-10

### Initial Release

### Added
- Basic CLI framework with Commander.js
- Authentication commands (login, logout, whoami)
- Professor modules listing command
- Interactive home menu
- Configuration management
- HTTP client with authentication
- Formatted output utilities
- Session persistence

### Features
- Token-based authentication
- Persistent configuration
- Basic error handling
- Simple table formatting
- Loading indicators

---

## Version Format

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible changes
- **MINOR** version for backwards-compatible features
- **PATCH** version for backwards-compatible bug fixes

## Types of Changes

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Now removed features
- **Fixed** - Bug fixes
- **Security** - Security improvements

---

## Upcoming Features (Roadmap)

### Planned for v0.3.0
- [ ] Bulk operations for admin requests
- [ ] Export to CSV/Excel functionality
- [ ] Advanced filtering (date ranges, search)
- [ ] Batch grade entry for professors
- [ ] Analytics and charts

### Planned for v0.4.0
- [ ] Offline mode with data caching
- [ ] Push notifications
- [ ] Multi-language support (FR/EN)
- [ ] Mobile companion app
- [ ] API rate limiting handling

---

## Contributors

- Development Team - Initial work and continuous improvements

---

## Notes

- All dates are in YYYY-MM-DD format
- Versions follow Semantic Versioning 2.0.0
- Breaking changes will be clearly marked
- Migration guides provided when necessary
