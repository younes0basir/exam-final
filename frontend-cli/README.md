# UPF CLI - University Management System Command Line Interface

## 🌟 NEW: Smart Edition v0.7.0 - Simple & Reliable AI!

The CLI now features a **simple, fast, and reliable AI assistant** (no API needed):
- 🤖 **Simple AI Assistant** - Instant responses, always works offline
- ⚡ **Lightning Fast** - <100ms response time (vs 2-3s with API)
- 🎯 **Reliable** - No JSON parsing errors, no null crashes
- 💬 **Direct Questions** - Asks for missing info clearly
- ✅ **Safe** - Confirms destructive actions
- 📱 **Responsive Layouts** - Works on small and large screens
- ✨ **Beautiful ASCII Art Banner** - Adapts to terminal width
- 📱 **Responsive Layouts** - Works on small and large screens
- 🧠 **Smart Suggestions** based on your role and context
- ⏰ **Time-Based Tips** for contextual guidance
- 🎨 **Enhanced UI** with color-coded status indicators
- 📊 **Real-Time Feedback** with animated progress bars
- 🔧 **Full CRUD Operations** - Create, Read, Update, Delete data!
- 🖱️ **Interactive Menus** - No need to remember commands, just navigate!
- 📐 **Smart Tables** - Auto-adjust column widths
- 🎯 **Enhanced Navigation** - Page scrolling and separators

### New AI Features:
- 🗣️ **Natural Language Processing** - "Créer un utilisateur", "Voir mes notes"
- 🧩 **Intent Recognition** - Understands what you want to do
- 🔍 **Entity Extraction** - Automatically detects IDs, roles, dates
- 🛡️ **Permission Checking** - Only allows actions you're authorized to do
- 💡 **Smart Suggestions** - Helps when it doesn't understand
- 🌍 **Bilingual** - French and English support

📚 **Documentation:**
- [SIMPLE_AI_REBUILD.md](./SIMPLE_AI_REBUILD.md) - **NEW!** Simple AI architecture
- [MULTI_TURN_CONVERSATION.md](./MULTI_TURN_CONVERSATION.md) - Conversation patterns
- [AI_ASSISTANT_GUIDE.md](./AI_ASSISTANT_GUIDE.md) - General AI guide
- [RESPONSIVE_UI_GUIDE.md](./RESPONSIVE_UI_GUIDE.md) - Complete responsive UI guide
- [INTERACTIVE_CRUD_GUIDE.md](./INTERACTIVE_CRUD_GUIDE.md) - Complete interactive menu guide
- [SMART_FEATURES.md](./SMART_FEATURES.md) - Complete smart features guide
- [CRUD_OPERATIONS.md](./CRUD_OPERATIONS.md) - Full CRUD operations guide
- [VISUAL_GUIDE.md](./VISUAL_GUIDE.md) - Before/after visual comparison
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick command reference

---

A powerful command-line interface for managing university operations at UPF (Université Privée de Fès).

## Features

### 🔐 Authentication
- Login/logout with token management
- Session persistence
- Multi-role support (Admin, Professor, Student)

### 👨‍🎓 Student Commands
- **Dashboard**: View personal statistics and overview
- **Grades**: Check grades for all modules (CC1, CC2, Exams, Final)
- **Timetable**: View weekly schedule
- **Absences**: Track attendance and absence status
- **Materials**: Access course materials and documents
- **Administrative Requests**: Submit and track administrative requests

### 👨‍🏫 Professor Commands
- **Dashboard**: View teaching statistics and overview
- **Modules**: List assigned teaching modules
- **Grades**: Manage student grades per module
- **Absences**: Review and validate absence justifications
- **Sessions**: View course sessions (cahier de textes)
- **Reservations**: Manage classroom reservations

### 👨‍💼 Admin Commands
- **Dashboard**: View comprehensive university statistics
- **Users**: Manage students, professors, and admins
- **Filieres**: Browse academic programs
- **Requests**: Process administrative document requests
- **Timetable**: View global schedule
- **Reservations**: Approve/reject room reservations
- **Absences**: Monitor all absences across the university

## Installation

```bash
cd frontend-cli
npm install
npm link
```

## Usage

### Interactive Menu Mode
Simply run without arguments:
```bash
upf-cli
# or
upf
```

This launches an interactive menu system with role-based options.

### Command-Line Mode

#### Authentication
```bash
# Login
upf-cli auth login
upf-cli auth login -e admin@upf.ma -p password

# Logout
upf-cli auth logout

# Check current session
upf-cli auth whoami
```

#### Student Commands
```bash
# Dashboard
upf-cli student dashboard
upf-cli student dashboard --json

# Grades
upf-cli student grades

# Timetable
upf-cli student timetable

# Absences
upf-cli student absences

# Course Materials
upf-cli student materials

# Administrative Requests
upf-cli student requests
```

#### Professor Commands
```bash
# Dashboard
upf-cli professor dashboard

# Modules
upf-cli professor modules

# Manage Grades (interactive)
upf-cli professor grades
upf-cli professor grades --module-id 1

# Manage Absences (interactive)
upf-cli professor absences

# Course Sessions
upf-cli professor sessions

# Reservations
upf-cli professor reservations
```

#### Admin Commands
```bash
# Dashboard
upf-cli admin dashboard

# Users
upf-cli admin users
upf-cli admin users --role student

# Filieres
upf-cli admin filieres

# Administrative Requests (interactive)
upf-cli admin requests
upf-cli admin requests --status pending

# Global Timetable
upf-cli admin timetable

# Room Reservations (interactive)
upf-cli admin reservations

# Absences
upf-cli admin absences
```

### Options

- `--json`: Output data in JSON format (useful for scripting)
- `--base-url <url>`: Override API base URL
- Various filter options depending on command

## Examples

### Quick Start
```bash
# 1. Set API URL (if different from default)
upf-cli --base-url http://13.49.72.180

# 2. Login
upf-cli auth login

# 3. Use interactive menu
upf-cli
```

### Scripting with JSON output
```bash
# Get grades as JSON
upf-cli student grades --json > grades.json

# Process with jq
upf-cli student grades --json | jq '.[] | select(.note_finale < 10)'
```

### Admin Workflow
```bash
# Login as admin
upf-cli auth login -e admin@upf.ma -p password

# Check dashboard stats
upf-cli admin dashboard

# Process pending requests interactively
upf-cli admin requests

# View all users
upf-cli admin users --json
```

## Configuration

The CLI stores configuration in a local config file:
- API base URL (default: http://13.49.72.180)
- Authentication token
- User session data

Configuration is automatically managed and persists between sessions.

## Architecture

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
│   │   └── output.js        # Formatted output utilities
│   ├── cli.js               # Main CLI entry point
│   └── config.js            # Configuration management
└── package.json
```

## Dependencies

- **commander**: CLI framework
- **inquirer**: Interactive prompts
- **axios**: HTTP client
- **chalk**: Terminal styling
- **cli-table3**: Table formatting
- **ora**: Loading spinners
- **conf**: Persistent configuration

## Development

### Adding New Commands

1. Create a new file in `src/commands/`
2. Export a `registerXXXCommands(program)` function
3. Import and register in `src/cli.js`
4. Add submenu functions if needed

### Example Command Structure

```javascript
import ora from "ora";
import { createApiClient } from "../lib/http.js";
import { printTable } from "../lib/output.js";

export function registerMyCommands(program) {
  const myCmd = program.command("mycommand").description("Description");
  
  myCmd
    .command("subcommand")
    .description("Subcommand description")
    .option("--json", "JSON output")
    .action(async (options) => {
      try {
        await doSomething(options);
      } catch (error) {
        printError(error?.message || "Error occurred");
        process.exitCode = 1;
      }
    });
}

export async function doSomething(options = {}) {
  const spinner = ora("Loading...").start();
  const client = createApiClient();
  const response = await client.get("/api/endpoint");
  spinner.stop();
  
  const data = response.data;
  
  if (options.json) {
    console.log(JSON.stringify(data, null, 2));
    return data;
  }
  
  // Format and display data
  printTable(["Header1", "Header2"], rows);
  return data;
}
```

## Error Handling

- Network errors are caught and displayed with helpful messages
- Authentication errors trigger automatic logout
- All commands support `--json` flag for programmatic error handling

## Best Practices

1. Always use `--json` flag when scripting
2. Use interactive mode for manual operations
3. Check `whoami` before performing role-specific actions
4. Use filters (`--role`, `--status`) to narrow down large datasets

## Troubleshooting

### Connection Issues
```bash
# Verify backend is running
curl http://13.49.72.180/api

# Check configured URL
upf-cli doctor
```

### Authentication Issues
```bash
# Clear session and re-login
upf-cli auth logout
upf-cli auth login
```

### Permission Denied
Ensure you're logged in with the correct role for the command you're trying to execute.

## License

MIT

## Support

For issues or questions, please refer to the main UPF project documentation.
