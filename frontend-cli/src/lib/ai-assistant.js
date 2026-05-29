import chalk from "chalk";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// NVIDIA API Configuration using OpenAI SDK
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || "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";
const USE_NVIDIA_AI = process.env.USE_NVIDIA_AI !== 'false';
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning";

// Initialize OpenAI client for NVIDIA
const openai = new OpenAI({
  apiKey: NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

// Fallback patterns for offline mode

/**
 * Call NVIDIA AI using OpenAI SDK for intelligent understanding
 */
async function callNvidiaAI(userMessage, context = {}) {
  // Check if NVIDIA AI is enabled
  if (!USE_NVIDIA_AI) {
    console.log(chalk.dim("   ⚙️  IA NVIDIA désactivée (USE_NVIDIA_AI=false)"));
    return null;
  }
  
  try {
    const systemPrompt = `Vous êtes un assistant IA pour UPF CLI (Université Privée de Fès). 
Votre rôle est de comprendre les demandes en langage naturel et de les convertir en commandes CLI.

Rôle utilisateur: ${context.userRole || 'unknown'}

Commandes disponibles selon le rôle:
${getCommandsForRole(context.userRole)}

IMPORTANT: Répondez UNIQUEMENT avec un objet JSON valide, sans texte supplémentaire.
Format exact requis:
{
  "intent": "nom_de_l'intention",
  "entities": {},
  "command": "upf commande",
  "confidence": 0.95,
  "needs_confirmation": false,
  "message": "Message en français"
}

Intentions possibles: createUser, deleteUser, updateUser, listUsers, viewGrades, updateGrades, createRequest, viewRequests, dashboard, timetable, absences, greeting, help

Exemples:
- "Supprimer utilisateur 42" → {"intent":"deleteUser","entities":{"userId":"42"},"confidence":0.95,"needs_confirmation":true,"message":"Supprimer l'utilisateur 42"}
- "Bonjour" → {"intent":"greeting","entities":{},"confidence":1.0,"needs_confirmation":false,"message":"Bonjour! Comment puis-je vous aider?"}

Si vous ne comprenez pas, retournez: {"intent":"unknown","confidence":0}`;

    const completion = await openai.chat.completions.create({
      model: NVIDIA_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: parseFloat(process.env.NVIDIA_TEMPERATURE) || 0.6,
      top_p: 0.95,
      max_tokens: parseInt(process.env.NVIDIA_MAX_TOKENS) || 1024,
      stream: false
    });

    const aiResponse = completion.choices[0].message.content;
    
    // Debug: Log raw response (first 200 chars)
    console.log(chalk.dim(`   📝 Réponse AI brute: ${aiResponse.substring(0, 200)}...`));
    
    // Try to parse JSON from response
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log(chalk.green("   ✅ JSON parsé avec succès"));
        return parsed;
      } else {
        console.log(chalk.yellow("⚠️  Aucun JSON trouvé dans la réponse"));
      }
    } catch (e) {
      console.log(chalk.yellow("⚠️  Erreur de parsing JSON:"), e.message);
      console.log(chalk.dim("   Utilisation du mode fallback..."));
    }

    // Fallback: extract intent from text
    return parseAIResponse(aiResponse);

  } catch (error) {
    console.log(chalk.yellow("\n⚠️  API NVIDIA indisponible, utilisation du mode local..."));
    
    // Show detailed error for debugging
    if (error.status) {
      console.log(chalk.dim(`   Erreur HTTP ${error.status}: ${error.message}`));
    } else {
      console.log(chalk.dim(`   ${error.message}`));
    }
    
    return null;
  }
}

/**
 * Get available commands for user role
 */
function getCommandsForRole(role) {
  const commands = {
    admin: "CRÉER/SUPPRIMER/MODIFIER utilisateurs, VOIR tous utilisateurs, DASHBOARD",
    professor: "VOIR/MODIFIER notes, VOIR modules, DASHBOARD, EMPLOI DU TEMPS",
    student: "VOIR notes, CRÉER/VOIR demandes, DASHBOARD, EMPLOI DU TEMPS, ABSENCES"
  };
  return commands[role] || commands.student;
}

/**
 * Parse AI text response to extract intent
 */
function parseAIResponse(text) {
  // Handle null or undefined response
  if (!text || typeof text !== 'string') {
    console.log(chalk.dim("   ⚠️  Réponse AI vide ou invalide"));
    return null;
  }
  
  const lowerText = text.toLowerCase();
  
  const intentMap = {
    'créer': 'createUser',
    'ajouter': 'createUser',
    'supprimer': 'deleteUser',
    'effacer': 'deleteUser',
    'modifier': 'updateUser',
    'voir': 'listUsers',
    'lister': 'listUsers',
    'notes': 'viewGrades',
    'demande': 'viewRequests',
    'dashboard': 'dashboard',
    'emploi': 'timetable'
  };

  for (const [keyword, intent] of Object.entries(intentMap)) {
    if (lowerText.includes(keyword)) {
      return {
        intent,
        entities: {},
        confidence: 0.7,
        needs_confirmation: intent.includes('delete')
      };
    }
  }

  return null;
}

const intentPatterns = {
  // Greeting/casual intents
  greeting: [
    /bonjour/i,
    /salut/i,
    /hello/i,
    /hi/i,
    /hey/i,
    /bonsoir/i,
    /coucou/i
  ],
  
  help: [
    /aide/i,
    /help/i,
    /comment.*utiliser/i,
    /what.*can.*you.*do/i,
    /commandes/i,
    /commands/i
  ],
  
  // User management intents
  createUser: [
    /créer.*utilisat(eur|rice)/i,
    /ajouter.*utilisat(eur|rice)/i,
    /nouvel.*utilisat(eur|rice)/i,
    /create.*user/i,
    /add.*user/i,
    /new.*user/i
  ],
  
  deleteUser: [
    /supprimer.*utilisat(eur|rice)/i,
    /supprime.*utilisat(eur|rice)/i,
    /effacer.*utilisat(eur|rice)/i,
    /delete.*user/i,
    /remove.*user/i,
    /supprime.*user/i,
    /delete.*utilisateur/i
  ],
  
  updateUser: [
    /modifier.*utilisat(eur|rice)/i,
    /mettre.*à.*jour.*utilisat(eur|rice)/i,
    /update.*user/i,
    /edit.*user/i,
    /change.*user/i
  ],
  
  listUsers: [
    /lister.*utilisat(eurs|rices)/i,
    /voir.*utilisat(eurs|rices)/i,
    /afficher.*utilisat(eurs|rices)/i,
    /list.*users/i,
    /show.*users/i,
    /get.*users/i
  ],
  
  // Grade management intents
  viewGrades: [
    /voir.*notes/i,
    /consulter.*notes/i,
    /mes.*notes/i,
    /view.*grades/i,
    /check.*grades/i,
    /my.*grades/i
  ],
  
  updateGrades: [
    /modifier.*notes/i,
    /entrer.*notes/i,
    /saisir.*notes/i,
    /update.*grades/i,
    /enter.*grades/i
  ],
  
  // Request management intents
  createRequest: [
    /créer.*demande/i,
    /soumettre.*demande/i,
    /nouvelle.*demande/i,
    /create.*request/i,
    /submit.*request/i
  ],
  
  viewRequests: [
    /voir.*demandes/i,
    /mes.*demandes/i,
    /statut.*demande/i,
    /view.*requests/i,
    /my.*requests/i
  ],
  
  // Dashboard intents
  dashboard: [
    /tableau.*de.*bord/i,
    /dashboard/i,
    /statistiques/i,
    /stats/i,
    /overview/i
  ],
  
  // Timetable intents
  timetable: [
    /emploi.*du.*temps/i,
    /planning/i,
    /schedule/i,
    /timetable/i,
    /calendar/i
  ],
  
  // Absence intents
  absences: [
    /absences/i,
    /présence/i,
    /attendance/i
  ]
};

// Entity extraction patterns
const entityPatterns = {
  userId: /(?:id|identifiant|user|utilisateur|#)?\s*(\d+)/i,
  userEmail: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
  userName: /(?:nom|name)\s*[:=]?\s*([A-Za-zÀ-ÿ\s]+)/i,
  role: /(student|professor|admin|étudiant|professeur|administrateur)/i,
  moduleId: /(?:module|cours)\s*(?:id|numéro)?\s*(\d+)/i,
  date: /(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})/,
  status: /(pending|validated|rejected|en_attente|validé|rejeté)/i
};

// Role-based command mapping
const roleCommands = {
  admin: {
    greeting: 'help',
    help: 'help',
    createUser: 'admin users --create',
    deleteUser: 'admin users --delete',
    updateUser: 'admin users --update',
    listUsers: 'admin users',
    dashboard: 'admin dashboard',
    timetable: 'admin timetable',
    absences: 'admin absences'
  },
  professor: {
    greeting: 'help',
    help: 'help',
    viewGrades: 'professor grades',
    updateGrades: 'professor grades',
    dashboard: 'professor dashboard',
    timetable: 'professor timetable',
    absences: 'professor absences'
  },
  student: {
    greeting: 'help',
    help: 'help',
    viewGrades: 'student grades',
    createRequest: 'student requests --create',
    viewRequests: 'student requests',
    dashboard: 'student dashboard',
    timetable: 'student timetable',
    absences: 'student absences'
  }
};

// Context tracking for multi-turn conversations
let conversationContext = {
  lastIntent: null,
  waitingFor: null, // What we're waiting for (e.g., 'userId', 'confirmation')
  pendingCommand: null
};

// Response templates
const responses = {
  understood: (intent, entities) => {
    const messages = {
      greeting: `👋 Bonjour! Comment puis-je vous aider aujourd'hui?`,
      help: `📚 Voici ce que je peux faire:\n   • Gérer les utilisateurs (créer, modifier, supprimer)\n   • Consulter les notes et emplois du temps\n   • Créer des demandes administratives\n   • Voir le tableau de bord\n   Tapez 'quit' pour quitter`,
      createUser: `🤖 J'ai compris : Vous voulez créer un nouvel utilisateur`,
      deleteUser: `🤖 J'ai compris : Vous voulez supprimer un utilisateur`,
      updateUser: `🤖 J'ai compris : Vous voulez modifier un utilisateur`,
      listUsers: `🤖 J'ai compris : Vous voulez voir la liste des utilisateurs`,
      viewGrades: `🤖 J'ai compris : Vous voulez consulter les notes`,
      updateGrades: `🤖 J'ai compris : Vous voulez modifier les notes`,
      createRequest: `🤖 J'ai compris : Vous voulez créer une demande`,
      viewRequests: `🤖 J'ai compris : Vous voulez voir vos demandes`,
      dashboard: `🤖 J'ai compris : Vous voulez voir le tableau de bord`,
      timetable: `🤖 J'ai compris : Vous voulez voir l'emploi du temps`,
      absences: `🤖 J'ai compris : Vous voulez voir les absences`
    };
    
    let message = messages[intent] || `🤖 Commande reconnue`;
    
    if (entities.length > 0) {
      message += `\n   Paramètres détectés: ${entities.map(e => `${e.type}: ${e.value}`).join(', ')}`;
    }
    
    return message;
  },
  
  clarification: (missingInfo) => {
    return `❓ J'ai besoin de plus d'informations:\n   ${missingInfo.join('\n   ')}`;
  },
  
  confirmation: (action, details) => {
    return `⚠️  Confirmation requise:\n   Action: ${action}\n   Détails: ${details}\n   Voulez-vous continuer? (oui/non)`;
  },
  
  error: (message) => {
    return `❌ Désolé, je n'ai pas compris. Pouvez-vous reformuler?\n   Exemples:\n   - "Créer un utilisateur"\n   - "Voir mes notes"\n   - "Supprimer l'utilisateur 42"`;
  }
};

/**
 * Handle follow-up responses in multi-turn conversations
 */
function handleFollowUpResponse(input, userRole) {
  const context = conversationContext;
  
  // If we're waiting for a userId
  if (context.waitingFor === 'userId') {
    // Extract number from input (handles "4", "42", "user 42", etc.)
    const numberMatch = input.match(/(\d+)/);
    if (numberMatch) {
      const userId = numberMatch[1];
      console.log(chalk.green(`   ✅ ID utilisateur détecté: ${userId}`));
      
      // Build complete command with the userId
      const baseCommand = context.pendingCommand;
      const fullCommand = `${baseCommand} ${userId}`;
      
      // Clear context
      conversationContext = {
        lastIntent: context.lastIntent,
        waitingFor: null,
        pendingCommand: null
      };
      
      return {
        success: true,
        intent: context.lastIntent,
        entities: [{ type: 'userId', value: userId }],
        confidence: 0.95,
        fromAI: false,
        generatedCommand: fullCommand
      };
    }
  }
  
  // If we're waiting for confirmation
  if (context.waitingFor === 'confirmation') {
    const confirmWords = ['oui', 'yes', 'y', 'o', 'confirm', 'valider'];
    const cancelWords = ['non', 'no', 'n', 'cancel', 'annuler', 'stop'];
    
    if (confirmWords.some(word => input.toLowerCase().includes(word))) {
      console.log(chalk.green("   ✅ Confirmation acceptée"));
      const command = context.pendingCommand;
      
      // Clear context
      conversationContext = {
        lastIntent: null,
        waitingFor: null,
        pendingCommand: null
      };
      
      return {
        success: true,
        intent: context.lastIntent,
        entities: [],
        confidence: 1.0,
        fromAI: false,
        generatedCommand: command
      };
    } else if (cancelWords.some(word => input.toLowerCase().includes(word))) {
      console.log(chalk.yellow("   ❌ Action annulée"));
      
      // Clear context
      conversationContext = {
        lastIntent: null,
        waitingFor: null,
        pendingCommand: null
      };
      
      return {
        success: false,
        error: "Action annulée par l'utilisateur",
        intent: null,
        entities: []
      };
    }
  }
  
  // If we don't understand the follow-up, reset context and try normal analysis
  console.log(chalk.dim("   ⚠️  Réponse non reconnue, réinitialisation du contexte"));
  conversationContext = {
    lastIntent: null,
    waitingFor: null,
    pendingCommand: null
  };
  
  // Return failure to trigger normal pattern matching
  return {
    success: false,
    error: null, // Don't show error, will retry normal analysis
    intent: null,
    entities: []
  };
}

/**
 * Analyze natural language input and extract intent
 */
export async function analyzeIntent(input, userRole = null) {
  const normalizedInput = input.trim();
  
  // Check if this is a follow-up response to a previous question
  if (conversationContext.waitingFor) {
    console.log(chalk.dim("   📝 Réponse contextuelle détectée..."));
    return handleFollowUpResponse(normalizedInput, userRole);
  }
  
  // First, try NVIDIA AI API for better understanding
  console.log(chalk.dim("   🧠 Analyse avec IA NVIDIA..."));
  const aiResult = await callNvidiaAI(normalizedInput, { userRole });
  
  if (aiResult && aiResult.confidence > 0.8) {
    console.log(chalk.green("   ✅ Compréhension AI réussie"));
    
    // Validate role permissions
    if (userRole && !hasPermission(aiResult.intent, userRole)) {
      return {
        success: false,
        error: `❌ Vous n'avez pas la permission d'exécuter cette action (rôle: ${userRole})`,
        intent: null,
        entities: []
      };
    }
    
    // Convert entities to array format
    const entitiesArray = Object.entries(aiResult.entities || {}).map(([type, value]) => ({
      type,
      value,
      raw: `${type}: ${value}`
    }));
    
    return {
      success: true,
      intent: aiResult.intent,
      entities: entitiesArray,
      confidence: aiResult.confidence,
      fromAI: true
    };
  }
  
  // Fallback to local pattern matching
  console.log(chalk.dim("   📝 Utilisation patterns locaux..."));
  
  // Try to match intent patterns
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(normalizedInput)) {
        // Extract entities
        const entities = extractEntities(normalizedInput);
        
        // Validate role permissions
        if (userRole && !hasPermission(intent, userRole)) {
          return {
            success: false,
            error: `❌ Vous n'avez pas la permission d'exécuter cette action (rôle: ${userRole})`,
            intent: null,
            entities: []
          };
        }
        
        return {
          success: true,
          intent,
          entities,
          confidence: 0.9,
          fromAI: false
        };
      }
    }
  }
  
  return {
    success: false,
    error: responses.error(),
    intent: null,
    entities: [],
    confidence: 0
  };
}

/**
 * Extract entities from input text
 */
function extractEntities(input) {
  const entities = [];
  
  for (const [entityType, pattern] of Object.entries(entityPatterns)) {
    const match = input.match(pattern);
    if (match) {
      entities.push({
        type: entityType,
        value: match[1],
        raw: match[0]
      });
    }
  }
  
  return entities;
}

/**
 * Check if user role has permission for intent
 */
function hasPermission(intent, role) {
  const permissions = {
    admin: Object.keys(roleCommands.admin),
    professor: Object.keys(roleCommands.professor),
    student: Object.keys(roleCommands.student)
  };
  
  return permissions[role]?.includes(intent) || false;
}

/**
 * Convert intent to CLI command
 */
export function intentToCommand(intent, entities, userRole) {
  // Special handling for greeting and help - just show response, no command
  if (intent === 'greeting' || intent === 'help') {
    return 'SHOW_RESPONSE_ONLY';
  }
  
  const baseCommand = roleCommands[userRole]?.[intent];
  
  if (!baseCommand) {
    return null;
  }
  
  let command = `upf ${baseCommand}`;
  
  // Add entity parameters
  entities.forEach(entity => {
    switch (entity.type) {
      case 'userId':
        if (intent.includes('delete') || intent.includes('update')) {
          command += ` ${entity.value}`;
        }
        break;
      case 'moduleId':
        command += ` --module-id ${entity.value}`;
        break;
      case 'role':
        command += ` --role ${entity.value}`;
        break;
    }
  });
  
  return command;
}

/**
 * Generate smart suggestions based on context
 */
export function generateSuggestions(userRole, lastAction = null) {
  const suggestions = {
    admin: [
      '"Créer un utilisateur étudiant"',
      '"Voir tous les professeurs"',
      '"Supprimer l\'utilisateur 42"',
      '"Voir le tableau de bord"',
      '"Lister les demandes en attente"'
    ],
    professor: [
      '"Voir mes modules"',
      '"Entrer les notes du module 5"',
      '"Voir l\'emploi du temps"',
      '"Valider les absences"'
    ],
    student: [
      '"Voir mes notes"',
      '"Créer une demande d\'attestation"',
      '"Voir mon emploi du temps"',
      '"Consulter mes absences"'
    ]
  };
  
  return suggestions[userRole] || [];
}

/**
 * Process natural language query
 */
export async function processNaturalLanguage(input, userRole) {
  console.log(chalk.cyan("\n🤖 Analyse de votre demande...\n"));
  
  // Analyze intent (now async for AI API)
  const analysis = await analyzeIntent(input, userRole);
  
  if (!analysis.success) {
    console.log(chalk.red(analysis.error));
    
    // Show suggestions
    const suggestions = generateSuggestions(userRole);
    console.log(chalk.dim("\n💡 Essayez plutôt:"));
    suggestions.slice(0, 3).forEach(s => {
      console.log(chalk.dim(`   • ${s}`));
    });
    
    return null;
  }
  
  // Display understanding
  const message = analysis.fromAI 
    ? `🤖 IA: ${analysis.entities.message || 'Commande comprise'}`
    : responses.understood(analysis.intent, analysis.entities);
  console.log(chalk.green(message));
  
  // Check if we need more information
  const missingInfo = checkMissingInfo(analysis.intent, analysis.entities);
  if (missingInfo.length > 0) {
    console.log(chalk.yellow(responses.clarification(missingInfo)));
    
    // Set conversation context for follow-up
    if (missingInfo.some(info => info.includes('ID'))) {
      const baseCommand = intentToCommand(analysis.intent, [], userRole);
      conversationContext = {
        lastIntent: analysis.intent,
        waitingFor: 'userId',
        pendingCommand: baseCommand
      };
      console.log(chalk.dim("   💡 Tapez simplement le numéro (ex: 42)"));
    }
    
    return null;
  }
  
  // Generate command
  const command = intentToCommand(analysis.intent, analysis.entities, userRole);
  
  // Special case: greeting/help just show response, no command execution
  if (command === 'SHOW_RESPONSE_ONLY') {
    return null; // Response already displayed above
  }
  
  if (command) {
    console.log(chalk.cyan(`\n⚡ Commande générée: ${command}`));
    
    // For destructive operations, ask for confirmation
    if (analysis.intent === 'deleteUser' || analysis.intent === 'deleteRequest') {
      console.log(chalk.yellow("\n⚠️  ATTENTION: Cette action est irréversible!"));
      console.log(chalk.yellow("   Voulez-vous vraiment continuer? (oui/non)"));
      
      // Set context for confirmation
      conversationContext = {
        lastIntent: analysis.intent,
        waitingFor: 'confirmation',
        pendingCommand: command
      };
      
      return null; // Wait for user confirmation
    }
    
    console.log(chalk.dim("   Exécution dans 2 secondes... (Ctrl+C pour annuler)\n"));
    
    // Wait for confirmation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return command;
  }
  
  return null;
}

/**
 * Check if required information is missing
 */
function checkMissingInfo(intent, entities) {
  const missing = [];
  
  // For delete/update operations, we need a user ID
  if ((intent === 'deleteUser' || intent === 'updateUser') && 
      !entities.find(e => e.type === 'userId')) {
    missing.push("ID de l'utilisateur à modifier/supprimer");
  }
  
  // For grade updates, we might need module ID
  if (intent === 'updateGrades' && !entities.find(e => e.type === 'moduleId')) {
    missing.push("ID du module (optionnel - sera demandé interactivement)");
  }
  
  return missing;
}

/**
 * Interactive AI assistant mode
 */
export async function aiAssistantMode(userRole) {
  const inquirer = await import("inquirer");
  
  console.log(chalk.bold.cyan("\n╔════════════════════════════════════════╗"));
  console.log(chalk.bold.cyan("║   🤖 Assistant IA UPF CLI             ║"));
  console.log(chalk.bold.cyan("║   Parlez naturellement!                ║"));
  console.log(chalk.bold.cyan("╚════════════════════════════════════════╝\n"));
  
  console.log(chalk.dim("Tapez 'quit' ou 'exit' pour quitter\n"));
  
  while (true) {
    const { query } = await inquirer.default.prompt([
      {
        type: "input",
        name: "query",
        message: chalk.cyan("🗣️  Vous:"),
        prefix: ""
      }
    ]);
    
    if (query.toLowerCase() === 'quit' || query.toLowerCase() === 'exit') {
      console.log(chalk.green("\n👋 Au revoir!\n"));
      break;
    }
    
    if (!query.trim()) {
      continue;
    }
    
    const command = await processNaturalLanguage(query, userRole);
    
    if (command) {
      console.log(chalk.green("\n✅ Exécution de la commande...\n"));
      
      // Execute the command
      const { execSync } = await import("child_process");
      try {
        execSync(command, { stdio: 'inherit' });
      } catch (error) {
        console.log(chalk.red("\n❌ Erreur lors de l'exécution"));
      }
    }
    
    console.log("");
  }
}
