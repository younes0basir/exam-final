# 🤖 UPF CLI - Assistant IA Guide

## Overview

L'UPF CLI intègre désormais un **assistant IA intelligent** qui comprend le langage naturel ! Plus besoin de mémoriser des commandes complexes - parlez simplement à votre CLI comme vous parleriez à un humain.

---

## 🚀 Démarrage Rapide

### Lancer l'Assistant IA

**Via la ligne de commande:**
```bash
upf ai
```

**Via le menu interactif:**
```bash
upf
→ 🤖 Assistant IA
```

---

## 💬 Exemples de Requêtes Naturelles

### 👨‍💼 Pour les Administrateurs

#### Gestion des Utilisateurs

**Créer un utilisateur:**
```
🗣️  Vous: Créer un nouvel utilisateur étudiant
🤖 Assistant: J'ai compris : Vous voulez créer un nouvel utilisateur
⚡ Commande générée: upf admin users --create
✅ Exécution...
```

**Supprimer un utilisateur:**
```
🗣️  Vous: Supprimer l'utilisateur 42
🤖 Assistant: J'ai compris : Vous voulez supprimer un utilisateur
   Paramètres détectés: userId: 42
⚠️  Confirmation requise:
   Action: deleteUser
   Détails: ID 42
   Voulez-vous continuer? (oui/non)
```

**Modifier un utilisateur:**
```
🗣️  Vous: Modifier l'utilisateur avec ID 58
🤖 Assistant: J'ai compris : Vous voulez modifier un utilisateur
   Paramètres détectés: userId: 58
⚡ Commande générée: upf admin users --update 58
```

**Lister les utilisateurs:**
```
🗣️  Vous: Voir tous les professeurs
🤖 Assistant: J'ai compris : Vous voulez voir la liste des utilisateurs
   Paramètres détectés: role: professor
⚡ Commande générée: upf admin users --role professor
```

**Requêtes variées:**
```
"Créer un utilisateur administrateur"
"Ajouter un nouvel étudiant"
"Effacer l'utilisateur 105"
"Mettre à jour l'utilisateur 42"
"Lister tous les étudiants"
"Afficher les professeurs"
"Voir les utilisateurs avec le rôle admin"
```

---

### 👨‍🏫 Pour les Professeurs

#### Gestion des Notes

**Voir les notes:**
```
🗣️  Vous: Voir mes notes
🤖 Assistant: J'ai compris : Vous voulez consulter les notes
⚡ Commande générée: upf professor grades
```

**Modifier les notes:**
```
🗣️  Vous: Entrer les notes du module 5
🤖 Assistant: J'ai compris : Vous voulez modifier les notes
   Paramètres détectés: moduleId: 5
⚡ Commande générée: upf professor grades --module-id 5
```

**Autres commandes:**
```
"Consulter les notes"
"Saisir les notes"
"Voir mon tableau de bord"
"Afficher l'emploi du temps"
"Valider les absences"
"Voir mes modules"
```

---

### 👨‍🎓 Pour les Étudiants

#### Demandes Administratives

**Créer une demande:**
```
🗣️  Vous: Créer une demande d'attestation
🤖 Assistant: J'ai compris : Vous voulez créer une demande
⚡ Commande générée: upf student requests --create
```

**Voir les demandes:**
```
🗣️  Vous: Voir mes demandes
🤖 Assistant: J'ai compris : Vous voulez voir vos demandes
⚡ Commande générée: upf student requests
```

**Notes et emploi du temps:**
```
"Voir mes notes"
"Consulter mon emploi du temps"
"Vérifier mes absences"
"Voir le tableau de bord"
"Soumettre une nouvelle demande"
"Statut de ma demande"
```

---

## 🧠 Capacités de l'IA

### 1. **Reconnaissance d'Intentions**

L'IA comprend différentes façons d'exprimer la même intention:

| Intention | Exemples de Requêtes |
|-----------|---------------------|
| **Créer utilisateur** | "Créer un utilisateur", "Ajouter un étudiant", "Nouvel admin" |
| **Supprimer utilisateur** | "Supprimer l'utilisateur", "Effacer ID 42", "Remove user" |
| **Voir notes** | "Voir mes notes", "Consulter grades", "Check my grades" |
| **Tableau de bord** | "Dashboard", "Statistiques", "Stats", "Overview" |
| **Emploi du temps** | "Planning", "Schedule", "Timetable", "Calendar" |

### 2. **Extraction d'Entités**

L'IA extrait automatiquement les informations importantes:

```
"Supprimer l'utilisateur 42"
→ Intent: deleteUser
→ Entity: userId = 42

"Voir les notes du module 5"
→ Intent: viewGrades  
→ Entity: moduleId = 5

"Créer un utilisateur admin"
→ Intent: createUser
→ Entity: role = admin
```

**Entités reconnues:**
- `userId` - ID de l'utilisateur (ex: 42)
- `userEmail` - Email (ex: ahmed@upf.ma)
- `userName` - Nom complet
- `role` - Rôle (student/professor/admin)
- `moduleId` - ID du module
- `date` - Date (format YYYY-MM-DD ou DD/MM/YYYY)
- `status` - Statut (pending/validated/rejected)

### 3. **Vérification des Permissions**

L'IA vérifie automatiquement si vous avez le droit d'exécuter une action:

```
🗣️  Vous (étudiant): Supprimer l'utilisateur 42
❌ Vous n'avez pas la permission d'exécuter cette action (rôle: student)

💡 Essayez plutôt:
   • "Voir mes notes"
   • "Créer une demande d'attestation"
   • "Voir mon emploi du temps"
```

### 4. **Suggestions Contextuelles**

Si l'IA ne comprend pas, elle propose des alternatives:

```
🗣️  Vous: Blabla incompréhensible
❌ Désolé, je n'ai pas compris. Pouvez-vous reformuler?

   Exemples:
   - "Créer un utilisateur"
   - "Voir mes notes"
   - "Supprimer l'utilisateur 42"
```

---

## 🎯 Mode Interactif vs Commande Directe

### Mode Interactif (Recommandé)

```bash
upf ai

╔════════════════════════════════════════╗
║   🤖 Assistant IA UPF CLI             ║
║   Parlez naturellement!                ║
╚════════════════════════════════════════╝

Tapez 'quit' ou 'exit' pour quitter

🗣️  Vous: Voir mes notes
🤖 Analyse de votre demande...

🤖 J'ai compris : Vous voulez consulter les notes
⚡ Commande générée: upf student grades
   Exécution dans 2 secondes... (Ctrl+C pour annuler)

✅ Exécution de la commande...
[Notes affichées]

🗣️  Vous: Créer une demande
🤖 Analyse...
[Suite de la conversation]

🗣️  Vous: quit
👋 Au revoir!
```

### Commande Directe (Future Enhancement)

```bash
# Future feature - one-shot AI command
upf ai "créer un utilisateur étudiant"
upf ai "supprimer l'utilisateur 42"
upf ai "voir mes notes"
```

---

## 💡 Astuces Pro

### 1. **Soyez Naturel**

L'IA comprend le langage courant:
```
✅ "Je veux créer un nouvel étudiant"
✅ "Peux-tu me montrer les notes?"
✅ "Supprime stp l'utilisateur 42"
✅ "J'aimerais voir mon planning"
```

### 2. **Incluez des Détails**

Plus vous donnez d'informations, mieux c'est:
```
✅ "Supprimer l'utilisateur 42" (mieux que juste "supprimer")
✅ "Voir les notes du module 5" (spécifique)
✅ "Créer un utilisateur professeur" (rôle précisé)
```

### 3. **Utilisez le Français ou l'Anglais**

L'IA est bilingue:
```
✅ "Créer un utilisateur" (français)
✅ "Create a user" (anglais)
✅ "Voir mes notes" (français)
✅ "View my grades" (anglais)
```

### 4. **Annulation Rapide**

Appuyez sur `Ctrl+C` à tout moment pour annuler l'exécution.

---

## 🔍 Comment Ça Marche

### Architecture de l'IA

```
Entrée Utilisateur
       ↓
[Analyse de Langage Naturel]
       ↓
[Reconnaissance d'Intention]
       ↓
[Extraction d'Entités]
       ↓
[Vérification des Permissions]
       ↓
[Génération de Commande CLI]
       ↓
[Exécution Automatique]
```

### Patterns de Reconnaissance

L'IA utilise des expressions régulières pour identifier:

1. **Intentions** (ce que vous voulez faire)
   - 50+ patterns par intention
   - Support multilingue (FR/EN)
   - Variantes syntaxiques

2. **Entités** (les détails)
   - IDs numériques
   - Emails
   - Noms
   - Dates
   - Statuts

3. **Contexte** (votre rôle)
   - Admin: Toutes les permissions
   - Professor: Gestion pédagogique
   - Student: Consultation et demandes

---

## 📊 Comparaison: Avant vs Après IA

### Sans IA (Commandes Traditionnelles)

```bash
# Mémorisation requise
upf admin users --create
upf admin users --delete 42
upf admin users --update 58
upf admin users --role student
upf professor grades --module-id 5
upf student requests --create

# Courbe d'apprentissage raide
# Facile à faire des erreurs de syntaxe
# Peu intuitif pour les débutants
```

### Avec IA (Langage Naturel)

```bash
upf ai

🗣️  "Créer un utilisateur"
🗣️  "Supprimer l'utilisateur 42"
🗣️  "Modifier l'utilisateur 58"
🗣️  "Voir les étudiants"
🗣️  "Notes du module 5"
🗣️  "Créer une demande"

# Aucun memorization required
# Syntaxe naturelle
# Très intuitif
# Accessible à tous
```

---

## 🛠️ Personnalisation (Pour Développeurs)

### Ajouter de Nouvelles Intentions

Dans `src/lib/ai-assistant.js`:

```javascript
const intentPatterns = {
  // Votre nouvelle intention
  myNewIntent: [
    /pattern1/i,
    /pattern2/i,
    /mot-clé.*action/i
  ]
};
```

### Ajouter de Nouvelles Entités

```javascript
const entityPatterns = {
  newEntity: /pattern\s*(\w+)/i
};
```

### Modifier les Réponses

```javascript
const responses = {
  understood: (intent, entities) => {
    // Personnalisez le message
    return `Message personnalisé`;
  }
};
```

---

## 🎓 Cas d'Usage Concrets

### Cas 1: Admin Onboarding Rapide

```bash
upf ai

🗣️  "Créer un étudiant Ahmed Benali"
→ Formulaire de création s'ouvre
→ Remplissez les détails
→ Utilisateur créé ✓

🗣️  "Créer un professeur Fatima Idrissi"
→ Formulaire de création s'ouvre
→ Remplissez les détails
→ Professeur créé ✓

🗣️  "Voir tous les nouveaux utilisateurs"
→ Liste affichée
```

### Cas 2: Professeur - Saisie de Notes

```bash
upf ai

🗣️  "Entrer les notes du module 5"
→ Interface de saisie interactive
→ Sélectionnez les étudiants
→ Entrez les notes
→ Sauvegardez

🗣️  "Voir les statistiques du module 5"
→ Graphiques et stats affichés
```

### Cas 3: Étudiant - Demandes Multiples

```bash
upf ai

🗣️  "Créer une attestation de scolarité"
→ Formulaire de demande
→ Soumis ✓

🗣️  "Créer une demande de relevé de notes"
→ Formulaire de demande
→ Soumis ✓

🗣️  "Voir le statut de mes demandes"
→ Liste avec statuts affichée
```

---

## 🚀 Fonctionnalités Futures

### Phase 1 (Implémentée)
- ✅ Reconnaissance d'intentions basique
- ✅ Extraction d'entités
- ✅ Vérification des permissions
- ✅ Mode interactif
- ✅ Suggestions contextuelles

### Phase 2 (Planifiée)
- [ ] Commandes one-shot (`upf ai "texte"`)
- [ ] Historique des conversations
- [ ] Apprentissage des préférences
- [ ] Correction automatique
- [ ] Support multi-langues avancé (AR)

### Phase 3 (Avancée)
- [ ] Intégration API IA (OpenAI/GPT)
- [ ] Compréhension contextuelle profonde
- [ ] Requêtes complexes combinées
- [ ] Génération de rapports naturels
- [ ] Voice commands

---

## 📝 Résumé des Commandes IA

### Lancement
```bash
upf ai                    # Mode interactif
# OU
upf → 🤖 Assistant IA     # Via menu
```

### Exemples par Rôle

**Admin:**
- "Créer un utilisateur [rôle]"
- "Supprimer l'utilisateur [ID]"
- "Modifier l'utilisateur [ID]"
- "Voir les [étudiants/professeurs/admins]"
- "Dashboard"

**Professor:**
- "Voir mes notes"
- "Entrer les notes du module [ID]"
- "Voir mon emploi du temps"
- "Valider les absences"

**Student:**
- "Voir mes notes"
- "Créer une demande"
- "Voir mes demandes"
- "Mon emploi du temps"
- "Mes absences"

---

## ❓ FAQ

**Q: L'IA comprend-elle toutes les langues?**
R: Actuellement français et anglais. Arabe prévu en Phase 2.

**Q: Que se passe-t-il si l'IA ne comprend pas?**
R: Elle propose des suggestions et exemples alternatifs.

**Q: Puis-je annuler une action?**
R: Oui, appuyez sur Ctrl+C avant l'exécution (délai de 2 secondes).

**Q: L'IA fonctionne-t-elle hors ligne?**
R: Oui, toute l'intelligence est locale, aucune connexion Internet requise.

**Q: Comment améliorer la reconnaissance?**
R: Soyez précis, incluez des détails (IDs, rôles), utilisez un langage clair.

---

## 🎉 Conclusion

L'assistant IA transforme votre expérience CLI:

✅ **Naturel** - Parlez comme à un humain
✅ **Intelligent** - Comprend le contexte et les permissions
✅ **Rapide** - Génération automatique de commandes
✅ **Accessible** - Pas de mémorisation nécessaire
✅ **Sûr** - Confirmations avant actions destructives
✅ **Bilingue** - Français et Anglais

**Le futur de la gestion universitaire est conversationnel!** 🤖✨

---

*Experiencez la puissance de l'IA dans votre terminal!*
