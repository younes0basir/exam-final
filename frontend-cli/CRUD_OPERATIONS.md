# 🔧 UPF CLI - CRUD Operations Guide

## Overview

The UPF CLI now supports full **CRUD (Create, Read, Update, Delete)** operations, allowing users to not only view data but also create, modify, and delete records directly from the command line.

---

## 👨‍💼 Administrator CRUD Operations

### User Management (Full CRUD)

#### 📖 READ - List Users
```bash
# List all users
upf admin users

# Filter by role
upf admin users --role student
upf admin users --role professor
upf admin users --role admin

# Export as JSON
upf admin users --json > users.json
```

#### ➕ CREATE - Add New User
```bash
# Interactive creation
upf admin users --create

# The CLI will prompt for:
# - Nom complet
# - Email (validated)
# - Mot de passe (min 6 characters)
# - Rôle (student/professor/admin)
```

**Example:**
```
📝 Créer un nouvel utilisateur

Nom complet: Ahmed Benali
Email: ahmed.benali@upf.ma
Mot de paste: ********
Rôle: 👨‍🎓 Étudiant

✓ Utilisateur créé avec succès
✓ Utilisateur créé: Ahmed Benali (ahmed.benali@upf.ma)
ℹ ID: 42
```

#### ✏️ UPDATE - Modify User
```bash
# Update user by ID
upf admin users --update 42

# The CLI will:
# 1. Fetch current user data
# 2. Show current values as defaults
# 3. Prompt for changes
# 4. Ask if you want to change password
```

**Example:**
```
✏️  Mise à jour de l'utilisateur: Ahmed Benali

Nom complet: [Ahmed Benali] Ahmed B.
Email: [ahmed.benali@upf.ma] ahmed.b@upf.ma
Rôle: 👨‍🎓 Étudiant
Changer le mot de passe? (y/N) n

✓ Utilisateur mis à jour avec succès
✓ Utilisateur mis à jour: Ahmed B.
```

#### ❌ DELETE - Remove User
```bash
# Delete user by ID
upf admin users --delete 42

# Safety confirmation required
```

**Example:**
```
⚠️  Êtes-vous sûr de vouloir supprimer l'utilisateur Ahmed B. (ahmed.b@upf.ma)? 
Cette action est irréversible! (y/N) y

✓ Utilisateur supprimé avec succès
✓ Utilisateur Ahmed B. a été supprimé
```

---

## 👨‍🏫 Professor CRUD Operations

### Grade Management

#### 📖 READ - View Grades
```bash
# Interactive grade management
upf professor grades

# Specify module
upf professor grades --module-id 5
```

#### ✏️ UPDATE - Modify Grades
The `manageGrades` function already supports updating student grades interactively:

```bash
upf professor grades

# Select module
# Select student
# Enter grades: CC1, CC2, Examen, Note Finale
```

### Session Management (Cahier de Textes)

#### ➕ CREATE - Add Session
```bash
upf professor sessions

# Interactive session creation with:
# - Module selection
# - Date
# - Topic/Content
# - Duration
```

---

## 👨‍🎓 Student CRUD Operations

### Administrative Requests

#### 📖 READ - View Requests
```bash
# List all requests
upf student requests

# Export as JSON
upf student requests --json
```

#### ➕ CREATE - Submit Request
```bash
# Create new administrative request
upf student requests --create

# The CLI will prompt for:
# - Type de demande (with emoji options)
# - Description (optional)
```

**Available Request Types:**
- 📄 Attestation de scolarité
- 📊 Relevé de notes
- 🎓 Attestation de réussite
- 📋 Certificat de présence
- 📝 Autre

**Example:**
```
📝 Créer une demande administrative

Type de demande:
  1) 📄 Attestation de scolarité
  2) 📊 Relevé de notes
  3) 🎓 Attestation de réussite
  4) 📋 Certificat de présence
  5) 📝 Autre

Description (optionnel): Urgent needed for internship application

✓ Demande soumise avec succès
✓ Demande créée: attestation_scolarite
ℹ ID: 15
ℹ Statut: en_attente
```

---

## 🎯 Interactive CRUD Workflows

### Admin: Complete User Management Workflow

```bash
# Step 1: View existing users
upf admin users --role student

# Step 2: Create new student
upf admin users --create
→ Enter details interactively

# Step 3: Verify creation
upf admin users --role student | grep "new_student_email"

# Step 4: Update if needed
upf admin users --update <new_id>

# Step 5: Delete if mistake
upf admin users --delete <new_id>
```

### Student: Request Submission Workflow

```bash
# Step 1: Check existing requests
upf student requests

# Step 2: Create new request
upf student requests --create
→ Select type and add description

# Step 3: Monitor status
upf student requests
→ Watch for status changes (en_attente → validé/rejeté)
```

---

## 🔐 Security Features

### Input Validation
- ✅ Email format validation
- ✅ Password minimum length (6 characters)
- ✅ Required field validation
- ✅ Role selection from predefined list

### Safety Confirmations
- ⚠️ Delete operations require explicit confirmation
- ⚠️ Shows full user details before deletion
- ⚠️ Warns about irreversible actions

### Error Handling
- Clear error messages
- API error propagation
- Graceful failure with spinner feedback
- Rollback on failed operations

---

## 💡 Best Practices

### For Administrators

1. **Always verify before deleting**
   ```bash
   # Check user details first
   upf admin users --json | jq '.[] | select(.id == 42)'
   
   # Then delete if correct
   upf admin users --delete 42
   ```

2. **Use filters for large datasets**
   ```bash
   upf admin users --role student  # Instead of listing all
   ```

3. **Export before bulk operations**
   ```bash
   upf admin users --json > backup.json
   ```

4. **Test with one user first**
   ```bash
   # Create test user
   upf admin users --create
   
   # Verify it works
   upf admin users --role student
   
   # Delete test user
   upf admin users --delete <test_id>
   ```

### For Students

1. **Check existing requests before creating new ones**
   ```bash
   upf student requests
   ```

2. **Provide clear descriptions**
   ```bash
   upf student requests --create
   → Add context: "Needed for scholarship application by [date]"
   ```

3. **Monitor request status regularly**
   ```bash
   upf student requests
   ```

### For Professors

1. **Review grades before finalizing**
   ```bash
   upf professor grades --module-id 5 --json
   ```

2. **Batch update when possible**
   ```bash
   upf professor grades
   → Update multiple students in one session
   ```

---

## 🛠️ Troubleshooting

### Common Issues

#### "Utilisateur non trouvé"
```bash
# Solution: Verify the ID exists
upf admin users --json | jq '.[].id'
```

#### "Email invalide"
```bash
# Solution: Use proper email format
# ✓ Correct: student@upf.ma
# ✗ Wrong: student@upf, student.upf.ma
```

#### "Mot de passe trop court"
```bash
# Solution: Use at least 6 characters
# ✓ Correct: password123
# ✗ Wrong: pass
```

#### Permission Denied
```bash
# Solution: Ensure you're logged in with correct role
upf auth whoami

# Re-login if needed
upf auth logout
upf auth login
```

#### Network Errors
```bash
# Check backend connectivity
curl http://13.49.72.180/api

# Verify CLI configuration
upf doctor
```

---

## 📊 CRUD Operations Summary

| Operation | Admin | Professor | Student |
|-----------|-------|-----------|---------|
| **Users** | ✅ Full CRUD | ❌ | ❌ |
| **Grades** | 👁️ View All | ✅ Update | 👁️ View Own |
| **Requests** | 👁️ View All + Process | ❌ | ✅ Create + View |
| **Sessions** | 👁️ View All | ✅ Create + Update | 👁️ View Own |
| **Absences** | 👁️ View All | ✅ Validate | 👁️ View Own |
| **Reservations** | ✅ Approve/Reject | ✅ Create | ❌ |
| **Filieres** | 👁️ View | 👁️ View | 👁️ View |

**Legend:**
- ✅ Full CRUD (Create, Read, Update, Delete)
- 👁️ Read-only access
- ❌ No access

---

## 🚀 Future CRUD Enhancements

Planned additions:
- [ ] Bulk user import from CSV
- [ ] Batch grade updates
- [ ] Request cancellation (for students)
- [ ] User deactivation (soft delete)
- [ ] Mass email notifications
- [ ] Automated report generation
- [ ] Schedule conflict detection
- [ ] Grade calculation automation

---

## 📝 Command Reference Quick Table

### Admin Commands
```bash
upf admin users                      # READ
upf admin users --create             # CREATE
upf admin users --update <id>        # UPDATE
upf admin users --delete <id>        # DELETE
```

### Professor Commands
```bash
upf professor grades                 # READ + UPDATE (interactive)
upf professor sessions               # READ + CREATE (interactive)
upf professor absences               # READ + VALIDATE (interactive)
```

### Student Commands
```bash
upf student requests                 # READ
upf student requests --create        # CREATE
```

---

## 🎓 Examples by Use Case

### Scenario 1: Onboarding New Students
```bash
# Admin creates 3 new students
upf admin users --create  # Student 1
upf admin users --create  # Student 2
upf admin users --create  # Student 3

# Verify all created
upf admin users --role student --json | jq 'length'
```

### Scenario 2: End of Semester Grade Entry
```bash
# Professor enters grades for module
upf professor grades --module-id 5

# For each student:
# - Select student
# - Enter CC1, CC2, Examen
# - System calculates finale
# - Save and move to next student
```

### Scenario 3: Student Needs Documents
```bash
# Student submits multiple requests
upf student requests --create  # Attestation de scolarité
upf student requests --create  # Relevé de notes

# Check status next day
upf student requests
```

---

**Remember**: Always use the interactive mode (`upf`) for guided CRUD operations with smart suggestions!

*Made with ❤️ for efficient university management*
