# 🗣️ Multi-Turn Conversation Guide - UPF CLI AI Assistant

## Overview

The UPF CLI AI Assistant now supports **multi-turn conversations**! This means you can have natural back-and-forth interactions, just like talking to a human. The assistant remembers context and understands follow-up responses.

---

## 🎯 What is Multi-Turn Conversation?

Instead of requiring complete commands in one sentence, the AI can now:

1. **Ask clarifying questions** when information is missing
2. **Understand short answers** (like just typing "42" instead of "User ID 42")
3. **Request confirmation** before destructive actions
4. **Maintain context** across multiple exchanges

---

## 💬 Examples

### Example 1: Deleting a User (Two-Step Process)

**Old Way (Single Command):**
```
🗣️ You: "Supprimer l'utilisateur 42"
✅ Done immediately
```

**New Way (Interactive):**
```
🗣️ You: "Supprimer un utilisateur"

🤖 J'ai compris : Vous voulez supprimer un utilisateur
❓ J'ai besoin de plus d'informations:
   ID de l'utilisateur à modifier/supprimer
   💡 Tapez simplement le numéro (ex: 42)

🗣️ You: 4

📝 Réponse contextuelle détectée...
✅ ID utilisateur détecté: 4

⚠️ ATTENTION: Cette action est irréversible!
   Voulez-vous vraiment continuer? (oui/non)

🗣️ You: oui

✅ Confirmation acceptée
⚡ Commande générée: upf admin users --delete 4
   Exécution dans 2 secondes... (Ctrl+C pour annuler)

✅ Exécution de la commande...
```

---

### Example 2: Creating a User

```
🗣️ You: "Créer un utilisateur"

🤖 J'ai compris : Vous voulez créer un nouvel utilisateur
⚡ Commande générée: upf admin users --create
   Exécution dans 2 secondes... (Ctrl+C pour annuler)

✅ Interactive form opens:
   Nom complet: John Doe
   Email: john@example.com
   Mot de passe: ********
   Rôle: [Student/Professor/Admin]
```

---

### Example 3: Canceling an Action

```
🗣️ You: "Supprimer l'utilisateur 5"

🤖 J'ai compris : Vous voulez supprimer un utilisateur

⚠️ ATTENTION: Cette action est irréversible!
   Voulez-vous vraiment continuer? (oui/non)

🗣️ You: non

❌ Action annulée
💡 Essayez plutôt:
   • "Voir tous les utilisateurs"
   • "Modifier l'utilisateur 5"
```

---

## 🧠 How It Works

### Context Tracking System

The AI maintains a conversation context object:

```javascript
conversationContext = {
  lastIntent: 'deleteUser',      // What we're trying to do
  waitingFor: 'userId',          // What information we need
  pendingCommand: 'upf admin users --delete'  // Base command
}
```

### Follow-Up Detection

When you type something after being asked for information:

1. **Check if waiting for input**: `if (conversationContext.waitingFor)`
2. **Extract relevant data**: Parse numbers, confirmations, etc.
3. **Build complete command**: Combine base command + extracted data
4. **Clear context**: Reset for next conversation

### Smart Pattern Matching

The system recognizes different types of follow-ups:

| Waiting For | Accepts | Example |
|-------------|---------|---------|
| `userId` | Any number | "4", "42", "user 42" |
| `confirmation` | Yes/No words | "oui", "yes", "non", "no" |
| `role` | Role names | "student", "professor" |

---

## ✨ Features

### 1. **Flexible Number Input**

When asked for an ID, you can type:
- Just the number: `42`
- With label: `user 42`, `ID 42`
- In a sentence: `l'utilisateur numéro 42`

All will be recognized!

### 2. **Natural Confirmations**

For yes/no questions, accepts:

**Yes:**
- "oui"
- "yes"
- "y"
- "o"
- "confirm"
- "valider"

**No:**
- "non"
- "no"
- "n"
- "cancel"
- "annuler"
- "stop"

### 3. **Context Timeout**

If you provide an unrecognized response, the system:
1. Shows warning: "⚠️ Réponse non reconnue"
2. Resets context
3. Tries normal pattern matching on your input

This prevents getting stuck in broken conversations.

### 4. **Visual Hints**

When waiting for input, helpful hints appear:
```
💡 Tapez simplement le numéro (ex: 42)
```

---

## 🔧 Technical Implementation

### File: `src/lib/ai-assistant.js`

#### 1. Context State
```javascript
let conversationContext = {
  lastIntent: null,
  waitingFor: null,
  pendingCommand: null
};
```

#### 2. Follow-Up Handler
```javascript
function handleFollowUpResponse(input, userRole) {
  // Check what we're waiting for
  if (context.waitingFor === 'userId') {
    // Extract number from input
    const userId = input.match(/(\d+)/)[1];
    // Build complete command
    return { success: true, generatedCommand: `${baseCommand} ${userId}` };
  }
  
  if (context.waitingFor === 'confirmation') {
    // Check for yes/no keywords
    if (input.includes('oui')) {
      return { success: true, generatedCommand: pendingCommand };
    }
  }
}
```

#### 3. Intent Analysis Update
```javascript
export async function analyzeIntent(input, userRole) {
  // FIRST: Check if this is a follow-up
  if (conversationContext.waitingFor) {
    return handleFollowUpResponse(input, userRole);
  }
  
  // THEN: Try normal AI/pattern analysis
  const aiResult = await callNvidiaAI(input, { userRole });
  // ...
}
```

#### 4. Setting Context
```javascript
// When asking for missing info
if (missingInfo.some(info => info.includes('ID'))) {
  conversationContext = {
    lastIntent: analysis.intent,
    waitingFor: 'userId',
    pendingCommand: baseCommand
  };
}

// When asking for confirmation
if (analysis.intent === 'deleteUser') {
  conversationContext = {
    lastIntent: analysis.intent,
    waitingFor: 'confirmation',
    pendingCommand: command
  };
}
```

---

## 🎓 Best Practices

### ✅ Do's

1. **Be concise with follow-ups**
   ```
   🤖 ID de l'utilisateur?
   🗣️ You: 42  ✓ (Perfect!)
   ```

2. **Use natural confirmations**
   ```
   🤖 Continuer? (oui/non)
   🗣️ You: oui  ✓
   🗣️ You: yes  ✓
   🗣️ You: y    ✓
   ```

3. **Start fresh if confused**
   - Type a new complete command
   - Context will reset automatically

### ❌ Don'ts

1. **Don't mix contexts**
   ```
   🤖 ID de l'utilisateur?
   🗣️ You: Créer un professeur  ✗ (Confusing!)
   ```

2. **Don't expect long-term memory**
   - Context only lasts for immediate follow-up
   - Each new topic starts fresh

---

## 🚀 Use Cases

### Admin Workflow
```
🗣️ "Supprimer utilisateur"
🤖 ID?
🗣️ "15"
🤖 Confirmer?
🗣️ "oui"
✅ Deleted!

🗣️ "Créer professeur"
🤖 [Opens interactive form]
```

### Professor Workflow
```
🗣️ "Modifier notes module 5"
🤖 [Opens grade entry interface]
```

### Student Workflow
```
🗣️ "Créer demande attestation"
🤖 Type?
🗣️ "Scolarité"
🤖 Description?
🗣️ "Pour stage"
✅ Request created!
```

---

## 🔍 Debugging

### View Current Context

Add this debug line temporarily:
```javascript
console.log('Current context:', conversationContext);
```

### Reset Context Manually

If stuck, type any complete command:
```
🗣️ "Voir tableau de bord"
```
This will reset context and start fresh.

### Common Issues

**Issue:** Context not clearing
**Solution:** Type 'exit' or complete a full command

**Issue:** Wrong number extracted
**Solution:** Be more specific: "utilisateur 42" instead of just "42"

**Issue:** Confirmation not recognized
**Solution:** Use clear words: "oui" or "non" instead of maybe "ok"

---

## 📊 Comparison: Before vs After

| Feature | Before | After |
|---------|--------|-------|
| **Input Format** | Full command required | Natural conversation |
| **Missing Info** | Error message | Asks follow-up question |
| **ID Input** | Must be in first message | Can provide separately |
| **Confirmation** | Automatic execution | Explicit confirmation for deletes |
| **Flexibility** | Rigid patterns | Understands variations |
| **User Experience** | Command-line style | Chat-style interaction |

---

## 🎯 Future Enhancements

Potential improvements:

1. **Multi-step forms**
   - Collect all user info step-by-step
   - Validate each field as entered

2. **Undo functionality**
   - "Oops, cancel that"
   - Rollback last action

3. **Conversation history**
   - Remember previous topics
   - Reference earlier commands

4. **Smart suggestions**
   - Based on conversation flow
   - Predict next likely action

5. **Voice input support**
   - Speech-to-text integration
   - Hands-free operation

---

## 📝 Summary

The multi-turn conversation feature makes the UPF CLI AI Assistant:

✅ **More Natural** - Talk like you would to a person
✅ **More Forgiving** - Handles incomplete information gracefully
✅ **Safer** - Confirms destructive actions
✅ **Faster** - Short answers accepted
✅ **Smarter** - Maintains context intelligently

**Try it now:**
```bash
upf ai

🗣️ "Supprimer utilisateur"
🤖 ID?
🗣️ 4
🤖 Confirmer?
🗣️ oui
✅ Done!
```

Enjoy your conversational AI assistant! 🎉
