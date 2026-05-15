#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import { registerAuthCommands } from "./commands/auth.js";
import { registerProfessorCommands } from "./commands/professor.js";
import { registerStudentCommands } from "./commands/student.js";
import { registerAdminCommands } from "./commands/admin.js";
import { loginFlow, logoutFlow, whoamiFlow } from "./commands/auth.js";
import { listProfessorModules } from "./commands/professor.js";
import { getApiBaseUrl, setApiBaseUrl, getUser } from "./config.js";
import { printInfo, printError, printWarning } from "./lib/output.js";

const program = new Command();

program
  .name("upf-cli")
  .description("CLI frontend pour l'application UPF")
  .version("0.1.0")
  .option("--base-url <url>", "URL backend Laravel (default: http://localhost:8000)")
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
    printInfo("Testez ensuite: upf-cli auth login");
  });

registerAuthCommands(program);
registerProfessorCommands(program);
registerStudentCommands(program);
registerAdminCommands(program);

async function runHomeMenu() {
  while (true) {
    const user = getUser();

    console.clear();
    console.log("===================================");
    console.log("            UPF CLI");
    console.log("===================================");
    console.log(`API: ${getApiBaseUrl()}`);
    console.log(`Session: ${user ? `${user.name} (${user.role})` : "non connecte"}`);
    console.log("");

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Menu principal",
        choices: [
          { name: "Connexion", value: "login", disabled: !!user },
          { name: "Qui suis-je", value: "whoami", disabled: !user },
          { name: "Tableau de bord", value: "dashboard", disabled: !user },
          { name: "Commandes professeur", value: "profMenu", disabled: !user || user.role !== "professor" },
          { name: "Commandes étudiant", value: "studentMenu", disabled: !user || user.role !== "student" },
          { name: "Commandes admin", value: "adminMenu", disabled: !user || user.role !== "admin" },
          { name: "Deconnexion", value: "logout", disabled: !user },
          { name: "Changer URL backend", value: "setApiUrl" },
          { name: "Quitter", value: "exit" }
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
      } else if (action === "exit") {
        return;
      }
    } catch (error) {
      printError(error?.response?.data?.message || error?.message || "Erreur inattendue.");
    }

    await inquirer.prompt([{ type: "input", name: "continue", message: "Entrer pour continuer..." }]);
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
          { name: "Tableau de bord", value: "dashboard" },
          { name: "Mes notes", value: "grades" },
          { name: "Emploi du temps", value: "timetable" },
          { name: "Absences", value: "absences" },
          { name: "Supports de cours", value: "materials" },
          { name: "Demandes administratives", value: "requests" },
          { name: "Retour au menu principal", value: "back" }
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
        const { viewRequests } = await import('./commands/student.js');
        await viewRequests();
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

async function adminSubMenu() {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Menu Administrateur",
        choices: [
          { name: "Tableau de bord", value: "dashboard" },
          { name: "Utilisateurs", value: "users" },
          { name: "Filières", value: "filieres" },
          { name: "Demandes administratives", value: "requests" },
          { name: "Emploi du temps", value: "timetable" },
          { name: "Réservations", value: "reservations" },
          { name: "Absences", value: "absences" },
          { name: "Retour au menu principal", value: "back" }
        ]
      }
    ]);

    try {
      if (action === "dashboard") {
        const { viewAdminDashboard } = await import('./commands/admin.js');
        await viewAdminDashboard();
      } else if (action === "users") {
        const { listUsers } = await import('./commands/admin.js');
        await listUsers();
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
      await inquirer.prompt([{ type: "input", name: "continue", message: "Entrer pour continuer..." }]);
    }
  }
}
