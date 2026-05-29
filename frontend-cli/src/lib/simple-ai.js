import chalk from "chalk";
import inquirer from "inquirer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Simple intent patterns - direct and reliable
const INTENT_PATTERNS = [
  {
    intent: 'whoami',
    patterns: [/qui suis/i, /whoami/i, /mon.*rôle/i, /my.*role/i, /je suis/i],
    requiresConfirmation: false,
    description: 'Voir mon profil',
    isWhoami: true
  },
  {
    intent: 'deleteUser',
    patterns: [/supprim/i, /effac/i, /delete/i, /remove/i, /kill/i],
    requiresConfirmation: true,
    description: 'Supprimer un utilisateur'
  },
  {
    intent: 'createUser',
    patterns: [/créer/i, /ajouter/i, /nouveau/i, /create/i, /add/i, /new/i],
    requiresConfirmation: false,
    description: 'Créer un utilisateur'
  },
  {
    intent: 'updateUser',
    patterns: [/modif/i, /chang/i, /update/i, /edit/i, /mettre à jour/i],
    requiresConfirmation: false,
    description: 'Modifier un utilisateur'
  },
  {
    intent: 'listUsers',
    patterns: [/lister/i, /voir.*utilis/i, /afficher.*utilis/i, /list.*user/i, /show.*user/i, /tous.*utilis/i],
    requiresConfirmation: false,
    description: 'Voir les utilisateurs'
  },
  {
    intent: 'viewGrades',
    patterns: [/note/i, /grade/i, /résultat/i, /mark/i],
    requiresConfirmation: false,
    description: 'Voir les notes'
  },
  {
    intent: 'dashboard',
    patterns: [/tableau.*bord/i, /dashboard/i, /statistique/i, /stats/i, /overview/i],
    requiresConfirmation: false,
    description: 'Tableau de bord'
  },
  {
    intent: 'timetable',
    patterns: [/emploi.*temps/i, /planning/i, /schedule/i, /calendar/i],
    requiresConfirmation: false,
    description: 'Emploi du temps'
  },
  {
    intent: 'greeting',
    patterns: [/bonjour/i, /salut/i, /hello/i, /hi/i, /hey/i, /coucou/i],
    requiresConfirmation: false,
    description: 'Salutation',
    isGreeting: true
  },
  {
    intent: 'help',
    patterns: [/aide/i, /help/i, /commande/i, /que.*faire/i, /comment/i],
    requiresConfirmation: false,
    description: 'Aide',
    isHelp: true
  }
];

// Entity extraction - simple and effective
function extractEntities(input) {
  const entities = {};
  
  // Extract numbers (user IDs, module IDs, etc.)
  const numbers = input.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    // First number is usually userId
    entities.userId = numbers[0];
    
    // If there's a second number, might be moduleId or other
    if (numbers.length > 1) {
      entities.moduleId = numbers[1];
    }
  }
  
  // Extract email
  const emailMatch = input.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    entities.email = emailMatch[0];
  }
  
  // Extract role keywords
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes('étudiant') || lowerInput.includes('student')) {
    entities.role = 'student';
  } else if (lowerInput.includes('professeur') || lowerInput.includes('professor')) {
    entities.role = 'professor';
  } else if (lowerInput.includes('admin')) {
    entities.role = 'admin';
  }
  
  return entities;
}

// Detect intent from input
function detectIntent(input) {
  const lowerInput = input.toLowerCase();
  
  for (const intentConfig of INTENT_PATTERNS) {
    for (const pattern of intentConfig.patterns) {
      if (pattern.test(lowerInput)) {
        return intentConfig;
      }
    }
  }
  
  return null;
}

// Map intent to CLI command
function intentToCommand(intent, entities, userRole) {
  const commands = {
    admin: {
      deleteUser: 'admin users --delete',
      createUser: 'admin users --create',
      updateUser: 'admin users --update',
      listUsers: 'admin users',
      dashboard: 'admin dashboard',
      timetable: 'admin timetable'
    },
    professor: {
      viewGrades: 'professor grades',
      dashboard: 'professor dashboard',
      timetable: 'professor timetable'
    },
    student: {
      viewGrades: 'student grades',
      dashboard: 'student dashboard',
      timetable: 'student timetable'
    }
  };
  
  const baseCommand = commands[userRole]?.[intent];
  if (!baseCommand) {
    return null;
  }
  
  let command = `upf ${baseCommand}`;
  
  // Add userId if present for delete/update
  if ((intent === 'deleteUser' || intent === 'updateUser') && entities.userId) {
    command += ` ${entities.userId}`;
  }
  
  return command;
}

// Show greeting message with role-specific info
function showGreeting(userRole) {
  const roleMessages = {
    admin: chalk.cyan("\n👨‍💼 Mode Administrateur"),
    professor: chalk.cyan("\n👨‍🏫 Mode Professeur"),
    student: chalk.cyan("\n👨‍🎓 Mode Étudiant")
  };
  
  console.log(chalk.green("\n👋 Bonjour! Je suis votre assistant UPF CLI."));
  console.log(roleMessages[userRole] || "");
  console.log(chalk.cyan("\nJe peux vous aider avec:"));
  
  const capabilities = {
    admin: [
      "   • Gestion des utilisateurs (créer, modifier, supprimer)",
      "   • Voir tous les utilisateurs et leurs rôles",
      "   • Tableau de bord et statistiques",
      "   • Emploi du temps global"
    ],
    professor: [
      "   • Consulter et saisir les notes",
      "   • Voir vos modules enseignés",
      "   • Emploi du temps personnel",
      "   • Tableau de bord professeur"
    ],
    student: [
      "   • Consulter vos notes",
      "   • Voir votre emploi du temps",
      "   • Créer des demandes administratives",
      "   • Tableau de bord étudiant"
    ]
  };
  
  (capabilities[userRole] || capabilities.student).forEach(msg => 
    console.log(chalk.white(msg))
  );
  
  console.log(chalk.dim("\nExemples:"));
  
  const examples = {
    admin: [
      '   "supprimer utilisateur 42"',
      '   "créer un étudiant"',
      '   "voir tous les professeurs"',
      '   "tableau de bord"'
    ],
    professor: [
      '   "voir mes notes"',
      '   "saisir notes module 5"',
      '   "emploi du temps"',
      '   "dashboard"'
    ],
    student: [
      '   "voir mes notes"',
      '   "mon emploi du temps"',
      '   "créer une demande"',
      '   "dashboard"'
    ]
  };
  
  (examples[userRole] || examples.student).forEach(ex => 
    console.log(chalk.gray(ex))
  );
  
  console.log(chalk.dim("\nTapez 'quit' pour quitter\n"));
}

// Show help message
function showHelp(userRole) {
  console.log(chalk.cyan("\n📚 Commandes disponibles:"));
  
  const helpMessages = {
    admin: [
      '"supprimer utilisateur 42" - Supprimer un utilisateur',
      '"créer un étudiant" - Créer un nouvel étudiant',
      '"modifier utilisateur 5" - Modifier un utilisateur',
      '"voir tous les utilisateurs" - Lister les utilisateurs',
      '"tableau de bord" - Voir les statistiques'
    ],
    professor: [
      '"voir mes notes" - Consulter les notes',
      '"emploi du temps" - Voir le planning',
      '"tableau de bord" - Voir les statistiques'
    ],
    student: [
      '"voir mes notes" - Consulter vos notes',
      '"emploi du temps" - Voir votre planning',
      '"créer une demande" - Soumettre une demande'
    ]
  };
  
  const messages = helpMessages[userRole] || helpMessages.student;
  messages.forEach(msg => console.log(chalk.white(`   ${msg}`)));
  
  console.log(chalk.dim("\nTapez 'quit' pour quitter\n"));
}

// Main AI assistant function
export async function simpleAIAssistant(userRole) {
  console.log(chalk.bold.cyan("\n╔════════════════════════════════════════╗"));
  console.log(chalk.bold.cyan("║   🤖 Assistant UPF CLI - Mode Simple  ║"));
  console.log(chalk.bold.cyan("║   Rapide, Fiable & Adapté à votre rôle║"));
  console.log(chalk.bold.cyan("║   (Sans API NVIDIA)                   ║"));
  console.log(chalk.bold.cyan("╚════════════════════════════════════════╝\n"));
  
  showGreeting(userRole);
  
  while (true) {
    const { query } = await inquirer.prompt([
      {
        type: "input",
        name: "query",
        message: chalk.cyan("🗣️  Vous:"),
        prefix: ""
      }
    ]);
    
    const input = query.trim();
    
    // Exit conditions
    if (input.toLowerCase() === 'quit' || input.toLowerCase() === 'exit' || input.toLowerCase() === 'q') {
      console.log(chalk.green("\n👋 Au revoir!\n"));
      break;
    }
    
    // Skip empty input
    if (!input) {
      continue;
    }
    
    // Detect intent
    const intentConfig = detectIntent(input);
    
    if (!intentConfig) {
      console.log(chalk.yellow("\n❌ Je n'ai pas compris. Essayez:"));
      showHelp(userRole);
      continue;
    }
    
    // Handle greetings
    if (intentConfig.isGreeting) {
      showGreeting(userRole);
      continue;
    }
    
    // Handle help
    if (intentConfig.isHelp) {
      showHelp(userRole);
      continue;
    }
    
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
    
    // Check role permissions
    const allowedIntents = {
      admin: ['deleteUser', 'createUser', 'updateUser', 'listUsers', 'dashboard', 'timetable', 'greeting', 'help', 'whoami'],
      professor: ['viewGrades', 'dashboard', 'timetable', 'greeting', 'help', 'whoami'],
      student: ['viewGrades', 'dashboard', 'timetable', 'greeting', 'help', 'whoami']
    };
    
    if (!allowedIntents[userRole]?.includes(intentConfig.intent)) {
      console.log(chalk.red(`\n⛔ Action non autorisée pour le rôle: ${userRole}`));
      console.log(chalk.dim("   Cette fonctionnalité est réservée aux administrateurs.\n"));
      continue;
    }
    
    // Extract entities
    const entities = extractEntities(input);
    
    // Display understanding
    console.log(chalk.green(`\n✅ Compris: ${intentConfig.description}`));
    
    if (Object.keys(entities).length > 0) {
      const entityList = Object.entries(entities)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      console.log(chalk.dim(`   Paramètres: ${entityList}`));
    }
    
    // Check for missing required info
    if ((intentConfig.intent === 'deleteUser' || intentConfig.intent === 'updateUser') && !entities.userId) {
      console.log(chalk.yellow("\n❓ Quel est l'ID de l'utilisateur?"));
      console.log(chalk.dim("   (Tapez simplement le numéro, ex: 42)\n"));
      
      const { userId } = await inquirer.prompt([
        {
          type: "input",
          name: "userId",
          message: "ID:",
          validate: (val) => /^\d+$/.test(val) || "Entrez un numéro valide"
        }
      ]);
      
      entities.userId = userId;
    }
    
    // Generate command
    const command = intentToCommand(intentConfig.intent, entities, userRole);
    
    if (!command) {
      console.log(chalk.red("\n❌ Commande non disponible pour votre rôle"));
      continue;
    }
    
    // Confirmation for destructive actions
    if (intentConfig.requiresConfirmation) {
      console.log(chalk.yellow("\n⚠️  ATTENTION: Cette action est irréversible!"));
      console.log(chalk.yellow(`   Commande: ${command}`));
      
      const { confirm } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: "Continuer?",
          default: false
        }
      ]);
      
      if (!confirm) {
        console.log(chalk.yellow("\n❌ Action annulée\n"));
        continue;
      }
    } else {
      console.log(chalk.cyan(`\n⚡ Commande: ${command}`));
      console.log(chalk.dim("   Exécution...\n"));
    }
    
    // Execute command
    try {
      const { execSync } = await import("child_process");
      execSync(command, { stdio: 'inherit' });
      console.log(chalk.green("\n✅ Terminé!\n"));
    } catch (error) {
      console.log(chalk.red("\n❌ Erreur lors de l'exécution\n"));
    }
  }
}
