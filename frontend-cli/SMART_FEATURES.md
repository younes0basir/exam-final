# 🚀 UPF CLI - Smart & Enhanced Edition

A powerful, intelligent command-line interface for managing university operations at UPF (Université Privée de Fès) with smart suggestions, beautiful UI, and real-time features.

## ✨ What's New in Smart Edition

### 🎨 Enhanced User Interface
- **ASCII Art Banner**: Beautiful welcome screen with gradient colors
- **Smart Status Indicators**: Real-time connection status with visual feedback
- **Color-Coded Output**: Automatic color-coding for success, warnings, and errors
- **Animated Loading**: Smooth loading animations for better UX
- **Time-Based Tips**: Contextual advice based on time of day

### 🧠 Intelligent Features
- **Smart Suggestions**: AI-powered command recommendations based on your role
- **Context-Aware Help**: Relevant tips displayed after each action
- **Predictive Commands**: Suggests next likely actions based on usage patterns
- **Role-Based Optimization**: Tailored experience for Admin, Professor, and Student roles

### 📊 Real-Time Capabilities
- **Live Status Updates**: Visual indicators for online/offline/syncing states
- **Auto-Refresh Data**: Dashboard data updates automatically
- **Progress Tracking**: Visual progress bars for long operations

## 🎯 Quick Start

### Installation

```bash
cd frontend-cli
npm install
npm link
```

### First Time Setup

```bash
# Set backend URL (AWS EC2)
upf auth login --base-url http://13.49.72.180

# Or use interactive mode
upf
# Then select "Changer URL backend"
```

### Launch Smart CLI

```bash
# Interactive menu with smart features
upf

# View smart tips
upf tips

# Check configuration
upf doctor
```

## 🌟 Smart Features Showcase

### 1. Smart Suggestions

After each action, the CLI displays personalized suggestions:

```
──────────────────────────────────────────────────
💡 Smart Suggestions:
──────────────────────────────────────────────────
  1. 📊 upf admin dashboard
     View real-time university statistics
  2. 👥 upf admin users --role student
     List all students
  3. 📝 upf admin requests
     Process pending administrative requests
──────────────────────────────────────────────────
```

### 2. Time-Based Tips

The CLI greets you with contextual advice:

- **Morning** (6AM-12PM): "🌅 Good morning! Check overnight administrative requests."
- **Afternoon** (12PM-5PM): "☀️ Midday reminder: Process pending reservations."
- **Evening** (5PM+): "🌆 Evening check: Review daily statistics."

### 3. Beautiful ASCII Banner

```
 _   _ _____ ____  
| | | | ____|  _ \ 
| |_| |  _| | |_) |
|  _  | |___|  __/ 
|_| |_|_____|_|    
```

### 4. Smart Status Indicators

- ● Online (Green) - Connected to backend
- ● Offline (Red) - Connection lost
- ● Syncing... (Yellow) - Updating data
- ● Ready (Cyan) - Ready for commands

## 📚 Usage Examples

### Authentication

```bash
# Login with smart suggestions
upf auth login

# Login with credentials
upf auth login -e admin@upf.ma -p password

# Check session
upf auth whoami

# Logout
upf auth logout
```

### Admin Commands (with Smart UI)

```bash
# Dashboard with real-time stats
upf admin dashboard

# Filter users by role
upf admin users --role student

# Process requests interactively
upf admin requests

# Monitor absences
upf admin absences
```

### Professor Commands (Enhanced)

```bash
# Teaching overview
upf professor dashboard

# Manage grades
upf professor grades

# Course sessions
upf professor sessions

# Room reservations
upf professor reservations
```

### Student Commands (Smart)

```bash
# Academic summary
upf student dashboard

# Check grades
upf student grades

# Weekly schedule
upf student timetable

# Course materials
upf student materials
```

## 🎨 UI Enhancements

### Color-Coded Output

- ✅ **Success**: Green checkmarks
- ⚠️ **Warnings**: Yellow alerts
- ❌ **Errors**: Red error messages
- ℹ️ **Info**: Cyan information

### Smart Tables

Tables automatically color-code status values:
- "Validé" / "Success" → Green
- "Rejeté" / "Error" → Red
- "En attente" / "Pending" → Yellow

### Progress Indicators

```
Fetching data...
  [███░░░░░░░] Step 1: Loading users
  [██████░░░░] Step 2: Processing data
  [██████████] Step 3: Complete
```

## 🧩 Architecture

```
frontend-cli/
├── src/
│   ├── commands/
│   │   ├── auth.js          # Authentication commands
│   │   ├── student.js       # Student-specific commands
│   │   ├── professor.js     # Professor-specific commands
│   │   └── admin.js         # Admin-specific commands
│   ├── lib/
│   │   ├── http.js          # HTTP client with interceptors
│   │   ├── output.js        # Basic formatted output utilities
│   │   ├── ui-enhanced.js   # 🆕 Enhanced UI components
│   │   └── smart-suggestions.js  # 🆕 Smart suggestion engine
│   ├── cli.js               # Main CLI entry point (enhanced)
│   └── config.js            # Configuration management
└── package.json
```

## 🔧 Advanced Features

### Command History

All commands are tracked in `~/.upf-cli-history` for analytics and improvement.

### Predictive Commands

The CLI learns from your usage patterns and suggests the most likely next command.

### Contextual Help

Type-specific help appears when needed:

```bash
upf admin users
# Shows: "Filter by role: --role student|professor|admin"
```

### JSON Export

All commands support `--json` flag for scripting:

```bash
upf student grades --json > grades.json
upf admin users --role student --json | jq '.[].email'
```

## 💡 Pro Tips

1. **Use Interactive Mode**: Run `upf` without arguments for the best experience
2. **Follow Suggestions**: Smart suggestions are based on your role and context
3. **Check Tips**: Run `upf tips` for time-based advice
4. **Export Data**: Use `--json` flag for programmatic access
5. **Quick Navigation**: Use keyboard shortcuts in menus (q=quit, h=help, b=back)

## 🎯 Role-Specific Workflows

### For Administrators

```bash
# Morning routine
upf                              # Open interactive menu
→ Dashboard                      # Check overnight stats
→ Requests                       # Process pending requests
→ Users                          # Review new registrations

# Afternoon tasks
upf admin reservations           # Approve room bookings
upf admin absences               # Monitor attendance
```

### For Professors

```bash
# Daily workflow
upf                              # Open menu
→ Dashboard                      # View today's schedule
→ Modules                        # See assigned courses
→ Sessions                       # Update cahier de textes

# After classes
upf professor grades             # Enter student grades
upf professor absences           # Validate justifications
```

### For Students

```bash
# Check academic status
upf student dashboard            # Overview
upf student grades               # Latest scores
upf student timetable            # Today's classes

# Study resources
upf student materials            # Download course files
upf student requests             # Submit admin requests
```

## 🛠️ Troubleshooting

### Connection Issues

```bash
# Verify backend connectivity
curl http://13.49.72.180/api

# Check CLI configuration
upf doctor

# Update backend URL
upf auth login --base-url http://13.49.72.180
```

### Session Problems

```bash
# Clear and re-login
upf auth logout
upf auth login
```

### Performance Tips

- Use `--json` flag for faster output (no formatting)
- Filter large datasets with role/status flags
- Use interactive mode for complex workflows

## 📦 Dependencies

### Core
- **commander**: CLI framework
- **inquirer**: Interactive prompts
- **axios**: HTTP client

### Enhanced UI
- **chalk**: Terminal styling
- **gradient-string**: Beautiful gradients
- **figlet**: ASCII art banners
- **boxen**: Decorative boxes
- **cli-table3**: Smart tables
- **ora**: Loading spinners
- **terminal-link**: Clickable links

### Utilities
- **conf**: Persistent configuration

## 🚀 Future Enhancements

Planned features:
- [ ] Voice commands
- [ ] Dark/Light theme toggle
- [ ] Custom aliases
- [ ] Command macros
- [ ] Plugin system
- [ ] Real-time notifications
- [ ] Offline mode
- [ ] Multi-language UI

## 📄 License

MIT

## 🤝 Support

For issues or questions, refer to the main UPF project documentation or contact the development team.

---

**Made with ❤️ for UPF University**

*Experience the future of university management with our intelligent CLI!*
