# 🚀 UPF CLI - Quick Reference Card

## Getting Started

### First Time Setup
```bash
npm install          # Install dependencies
npm link            # Link CLI globally
upf auth login      # Login to system
```

### Set Backend URL
```bash
upf auth login --base-url http://13.49.72.180
```

---

## Essential Commands

### 🔐 Authentication
```bash
upf auth login              # Interactive login
upf auth logout             # Logout
upf auth whoami             # Check current session
```

### 📊 Dashboard
```bash
upf                         # Interactive menu (RECOMMENDED)
upf admin dashboard         # Admin stats
upf professor dashboard     # Teaching overview
upf student dashboard       # Academic summary
```

### 💡 Smart Features
```bash
upf tips                    # Get smart suggestions
upf doctor                  # Check configuration
```

---

## Role-Specific Commands

### 👨‍💼 Administrator

#### User Management
```bash
upf admin users                     # List all users
upf admin users --role student      # Filter students
upf admin users --role professor    # Filter professors
```

#### Requests & Approvals
```bash
upf admin requests                  # Process requests (interactive)
upf admin reservations              # Manage room bookings
upf admin absences                  # Monitor attendance
```

#### Academic Programs
```bash
upf admin filieres                  # List programs
upf admin timetable                 # Global schedule
```

---

### 👨‍🏫 Professor

#### Teaching Management
```bash
upf professor modules               # My courses
upf professor sessions              # Course sessions
upf professor grades                # Manage grades (interactive)
upf professor absences              # Validate absences
```

#### Reservations
```bash
upf professor reservations          # Room bookings
```

---

### 👨‍🎓 Student

#### Academic Information
```bash
upf student grades                  # My grades
upf student timetable               # My schedule
upf student absences                # My attendance
upf student materials               # Course materials
```

#### Administrative
```bash
upf student requests                # Submit/view requests
```

---

## Smart Features Guide

### 🧠 Smart Suggestions
- Appear automatically after each action
- Based on your role (Admin/Professor/Student)
- Priority-ranked by importance
- Include emoji icons for quick recognition

### ⏰ Time-Based Tips
- **Morning** (6AM-12PM): Daily planning tips
- **Afternoon** (12PM-5PM): Mid-day reminders
- **Evening** (5PM+): End-of-day tasks

### 🎨 Visual Indicators
- ● Green = Online/Success
- ● Red = Offline/Error
- ● Yellow = Warning/Pending
- ● Cyan = Info/Ready

---

## Pro Tips

### Efficiency Hacks
1. **Use Interactive Mode**: `upf` is faster than typing full commands
2. **Follow Suggestions**: Smart suggestions are optimized for your workflow
3. **Export Data**: Add `--json` flag to any command
4. **Check Tips**: Run `upf tips` for contextual advice
5. **Quick Config**: Use `upf doctor` to verify setup

### JSON Export Examples
```bash
upf student grades --json > grades.json
upf admin users --role student --json | jq '.[].email'
upf professor modules --json
```

### Filtering Data
```bash
upf admin users --role student
upf admin requests --status pending
upf professor grades --module-id 1
```

---

## Troubleshooting

### Connection Issues
```bash
# Test backend connectivity
curl http://13.49.72.180/api

# Check CLI config
upf doctor

# Update URL
upf auth login --base-url http://13.49.72.180
```

### Session Problems
```bash
# Clear and re-login
upf auth logout
upf auth login
```

### Performance
```bash
# Use JSON for faster output
upf admin users --json

# Filter large datasets
upf admin users --role student
```

---

## Keyboard Navigation (Interactive Menu)

- **Arrow Keys**: Navigate menu
- **Enter**: Select option
- **Ctrl+C**: Cancel/Exit
- **q**: Quit (in submenus)
- **b**: Back (in submenus)

---

## Common Workflows

### 👨‍💼 Admin Daily Routine
```bash
upf                              # Open menu
→ Dashboard                      # Check stats
→ Requests                       # Process documents
→ Users                          # Review registrations
→ Absences                       # Monitor attendance
```

### 👨‍🏫 Professor Workflow
```bash
upf                              # Open menu
→ Dashboard                      # View schedule
→ Modules                        # See courses
→ Sessions                       # Update cahier
→ Grades                         # Enter scores
```

### 👨‍🎓 Student Routine
```bash
upf                              # Open menu
→ Dashboard                      # Overview
→ Grades                         # Check scores
→ Timetable                      # View schedule
→ Materials                      # Download files
```

---

## Configuration

### View Current Settings
```bash
upf doctor
```

### Change Backend URL
```bash
# Method 1: Via login
upf auth login --base-url <URL>

# Method 2: Via menu
upf → "Changer URL backend"
```

### Config File Location
- Windows: `%APPDATA%\upf-cli\config.json`
- Mac/Linux: `~/.config/upf-cli/config.json`

---

## Command History

View command history:
```bash
# Windows
type %USERPROFILE%\.upf-cli-history

# Mac/Linux
cat ~/.upf-cli-history
```

---

## Help & Support

### Built-in Help
```bash
upf --help                # Main help
upf auth --help           # Auth help
upf admin --help          # Admin help
```

### Documentation
- README.md - Full documentation
- SMART_FEATURES.md - Smart features guide
- VISUAL_GUIDE.md - Visual examples
- ENHANCEMENT_SUMMARY.md - What's new

---

## Quick Stats

| Feature | Command |
|---------|---------|
| Login | `upf auth login` |
| Dashboard | `upf` → Dashboard |
| Tips | `upf tips` |
| Config | `upf doctor` |
| Logout | `upf auth logout` |
| Help | `upf --help` |

---

## Emoji Legend

- 📊 Dashboard/Statistics
- 👥 Users/People
- 📝 Requests/Documents
- 📋 Absences/Attendance
- 📚 Teaching/Courses
- 📖 Modules/Subjects
- ✏️ Grades/Scores
- 📅 Sessions/Schedule
- 🎓 Student/Academic
- 📈 Grades/Performance
- ⏰ Timetable/Time
- 📁 Materials/Files
- 💡 Tips/Suggestions
- ℹ️ Information
- ✓ Success
- ✗ Error
- ⚠ Warning

---

## Version Info

Current Version: 0.2.0 (Smart Edition)

Check version:
```bash
upf --version
```

---

**Remember**: The interactive mode (`upf`) is the easiest way to use the CLI!

*Made with ❤️ for UPF University*
