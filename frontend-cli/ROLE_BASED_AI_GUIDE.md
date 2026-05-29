# 🤖 Role-Based AI Assistant Integration Guide

## Overview

The UPF CLI now features an **intelligent AI assistant** that is fully integrated into the main menu and adapts to your user role (Admin, Professor, or Student).

---

## 🎯 Key Features

### 1. **Role-Aware Interface**

The AI assistant automatically detects your role and shows relevant capabilities:

**Admin:**
```
👨‍💼 Mode Administrateur

Je peux vous aider avec:
   • Gestion des utilisateurs (créer, modifier, supprimer)
   • Voir tous les utilisateurs et leurs rôles
   • Tableau de bord et statistiques
   • Emploi du temps global
```

**Professor:**
```
👨‍🏫 Mode Professeur

Je peux vous aider avec:
   • Consulter et saisir les notes
   • Voir vos modules enseignés
   • Emploi du temps personnel
   • Tableau de bord professeur
```

**Student:**
```
👨‍🎓 Mode Étudiant

Je peux vous aider avec:
   • Consulter vos notes
   • Voir votre emploi du temps
   • Créer des demandes administratives
   • Tableau de bord étudiant
```

---

### 2. **Permission Enforcement**

The AI enforces role-based permissions automatically:

```javascript
const allowedIntents = {
  admin: ['deleteUser', 'createUser', 'updateUser', 'listUsers', ...],
  professor: ['viewGrades', 'dashboard', 'timetable', ...],
  student: ['viewGrades', 'dashboard', 'timetable', ...]
};

if (!allowedIntents[userRole]?.includes(intentConfig.intent)) {
  console.log("⛔ Action non autorisée pour votre rôle");
}
```

**Example:**
```
>>> [Student tries] supprimer utilisateur 42

⛔ Action non autorisée pour le rôle: student
   Cette fonctionnalité est réservée aux administrateurs.
```

---

### 3. **Smart Examples**

Shows role-specific examples to guide users:

**Admin Examples:**
- "supprimer utilisateur 42"
- "créer un étudiant"
- "voir tous les professeurs"
- "tableau de bord"

**Professor Examples:**
- "voir mes notes"
- "saisir notes module 5"
- "emploi du temps"
- "dashboard"

**Student Examples:**
- "voir mes notes"
- "mon emploi du temps"
- "créer une demande"
- "dashboard"

---

## 🚀 How to Access

### Method 1: Main Menu

```bash
upf

→ 🤖 Assistant IA
```

### Method 2: Direct Command

```bash
upf ai
```

Both methods launch the same role-aware AI assistant.

---

## 💬 Usage Examples by Role

### Admin User

```bash
upf ai

╔════════════════════════════════════════╗
║   🤖 Assistant UPF CLI - Mode Simple  ║
║   Rapide, Fiable & Adapté à votre rôle║
╚════════════════════════════════════════╝

👋 Bonjour! Je suis votre assistant UPF CLI.
👨‍💼 Mode Administrateur

Je peux vous aider avec:
   • Gestion des utilisateurs (créer, modifier, supprimer)
   • Voir tous les utilisateurs et leurs rôles
   • Tableau de bord et statistiques
   • Emploi du temps global

Exemples:
   "supprimer utilisateur 42"
   "créer un étudiant"
   "voir tous les professeurs"
   "tableau de bord"

🗣️ Vous: créer un étudiant

✅ Compris: Créer un utilisateur

⚡ Commande: upf admin users --create
   Exécution...

[Interactive form opens for user creation]
```

---

### Professor User

```bash
upf ai

👨‍🏫 Mode Professeur

Je peux vous aider avec:
   • Consulter et saisir les notes
   • Voir vos modules enseignés
   • Emploi du temps personnel
   • Tableau de bord professeur

🗣️ Vous: voir mes notes

✅ Compris: Voir les notes

⚡ Commande: upf professor grades
   Exécution...

[Displays grades for professor's modules]
```

---

### Student User

```bash
upf ai

👨‍🎓 Mode Étudiant

Je peux vous aider avec:
   • Consulter vos notes
   • Voir votre emploi du temps
   • Créer des demandes administratives
   • Tableau de bord étudiant

🗣️ Vous: mon emploi du temps

✅ Compris: Emploi du temps

⚡ Commande: upf student timetable
   Exécution...

[Displays student's weekly schedule]
```

---

## 🔒 Permission System

### Admin Permissions

| Action | Allowed | Example |
|--------|---------|---------|
| Delete users | ✅ Yes | "supprimer utilisateur 42" |
| Create users | ✅ Yes | "créer un professeur" |
| Update users | ✅ Yes | "modifier utilisateur 5" |
| List users | ✅ Yes | "voir tous les étudiants" |
| View grades | ❌ No | - |
| Dashboard | ✅ Yes | "tableau de bord" |

### Professor Permissions

| Action | Allowed | Example |
|--------|---------|---------|
| Delete users | ❌ No | Blocked |
| Create users | ❌ No | Blocked |
| View grades | ✅ Yes | "voir mes notes" |
| Update grades | ✅ Yes | "saisir notes" |
| Dashboard | ✅ Yes | "dashboard" |
| Timetable | ✅ Yes | "emploi du temps" |

### Student Permissions

| Action | Allowed | Example |
|--------|---------|---------|
| Delete users | ❌ No | Blocked |
| Create users | ❌ No | Blocked |
| View grades | ✅ Yes | "voir mes notes" |
| Dashboard | ✅ Yes | "dashboard" |
| Timetable | ✅ Yes | "mon emploi du temps" |
| Create requests | ⚠️ Via command | Use `upf student requests --create` |

---

## 🎨 User Experience Flow

### 1. Launch Assistant

```bash
upf
→ 🤖 Assistant IA
```

### 2. See Role-Specific Welcome

```
👋 Bonjour! Je suis votre assistant UPF CLI.
👨‍💼 Mode Administrateur

Je peux vous aider avec:
   • [Admin-specific capabilities]

Exemples:
   "[Admin-specific examples]"
```

### 3. Type Natural Request

```
🗣️ Vous: supprimer utilisateur 42
```

### 4. AI Understands & Confirms

```
✅ Compris: Supprimer un utilisateur
   Paramètres: userId: 42

⚠️ ATTENTION: Cette action est irréversible!
   Commande: upf admin users --delete 42
   Continuer? (y/N) y
```

### 5. Execute & Complete

```
⚡ Commande: upf admin users --delete 42
   Exécution...

[Command executes]

✅ Terminé!

🗣️ Vous: [Ready for next command]
```

---

## 🔧 Technical Implementation

### File Structure

```
src/
├── cli.js                    # Main CLI with AI menu option
├── lib/
│   ├── simple-ai.js         # Role-aware AI assistant
│   └── ...
```

### Key Components

#### 1. Role Detection

```javascript
export async function simpleAIAssistant(userRole) {
  // userRole passed from main CLI
  showGreeting(userRole);  // Shows role-specific welcome
  
  while (true) {
    // Process commands with role awareness
  }
}
```

#### 2. Permission Checking

```javascript
const allowedIntents = {
  admin: ['deleteUser', 'createUser', ...],
  professor: ['viewGrades', ...],
  student: ['viewGrades', ...]
};

if (!allowedIntents[userRole]?.includes(intent)) {
  console.log("⛔ Action non autorisée");
  continue;
}
```

#### 3. Role-Specific Help

```javascript
function showGreeting(userRole) {
  const capabilities = {
    admin: ["Gestion utilisateurs", ...],
    professor: ["Consulter notes", ...],
    student: ["Voir notes", ...]
  };
  
  capabilities[userRole].forEach(cap => console.log(cap));
}
```

---

## 📊 Comparison: Before vs After

| Feature | Before | After |
|---------|--------|-------|
| **Role Awareness** | ❌ Generic | ✅ Role-specific |
| **Permissions** | ⚠️ Manual check | ✅ Automatic |
| **Examples** | ❌ Same for all | ✅ Role-specific |
| **Capabilities** | ❌ All shown | ✅ Filtered by role |
| **Security** | ⚠️ Client-side only | ✅ Role-enforced |
| **UX** | ❌ Confusing | ✅ Clear guidance |

---

## 🎯 Best Practices

### For Users

✅ **Be specific**: Include keywords like "utilisateur", "notes", etc.  
✅ **Use numbers**: "42" is better than "quarante-deux"  
✅ **Follow examples**: Use the format shown in help  
✅ **Check permissions**: Some actions require admin role  

### For Developers

✅ **Update allowedIntents**: When adding new features  
✅ **Add role examples**: Keep examples current  
✅ **Test all roles**: Verify permissions work correctly  
✅ **Keep it simple**: Don't overcomplicate patterns  

---

## 🚨 Common Issues

### Issue: "Action non autorisée"

**Cause:** Trying to perform action outside your role  
**Solution:** Use appropriate role or ask admin

```
>>> [Student] supprimer utilisateur 42

⛔ Action non autorisée pour le rôle: student
   Cette fonctionnalité est réservée aux administrateurs.
```

### Issue: "Je n'ai pas compris"

**Cause:** Input doesn't match any patterns  
**Solution:** Use suggested examples or type 'aide'

```
>>> [Unclear input]

❌ Je n'ai pas compris. Essayez:

📚 Commandes disponibles:
   "[Role-specific examples]"
```

### Issue: Missing User ID

**Cause:** Forgot to include ID in delete/update command  
**Solution:** AI will ask for it

```
>>> supprimer utilisateur

❓ Quel est l'ID de l'utilisateur?
   (Tapez simplement le numéro, ex: 42)

ID: 42
```

---

## 🔮 Future Enhancements

Potential improvements:

1. **Voice Commands**
   - Speech-to-text integration
   - Hands-free operation

2. **Smart Suggestions**
   - Based on usage patterns
   - Predictive commands

3. **Multi-language**
   - Arabic support
   - English full support

4. **Command History**
   - Remember recent commands
   - Quick re-execution

5. **Batch Operations**
   - "Delete users 42, 43, 44"
   - Process multiple items

---

## 📝 Summary

The role-based AI assistant provides:

✅ **Personalized Experience** - Adapts to your role  
✅ **Security** - Enforces permissions automatically  
✅ **Guidance** - Shows relevant examples  
✅ **Simplicity** - Natural language interface  
✅ **Reliability** - Fast, offline, no crashes  

**Integrated seamlessly into the main `upf` CLI!** 🎉

---

**Version:** v0.7.0 (Role-Aware Edition)  
**Date:** 2026-05-28  
**Status:** ✅ Production Ready & Tested
