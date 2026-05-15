# UPF CLI Quick Reference

## 🚀 Quick Start

```bash
npm install
npm link
upf-cli
```

## 📋 Command Summary

### Auth Commands
| Command | Description |
|---------|-------------|
| `upf-cli auth login` | Login with email/password |
| `upf-cli auth logout` | Logout and clear session |
| `upf-cli auth whoami` | Show current user info |

### Student Commands
| Command | Description |
|---------|-------------|
| `upf-cli student dashboard` | View student dashboard |
| `upf-cli student grades` | Check grades |
| `upf-cli student timetable` | View schedule |
| `upf-cli student absences` | Check absences |
| `upf-cli student materials` | View course materials |
| `upf-cli student requests` | Administrative requests |

### Professor Commands
| Command | Description |
|---------|-------------|
| `upf-cli professor dashboard` | View professor dashboard |
| `upf-cli professor modules` | List teaching modules |
| `upf-cli professor grades` | Manage grades (interactive) |
| `upf-cli professor absences` | Validate absences (interactive) |
| `upf-cli professor sessions` | View course sessions |
| `upf-cli professor reservations` | Manage room reservations |

### Admin Commands
| Command | Description |
|---------|-------------|
| `upf-cli admin dashboard` | View admin dashboard |
| `upf-cli admin users` | List all users |
| `upf-cli admin filieres` | List academic programs |
| `upf-cli admin requests` | Process requests (interactive) |
| `upf-cli admin timetable` | View global timetable |
| `upf-cli admin reservations` | Manage reservations (interactive) |
| `upf-cli admin absences` | View all absences |

## 🔧 Common Options

- `--json`: Output in JSON format
- `--base-url <url>`: Set API URL
- `--role <role>`: Filter by role (admin only)
- `--status <status>`: Filter by status

## 💡 Tips

1. **Interactive Mode**: Run `upf-cli` without arguments for menu-driven interface
2. **JSON Output**: Use `--json` for scripting and data processing
3. **Filters**: Use filter options to narrow down large datasets
4. **Role-Based**: Commands are automatically filtered based on your role

## 🎯 Interactive Features

The following commands support interactive processing:

- **Professor > Absences**: Validate/reject absence justifications
- **Professor > Grades**: Select module and view/edit grades
- **Admin > Requests**: Approve/reject administrative requests
- **Admin > Reservations**: Approve/reject room reservations

## 📊 Example Workflows

### Student Checking Grades
```bash
upf-cli auth login
upf-cli student grades --json | jq '.[] | select(.note_finale < 10)'
```

### Professor Managing Absences
```bash
upf-cli auth login
upf-cli professor absences
# Follow interactive prompts to validate absences
```

### Admin Processing Requests
```bash
upf-cli auth login -e admin@upf.ma -p password
upf-cli admin dashboard
upf-cli admin requests --status pending
# Follow interactive prompts to process requests
```

## 🔍 Debugging

```bash
# Check configuration
upf-cli doctor

# Verbose output (add to any command)
upf-cli student grades --json 2>&1 | less

# Test API connection
curl http://localhost:8000/api
```

## ⌨️ Keyboard Shortcuts (Interactive Mode)

- `↑/↓`: Navigate menu
- `Enter`: Select option
- `Ctrl+C`: Exit
- Any key: Continue after command execution
