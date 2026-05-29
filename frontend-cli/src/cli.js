#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { registerAuthCommands } from "./commands/auth.js";
import { registerProfessorCommands } from "./commands/professor.js";
import { registerStudentCommands } from "./commands/student.js";
import { registerAdminCommands } from "./commands/admin.js";
import { loginFlow, logoutFlow, whoamiFlow } from "./commands/auth.js";
import { listProfessorModules } from "./commands/professor.js";
import { getApiBaseUrl, setApiBaseUrl, getUser } from "./config.js";
import { printInfo, printError, printWarning } from "./lib/output.js";
import { showBanner, showSuggestions, getStatusIndicator } from "./lib/ui-enhanced.js";
import { displaySmartSuggestions, getTimeBasedTip } from "./lib/smart-suggestions.js";
import { createStatusBar, createDivider } from "./lib/responsive-ui.js";
import { simpleAIAssistant } from "./lib/simple-ai.js";

const program = new Command();

program
  .name("upf-cli")
  .description("CLI frontend pour l'application UPF")
  .version("0.1.0")
  .option("--base-url <url>", "URL backend Laravel (default: http://13.49.72.180)")
  .hook("preAction", (thisCommand) => {
    const opts = thisCommand.opts();
    if (opts.baseUrl) {
      setApiBaseUrl(opts.baseUrl);
    }
  });

program
  .command("doctor")
  .description("Verifier configuration locale")
  .action(() => {
    printInfo(`API base URL: ${getApiBaseUrl()}`);
    printInfo("Testez ensuite: upf auth login");
  });

program
  .command("tips")
  .description("Afficher des conseils intelligents")
  .action(() => {
    const tip = getTimeBasedTip();
    if (tip) {
      console.log(chalk.cyan(tip));
    }
    displaySmartSuggestions();
  });

program
  .command("ai")
  .description("🤖 Assistant IA - Simple et Fiable!")
  .action(async () => {
    const user = getUser();
    if (!user) {
      printError("Veuillez vous connecter d'abord: upf auth login");
      process.exit(1);
    }
    await simpleAIAssistant(user.role);
  });

registerAuthCommands(program);
registerProfessorCommands(program);
registerStudentCommands(program);
registerAdminCommands(program);

async function runHomeMenu() {
  // Show banner on first load
  showBanner();
  
  // Show time-based tip
  const timeTip = getTimeBasedTip();
  if (timeTip) {
    console.log(chalk.cyan(timeTip));
    console.log("");
  }
  
  while (true) {
    const user = getUser();

    console.clear();
    showBanner();
    
    // Display connection status with responsive status bar
    const apiUrl = getApiBaseUrl();
    const statusItems = [
      { icon: getStatusIndicator('online').includes('Online') ? '🟢' : '🔴', label: 'API', value: apiUrl },
      { icon: '👤', label: 'Session', value: user ? `${user.name} (${user.role})` : 'Non connecté' }
    ];
    
    console.log(createStatusBar(statusItems));
    console.log("");

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: chalk.bold.cyan("Menu Principal"),
        pageSize: 10,
        choices: [
          { name: "🔐 Connexion", value: "login", disabled: !!user },
          { name: "👤 Qui suis-je", value: "whoami", disabled: !user },
          { name: "📊 Tableau de bord", value: "dashboard", disabled: !user },
          { name: "👨‍🏫 Commandes professeur", value: "profMenu", disabled: !user || user.role !== "professor" },
          { name: "👨‍🎓 Commandes étudiant", value: "studentMenu", disabled: !user || user.role !== "student" },
          { name: "👨‍💼 Commandes admin", value: "adminMenu", disabled: !user || user.role !== "admin" },
          { name: "🚪 Deconnexion", value: "logout", disabled: !user },
          { name: "⚙️ Changer URL backend", value: "setApiUrl" },
          new inquirer.Separator(),
          { name: "🤖 Assistant IA", value: "aiAssistant" },
          { name: "❌ Quitter", value: "exit" }
        ]
      }
    ]);

    try {
      if (action === "login") {
        await loginFlow();
      } else if (action === "whoami") {
        await whoamiFlow();
      } else if (action === "dashboard") {
        await showDashboard();
      } else if (action === "profMenu") {
        await professorSubMenu();
      } else if (action === "studentMenu") {
        await studentSubMenu();
      } else if (action === "adminMenu") {
        await adminSubMenu();
      } else if (action === "logout") {
        await logoutFlow();
      } else if (action === "setApiUrl") {
        const { url } = await inquirer.prompt([
          {
            type: "input",
            name: "url",
            message: "Nouvelle URL backend:",
            default: getApiBaseUrl()
          }
        ]);
        setApiBaseUrl(url);
        printInfo(`URL backend mise a jour: ${url}`);
      } else if (action === "aiAssistant") {
        await simpleAIAssistant(user.role);
      } else if (action === "exit") {
        console.log(chalk.green("\n👋 Au revoir! See you soon!\n"));
        return;
      }
    } catch (error) {
      printError(error?.response?.data?.message || error?.message || "Erreur inattendue.");
    }

    // Show smart suggestions after each action
    if (action !== "exit") {
      displaySmartSuggestions();
      await inquirer.prompt([{ type: "input", name: "continue", message: chalk.cyan("Appuyez sur Entrée pour continuer...") }]);
    }
  }
}

if (process.argv.length <= 2) {
  runHomeMenu().catch((error) => {
    printWarning("Fermeture du menu suite a une erreur.");
    printError(error?.message || "Erreur");
    process.exit(1);
  });
} else {
  program.parseAsync(process.argv);
}

// Helper functions for submenus
async function showDashboard() {
  const user = getUser();
  if (!user) return;

  try {
    if (user.role === 'admin') {
      const { viewAdminDashboard } = await import('./commands/admin.js');
      await viewAdminDashboard();
    } else if (user.role === 'professor') {
      const { viewProfessorDashboard } = await import('./commands/professor.js');
      await viewProfessorDashboard();
    } else if (user.role === 'student') {
      const { viewStudentDashboard } = await import('./commands/student.js');
      await viewStudentDashboard();
    }
  } catch (error) {
    printError(error?.response?.data?.message || "Erreur lors du chargement du tableau de bord.");
  }
}

async function professorSubMenu() {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Menu Professeur",
        choices: [
          { name: "Tableau de bord", value: "dashboard" },
          { name: "Mes modules", value: "modules" },
          { name: "Gérer les notes", value: "grades" },
          { name: "Gérer les absences", value: "absences" },
          { name: "Sessions de cours", value: "sessions" },
          { name: "Réservations", value: "reservations" },
          { name: "Retour au menu principal", value: "back" }
        ]
      }
    ]);

    try {
      if (action === "dashboard") {
        const { viewProfessorDashboard } = await import('./commands/professor.js');
        await viewProfessorDashboard();
      } else if (action === "modules") {
        await listProfessorModules();
      } else if (action === "grades") {
        const { manageGrades } = await import('./commands/professor.js');
        await manageGrades();
      } else if (action === "absences") {
        const { manageAbsences } = await import('./commands/professor.js');
        await manageAbsences();
      } else if (action === "sessions") {
        const { viewSessions } = await import('./commands/professor.js');
        await viewSessions();
      } else if (action === "reservations") {
        const { manageReservations } = await import('./commands/professor.js');
        await manageReservations();
      } else if (action === "back") {
        return;
      }
    } catch (error) {
      printError(error?.response?.data?.message || error?.message || "Erreur inattendue.");
    }

    if (action !== "back") {
      await inquirer.prompt([{ type: "input", name: "continue", message: "Entrer pour continuer..." }]);
    }
  }
}

async function studentSubMenu() {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Menu Étudiant",
        choices: [
          { name: "📊 Tableau de bord", value: "dashboard" },
          { name: "📈 Mes notes", value: "grades" },
          { name: "📅 Emploi du temps", value: "timetable" },
          { name: "📋 Absences", value: "absences" },
          { name: "📁 Supports de cours", value: "materials" },
          { name: "📝 Demandes administratives", value: "requests" },
          { name: "⬅️ Retour au menu principal", value: "back" }
        ]
      }
    ]);

    try {
      if (action === "dashboard") {
        const { viewStudentDashboard } = await import('./commands/student.js');
        await viewStudentDashboard();
      } else if (action === "grades") {
        const { viewGrades } = await import('./commands/student.js');
        await viewGrades();
      } else if (action === "timetable") {
        const { viewTimetable } = await import('./commands/student.js');
        await viewTimetable();
      } else if (action === "absences") {
        const { viewAbsences } = await import('./commands/student.js');
        await viewAbsences();
      } else if (action === "materials") {
        const { viewMaterials } = await import('./commands/student.js');
        await viewMaterials();
      } else if (action === "requests") {
        await manageRequestsInteractive();
      } else if (action === "back") {
        return;
      }
    } catch (error) {
      printError(error?.response?.data?.message || error?.message || "Erreur inattendue.");
    }

    if (action !== "back") {
      await inquirer.prompt([{ type: "input", name: "continue", message: chalk.cyan("Appuyez sur Entrée pour continuer...") }]);
    }
  }
}

async function adminSubMenu() {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Menu Administrateur",
        choices: [
          { name: "📊 Tableau de bord", value: "dashboard" },
          { name: "👥 Gérer les utilisateurs", value: "users" },
          { name: "🎓 Filières", value: "filieres" },
          { name: "📝 Demandes administratives", value: "requests" },
          { name: "📅 Emploi du temps", value: "timetable" },
          { name: "🏫 Réservations", value: "reservations" },
          { name: "📋 Absences", value: "absences" },
          { name: "⬅️ Retour au menu principal", value: "back" }
        ]
      }
    ]);

    try {
      if (action === "dashboard") {
        const { viewAdminDashboard } = await import('./commands/admin.js');
        await viewAdminDashboard();
      } else if (action === "users") {
        await manageUsersInteractive();
      } else if (action === "filieres") {
        const { listFilieres } = await import('./commands/admin.js');
        await listFilieres();
      } else if (action === "requests") {
        const { manageRequests } = await import('./commands/admin.js');
        await manageRequests();
      } else if (action === "timetable") {
        const { viewTimetable } = await import('./commands/admin.js');
        await viewTimetable();
      } else if (action === "reservations") {
        const { manageReservations } = await import('./commands/admin.js');
        await manageReservations();
      } else if (action === "absences") {
        const { viewAbsences } = await import('./commands/admin.js');
        await viewAbsences();
      } else if (action === "back") {
        return;
      }
    } catch (error) {
      printError(error?.response?.data?.message || error?.message || "Erreur inattendue.");
    }

    if (action !== "back") {
      await inquirer.prompt([{ type: "input", name: "continue", message: chalk.cyan("Appuyez sur Entrée pour continuer...") }]);
    }
  }
}

// ==================== INTERACTIVE CRUD MENUS ====================

// Interactive User Management Menu
async function manageUsersInteractive() {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "👥 Gestion des Utilisateurs",
        choices: [
          { name: "📋 Voir tous les utilisateurs", value: "list" },
          { name: "📋 Voir les étudiants", value: "list_students" },
          { name: "📋 Voir les professeurs", value: "list_professors" },
          { name: "➕ Créer un nouvel utilisateur", value: "create" },
          { name: "✏️ Modifier un utilisateur", value: "update" },
          { name: "❌ Supprimer un utilisateur", value: "delete" },
          { name: "⬅️ Retour au menu administrateur", value: "back" }
        ]
      }
    ]);

    try {
      if (action === "list") {
        const { listUsers } = await import('./commands/admin.js');
        await listUsers({});
      } else if (action === "list_students") {
        const { listUsers } = await import('./commands/admin.js');
        await listUsers({ role: 'student' });
      } else if (action === "list_professors") {
        const { listUsers } = await import('./commands/admin.js');
        await listUsers({ role: 'professor' });
      } else if (action === "create") {
        const { createUser } = await import('./commands/admin.js');
        await createUser();
      } else if (action === "update") {
        // First list users to choose from
        const { listUsers } = await import('./commands/admin.js');
        console.log(chalk.cyan("\nSélectionnez l'utilisateur à modifier:\n"));
        await listUsers({});
        
        const { userId } = await inquirer.prompt([
          {
            type: "input",
            name: "userId",
            message: "Entrez l'ID de l'utilisateur à modifier:",
            validate: (input) => input.length > 0 || "L'ID est requis"
          }
        ]);
        
        const { updateUser } = await import('./commands/admin.js');
        await updateUser(userId);
      } else if (action === "delete") {
        // First list users to choose from
        const { listUsers } = await import('./commands/admin.js');
        console.log(chalk.red("\n⚠️ Sélectionnez l'utilisateur à supprimer:\n"));
        await listUsers({});
        
        const { userId } = await inquirer.prompt([
          {
            type: "input",
            name: "userId",
            message: "Entrez l'ID de l'utilisateur à supprimer:",
            validate: (input) => input.length > 0 || "L'ID est requis"
          }
        ]);
        
        const { deleteUser } = await import('./commands/admin.js');
        await deleteUser(userId);
      } else if (action === "back") {
        return;
      }
    } catch (error) {
      printError(error?.response?.data?.message || error?.message || "Erreur inattendue.");
    }

    if (action !== "back") {
      await inquirer.prompt([{ type: "input", name: "continue", message: chalk.cyan("Appuyez sur Entrée pour continuer...") }]);
    }
  }
}

// Interactive Requests Management Menu for Students
async function manageRequestsInteractive() {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "📝 Gestion des Demandes Administratives",
        choices: [
          { name: "📋 Voir mes demandes", value: "list" },
          { name: "➕ Créer une nouvelle demande", value: "create" },
          { name: "⬅️ Retour au menu étudiant", value: "back" }
        ]
      }
    ]);

    try {
      if (action === "list") {
        const { viewRequests } = await import('./commands/student.js');
        await viewRequests({});
      } else if (action === "create") {
        const { createRequest } = await import('./commands/student.js');
        await createRequest();
      } else if (action === "back") {
        return;
      }
    } catch (error) {
      printError(error?.response?.data?.message || error?.message || "Erreur inattendue.");
    }

    if (action !== "back") {
      await inquirer.prompt([{ type: "input", name: "continue", message: chalk.cyan("Appuyez sur Entrée pour continuer...") }]);
    }
  }
}
