# 🎨 UPF CLI - Interactive CRUD Menus Guide

## Overview

The UPF CLI now features **beautiful interactive menus** with full CRUD operations integrated directly into the `upf` command. No need to remember complex command-line flags - just use the guided menu system!

---

## 🚀 Quick Start

### Launch Interactive Mode

```bash
upf
```

This opens the main menu with smart suggestions and beautiful UI.

---

## 👨‍💼 Administrator - Interactive User Management

### Step-by-Step Workflow

#### 1. Launch CLI and Login
```bash
upf
# Login if not already logged in
→ Connexion
→ Enter admin credentials
```

#### 2. Navigate to Admin Menu
```
Menu principal
  → Commandes administrateur
```

#### 3. Access User Management
```
Menu Administrateur
  📊 Tableau de bord
  👥 Gérer les utilisateurs      ← Select this
  🎓 Filières
  📝 Demandes administratives
  📅 Emploi du temps
  🏫 Réservations
  📋 Absences
  ⬅️ Retour au menu principal
```

#### 4. User Management Submenu
```
👥 Gestion des Utilisateurs
  📋 Voir tous les utilisateurs
  📋 Voir les étudiants
  📋 Voir les professeurs
  ➕ Créer un nouvel utilisateur    ← CREATE
  ✏️ Modifier un utilisateur        ← UPDATE
  ❌ Supprimer un utilisateur       ← DELETE
  ⬅️ Retour au menu administrateur
```

---

## 📋 CREATE User (Interactive)

### Menu Path:
```
upf → Commandes administrateur → Gérer les utilisateurs → ➕ Créer un nouvel utilisateur
```

### Interactive Flow:
```
📝 Créer un nouvel utilisateur

Nom complet: Sarah Martinez
Email: sarah.martinez@upf.ma
Mot de passe: ********
Rôle: 
  1) 👨‍🎓 Étudiant
  2) 👨‍🏫 Professeur
  3) 👨‍💼 Administrateur
Answer: 1

⟳ Création de l'utilisateur...
✓ Utilisateur créé avec succès
✓ Utilisateur créé: Sarah Martinez (sarah.martinez@upf.ma)
ℹ ID: 105

Appuyez sur Entrée pour continuer...
```

**Features:**
- ✅ Real-time validation
- ✅ Email format checking
- ✅ Password strength verification
- ✅ Visual role selection with emojis
- ✅ Success confirmation with details

---

## ✏️ UPDATE User (Interactive)

### Menu Path:
```
upf → Commandes administrateur → Gérer les utilisateurs → ✏️ Modifier un utilisateur
```

### Interactive Flow:

**Step 1: View Current Users**
```
Sélectionnez l'utilisateur à modifier:

┌────┬──────────────────┬─────────────────────────┬──────────┐
│ ID │ Name             │ Email                   │ Role     │
├────┼──────────────────┼─────────────────────────┼──────────┤
│ 42 │ Ahmed Benali     │ ahmed@upf.ma            │ student  │
│ 58 │ Dr. Fatima       │ fatima@upf.ma           │ professor│
│105 │ Sarah Martinez   │ sarah.martinez@upf.ma   │ student  │
└────┴──────────────────┴─────────────────────────┴──────────┘

Entrez l'ID de l'utilisateur à modifier: 105
```

**Step 2: Modify Details**
```
✏️  Mise à jour de l'utilisateur: Sarah Martinez

Nom complet: [Sarah Martinez] Sarah M.
Email: [sarah.martinez@upf.ma] s.martinez@upf.ma
Rôle: 
  1) 👨‍🎓 Étudiant
  2) 👨‍🏫 Professeur
  3) 👨‍💼 Administrateur
Answer: [1] 

Changer le mot de passe? (y/N) n

⟳ Mise à jour de l'utilisateur...
✓ Utilisateur mis à jour avec succès
✓ Utilisateur mis à jour: Sarah M.

Appuyez sur Entrée pour continuer...
```

**Features:**
- ✅ Shows current users before selection
- ✅ Pre-fills current values (shown in brackets [])
- ✅ Press Enter to keep current value
- ✅ Optional password change
- ✅ Clear success confirmation

---

## ❌ DELETE User (Interactive)

### Menu Path:
```
upf → Commandes administrateur → Gérer les utilisateurs → ❌ Supprimer un utilisateur
```

### Interactive Flow:

**Step 1: View Current Users**
```
⚠️ Sélectionnez l'utilisateur à supprimer:

┌────┬──────────────────┬─────────────────────────┬──────────┐
│ ID │ Name             │ Email                   │ Role     │
├────┼──────────────────┼─────────────────────────┼──────────┤
│ 42 │ Ahmed Benali     │ ahmed@upf.ma            │ student  │
│105 │ Sarah M.         │ s.martinez@upf.ma       │ student  │
└────┴──────────────────┴─────────────────────────┴──────────┘

Entrez l'ID de l'utilisateur à supprimer: 105
```

**Step 2: Safety Confirmation**
```
⚠️  Êtes-vous sûr de vouloir supprimer l'utilisateur 
Sarah M. (s.martinez@upf.ma)? 
Cette action est irréversible! (y/N) y

⟳ Suppression de l'utilisateur...
✓ Utilisateur supprimé avec succès
✓ Utilisateur Sarah M. a été supprimé

Appuyez sur Entrée pour continuer...
```

**Safety Features:**
- ⚠️ Shows user list before deletion
- ⚠️ Displays full user details
- ⚠️ Requires explicit confirmation (default: No)
- ⚠️ Warns about irreversible action
- ⚠️ Red warning color for visibility

---

## 👨‍🎓 Student - Interactive Request Management

### Menu Path:
```
upf → Commandes étudiant → 📝 Demandes administratives
```

### Requests Submenu:
```
📝 Gestion des Demandes Administratives
  📋 Voir mes demandes
  ➕ Créer une nouvelle demande
  ⬅️ Retour au menu étudiant
```

---

## 📝 CREATE Request (Interactive)

### Menu Path:
```
upf → Commandes étudiant → Demandes administratives → ➕ Créer une nouvelle demande
```

### Interactive Flow:
```
📝 Créer une demande administrative

Type de demande:
  1) 📄 Attestation de scolarité
  2) 📊 Relevé de notes
  3) 🎓 Attestation de réussite
  4) 📋 Certificat de présence
  5) 📝 Autre
Answer: 1

Description (optionnel): Needed for internship application by March 15

⟳ Soumission de la demande...
✓ Demande soumise avec succès
✓ Demande créée: attestation_scolarite
ℹ ID: 28
ℹ Statut: en_attente

Appuyez sur Entrée pour continuer...
```

**Features:**
- ✅ Emoji icons for easy identification
- ✅ Clear type descriptions
- ✅ Optional description field
- ✅ Instant submission confirmation
- ✅ Shows request ID and status

---

## 📋 VIEW Requests (Interactive)

### Menu Path:
```
upf → Commandes étudiant → Demandes administratives → 📋 Voir mes demandes
```

### Display:
```
┌────┬──────────────────────────┬──────────────┬────────────┐
│ ID │ Type                     │ Statut       │ Date       │
├────┼──────────────────────────┼──────────────┼────────────┤
│ 28 │ attestation_scolarite    │ en_attente   │ 28/05/2026 │
│ 25 │ releve_notes             │ validé       │ 25/05/2026 │
│ 22 │ certificat_presence      │ rejeté       │ 20/05/2026 │
└────┴──────────────────────────┴──────────────┴────────────┘

Appuyez sur Entrée pour continuer...
```

**Features:**
- ✅ Color-coded status (green=validé, red=rejeté, yellow=en_attente)
- ✅ Formatted date display
- ✅ Easy-to-read table format

---

## 🎯 Complete Workflows

### Workflow 1: Admin Onboards New Professor

```bash
# Step 1: Launch and login
upf
→ Connexion (as admin)

# Step 2: Navigate to user management
→ Commandes administrateur
→ Gérer les utilisateurs
→ ➕ Créer un nouvel utilisateur

# Step 3: Enter professor details
Nom complet: Dr. Mohammed Alami
Email: m.alami@upf.ma
Mot de passe: prof123456
Rôle: 2) 👨‍🏫 Professeur

# Step 4: Verify creation
→ 📋 Voir les professeurs
# Confirm new professor appears in list

# Step 5: Exit
→ ⬅️ Retour (multiple times)
→ Quitter
```

### Workflow 2: Student Submits Multiple Requests

```bash
# Step 1: Launch and login
upf
→ Connexion (as student)

# Step 2: First request
→ Commandes étudiant
→ 📝 Demandes administratives
→ ➕ Créer une nouvelle demande
→ Select: 📄 Attestation de scolarité
→ Description: For visa application

# Step 3: Second request
→ 📝 Demandes administratives (again)
→ ➕ Créer une nouvelle demande
→ Select: 📊 Relevé de notes
→ Description: Transcript needed

# Step 4: Check both requests
→ 📋 Voir mes demandes
# Verify both appear with "en_attente" status

# Step 5: Exit
→ ⬅️ Retour
→ Quitter
```

### Workflow 3: Admin Updates Student Email

```bash
# Step 1: Find the student
upf
→ Commandes administrateur
→ Gérer les utilisateurs
→ 📋 Voir les étudiants
# Note the ID (e.g., 42)

# Step 2: Update
→ ✏️ Modifier un utilisateur
→ Entrez l'ID: 42

# Step 3: Modify email only
Nom complet: [Current Name] (press Enter)
Email: [old@email.com] new.email@upf.ma
Rôle: [current] (press Enter)
Changer le mot de passe? N

# Step 4: Verify
→ 📋 Voir les étudiants
# Confirm email is updated

# Step 5: Exit
→ ⬅️ Retour
→ Quitter
```

---

## 💡 Pro Tips

### 1. Use Keyboard Navigation
- **Arrow Keys**: Navigate menu options
- **Enter**: Select option
- **Ctrl+C**: Cancel/Exit anytime
- **Tab**: Auto-complete (in some terminals)

### 2. Smart Suggestions
After each action, the CLI shows smart suggestions:
```
──────────────────────────────────────────────────
💡 Smart Suggestions:
──────────────────────────────────────────────────
  1. 👥 upf admin users
     Manage university users
  2. 📝 upf admin requests
     Process pending documents
──────────────────────────────────────────────────
```

### 3. Quick Navigation
- Use **⬅️ Retour** to go back one level
- Use **Quitter** to exit completely
- Press **Ctrl+C** for emergency exit

### 4. Context Awareness
The menu adapts based on your role:
- **Admin**: Sees all management options
- **Professor**: Sees teaching-related options
- **Student**: Sees academic options

### 5. Visual Cues
- **Emojis**: Quick visual identification
- **Colors**: Status indication (green/red/yellow)
- **Bold text**: Important information
- **Brackets []**: Current/default values

---

## 🎨 UI/UX Features

### Beautiful ASCII Banner
```
 _   _ _____ ____  
| | | | ____|  _ \ 
| |_| |  _| | |_) |
|  _  | |___|  __/ 
|_| |_|_____|_|    

Université Privée de Fès - Smart Management System
```

### Status Indicators
- ● **Green Online** - Connected to backend
- ● **Red Offline** - Connection lost
- ● **Yellow Syncing** - Updating data

### Color-Coded Output
- ✅ **Green**: Success, validated, active
- ❌ **Red**: Error, rejected, inactive
- ⚠️ **Yellow**: Warning, pending, caution
- ℹ️ **Cyan**: Information, help, tips

### Loading Animations
```
⟳ Création de l'utilisateur...
⟳ Mise à jour de l'utilisateur...
⟳ Suppression de l'utilisateur...
```

### Progress Feedback
```
✓ Utilisateur créé avec succès
✓ Utilisateur mis à jour avec succès
✓ Utilisateur supprimé avec succès
```

---

## 🛠️ Troubleshooting

### Menu Not Showing Options

**Problem**: Menu appears blank or frozen

**Solution**:
```bash
# Check backend connection
upf doctor

# Re-login
upf auth logout
upf auth login
```

### Can't See CRUD Options

**Problem**: Don't see create/update/delete options

**Solution**:
- Ensure you're logged in with correct role
- Admin sees user CRUD
- Students see request creation
- Navigate to correct submenu

### Validation Errors

**Problem**: "Email invalide" or "Mot de passe trop court"

**Solution**:
- Email must be format: `username@domain.tld`
- Password must be at least 6 characters
- Required fields cannot be empty

### Permission Denied

**Problem**: "Vous n'avez pas la permission"

**Solution**:
```bash
# Check your role
upf auth whoami

# Must be admin for user management
# Re-login with admin account if needed
```

---

## 📊 Comparison: Command-Line vs Interactive

| Feature | Command-Line Flags | Interactive Menu |
|---------|-------------------|------------------|
| **Ease of Use** | Remember flags | Guided prompts |
| **Discovery** | Need documentation | Self-explanatory |
| **Validation** | Error after submit | Real-time validation |
| **Visual Feedback** | Text only | Emojis + colors |
| **Safety** | Manual care | Built-in confirmations |
| **Speed** | Faster for experts | Better for learning |
| **Error Prevention** | Prone to typos | Guided input |

**Recommendation**: Use interactive menu for learning and complex operations, command-line flags for scripting and automation.

---

## 🎓 Best Practices

### For Administrators

1. **Always verify before deleting**
   - Use "Voir les utilisateurs" first
   - Double-check ID before deletion
   - Confirm the confirmation prompt

2. **Batch operations**
   - Create multiple users in sequence
   - Stay in the submenu for efficiency
   - Use filters to find specific users

3. **Regular monitoring**
   - Check "Demandes administratives" daily
   - Review new user registrations
   - Monitor system statistics via dashboard

### For Students

1. **Check existing requests**
   - Before creating new ones
   - Monitor status changes
   - Track approval/rejection

2. **Provide clear descriptions**
   - Explain why you need the document
   - Include deadlines if urgent
   - Add context for faster processing

3. **Follow up**
   - Check status regularly
   - Contact admin if stuck in "en_attente"
   - Submit new request if rejected

---

## 🚀 Future Enhancements

Planned improvements:
- [ ] Search/filter within menus
- [ ] Bulk operations (create multiple users)
- [ ] Undo/rollback functionality
- [ ] Custom keyboard shortcuts
- [ ] Voice commands
- [ ] Dark/light theme toggle
- [ ] Multi-language menu (AR/EN/FR)
- [ ] Export from menu interface

---

## 📝 Summary

The interactive CRUD menus provide:

✅ **User-Friendly Interface** - No command memorization needed
✅ **Guided Workflows** - Step-by-step prompts
✅ **Visual Clarity** - Emojis, colors, and formatting
✅ **Safety Mechanisms** - Confirmations and validations
✅ **Smart Suggestions** - Context-aware recommendations
✅ **Professional UX** - Modern, intuitive design

**Result**: A CLI that feels like a graphical application but runs in your terminal!

---

*Experience the power of interactive CRUD operations with beautiful UI/UX!* 🎨✨
