# 👤 Fonctionnalité "Qui suis-je" - Whoami

## Nouvelle Fonctionnalité

L'assistant AI comprend maintenant la question "qui suis je" et affiche votre profil utilisateur.

---

## 🎯 Comment l'utiliser

### Dans l'assistant AI

```bash
upf ai

>>> qui suis je

👤 Votre Profil:
   Rôle: ADMIN
   Description: Administrateur - Accès complet au système

   Pour voir plus de détails, utilisez: upf auth whoami
```

### Variations reconnues

L'assistant comprend plusieurs formulations:

✅ "qui suis je"  
✅ "whoami"  
✅ "mon rôle"  
✅ "my role"  
✅ "je suis quoi"  

---

## 📊 Exemples par Rôle

### Admin

```
>>> qui suis je

👤 Votre Profil:
   Rôle: ADMIN
   Description: Administrateur - Accès complet au système

   Pour voir plus de détails, utilisez: upf auth whoami
```

### Professor

```
>>> qui suis je

👤 Votre Profil:
   Rôle: PROFESSOR
   Description: Professeur - Gestion des notes et modules

   Pour voir plus de détails, utilisez: upf auth whoami
```

### Student

```
>>> qui suis je

👤 Votre Profil:
   Rôle: STUDENT
   Description: Étudiant - Consultation des notes et emplois du temps

   Pour voir plus de détails, utilisez: upf auth whoami
```

---

## 🔧 Implémentation

### Pattern Recognition

```javascript
{
  intent: 'whoami',
  patterns: [
    /qui suis/i,      // "qui suis je"
    /whoami/i,        // "whoami"
    /mon.*rôle/i,     // "mon rôle"
    /my.*role/i,      // "my role"
    /je suis/i        // "je suis quoi"
  ],
  isWhoami: true
}
```

### Response Handler

```javascript
if (intentConfig.isWhoami) {
  console.log("👤 Votre Profil:");
  console.log(`   Rôle: ${userRole.toUpperCase()}`);
  
  const descriptions = {
    admin: 'Administrateur - Accès complet au système',
    professor: 'Professeur - Gestion des notes et modules',
    student: 'Étudiant - Consultation des notes et emplois du temps'
  };
  
  console.log(`   Description: ${descriptions[userRole]}`);
}
```

---

## 💡 Pourquoi cette fonctionnalité ?

### Problème
Les utilisateurs oublient parfois quel rôle ils utilisent, surtout quand ils ont plusieurs comptes.

### Solution
Une commande simple et naturelle pour vérifier son identité.

### Avantages
✅ **Naturel** - Question en langage naturel  
✅ **Rapide** - Réponse instantanée  
✅ **Clair** - Affiche le rôle en majuscules  
✅ **Utile** - Rappel des permissions  

---

## 🔄 Commandes Similaires

| Commande AI | Commande CLI | Résultat |
|-------------|--------------|----------|
| "qui suis je" | `upf auth whoami` | Affiche profil complet |
| "whoami" | `upf auth whoami` | Affiche profil complet |
| "mon rôle" | `upf auth whoami` | Affiche profil complet |

**Note:** La commande AI est plus simple mais moins détaillée que `upf auth whoami`.

---

## 🎨 User Experience

### Avant
```
>>> qui suis je

❌ Je n'ai pas compris. Essayez:

📚 Commandes disponibles:
   "supprimer utilisateur 42"
   ...
```

### Après
```
>>> qui suis je

👤 Votre Profil:
   Rôle: ADMIN
   Description: Administrateur - Accès complet au système

   Pour voir plus de détails, utilisez: upf auth whoami
```

**Beaucoup mieux !** ✅

---

## 📝 Code Changes

### Fichier: `src/lib/simple-ai.js`

#### 1. Ajout du pattern whoami

```javascript
const INTENT_PATTERNS = [
  {
    intent: 'whoami',
    patterns: [/qui suis/i, /whoami/i, /mon.*rôle/i, /my.*role/i, /je suis/i],
    requiresConfirmation: false,
    description: 'Voir mon profil',
    isWhoami: true
  },
  // ... autres patterns
];
```

#### 2. Ajout du handler

```javascript
// Handle whoami
if (intentConfig.isWhoami) {
  console.log(chalk.green("\n👤 Votre Profil:"));
  console.log(chalk.white(`   Rôle: ${chalk.bold(userRole.toUpperCase())}`));
  
  const roleDescriptions = {
    admin: 'Administrateur - Accès complet au système',
    professor: 'Professeur - Gestion des notes et modules',
    student: 'Étudiant - Consultation des notes et emplois du temps'
  };
  
  console.log(chalk.dim(`   Description: ${roleDescriptions[userRole] || 'Utilisateur'}`));
  console.log(chalk.dim("\n   Pour voir plus de détails, utilisez: upf auth whoami\n"));
  continue;
}
```

#### 3. Ajout aux permissions

```javascript
const allowedIntents = {
  admin: [..., 'whoami'],
  professor: [..., 'whoami'],
  student: [..., 'whoami']
};
```

**Total:** ~30 lignes ajoutées

---

## 🧪 Testing

### Test 1: French Query

```bash
upf ai

>>> qui suis je

👤 Votre Profil:
   Rôle: ADMIN
   Description: Administrateur - Accès complet au système
```

✅ Works!

### Test 2: English Query

```bash
>>> whoami

👤 Votre Profil:
   Rôle: PROFESSOR
   Description: Professeur - Gestion des notes et modules
```

✅ Works!

### Test 3: Variation

```bash
>>> mon rôle

👤 Votre Profil:
   Rôle: STUDENT
   Description: Étudiant - Consultation des notes et emplois du temps
```

✅ Works!

---

## 🎓 Best Practices

### Pour les Utilisateurs

✅ Utilisez "qui suis je" pour un rappel rapide  
✅ Tapez "upf auth whoami" pour plus de détails  
✅ Le rôle est affiché en MAJUSCULES pour clarté  

### Pour les Développeurs

✅ Ajoutez des patterns pour variations linguistiques  
✅ Gardez la réponse concise dans l'AI  
✅ Redirigez vers commande complète pour détails  

---

## 🔮 Future Enhancements

Améliorations possibles:

1. **Afficher le nom complet**
   ```
   👤 Votre Profil:
      Nom: Fatima Idrissi
      Rôle: PROFESSOR
      Email: fatima@upf.ac.ma
   ```

2. **Statistiques personnelles**
   ```
   👤 Votre Profil:
      Rôle: STUDENT
      Modules inscrits: 5
      Moyenne générale: 15.2/20
   ```

3. **Dernière connexion**
   ```
   👤 Votre Profil:
      Rôle: ADMIN
      Dernière connexion: Il y a 2 heures
   ```

Mais pour l'instant, gardons-le **simple et rapide** ! ⚡

---

## 📚 Related Commands

| Command | Purpose | Detail Level |
|---------|---------|--------------|
| `upf ai` → "qui suis je" | Quick role check | Basic |
| `upf auth whoami` | Full profile view | Detailed |
| `upf auth login` | See current session | Session info |

---

## ✅ Summary

La fonctionnalité "qui suis je" offre:

✅ **Reconnaissance naturelle** - Comprend plusieurs formulations  
✅ **Réponse instantanée** - Pas d'appel API  
✅ **Clarté visuelle** - Rôle en majuscules  
✅ **Guidance** - Mentionne commande détaillée  
✅ **Multi-langue** - Français et anglais  

**Maintenant l'assistant comprend vraiment les questions basiques !** 🎉

---

**Version:** v0.7.1 (Whoami Update)  
**Date:** 2026-05-28  
**Status:** ✅ Production Ready
